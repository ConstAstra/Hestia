import type { BetaTool } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { type Listing, SecondHandRequestSchema, SecondHandResultSchema, type SecondHandStreamEvent } from "../second-hand-schema";
import type { z } from "zod";
import { hestiaBuyLink } from "./affiliate";
import { pageStatus, PRODUCT_FIELD_NAMES, PRODUCT_FIELDS_SCHEMA, REAL_PRODUCTS_RULES, runWebAgent } from "./web-agent";

const SYSTEM_PROMPT = `Tu es la chineuse de Hestia, une application de décoration grand public. Tu trouves des meubles et objets de seconde main réellement en vente en France : vintage, occasion, reconditionné.

Méthode :
1. Cherche des annonces actuelles sur les plateformes de seconde main françaises : Selency, Label Emmaüs, Leboncoin, Vinted (rubrique maison), eBay, Brocante Lab, Pamono, ainsi que les rubriques occasion des enseignes (IKEA Seconde vie, etc.).
2. Retiens de 3 à 6 annonces fidèles à la demande, de préférence sur des plateformes différentes, dans le budget s'il est indiqué, près de la ville indiquée ou avec livraison possible.
3. ${REAL_PRODUCTS_RULES}
   Pour une annonce, la « référence » est le numéro de l'annonce s'il est affiché. Relève aussi l'état indiqué par le vendeur et la localisation (ou « Livraison possible »). Écarte les annonces vendues ou expirées.
4. Ajoute 2 à 4 conseils de chine adaptés à la demande : points à vérifier, prix à négocier, transport, rénovation.

Quand tes recherches sont terminées, appelle l'outil submit_listings une seule fois, en français. Les prix sont en euros.`;

const SUBMIT_TOOL: BetaTool = {
  name: "submit_listings",
  description: "Enregistre les annonces de seconde main trouvées. À appeler une seule fois, après les recherches.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["listings", "tips"],
    properties: {
      listings: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [...PRODUCT_FIELD_NAMES, "condition", "location", "whyItMatches"],
          properties: {
            ...PRODUCT_FIELDS_SCHEMA,
            condition: { type: "string", description: "État indiqué par le vendeur (ex. « Très bon état », « À restaurer »)." },
            location: { type: "string", description: "Ville ou région du vendeur, ou « Livraison possible »." },
            whyItMatches: { type: "string", description: "En une phrase, pourquoi cette annonce répond à la demande." },
          },
        },
      },
      tips: { type: "array", items: { type: "string" }, description: "2 à 4 conseils de chine." },
    },
  },
};

export async function findSecondHand(
  request: z.infer<typeof SecondHandRequestSchema>,
  emit: (event: SecondHandStreamEvent) => void,
  signal?: AbortSignal,
) {
  emit({ type: "status", message: `Hestia part chiner « ${request.query} »…` });
  const text = [
    `Je cherche en seconde main : ${request.query}.`,
    request.maxPrice ? `Budget maximum : ${request.maxPrice} €.` : null,
    request.city ? `J'habite près de : ${request.city}.` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const outcome = await runWebAgent({
    system: SYSTEM_PROMPT,
    content: [{ type: "text", text }],
    submitTool: SUBMIT_TOOL,
    maxSearches: 10,
    maxFetches: 8,
    onStatus: (message) => emit({ type: "status", message }),
    signal,
  });
  if (!outcome.ok) {
    emit({ type: "error", message: "Impossible de terminer la recherche cette fois-ci. Merci de réessayer." });
    return;
  }
  const parsed = SecondHandResultSchema.safeParse(outcome.input);
  if (!parsed.success) {
    emit({ type: "error", message: "La réponse d'Hestia était incomplète. Merci de réessayer." });
    return;
  }
  const listings: Listing[] = parsed.data.listings.flatMap((listing) => {
    const status = pageStatus(listing.url, outcome.seen);
    if (!status) return [];
    return [{ ...listing, reference: listing.reference.trim(), verified: status === "fetched", buyUrl: hestiaBuyLink(listing.url, listing.retailer) }];
  });
  emit({ type: "result", listings, tips: parsed.data.tips, discarded: parsed.data.listings.length - listings.length });
}
