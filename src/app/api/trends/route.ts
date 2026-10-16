import { after, connection } from "next/server";
import { readStoredTrends } from "@/lib/server/trends-store";
import {
  canAutoRefresh,
  isRefreshing,
  isTrendsResearchConfigured,
  refreshTrends,
  trendsAreStale,
} from "@/lib/server/trends-research";
import { TRENDS } from "@/lib/trends";
import type { LiveTrendsResponse } from "@/lib/trends-schema";

// La veille tourne après la réponse (after) : on lui laisse le temps de chercher.
export const maxDuration = 300;

/** GET /api/trends : dernière veille enregistrée, ou sélection éditoriale fixe. */
export async function GET() {
  await connection();
  const stored = await readStoredTrends();

  // Sélection absente ou vieille de plus d'une semaine : actualisation en arrière-plan.
  let refreshing = isRefreshing();
  if (isTrendsResearchConfigured() && canAutoRefresh() && (await trendsAreStale())) {
    refreshing = true;
    after(async () => {
      try {
        await refreshTrends();
      } catch (error) {
        console.error("[trends] actualisation automatique impossible", error);
      }
    });
  }

  const body: LiveTrendsResponse = stored
    ? { live: true, updatedAt: stored.updatedAt, trends: stored.trends, sources: stored.sources, refreshing }
    : { live: false, updatedAt: null, trends: TRENDS, sources: [], refreshing };
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}
