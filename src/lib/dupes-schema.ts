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

export const DupesRequestSchema = z.object({
  inspiration: ImageInputSchema,
  room: ImageInputSchema.optional(),
  budget: z.number().min(30).max(50_000),
  roomType: z.string().max(40).optional(),
  notes: z.string().max(600).optional(),
});

export type ImageInput = z.infer<typeof ImageInputSchema>;
export type DupesRequest = z.infer<typeof DupesRequestSchema>;

export const DupeSchema = z.object({
  originalItem: z.string(),
  category: z.string(),
  productName: z.string(),
  retailer: z.string(),
  price: z.number().nonnegative(),
  url: z.string().url(),
  whyItMatches: z.string(),
  priority: z.enum(["essentiel", "bonus"]),
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
      result: z.infer<typeof DupesResultSchema>;
      /** URLs effectivement vues par l'IA pendant ses recherches. */
      verifiedUrls: string[];
    }
  | { type: "error"; message: string };
