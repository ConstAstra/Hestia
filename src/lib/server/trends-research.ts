import Anthropic from "@anthropic-ai/sdk";
import type {
  BetaContentBlock,
  BetaMessageParam,
  BetaTool,
  BetaToolUseBlock,
} from "@anthropic-ai/sdk/resources/beta/messages/messages";
import type { Trend } from "../trends";
import { ResearchResultSchema } from "../trends-schema";
import { readStoredTrends, type StoredTrends, writeStoredTrends } from "./trends-store";

/*
 * Veille des tendances déco : Claude parcourt le web (magazines, salons, sites
 * spécialisés) et en tire une sélection structurée, enregistrée pour la page Tendances.
 */

const MODEL = "claude-opus-5-5";
const MAX_TURNS = 8;
export const TRENDS_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const SYSTEM_PROMPT = `Tu es la rédactrice tendances d'Hestia, une application de décoration d'intérieur grand public, en français.

Ta mission : faire une veille web des tendances déco du moment, puis en tirer une sélection de 6 à 8 tendances.

Méthode :
1. Cherche des sources récentes et sérieuses : magazines de décoration (français et internationaux), comptes rendus de salons (Maison&Objet, Milan Design Week…), annonces des marques de peinture et d'ameublement, sites spécialisés. Privilégie les publications des derniers mois.
2. Retiens les tendances citées par plusieurs sources, concrètes et adoptables par tout le monde, sur des styles variés (pas seulement minimalistes) : couleurs, matières, motifs, formes, pièces, ambiances.
3. Pour chaque tendance, rédige en français, sur un ton chaleureux et précis :
   - label : un mot de catégorie (Couleur, Matière, Motif, Forme, Pièce, Ambiance, Esprit…) ;
   - title : un titre court et évocateur ;
   - description : 2 ou 3 phrases qui expliquent la tendance et pourquoi elle séduit ;
   - tips : 3 conseils concrets et abordables pour l'adopter chez soi ;
   - palette : 5 couleurs représentatives au format #RRGGBB, de la plus marquante à la plus neutre ;
   - queries : 2 requêtes courtes EN ANGLAIS pour trouver des photos d'intérieurs illustrant la tendance dans une banque d'images (ex. « dark wood living room »).
4. N'invente rien : ne cite que des tendances effectivement relevées dans tes recherches, sans chiffres ni citations fabriqués.
5. Liste dans sources les pages que tu as réellement consultées (titre et URL tels qu'ils figurent dans tes résultats), 3 à 10 au total.

Quand tu as terminé, appelle l'outil submit_trends une seule fois avec la sélection complète.`;

const SUBMIT_TOOL: BetaTool = {
  name: "submit_trends",
  description: "Enregistre la sélection finale des tendances déco. À appeler une seule fois, après la veille.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["trends", "sources"],
    properties: {
      trends: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["label", "title", "description", "tips", "palette", "queries"],
          properties: {
            label: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            tips: { type: "array", items: { type: "string" } },
            palette: { type: "array", items: { type: "string", description: "Couleur #RRGGBB" } },
            queries: { type: "array", items: { type: "string", description: "Requête photo en anglais" } },
          },
        },
      },
      sources: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "url"],
          properties: { title: { type: "string" }, url: { type: "string" } },
        },
      },
    },
  },
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

function collectUrls(blocks: BetaContentBlock[], into: Set<string>) {
  for (const block of blocks) {
    if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
      for (const result of block.content) into.add(result.url);
    } else if (block.type === "web_fetch_tool_result" && block.content.type === "web_fetch_result") {
      into.add(block.content.url);
    }
  }
}

/** Lance la veille et renvoie la sélection validée (lève une erreur en cas d'échec). */
export async function researchTrends(): Promise<StoredTrends> {
  const client = new Anthropic();
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const messages: BetaMessageParam[] = [
    { role: "user", content: `Nous sommes le ${today}. Quelles sont les tendances déco du moment ?` },
  ];
  const seenUrls = new Set<string>();
  let nudged = false;

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const message = await client.beta.messages
      .stream({
        model: MODEL,
        max_tokens: 32000,
        system: SYSTEM_PROMPT,
        thinking: { type: "adaptive" },
        output_config: { effort: "medium" },
        tools: [
          { type: "web_search_20260209", name: "web_search", max_uses: 12, user_location: { type: "approximate", country: "FR" } },
          { type: "web_fetch_20260209", name: "web_fetch", max_uses: 6 },
          SUBMIT_TOOL,
        ],
        tool_choice: { type: "auto" },
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        messages,
      })
      .finalMessage();
    collectUrls(message.content, seenUrls);

    if (message.stop_reason === "refusal") throw new Error("Veille refusée par le modèle");

    const submit = message.content.find(
      (block): block is BetaToolUseBlock => block.type === "tool_use" && block.name === "submit_trends",
    );
    if (submit) {
      const parsed = ResearchResultSchema.safeParse(submit.input);
      if (!parsed.success) throw new Error(`Sélection invalide : ${parsed.error.issues[0]?.message}`);
      const used = new Set<string>();
      const trends: Trend[] = parsed.data.trends.map((trend) => {
        let id = slugify(trend.title) || "tendance";
        while (used.has(id)) id += "-2";
        used.add(id);
        return { id, ...trend };
      });
      // On ne garde que les sources effectivement vues pendant la recherche.
      const sources = parsed.data.sources.filter((source) => seenUrls.has(source.url));
      return { updatedAt: new Date().toISOString(), trends, sources };
    }

    messages.push({ role: "assistant", content: message.content });
    if (message.stop_reason === "pause_turn") continue;
    if (message.stop_reason === "max_tokens" || nudged) break;
    nudged = true;
    messages.push({ role: "user", content: "Merci ! Appelle maintenant submit_trends avec ta sélection finale." });
  }
  throw new Error("La veille n'a pas abouti");
}

let running: Promise<StoredTrends> | null = null;
let lastFailureAt = 0;
const RETRY_COOLDOWN_MS = 6 * 60 * 60 * 1000;

/** Après un échec, l'actualisation automatique patiente avant de réessayer (appels coûteux). */
export const canAutoRefresh = () => running === null && Date.now() - lastFailureAt > RETRY_COOLDOWN_MS;

export const isRefreshing = () => running !== null;
export const isTrendsResearchConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

/** Actualise et enregistre ; une seule veille à la fois par serveur. */
export function refreshTrends(): Promise<StoredTrends> {
  running ??= researchTrends()
    .then(async (result) => {
      await writeStoredTrends(result);
      return result;
    })
    .catch((error: unknown) => {
      lastFailureAt = Date.now();
      throw error;
    })
    .finally(() => {
      running = null;
    });
  return running;
}

/** Vrai si aucune veille n'existe ou si la dernière date de plus d'une semaine. */
export async function trendsAreStale(): Promise<boolean> {
  const stored = await readStoredTrends();
  return !stored || Date.now() - new Date(stored.updatedAt).getTime() > TRENDS_MAX_AGE_MS;
}
