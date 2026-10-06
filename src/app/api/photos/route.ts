import { connection } from "next/server";
import { isPhotoProviderConfigured, searchPhotos } from "@/lib/server/pexels";

/** GET /api/photos?q=salon+bohème&page=2 → { configured, photos, nextPage } */
export async function GET(request: Request) {
  // Réponse calculée à chaque requête (clé lue à l'exécution), jamais figée à la compilation.
  await connection();
  if (!isPhotoProviderConfigured()) {
    return Response.json({ configured: false, photos: [], nextPage: null });
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
