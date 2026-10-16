import type { BetaMessageParam, BetaTool } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import type { z } from "zod";
import { hestiaBuyLink } from "./affiliate";
import { pageStatus, PRODUCT_FIELD_NAMES, PRODUCT_FIELDS_SCHEMA, REAL_PRODUCTS_RULES, runWebAgent, type SeenUrls } from "./web-agent";
import {
  DupesResultSchema,
  type DupesRequest,
  type DupesStreamEvent,
  type ImageInput,
} from "../dupes-schema";

type DupesResult = z.infer<typeof DupesResultSchema>;

const SYSTEM_PROMPT = `Tu es la décoratrice d'intérieur de Hestia, une application grand public. Ta spécialité : retrouver des « dupes », c'est-à-dire des produits abordables, réellement en vente, qui reproduisent fidèlement une ambiance repérée en inspiration (réseaux sociaux, magazines, photos).

Méthode :
1. Analyse la photo d'inspiration : identifie chaque pièce qui fait l'ambiance (mobilier, luminaires, textiles, tapis, objets, plantes, finitions murales) avec sa forme, sa matière, sa couleur et ses proportions.
2. Si une photo de la pièce de l'utilisateur est fournie, observe-la : volumes, lumière, sol, murs, meubles déjà présents à conserver. Ne propose pas ce que la personne possède déjà ; adapte les tailles à l'espace visible.
3. Pour chaque pièce, cherche sur le web un équivalent actuellement disponible chez des enseignes livrant en France (par exemple IKEA, Maisons du Monde, La Redoute Intérieurs, AM.PM, H&M Home, Zara Home, Leroy Merlin, Castorama, Conforama, Made in Design, Westwing, Bocage, Fnac-Darty, Amazon, Etsy). Le dupe doit s'inspirer directement de l'objet de l'inspiration : même silhouette, même matière ou un rendu proche, même teinte.
4. Respecte le budget total : la somme des prix des dupes ne doit pas le dépasser. Classe en « essentiel » ce qui porte l'ambiance et en « bonus » le reste ; si le budget est serré, privilégie les essentiels et explique les arbitrages.
5. Si l'utilisateur a choisi un style, des couleurs ou des matières, chaque produit doit les respecter (ou en avoir l'aspect fidèle) : vérifie-le sur la fiche.
6. ${REAL_PRODUCTS_RULES}
   Si tu ne trouves pas de dupe fiable pour une pièce, omets-la et mentionne-la dans les conseils.

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
          required: ["originalItem", "category", ...PRODUCT_FIELD_NAMES, "whyItMatches", "priority"],
          properties: {
            originalItem: { type: "string", description: "L'objet tel qu'il apparaît dans l'inspiration." },
            category: { type: "string" },
            ...PRODUCT_FIELDS_SCHEMA,
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
    request.styles?.length
      ? `Style souhaité : ${request.styles.join(" et ")}. Choisis des pièces fidèles à ce style, en l'accordant à l'inspiration.`
      : null,
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

/**
 * Ne garde que les produits réellement rencontrés en ligne pendant la recherche,
 * leur attache leur lien d'achat Hestia et recalcule le total.
 */
function verifyDupes(result: DupesResult, seen: SeenUrls) {
  const dupes = result.dupes.flatMap((dupe) => {
    const status = pageStatus(dupe.url, seen);
    if (!status) return [];
    return [{ ...dupe, reference: dupe.reference.trim(), verified: status === "fetched", buyUrl: hestiaBuyLink(dupe.url, dupe.retailer) }];
  });
  const totalPrice = Math.round(dupes.reduce((sum, dupe) => sum + dupe.price, 0) * 100) / 100;
  return { result: { ...result, dupes, totalPrice }, discarded: result.dupes.length - dupes.length };
}

export async function findDupes(
  request: DupesRequest,
  emit: (event: DupesStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  emit({ type: "status", message: "Analyse de votre inspiration…" });
  const outcome = await runWebAgent({
    system: SYSTEM_PROMPT,
    content: buildUserContent(request),
    submitTool: SUBMIT_TOOL,
    maxSearches: 15,
    maxFetches: 14,
    onStatus: (message) => emit({ type: "status", message }),
    signal,
  });

  if (!outcome.ok) {
    emit({
      type: "error",
      message:
        outcome.reason === "refusal"
          ? "Cette demande n'a pas pu être traitée. Essayez avec une autre image."
          : "Impossible de finaliser la sélection cette fois-ci. Merci de réessayer.",
    });
    return;
  }

  const parsed = DupesResultSchema.safeParse(outcome.input);
  if (!parsed.success) {
    emit({ type: "error", message: "La réponse d'Hestia était incomplète. Merci de réessayer." });
    return;
  }
  const { result, discarded } = verifyDupes(parsed.data, outcome.seen);
  if (parsed.data.dupes.length > 0 && result.dupes.length === 0) {
    emit({
      type: "error",
      message: "Hestia n'a pas pu confirmer de produits réellement en vente cette fois-ci. Merci de réessayer.",
    });
    return;
  }
  emit({ type: "result", result, discarded });
}
