import Anthropic from "@anthropic-ai/sdk";
import type {
  BetaContentBlock,
  BetaMessageParam,
  BetaTool,
  BetaToolUseBlock,
} from "@anthropic-ai/sdk/resources/beta/messages/messages";

/*
 * Boucle commune aux recherches de produits (outil de création, « Où l'acheter ») :
 * Claude cherche sur le web, ouvre les fiches produit, puis rend son résultat via un
 * outil strict. On relève au passage chaque page vue, pour écarter ensuite tout
 * produit dont la page n'a jamais été rencontrée.
 */

const MODEL = "claude-opus-5-5";
const MAX_TURNS = 8;

/** Forme comparable d'une URL : sans « www », sans ancre ni barre finale. */
export function normalizeUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    url.hash = "";
    return `${url.hostname.toLowerCase().replace(/^www\./, "")}${url.pathname.replace(/\/+$/, "")}${url.search}`;
  } catch {
    return null;
  }
}

export interface SeenUrls {
  /** Pages vues dans les résultats de recherche. */
  searched: Set<string>;
  /** Pages ouvertes et lues (web_fetch) : la preuve la plus forte. */
  fetched: Set<string>;
}

/** Statut d'une page produit : lue, seulement vue dans une recherche, ou jamais rencontrée. */
export function pageStatus(url: string, seen: SeenUrls): "fetched" | "searched" | null {
  const key = normalizeUrl(url);
  if (!key) return null;
  if (seen.fetched.has(key)) return "fetched";
  return seen.searched.has(key) ? "searched" : null;
}

function collectUrls(blocks: BetaContentBlock[], into: SeenUrls) {
  const add = (set: Set<string>, url: string) => {
    const normalized = normalizeUrl(url);
    if (normalized) set.add(normalized);
  };
  for (const block of blocks) {
    if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
      for (const result of block.content) add(into.searched, result.url);
    } else if (block.type === "web_fetch_tool_result" && block.content.type === "web_fetch_result") {
      add(into.fetched, block.content.url);
    }
  }
}

function statusFor(block: BetaContentBlock): string | null {
  if (block.type !== "server_tool_use") return null;
  const input = block.input as { query?: unknown; url?: unknown };
  if (block.name === "web_search" && typeof input.query === "string") {
    return `Recherche : « ${input.query} »`;
  }
  if (block.name === "web_fetch" && typeof input.url === "string") {
    try {
      return `Vérification d'une fiche produit sur ${new URL(input.url).hostname.replace(/^www\./, "")}`;
    } catch {
      return "Vérification d'une fiche produit";
    }
  }
  return null;
}

export type WebAgentOutcome =
  | { ok: true; input: unknown; seen: SeenUrls }
  | { ok: false; reason: "refusal" | "unfinished" };

export async function runWebAgent(options: {
  system: string;
  content: Exclude<BetaMessageParam["content"], string>;
  submitTool: BetaTool;
  maxSearches: number;
  maxFetches: number;
  onStatus?: (message: string) => void;
  signal?: AbortSignal;
}): Promise<WebAgentOutcome> {
  const client = new Anthropic();
  const messages: BetaMessageParam[] = [{ role: "user", content: options.content }];
  const seen: SeenUrls = { searched: new Set(), fetched: new Set() };
  let nudged = false;

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const stream = client.beta.messages.stream(
      {
        model: MODEL,
        max_tokens: 32000,
        system: options.system,
        thinking: { type: "adaptive" },
        // "medium" garde des temps de réponse raisonnables pour un usage grand public.
        output_config: { effort: "medium" },
        tools: [
          {
            type: "web_search_20260209",
            name: "web_search",
            max_uses: options.maxSearches,
            user_location: { type: "approximate", country: "FR" },
          },
          { type: "web_fetch_20260209", name: "web_fetch", max_uses: options.maxFetches },
          options.submitTool,
        ],
        tool_choice: { type: "auto" },
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        messages,
      },
      { signal: options.signal },
    );

    stream.on("contentBlock", (block) => {
      const status = statusFor(block);
      if (status) options.onStatus?.(status);
    });

    const message = await stream.finalMessage();
    collectUrls(message.content, seen);

    if (message.stop_reason === "refusal") return { ok: false, reason: "refusal" };

    const submit = message.content.find(
      (block): block is BetaToolUseBlock => block.type === "tool_use" && block.name === options.submitTool.name,
    );
    if (submit) return { ok: true, input: submit.input, seen };

    messages.push({ role: "assistant", content: message.content });

    if (message.stop_reason === "pause_turn") {
      options.onStatus?.("Recherche approfondie en cours…");
      continue;
    }
    if (message.stop_reason === "max_tokens" || nudged) break;

    // Le modèle a terminé sans appeler l'outil : on le lui rappelle une fois.
    nudged = true;
    messages.push({
      role: "user",
      content: `Merci ! Appelle maintenant ${options.submitTool.name} avec ta sélection finale.`,
    });
  }

  return { ok: false, reason: "unfinished" };
}

/** Champs d'une fiche produit réelle, communs aux dupes et aux offres « Où l'acheter ». */
export const PRODUCT_FIELDS_SCHEMA = {
  productName: { type: "string", description: "Nom exact du produit, tel qu'affiché sur la fiche." },
  retailer: { type: "string" },
  price: { type: "number", description: "Prix affiché sur la fiche, en euros." },
  url: { type: "string", description: "URL de la page produit, ouverte avec web_fetch." },
  reference: {
    type: "string",
    description: "Référence de l'enseigne (n° d'article, SKU), recopiée de la fiche. Chaîne vide si la fiche n'en affiche pas.",
  },
  dimensions: {
    type: "string",
    description: "Dimensions recopiées de la fiche (ex. « L. 82 × P. 96 × H. 101 cm »). Chaîne vide si non indiquées.",
  },
  details: {
    type: "string",
    description: "Autres informations de la fiche en une ou deux phrases : composition, finition, entretien.",
  },
  material: { type: "string", description: "Matière principale indiquée sur la fiche." },
  color: { type: "string", description: "Coloris indiqué sur la fiche." },
  availability: {
    type: "string",
    description: "Où le trouver : « En ligne », « En ligne et en magasin », délai de livraison si indiqué.",
  },
} as const;

export const PRODUCT_FIELD_NAMES = Object.keys(PRODUCT_FIELDS_SCHEMA);

/** Consignes communes : produits réels uniquement, données recopiées de la fiche. */
export const REAL_PRODUCTS_RULES = `Produits réels uniquement. N'invente jamais un produit, une référence, un prix ni une URL. Pour chaque produit retenu :
   - ouvre la page produit elle-même avec web_fetch (pas une page de catégorie ni un résultat de recherche) ;
   - recopie depuis cette page le nom exact, la référence de l'enseigne (numéro d'article, SKU, réf.) — laisse vide si la fiche n'en affiche pas —, le prix affiché, les dimensions, la matière et le coloris ;
   - indique où le trouver : en ligne, en magasin, délai de livraison si la fiche le précise ;
   - écarte le produit s'il est indisponible, en rupture ou si la page ne charge pas.
   Hestia écarte automatiquement tout produit dont la page n'a pas été vue pendant la recherche.`;
