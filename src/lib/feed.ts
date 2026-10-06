"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INSPIRATIONS, PRODUCTS } from "./catalog";
import type { Inspiration, Photo, Product } from "./types";

/** Une épingle du fil : une vraie photo, ou (mode démonstration) un élément du catalogue. */
export type FeedItem =
  | { kind: "photo"; key: string; photo: Photo }
  | { kind: "inspiration"; key: string; item: Inspiration; ratio: number }
  | { kind: "product"; key: string; item: Product; ratio: number };

/** Rapport hauteur / largeur d'une épingle, pour répartir la mosaïque. */
export const itemRatio = (item: FeedItem) => (item.kind === "photo" ? item.photo.height / item.photo.width : item.ratio);

interface ApiPage {
  configured: boolean;
  photos: Photo[];
  nextPage: number | null;
}

/** Épingles de démonstration, tirées du catalogue, quand aucune banque d'images n'est configurée. */
function demoItems(seed: number): FeedItem[] {
  const ratios = [1.5, 1.25, 1.75, 1, 1.4, 1.2, 1.6];
  const all: FeedItem[] = [
    ...INSPIRATIONS.map((item, i) => ({ kind: "inspiration" as const, key: `i-${item.id}`, item, ratio: ratios[(i + seed) % ratios.length] })),
    ...PRODUCTS.map((item, i) => ({ kind: "product" as const, key: `p-${item.id}`, item, ratio: ratios[(i * 3 + seed) % ratios.length] })),
  ];
  // Mélange déterministe pour alterner ambiances et produits.
  return all.sort((a, b) => ((a.key.length * 7 + seed) % 5) - ((b.key.length * 7 + seed) % 5));
}

/**
 * Fil infini : chaque page puise tour à tour dans les requêtes fournies
 * (page 1 de la requête A, page 1 de B, …, puis page 2 de A, etc.).
 */
export function usePhotoFeed(queries: string[]) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const state = useRef({ step: 0, exhausted: new Set<string>(), seen: new Set<string>(), busy: false, version: 0 });
  // Pas de remise à zéro ici : chaque nouvelle liste de requêtes remonte le composant (prop `key`).

  const loadMore = useCallback(async () => {
    const s = state.current;
    if (s.busy || done || queries.length === 0) return;
    s.busy = true;
    setLoading(true);
    const version = s.version;
    try {
      // On cherche la prochaine requête encore active.
      let attempts = 0;
      while (attempts < queries.length) {
        const index = s.step % queries.length;
        const query = queries[index];
        const page = Math.floor(s.step / queries.length) + 1;
        s.step++;
        attempts++;
        if (s.exhausted.has(query)) continue;

        const response = await fetch(`/api/photos?q=${encodeURIComponent(query)}&page=${page}`);
        const data = (await response.json()) as ApiPage;
        if (version !== state.current.version) return;
        setConfigured(data.configured);

        if (!data.configured) {
          setItems(demoItems(0));
          setDone(true);
          return;
        }
        if (!data.nextPage) s.exhausted.add(query);
        const fresh = data.photos.filter((p) => !s.seen.has(p.id));
        fresh.forEach((p) => s.seen.add(p.id));
        if (fresh.length) {
          setItems((previous) => [...previous, ...fresh.map((photo) => ({ kind: "photo" as const, key: photo.id, photo }))]);
          return;
        }
      }
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      if (version === state.current.version) {
        state.current.busy = false;
        setLoading(false);
      }
    }
  }, [queries, done]);

  return { items, configured, loading, done, loadMore };
}

/** Déclenche `onVisible` quand l'élément sentinelle approche du bas de l'écran. */
export function useInfiniteScroll(onVisible: () => void, enabled = true) {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useRef(onVisible);
  useEffect(() => {
    callback.current = onVisible;
  }, [onVisible]);
  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    const observer = new IntersectionObserver((entries) => entries[0]?.isIntersecting && callback.current(), {
      rootMargin: "1200px 0px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);
  return ref;
}
