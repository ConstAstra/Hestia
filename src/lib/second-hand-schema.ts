import { z } from "zod";

/** Recherche « Seconde main » : ce que l'on cherche, et éventuellement un budget et une ville. */
export const SecondHandRequestSchema = z.object({
  query: z.string().trim().min(2, "Dites-nous ce que vous cherchez.").max(120),
  maxPrice: z.number().min(5).max(20_000).optional(),
  city: z.string().trim().max(60).optional(),
});

/** Annonce réelle trouvée sur une plateforme de seconde main. */
export const ListingSchema = z.object({
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
  /** État indiqué par le vendeur (très bon état, à restaurer…). */
  condition: z.string(),
  /** Ville ou région du vendeur, ou « Livraison possible ». */
  location: z.string(),
  whyItMatches: z.string(),
});

export const SecondHandResultSchema = z.object({ listings: z.array(ListingSchema), tips: z.array(z.string()) });

export type Listing = z.infer<typeof ListingSchema> & { verified: boolean; buyUrl: string };

export type SecondHandStreamEvent =
  | { type: "status"; message: string }
  | { type: "result"; listings: Listing[]; tips: string[]; discarded: number }
  | { type: "error"; message: string };
