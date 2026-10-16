import { z } from "zod";

/** « Où l'acheter » : on n'envoie que l'identifiant du produit du catalogue, décrit côté serveur. */
export const OffersRequestSchema = z.object({ productId: z.string().min(1).max(60) });

/** Offre réelle trouvée en ligne pour un produit du swipe. */
export const OfferSchema = z.object({
  productName: z.string(),
  retailer: z.string(),
  price: z.number().nonnegative(),
  url: z.string().url(),
  reference: z.string(),
  dimensions: z.string(),
  details: z.string(),
  material: z.string(),
  color: z.string(),
  availability: z.string(),
  /** En une phrase : en quoi cette offre correspond au produit aimé. */
  whyItMatches: z.string(),
});

export const OffersResultSchema = z.object({ offers: z.array(OfferSchema) });

export type Offer = z.infer<typeof OfferSchema> & { verified: boolean; buyUrl: string };

export type OffersStreamEvent =
  | { type: "status"; message: string }
  | { type: "result"; offers: Offer[]; discarded: number }
  | { type: "error"; message: string };
