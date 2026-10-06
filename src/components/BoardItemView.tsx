/* eslint-disable @next/next/no-img-element -- images utilisateur stockées en data URL */
import { DupeCard } from "@/components/DupeCard";
import { Visual } from "@/components/Visual";
import { formatPrice, INSPIRATIONS_BY_ID, PRODUCTS_BY_ID, STYLE_LABELS } from "@/lib/catalog";
import type { BoardItem } from "@/lib/types";

/** Aperçu compact d'un élément, pour les couvertures de tableaux. */
export function BoardItemThumb({ item }: { item: BoardItem }) {
  switch (item.kind) {
    case "image":
      return <img src={item.src} alt={item.caption ?? ""} className="h-full w-full object-cover" />;
    case "product": {
      const product = PRODUCTS_BY_ID[item.productId];
      return product ? <Visual palette={product.palette} seed={product.id} category={product.category} image={product.image} alt="" /> : null;
    }
    case "inspiration": {
      const inspiration = INSPIRATIONS_BY_ID[item.inspirationId];
      return inspiration ? <Visual palette={inspiration.palette} seed={inspiration.id} image={inspiration.image} alt="" /> : null;
    }
    case "note":
      return <div className="h-full w-full p-2 text-[10px] leading-tight" style={{ background: item.color }}>{item.text}</div>;
    case "dupe":
      return (
        <div className="flex h-full w-full items-center justify-center bg-accent-soft p-2 text-center text-[10px] font-medium text-accent-strong">
          {item.dupe.productName}
        </div>
      );
  }
}

/** Rendu complet d'un élément dans la grille d'un tableau. */
export function BoardItemCard({ item }: { item: BoardItem }) {
  switch (item.kind) {
    case "image":
      return (
        <figure className="card overflow-hidden">
          <img src={item.src} alt={item.caption ?? "Image"} className="w-full" />
          {item.caption && <figcaption className="p-3 text-sm">{item.caption}</figcaption>}
        </figure>
      );
    case "product": {
      const product = PRODUCTS_BY_ID[item.productId];
      if (!product) return null;
      return (
        <article className="card overflow-hidden">
          <div className="aspect-square">
            <Visual palette={product.palette} seed={product.id} category={product.category} image={product.image} alt={product.name} />
          </div>
          <div className="space-y-1 p-3">
            <p className="text-sm font-medium leading-snug">{product.name}</p>
            <p className="text-xs text-muted">
              {STYLE_LABELS[product.style]} · {formatPrice(product.price)}
            </p>
          </div>
        </article>
      );
    }
    case "inspiration": {
      const inspiration = INSPIRATIONS_BY_ID[item.inspirationId];
      if (!inspiration) return null;
      return (
        <article className="card overflow-hidden">
          <div className="aspect-[3/4]">
            <Visual palette={inspiration.palette} seed={inspiration.id} image={inspiration.image} alt={inspiration.title} />
          </div>
          <div className="space-y-1 p-3">
            <p className="text-sm font-medium leading-snug">{inspiration.title}</p>
            <p className="text-xs text-muted">{inspiration.mood}</p>
          </div>
        </article>
      );
    }
    case "note":
      return (
        <div className="rounded-3xl p-5 pr-10 text-[#2b2420] shadow-sm" style={{ background: item.color }}>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{item.text}</p>
        </div>
      );
    case "dupe":
      return <DupeCard dupe={item.dupe} />;
  }
}
