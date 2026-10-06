"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/** Nombre de colonnes selon la largeur disponible, comme sur Pinterest. */
function columnsFor(width: number) {
  if (width < 520) return 2;
  if (width < 860) return 3;
  if (width < 1180) return 4;
  return 5;
}

/**
 * Mosaïque à colonnes : chaque élément va dans la colonne la plus courte.
 * Contrairement aux colonnes CSS, l'ordre reste stable quand on ajoute des éléments
 * en bas (défilement infini) : rien ne saute d'une colonne à l'autre.
 */
export function Masonry<T>({
  items,
  ratio,
  getKey,
  render,
  gap = 14,
}: {
  items: T[];
  ratio: (item: T) => number;
  getKey: (item: T) => string;
  render: (item: T) => ReactNode;
  gap?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setColumns(columnsFor(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const buckets: T[][] = Array.from({ length: columns }, () => []);
  const heights = new Array(columns).fill(0);
  for (const item of items) {
    const shortest = heights.indexOf(Math.min(...heights));
    buckets[shortest].push(item);
    // Hauteur relative de l'image, plus une marge pour la légende éventuelle.
    heights[shortest] += Math.min(Math.max(ratio(item), 0.6), 2) + 0.12;
  }

  return (
    <div ref={ref} className="flex items-start" style={{ gap }}>
      {buckets.map((bucket, index) => (
        <div key={index} className="flex min-w-0 flex-1 flex-col" style={{ gap }}>
          {bucket.map((item) => (
            <div key={getKey(item)}>{render(item)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
