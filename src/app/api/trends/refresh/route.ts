import { connection } from "next/server";
import { isTrendsResearchConfigured, refreshTrends } from "@/lib/server/trends-research";

export const maxDuration = 300;

/*
 * Actualisation manuelle ou planifiée de la veille des tendances.
 * Autorisée avec l'en-tête « Authorization: Bearer <secret> », où le secret est
 * TRENDS_REFRESH_SECRET ou CRON_SECRET (ce dernier est envoyé par les tâches planifiées Vercel).
 */
async function handle(request: Request) {
  await connection();
  const secrets = [process.env.TRENDS_REFRESH_SECRET, process.env.CRON_SECRET].filter(Boolean);
  const auth = request.headers.get("authorization") ?? "";
  if (secrets.length === 0 || !secrets.some((secret) => auth === `Bearer ${secret}`)) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  if (!isTrendsResearchConfigured()) {
    return Response.json({ error: "ANTHROPIC_API_KEY manquante" }, { status: 503 });
  }
  try {
    const result = await refreshTrends();
    return Response.json({
      ok: true,
      updatedAt: result.updatedAt,
      trends: result.trends.map((trend) => trend.title),
      sources: result.sources.length,
    });
  } catch (error) {
    console.error("[trends] actualisation impossible", error);
    return Response.json({ error: "La veille n'a pas abouti, réessayez plus tard." }, { status: 502 });
  }
}

export const GET = handle;
export const POST = handle;
