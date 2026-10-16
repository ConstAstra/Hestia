import { z } from "zod";

const Hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur au format #RRGGBB");

/** Une tendance telle que la produit la veille web (avant attribution d'un identifiant). */
export const ResearchedTrendSchema = z.object({
  label: z.string().min(2).max(30),
  title: z.string().min(5).max(80),
  description: z.string().min(40).max(500),
  tips: z.array(z.string().min(10).max(220)).min(2).max(4),
  palette: z.array(Hex).min(4).max(6),
  queries: z.array(z.string().min(3).max(60)).min(1).max(3),
});

export const SourceSchema = z.object({
  title: z.string().min(2).max(200),
  url: z.string().url(),
});

export const ResearchResultSchema = z.object({
  trends: z.array(ResearchedTrendSchema).min(4).max(10),
  sources: z.array(SourceSchema).max(20),
});

export type ResearchResult = z.infer<typeof ResearchResultSchema>;
export type TrendSource = z.infer<typeof SourceSchema>;

/** Réponse de GET /api/trends. */
export interface LiveTrendsResponse {
  /** true si la sélection provient d'une veille web, false pour la sélection éditoriale fixe. */
  live: boolean;
  updatedAt: string | null;
  trends: {
    id: string;
    label: string;
    title: string;
    description: string;
    tips: string[];
    palette: string[];
    queries: string[];
  }[];
  sources: TrendSource[];
  /** Une actualisation est en cours en arrière-plan. */
  refreshing: boolean;
}
