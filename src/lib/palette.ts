"use client";

import { useEffect, useState } from "react";
import type { Photo } from "./types";

/*
 * Palettes de couleurs : extraction des teintes dominantes d'une photo (dans le
 * navigateur, via un canvas) et synthèse des couleurs préférées d'une personne.
 */

type RGB = [number, number, number];

const toHex = ([r, g, b]: RGB) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
const fromHex = (hex: string): RGB => {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const distance = (a: RGB, b: RGB) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

/** k-moyennes pondérées : regroupe des couleurs en `k` teintes, classées par importance. */
function cluster(points: RGB[], weights: number[], k: number): RGB[] {
  if (points.length <= k) return points;
  // Initialisation étalée : on prend à chaque fois le point le plus éloigné des centres choisis.
  const centers: RGB[] = [points[0]];
  while (centers.length < k) {
    let best = 0;
    let bestDistance = -1;
    points.forEach((p, i) => {
      const d = Math.min(...centers.map((c) => distance(p, c)));
      if (d > bestDistance) {
        bestDistance = d;
        best = i;
      }
    });
    centers.push(points[best]);
  }
  let totals = new Array(k).fill(0);
  for (let iteration = 0; iteration < 10; iteration++) {
    const sums = centers.map(() => [0, 0, 0]);
    totals = new Array(k).fill(0);
    points.forEach((p, i) => {
      let nearest = 0;
      for (let c = 1; c < k; c++) if (distance(p, centers[c]) < distance(p, centers[nearest])) nearest = c;
      const w = weights[i];
      sums[nearest][0] += p[0] * w;
      sums[nearest][1] += p[1] * w;
      sums[nearest][2] += p[2] * w;
      totals[nearest] += w;
    });
    centers.forEach((_, c) => {
      if (totals[c] > 0) centers[c] = [sums[c][0] / totals[c], sums[c][1] / totals[c], sums[c][2] / totals[c]];
    });
  }
  return centers
    .map((center, c) => ({ center, total: totals[c] }))
    .filter((entry) => entry.total > 0)
    .sort((a, b) => b.total - a.total)
    .map((entry) => entry.center);
}

const cache = new Map<string, string[]>();
const pending = new Map<string, Promise<string[]>>();

export const cachedPalette = (photoId: string) => cache.get(photoId);

/** Cinq teintes dominantes d'une photo. Repli : sa couleur moyenne si l'image est inaccessible. */
export function extractPalette(photo: Photo): Promise<string[]> {
  if (photo.palette?.length) return Promise.resolve(photo.palette);
  const hit = cache.get(photo.id);
  if (hit) return Promise.resolve(hit);
  const running = pending.get(photo.id);
  if (running) return running;

  const promise = new Promise<string[]>((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => {
      try {
        const size = 48;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("canvas");
        context.drawImage(image, 0, 0, size, size);
        const { data } = context.getImageData(0, 0, size, size);
        const points: RGB[] = [];
        for (let i = 0; i < data.length; i += 4) points.push([data[i], data[i + 1], data[i + 2]]);
        const palette = cluster(points, points.map(() => 1), 5).map(toHex);
        cache.set(photo.id, palette);
        resolve(palette);
      } catch {
        resolve([photo.color]);
      }
    };
    image.onerror = () => resolve([photo.color]);
    image.src = photo.src.medium;
  }).finally(() => pending.delete(photo.id));
  pending.set(photo.id, promise);
  return promise;
}

/** Palette d'une photo, calculée à l'affichage (null pendant le calcul). */
export function usePhotoPalette(photo: Photo | null): string[] | null {
  const [state, setState] = useState<{ id: string; palette: string[] } | null>(null);
  useEffect(() => {
    if (!photo) return;
    let alive = true;
    void extractPalette(photo).then((palette) => alive && setState({ id: photo.id, palette }));
    return () => {
      alive = false;
    };
  }, [photo]);
  if (!photo) return null;
  if (photo.palette?.length) return photo.palette;
  return state?.id === photo.id ? state.palette : (cache.get(photo.id) ?? null);
}

/** Synthèse des couleurs préférées : les palettes aimées regroupées en `k` teintes. */
export function favoriteColors(palettes: string[][], k = 6): string[] {
  const points: RGB[] = [];
  const weights: number[] = [];
  for (const palette of palettes) {
    palette.forEach((hex, rank) => {
      points.push(fromHex(hex));
      weights.push(1 / (rank + 1)); // la couleur dominante d'une palette compte davantage
    });
  }
  return cluster(points, weights, Math.min(k, points.length)).map(toHex);
}

/** Nom français approché d'une couleur, pour les étiquettes de la palette personnelle. */
const NAMED: [string, string][] = [
  ["Blanc cassé", "#f4efe6"], ["Crème", "#efe2c8"], ["Lin", "#e2d3b8"], ["Sable", "#d8c09a"], ["Camel", "#b98a5a"],
  ["Ocre", "#cf9a3a"], ["Moutarde", "#c9a12e"], ["Terracotta", "#c0603d"], ["Brique", "#9e4a32"], ["Rouille", "#a5532a"],
  ["Rose poudré", "#e3b5a8"], ["Vieux rose", "#c08a8a"], ["Bordeaux", "#6e2532"], ["Chocolat", "#5a3a28"], ["Noyer", "#7a5236"],
  ["Olive", "#6f7a3b"], ["Vert olive clair", "#8d975b"], ["Kaki", "#7d7b52"], ["Sauge", "#9aab8c"], ["Vert amande", "#c5cfa6"], ["Vert sapin", "#2f5446"], ["Bleu canard", "#2c6470"], ["Bleu ardoise", "#5c7088"],
  ["Bleu nuit", "#1f2f45"], ["Gris perle", "#c9c9c4"], ["Gris taupe", "#8b8178"], ["Anthracite", "#3a3a3a"], ["Noir", "#1c1c1c"],
];
export function colorName(hex: string): string {
  const rgb = fromHex(hex);
  return NAMED.reduce((best, entry) => (distance(rgb, fromHex(entry[1])) < distance(rgb, fromHex(best[1])) ? entry : best))[0];
}
