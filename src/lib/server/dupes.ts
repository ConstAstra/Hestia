import Anthropic from "@anthropic-ai/sdk";
import type {
  BetaContentBlock,
  BetaMessageParam,
  BetaTool,
  BetaToolUseBlock,
} from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { hestiaBuyLink } from "./affiliate";
import {
  DupesResultSchema,
  type DupesRequest,
  type DupesStreamEvent,
  type ImageInput,
} from "../dupes-schema";
import type { z } from "zod";

type DupesResult = z.infer<typeof DupesResultSchema>;

const MODEL = "claude-opus-5-5";
const MAX_TURNS = 8;

const SYSTEM_PROMPT = `Tu es la décoratrice d'intérieur de Hestia, une application grand public. Ta spécialité : retrouver des « dupes », c'est-à-dire des produits abordables, réellement en vente, qui reproduisent fidèlement une ambiance repérée en inspiration (réseaux sociaux, magazines, photos).

Méthode :
1. Analyse la photo d'inspiration : identifie chaque pièce qui fait l'ambiance (mobilier, luminaires, textiles, tapis, objets, plantes, finitions murales) avec sa forme, sa matière, sa couleur et ses proportions.
2. Si une photo de la pièce de l'utilisateur est fournie, observe-la : volumes, lumière, sol, murs, meubles déjà présents à conserver. Ne propose pas ce que la personne possède déjà ; adapte les tailles à l'espace visible.
3. Pour chaque pièce, cherche sur le web un équivalent actuellement disponible chez des enseignes livrant en France (par exemple IKEA, Maisons du Monde, La Redoute Intérieurs, AM.PM, H&M Home, Zara Home, Leroy Merlin, Castorama, Conforama, Made in Design, Westwing, Bocage, Fnac-Darty, Amazon, Etsy). Le dupe doit s'inspirer directement de l'objet de l'inspiration : même silhouette, même matière ou un rendu proche, même teinte.
4. Respecte le budget total : la somme des prix des dupes ne doit pas le dépasser. Classe en « essentiel » ce qui porte l'ambiance et en « bonus » le reste ; si le budget est serré, privilégie les essentiels et explique les arbitrages.
5. Si l'utilisateur a choisi des couleurs ou des matières, chaque produit doit les respecter (ou en avoir l'aspect fidèle) : vérifie-le sur la fiche.
6. Produits réels uniquement. N'invente jamais un produit, une référence, un prix ni une URL. Pour chaque dupe retenu :
   - ouvre la page produit elle-même avec web_fetch (pas une page de catégorie ni un résultat de recherche) ;
   - recopie depuis cette page le nom exact, la référence de l'enseigne (numéro d'article, SKU, réf.) — laisse vide si la fiche n'en affiche pas —, le prix affiché, les dimensions, la matière et le coloris ;
   - indique où le trouver : en ligne, en magasin, délai de livraison si la fiche le précise ;
   - écarte le produit s'il est indisponible, en rupture ou si la page ne charge pas.
   Si tu ne trouves pas de dupe fiable pour une pièce, omets-la et mentionne-la dans les conseils. Hestia écarte automatiquement tout produit dont la page n'a pas été vue pendant la recherche.

Quand tes recherches sont terminées, appelle l'outil submit_dupes une seule fois avec le résultat complet, rédigé en français, sur un ton chaleureux et précis. Les prix sont en euros.`;

const SUBMIT_TOOL: BetaTool = {
  name: "submit_dupes",
  description:
    "Enregistre la sélection finale de dupes pour l'utilisateur. À appeler une seule fois, après les recherches.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["ambianceSummary", "palette", "roomAdvice", "dupes", "totalPrice", "budgetTips"],
    properties: {
      ambianceSummary: {
        type: "string",
        description: "2 à 4 phrases décrivant l'ambiance de l'inspiration et ce qui la rend unique.",
      },
      palette: {
        type: "array",
        description: "4 à 6 couleurs clés de l'inspiration.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "hex"],
          properties: {
            name: { type: "string" },
            hex: { type: "string", description: "Couleur au format #RRGGBB." },
          },
        },
      },
      roomAdvice: {
        type: "string",
        description:
          "Conseils d'agencement pour transposer l'ambiance dans la pièce de l'utilisateur (ou conseils généraux sans photo de pièce).",
      },
      dupes: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "originalItem", "category", "productName", "retailer", "price", "url",
            "reference", "details", "material", "color", "availability", "whyItMatches", "priority",
          ],
          properties: {
            originalItem: { type: "string", description: "L'objet tel qu'il apparaît dans l'inspiration." },
            category: { type: "string" },
            productName: { type: "string", description: "Nom exact du produit, tel qu'affiché sur la fiche." },
            retailer: { type: "string" },
            price: { type: "number", description: "Prix affiché sur la fiche, en euros." },
            url: { type: "string", description: "URL de la page produit, ouverte avec web_fetch." },
            reference: {
              type: "string",
              description: "Référence de l'enseigne (n° d'article, SKU), recopiée de la fiche. Chaîne vide si la fiche n'en affiche pas.",
            },
            details: {
              type: "string",
              description: "Informations de la fiche en une ou deux phrases : dimensions, composition, finition, entretien.",
            },
            material: { type: "string", description: "Matière principale indiquée sur la fiche." },
            color: { type: "string", description: "Coloris indiqué sur la fiche." },
            availability: {
              type: "string",
              description: "Où le trouver : « En ligne », « En ligne et en magasin », délai de livraison si indiqué.",
            },
            whyItMatches: { type: "string", description: "En une phrase, pourquoi ce produit reproduit l'original." },
            priority: { type: "string", enum: ["essentiel", "bonus"] },
          },
        },
      },
      totalPrice: { type: "number", description: "Somme des prix des dupes proposés." },
      budgetTips: {
        type: "array",
        items: { type: "string" },
        description: "2 à 5 astuces : arbitrages, DIY, seconde main, pièces manquantes.",
      },
    },
  },
};

const imageBlock = (image: ImageInput) => ({
  type: "image" as const,
  source: { type: "base64" as const, media_type: image.mediaType, data: image.data },
});

function buildUserContent(request: DupesRequest) {
  const content: Exclude<BetaMessageParam["content"], string> = [
    { type: "text", text: "Voici mon inspiration :" },
    request.inspiration
      ? imageBlock(request.inspiration)
      : { type: "image", source: { type: "url", url: request.inspirationUrl! } },
  ];
  if (request.room) {
    content.push({ type: "text", text: "Et voici ma pièce telle qu'elle est aujourd'hui :" }, imageBlock(request.room));
  }
  const details = [
    `Budget total : ${request.budget} €.`,
    request.roomType ? `Type de pièce : ${request.roomType}.` : null,
    request.notes ? `Précisions de ma part : ${request.notes}` : null,
    request.colors?.length
      ? `Couleurs que je souhaite pour ce projet : ${request.colors.map((c) => `${c.name} (${c.hex})`).join(", ")}. Oriente les dupes et la palette proposée vers ces teintes, tout en gardant l'esprit de l'inspiration.`
      : null,
    request.materials?.length
      ? `Matières que je souhaite mettre à l'honneur : ${request.materials.join(", ")}. Privilégie des pièces dans ces matières (ou des alternatives abordables qui en ont l'aspect).`
      : null,
  ].filter(Boolean);
  content.push({
    type: "text",
    text: `${details.join("\n")}\n\nTrouve-moi les dupes pour reproduire cette ambiance.`,
  });
  return content;
}

/** Forme comparable d'une URL : sans « www », sans ancre ni barre finale. */
function normalizeUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    url.hash = "";
    return `${url.hostname.toLowerCase().replace(/^www\./, "")}${url.pathname.replace(/\/+$/, "")}${url.search}`;
  } catch {
    return null;
  }
}

interface SeenUrls {
  /** Pages vues dans les résultats de recherche. */
  searched: Set<string>;
  /** Pages ouvertes et lues (web_fetch) : la preuve la plus forte. */
  fetched: Set<string>;
}

/** Relève les URLs vues dans les résultats de recherche / de lecture de pages. */
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

/**
 * Ne garde que les produits réellement rencontrés en ligne pendant la recherche,
 * leur attache leur lien d'achat Hestia et recalcule le total.
 */
function verifyDupes(result: DupesResult, seen: SeenUrls) {
  const dupes = result.dupes.flatMap((dupe) => {
    const key = normalizeUrl(dupe.url);
    if (!key) return [];
    const verified = seen.fetched.has(key);
    if (!verified && !seen.searched.has(key)) return [];
    return [{ ...dupe, reference: dupe.reference.trim(), verified, buyUrl: hestiaBuyLink(dupe.url, dupe.retailer) }];
  });
  const totalPrice = Math.round(dupes.reduce((sum, dupe) => sum + dupe.price, 0) * 100) / 100;
  return { result: { ...result, dupes, totalPrice }, discarded: result.dupes.length - dupes.length };
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

export async function findDupes(
  request: DupesRequest,
  emit: (event: DupesStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const client = new Anthropic();
  const messages: BetaMessageParam[] = [{ role: "user", content: buildUserContent(request) }];
  const seenUrls: SeenUrls = { searched: new Set(), fetched: new Set() };
  let nudged = false;

  emit({ type: "status", message: "Analyse de votre inspiration…" });

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const stream = client.beta.messages.stream(
      {
        model: MODEL,
        max_tokens: 32000,
        system: SYSTEM_PROMPT,
        thinking: { type: "adaptive" },
        // "medium" garde des temps de réponse raisonnables pour un usage grand public.
        output_config: { effort: "medium" },
        tools: [
          {
            type: "web_search_20260209",
            name: "web_search",
            max_uses: 15,
            user_location: { type: "approximate", country: "FR" },
          },
          { type: "web_fetch_20260209", name: "web_fetch", max_uses: 14 },
          SUBMIT_TOOL,
        ],
        tool_choice: { type: "auto" },
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        messages,
      },
      { signal },
    );

    stream.on("contentBlock", (block) => {
      const status = statusFor(block);
      if (status) emit({ type: "status", message: status });
    });

    const message = await stream.finalMessage();
    collectUrls(message.content, seenUrls);

    if (message.stop_reason === "refusal") {
      emit({
        type: "error",
        message: "Cette demande n'a pas pu être traitée. Essayez avec une autre image.",
      });
      return;
    }

    const submit = message.content.find(
      (block): block is BetaToolUseBlock => block.type === "tool_use" && block.name === "submit_dupes",
    );
    if (submit) {
      const parsed = DupesResultSchema.safeParse(submit.input);
      if (!parsed.success) {
        emit({ type: "error", message: "La réponse d'Hestia était incomplète. Merci de réessayer." });
        return;
      }
      const { result, discarded } = verifyDupes(parsed.data, seenUrls);
      if (parsed.data.dupes.length > 0 && result.dupes.length === 0) {
        emit({
          type: "error",
          message: "Hestia n'a pas pu confirmer de produits réellement en vente cette fois-ci. Merci de réessayer.",
        });
        return;
      }
      emit({ type: "result", result, discarded });
      return;
    }

    messages.push({ role: "assistant", content: message.content });

    if (message.stop_reason === "pause_turn") {
      emit({ type: "status", message: "Recherche approfondie en cours…" });
      continue;
    }
    if (message.stop_reason === "max_tokens" || nudged) break;

    // Le modèle a terminé sans appeler l'outil : on le lui rappelle une fois.
    nudged = true;
    messages.push({
      role: "user",
      content: "Merci ! Appelle maintenant submit_dupes avec ta sélection finale.",
    });
  }

  emit({
    type: "error",
    message: "Impossible de finaliser la sélection cette fois-ci. Merci de réessayer.",
  });
}
