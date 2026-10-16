import type { BetaTool } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { CATEGORY_LABELS, STYLE_LABELS } from "../catalog";
import { OffersResultSchema, type Offer, type OffersStreamEvent } from "../offers-schema";
import type { Product } from "../types";
import { hestiaBuyLink } from "./affiliate";
import { pageStatus, PRODUCT_FIELD_NAMES, PRODUCT_FIELDS_SCHEMA, REAL_PRODUCTS_RULES, runWebAgent } from "./web-agent";

const SYSTEM_PROMPT = `Tu es l'acheteuse de Hestia, une application de décoration grand public. Une personne a aimé un produit dans le swipe d'Hestia ; ce produit est un modèle type (une silhouette, une matière, un style, un ordre de prix), pas une référence marchande. Ta mission : trouver où acheter, en France, des produits réels qui lui correspondent.

Méthode :
1. Cherche sur le web des produits actuellement en vente chez des enseignes livrant en France (IKEA, Maisons du Monde, La Redoute Intérieurs, AM.PM, H&M Home, Zara Home, Leroy Merlin, Castorama, Conforama, Made in Design, Westwing, Bocage, Habitat, Amazon, Etsy…) qui reprennent la silhouette, la matière, la couleur et le style décrits.
2. Retiens de 1 à 3 offres, de préférence chez des enseignes différentes, dont au moins une proche du prix indicatif. Classe-les de la plus fidèle à la moins fidèle.
3. ${REAL_PRODUCTS_RULES}
   Si tu ne trouves aucune offre fiable, renvoie une liste vide.

Quand tes recherches sont terminées, appelle l'outil submit_offers une seule fois, en français. Les prix sont en euros.`;

const SUBMIT_TOOL: BetaTool = {
  name: "submit_offers",
  description: "Enregistre les offres réelles trouvées pour le produit. À appeler une seule fois, après les recherches.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["offers"],
    properties: {
      offers: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [...PRODUCT_FIELD_NAMES, "whyItMatches"],
          properties: {
            ...PRODUCT_FIELDS_SCHEMA,
            whyItMatches: { type: "string", description: "En une phrase, en quoi cette offre correspond au produit aimé." },
          },
        },
      },
    },
  },
};

function describe(product: Product) {
  return [
    `Produit aimé : ${product.name}`,
    `Catégorie : ${CATEGORY_LABELS[product.category]}`,
    `Style : ${STYLE_LABELS[product.style]}`,
    `Matières : ${product.materials.join(", ")}`,
    `Description : ${product.description}`,
    `Prix indicatif : environ ${product.price} €`,
    "",
    "Trouve-moi où l'acheter.",
  ].join("\n");
}

export async function findOffers(product: Product, emit: (event: OffersStreamEvent) => void, signal?: AbortSignal) {
  emit({ type: "status", message: `Hestia cherche « ${product.name} » chez les enseignes…` });
  const outcome = await runWebAgent({
    system: SYSTEM_PROMPT,
    content: [{ type: "text", text: describe(product) }],
    submitTool: SUBMIT_TOOL,
    maxSearches: 8,
    maxFetches: 6,
    onStatus: (message) => emit({ type: "status", message }),
    signal,
  });
  if (!outcome.ok) {
    emit({ type: "error", message: "Impossible de terminer la recherche cette fois-ci. Merci de réessayer." });
    return;
  }
  const parsed = OffersResultSchema.safeParse(outcome.input);
  if (!parsed.success) {
    emit({ type: "error", message: "La réponse d'Hestia était incomplète. Merci de réessayer." });
    return;
  }
  const offers: Offer[] = parsed.data.offers.flatMap((offer) => {
    const status = pageStatus(offer.url, outcome.seen);
    if (!status) return [];
    return [{ ...offer, reference: offer.reference.trim(), verified: status === "fetched", buyUrl: hestiaBuyLink(offer.url, offer.retailer) }];
  });
  emit({ type: "result", offers, discarded: parsed.data.offers.length - offers.length });
}
