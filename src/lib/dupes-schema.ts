import { z } from "zod";

/** ~6 Mo de base64 ≈ 4,5 Mo d'image : largement suffisant après compression côté client. */
const MAX_BASE64_LENGTH = 6_000_000;

export const ImageInputSchema = z.object({
  mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  data: z
    .string()
    .min(100)
    .max(MAX_BASE64_LENGTH, "Image trop lourde")
    .regex(/^[A-Za-z0-9+/=]+$/, "Encodage base64 invalide"),
});

/** Photo du fil d'inspiration, transmise par son adresse : seul le CDN Pexels est accepté. */
const PexelsImageUrl = z
  .string()
  .url()
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "images.pexels.com";
    } catch {
      return false;
    }
  }, "Adresse d'image non autorisée");

export const DupesRequestSchema = z
  .object({
    inspiration: ImageInputSchema.optional(),
    inspirationUrl: PexelsImageUrl.optional(),
    room: ImageInputSchema.optional(),
    budget: z.number().min(30).max(50_000),
    roomType: z.string().max(40).optional(),
    notes: z.string().max(600).optional(),
    /** Styles choisis (deux au plus). */
    styles: z.array(z.string().min(1).max(40)).max(2).optional(),
    /** Palette choisie dans le studio de couleurs. */
    colors: z
      .array(z.object({ name: z.string().min(1).max(40), hex: z.string().regex(/^#[0-9a-fA-F]{6}$/) }))
      .max(6)
      .optional(),
    /** Matières choisies dans la matériauthèque. */
    materials: z.array(z.string().min(1).max(40)).max(5).optional(),
  })
  .refine((value) => value.inspiration || value.inspirationUrl, "Ajoutez une image d'inspiration.");

export type ImageInput = z.infer<typeof ImageInputSchema>;
export type DupesRequest = z.infer<typeof DupesRequestSchema>;

export const DupeSchema = z.object({
  originalItem: z.string(),
  category: z.string(),
  productName: z.string(),
  retailer: z.string(),
  price: z.number().nonnegative(),
  url: z.string().url(),
  /** Référence de l'enseigne (SKU, n° d'article), recopiée de la fiche ; vide si la fiche n'en affiche pas. */
  reference: z.string(),
  dimensions: z.string(),
  /** Autres informations de la fiche : composition, finition, entretien… */
  details: z.string(),
  material: z.string(),
  color: z.string(),
  /** Où le trouver : en ligne, en magasin, délai de livraison constaté. */
  availability: z.string(),
  whyItMatches: z.string(),
  priority: z.enum(["essentiel", "bonus"]),
});

/** Dupe tel qu'envoyé au navigateur : vérifié côté serveur et doté de son lien d'achat Hestia. */
export const VerifiedDupeSchema = DupeSchema.extend({
  /** Page produit ouverte et lue pendant la recherche (et non seulement vue dans un résultat). */
  verified: z.boolean(),
  buyUrl: z.string(),
});

export const DupesResultSchema = z.object({
  ambianceSummary: z.string(),
  palette: z.array(z.object({ name: z.string(), hex: z.string() })),
  roomAdvice: z.string(),
  dupes: z.array(DupeSchema),
  totalPrice: z.number().nonnegative(),
  budgetTips: z.array(z.string()),
});

/** Messages envoyés au navigateur, une ligne JSON par événement (NDJSON). */
export type DupesStreamEvent =
  | { type: "status"; message: string }
  | {
      type: "result";
      result: Omit<z.infer<typeof DupesResultSchema>, "dupes"> & { dupes: z.infer<typeof VerifiedDupeSchema>[] };
      /** Produits écartés faute d'avoir été trouvés réellement en ligne. */
      discarded: number;
    }
  | { type: "error"; message: string };
