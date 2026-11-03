import { connection } from "next/server";
import { clientIp, isSameOrigin } from "@/lib/server/guard";
import { isPhotoProviderConfigured, searchPhotos } from "@/lib/server/pexels";
import { checkRateLimit } from "@/lib/server/rate-limit";

/** GET /api/photos?q=salon+bohème&page=2 → { configured, photos, nextPage } */
export async function GET(request: Request) {
  // Réponse calculée à chaque requête (clé lue à l'exécution), jamais figée à la compilation.
  await connection();
  if (!isPhotoProviderConfigured()) {
    return Response.json({ configured: false, photos: [], nextPage: null });
  }
  // Le quota Pexels est partagé : on le réserve aux pages d'Hestia, avec une limite par client.
  if (!isSameOrigin(request)) return Response.json({ error: "Origine non autorisée." }, { status: 403 });
  const limit = checkRateLimit(`photos:${clientIp(request)}`, Number(process.env.PHOTOS_HOURLY_LIMIT ?? 400));
  if (!limit.ok) {
    return Response.json({ configured: true, photos: [], nextPage: null, error: true }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } });
  }
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 100) || "décoration intérieure";
  const page = Math.min(Math.max(Number(url.searchParams.get("page")) || 1, 1), 50);
  try {
    const result = await searchPhotos(query, page);
    return Response.json(
      { configured: true, ...result },
      { headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=3600" } },
    );
  } catch (error) {
    console.error("[photos]", error);
    return Response.json({ configured: true, photos: [], nextPage: null, error: true }, { status: 502 });
  }
}
