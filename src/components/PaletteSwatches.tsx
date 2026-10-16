"use client";

import { useMemo } from "react";
import { INSPIRATIONS_BY_ID, PRODUCTS_BY_ID } from "@/lib/catalog";
import { colorName, favoriteColors, usePhotoPalette } from "@/lib/palette";
import { useHestia } from "@/lib/store";
import type { Photo } from "@/lib/types";

/** Pastilles d'une palette, en rang serré (cartes du swipe, épingles). */
export function PaletteDots({ colors, className = "" }: { colors: string[]; className?: string }) {
  return (
    <div className={`flex -space-x-1.5 ${className}`} aria-label={`Palette : ${colors.map(colorName).join(", ")}`}>
      {colors.map((color, index) => (
        <span key={`${color}-${index}`} className="h-6 w-6 rounded-full border-2 border-white shadow-sm" style={{ background: color }} />
      ))}
    </div>
  );
}

/** Palette d'une photo, extraite à l'affichage. */
export function PhotoPaletteDots({ photo, className }: { photo: Photo; className?: string }) {
  const palette = usePhotoPalette(photo);
  return palette ? <PaletteDots colors={palette} className={className} /> : null;
}

/** Grandes pastilles nommées, avec leur code couleur (fiche d'une photo, palette personnelle). */
export function PaletteSwatches({ colors }: { colors: string[] }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {colors.map((color, index) => (
        <li key={`${color}-${index}`} className="flex w-16 flex-col items-center gap-1.5 text-center">
          <span className="h-12 w-12 rounded-full border border-border shadow-sm" style={{ background: color }} />
          <span className="text-xs leading-tight">{colorName(color)}</span>
          <span className="text-[10px] uppercase tracking-wide text-muted">{color}</span>
        </li>
      ))}
    </ul>
  );
}

/** « Vos couleurs » : synthèse des palettes de tout ce que la personne a aimé. */
export function PersonalPalette({ className = "" }: { className?: string }) {
  const likedProducts = useHestia((s) => s.likedProducts);
  const likedInspirations = useHestia((s) => s.likedInspirations);
  const likedPhotos = useHestia((s) => s.likedPhotos);

  const colors = useMemo(() => {
    const palettes = [
      ...likedInspirations.map((id) => INSPIRATIONS_BY_ID[id]?.palette),
      ...likedProducts.map((id) => PRODUCTS_BY_ID[id]?.palette),
      ...Object.values(likedPhotos).map((photo) => photo.palette ?? [photo.color]),
    ].filter((palette): palette is string[] => Boolean(palette?.length));
    return palettes.length ? favoriteColors(palettes, 6) : [];
  }, [likedProducts, likedInspirations, likedPhotos]);

  if (colors.length === 0) return null;
  return (
    <section className={`card space-y-3 p-5 ${className}`}>
      <div>
        <h2 className="font-display text-2xl">Vos couleurs</h2>
        <p className="text-sm text-muted">La palette qui se dégage de vos coups de cœur.</p>
      </div>
      <PaletteSwatches colors={colors} />
    </section>
  );
}
