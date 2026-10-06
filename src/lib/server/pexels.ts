import type { Photo } from "../types";

/*
 * Fournisseur de photos : l'API Pexels (gratuite, photos libres pour un usage
 * commercial, crédit du photographe apprécié). La clé reste côté serveur.
 * https://www.pexels.com/api/documentation/
 */

const API_BASE = process.env.PEXELS_API_BASE ?? "https://api.pexels.com/v1";
const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; value: PhotoPage }>();

export interface PhotoPage {
  photos: Photo[];
  nextPage: number | null;
}

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  alt: string | null;
  avg_color: string | null;
  photographer: string;
  photographer_url: string;
  src: { original: string; large2x: string; large: string; medium: string };
}

interface PexelsSearchResponse {
  page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

export const isPhotoProviderConfigured = () => Boolean(process.env.PEXELS_API_KEY);

function toPhoto(p: PexelsPhoto): Photo {
  return {
    id: String(p.id),
    width: p.width,
    height: p.height,
    alt: p.alt || "Inspiration déco",
    color: p.avg_color || "#e9d8c8",
    // « large » est recadré à 940 px de large : idéal pour la grille ; « large2x » pour la fiche.
    src: { medium: p.src.large, large: p.src.large2x, original: p.src.original },
    photographer: p.photographer,
    photographerUrl: p.photographer_url,
    pageUrl: p.url,
  };
}

async function pexels<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: process.env.PEXELS_API_KEY ?? "" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Pexels ${response.status}`);
  return (await response.json()) as T;
}

/** Recherche de photos, avec un petit cache mémoire pour ménager le quota (200 requêtes/heure). */
export async function searchPhotos(query: string, page: number, perPage = 30): Promise<PhotoPage> {
  const key = `${query}|${page}|${perPage}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;

  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(perPage),
    locale: "fr-FR",
  });
  const data = await pexels<PexelsSearchResponse>(`/search?${params}`);
  const value: PhotoPage = {
    photos: data.photos.map(toPhoto),
    nextPage: data.next_page ? page + 1 : null,
  };
  cache.set(key, { at: Date.now(), value });
  if (cache.size > 500) cache.delete(cache.keys().next().value!);
  return value;
}
