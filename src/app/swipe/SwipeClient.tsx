"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AddToBoardDialog } from "@/components/AddToBoardDialog";
import { IconClose, IconBoard, IconHeart } from "@/components/Ornaments";
import { Visual } from "@/components/Visual";
import {
  CATEGORY_LABELS,
  formatPrice,
  INSPIRATIONS,
  INSPIRATIONS_BY_ID,
  PRODUCTS,
  PRODUCTS_BY_ID,
  ROOM_LABELS,
  STYLE_LABELS,
} from "@/lib/catalog";
import { type NewBoardItem, type SwipeKind, useHestia, useHydrated } from "@/lib/store";
import type { Inspiration, Product, ProductCategory } from "@/lib/types";

const SWIPE_THRESHOLD = 110;

const normalize = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function matchesQuery(product: Product, query: string): boolean {
  if (!query) return true;
  const haystack = normalize(
    [product.name, product.description, CATEGORY_LABELS[product.category], STYLE_LABELS[product.style], ...product.materials].join(" "),
  );
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

type Card = { kind: "product"; item: Product } | { kind: "inspiration"; item: Inspiration };

export function SwipeClient() {
  const hydrated = useHydrated();
  const [mode, setMode] = useState<SwipeKind>("inspiration");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState<NewBoardItem[] | null>(null);

  const seen = useHestia((s) => s.seen);
  const swipe = useHestia((s) => s.swipe);
  const resetSeen = useHestia((s) => s.resetSeen);

  const deck: Card[] = useMemo(() => {
    const seenIds = new Set(seen[mode]);
    if (mode === "inspiration") {
      return INSPIRATIONS.filter((i) => !seenIds.has(i.id)).map((item) => ({ kind: "inspiration", item }));
    }
    return PRODUCTS.filter(
      (p) => !seenIds.has(p.id) && (category === "all" || p.category === category) && matchesQuery(p, query),
    ).map((item) => ({ kind: "product", item }));
  }, [seen, mode, category, query]);

  const top = deck[0];
  const decide = useCallback(
    (liked: boolean) => {
      if (top) swipe(top.kind, top.item.id, liked);
    },
    [top, swipe],
  );

  const saveTop = () => {
    if (!top) return;
    setSaving([top.kind === "product" ? { kind: "product", productId: top.item.id } : { kind: "inspiration", inspirationId: top.item.id }]);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="kicker">Swipe</p>
          <h1 className="font-display text-4xl md:text-6xl">Ça vous plaît ?</h1>
          <p className="text-muted">Glissez à droite pour garder, à gauche pour passer. Au clavier : ← et →.</p>
        </div>
        <div className="inline-flex rounded-full border border-border bg-surface p-1" role="tablist">
          {(
            [
              ["inspiration", "Ambiances"],
              ["product", "Produits"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${mode === value ? "bg-accent text-white" : "text-muted"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === "product" && (
          <div className="space-y-3">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un produit : lampe laiton, tapis jute, velours…"
              className="input max-w-xl"
            />
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {(["all", ...Object.keys(CATEGORY_LABELS)] as (ProductCategory | "all")[]).map((value) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${
                    category === value ? "border-accent bg-accent-soft text-accent-strong" : "border-border bg-surface"
                  }`}
                >
                  {value === "all" ? "Tout" : CATEGORY_LABELS[value]}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
        <section className="mx-auto w-full max-w-[420px]">
          {!hydrated ? (
            <div className="aspect-[3/4] animate-pulse rounded-[2rem] bg-surface-muted" />
          ) : top ? (
            <>
              <div className="relative aspect-[3/4]">
                {deck[1] && (
                  <div className="absolute inset-0 translate-y-3 scale-[0.96] opacity-70">
                    <CardFace card={deck[1]} />
                  </div>
                )}
                <SwipeCard key={`${top.kind}-${top.item.id}`} card={top} onDecide={decide} />
              </div>
              <div className="mt-6 flex items-center justify-center gap-5">
                <button onClick={() => decide(false)} aria-label="Passer" className="hover-wiggle grid h-16 w-16 place-items-center rounded-full bg-olive-soft text-olive shadow-sm transition hover:scale-110 active:scale-90">
                  <IconClose className="h-8 w-8" />
                </button>
                <button onClick={saveTop} aria-label="Enregistrer dans un tableau" className="hover-wiggle grid h-12 w-12 place-items-center rounded-full bg-gold-soft text-gold shadow-sm transition hover:scale-110 active:scale-90">
                  <IconBoard className="h-8 w-8 text-foreground" />
                </button>
                <button onClick={() => decide(true)} aria-label="J'aime" className="hover-wiggle grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-like text-white shadow-[0_10px_24px_-8px_var(--like)] transition hover:scale-110 active:scale-90">
                  <IconHeart filled className="h-9 w-9" />
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-muted">{deck.length} restant{deck.length > 1 ? "s" : ""}</p>
            </>
          ) : (
            <div className="card flex aspect-[3/4] flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="font-display text-2xl">Vous avez tout vu !</p>
              <p className="text-sm text-muted">
                {mode === "product" && (query || category !== "all")
                  ? "Aucun autre produit ne correspond à ces filtres."
                  : "Retrouvez vos coups de cœur ci-contre, ou recommencez la sélection."}
              </p>
              <button onClick={() => resetSeen(mode)} className="btn-ghost">
                Tout revoir
              </button>
            </div>
          )}
        </section>

        <Favorites mode={mode} onSave={setSaving} />
      </div>

      <AddToBoardDialog items={saving} onClose={() => setSaving(null)} />
    </div>
  );
}

function SwipeCard({ card, onDecide }: { card: Card; onDecide: (liked: boolean) => void }) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [leaving, setLeaving] = useState<0 | 1 | -1>(0);
  const start = useRef<{ x: number; y: number } | null>(null);

  const leave = useCallback(
    (direction: 1 | -1) => {
      setLeaving(direction);
      setTimeout(() => onDecide(direction === 1), 220);
    },
    [onDecide],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowRight") leave(1);
      if (event.key === "ArrowLeft") leave(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leave]);

  const x = leaving ? leaving * 700 : drag.x;
  const rotation = x / 18;
  const likeOpacity = Math.max(0, Math.min(1, x / SWIPE_THRESHOLD));
  const nopeOpacity = Math.max(0, Math.min(1, -x / SWIPE_THRESHOLD));

  return (
    <div
      className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
      style={{
        transform: `translate(${x}px, ${drag.y}px) rotate(${rotation}deg)`,
        transition: drag.active ? "none" : "transform 0.25s ease-out",
      }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        start.current = { x: event.clientX, y: event.clientY };
        setDrag({ x: 0, y: 0, active: true });
      }}
      onPointerMove={(event) => {
        if (!start.current) return;
        setDrag({ x: event.clientX - start.current.x, y: (event.clientY - start.current.y) * 0.3, active: true });
      }}
      onPointerUp={() => {
        start.current = null;
        if (Math.abs(drag.x) > SWIPE_THRESHOLD) leave(drag.x > 0 ? 1 : -1);
        else setDrag({ x: 0, y: 0, active: false });
      }}
      onPointerCancel={() => {
        start.current = null;
        setDrag({ x: 0, y: 0, active: false });
      }}
    >
      <CardFace card={card} />
      {/* Cœur qui apparaît en glissant vers la droite */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[22%] flex justify-center"
        style={{ opacity: likeOpacity, transform: `scale(${0.6 + likeOpacity * 0.5}) rotate(-8deg)` }}
      >
        <IconHeart filled className="h-36 w-36 text-like drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]" />
      </div>
      <span
        className="pointer-events-none absolute right-6 top-6 rotate-12 rounded-full border-2 border-nope bg-surface/80 px-4 py-1 font-display text-2xl text-nope"
        style={{ opacity: nopeOpacity }}
      >
        BOF
      </span>
    </div>
  );
}

function CardFace({ card }: { card: Card }) {
  const palette = card.item.palette;
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-surface shadow-xl">
      <div className="arch m-3 mb-0 min-h-0 flex-1">
        <Visual
          palette={palette}
          seed={card.item.id}
          category={card.kind === "product" ? card.item.category : undefined}
          image={card.item.image}
          alt={card.kind === "product" ? card.item.name : card.item.title}
        />
      </div>
      <div className="space-y-2 p-5">
        {card.kind === "product" ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-heading text-xl font-semibold leading-snug">{card.item.name}</h2>
              <p className="font-heading text-xl font-semibold text-accent-strong">{formatPrice(card.item.price)}</p>
            </div>
            <p className="text-sm text-muted">{card.item.description}</p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-strong">{STYLE_LABELS[card.item.style]}</span>
              {card.item.materials.map((m) => (
                <span key={m} className="rounded-full bg-surface-muted px-2.5 py-1">{m}</span>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="font-heading text-xl font-semibold leading-snug">{card.item.title}</h2>
            <p className="text-sm text-muted">{card.item.mood}</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-strong">{STYLE_LABELS[card.item.style]}</span>
                <span className="rounded-full bg-surface-muted px-2.5 py-1">{ROOM_LABELS[card.item.room]}</span>
              </div>
              <div className="flex -space-x-1.5" aria-hidden>
                {palette.map((c) => (
                  <span key={c} className="h-5 w-5 rounded-full border-2 border-surface" style={{ background: c }} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Favorites({ mode, onSave }: { mode: SwipeKind; onSave: (items: NewBoardItem[]) => void }) {
  const hydrated = useHydrated();
  const likedProducts = useHestia((s) => s.likedProducts);
  const likedInspirations = useHestia((s) => s.likedInspirations);
  const unlike = useHestia((s) => s.unlike);

  const inspirations = likedInspirations.map((id) => INSPIRATIONS_BY_ID[id]).filter(Boolean);
  const products = likedProducts.map((id) => PRODUCTS_BY_ID[id]).filter(Boolean);

  // Profil de style déduit de tous les coups de cœur.
  const styleCounts = new Map<string, number>();
  for (const item of [...inspirations, ...products]) {
    styleCounts.set(item.style, (styleCounts.get(item.style) ?? 0) + 1);
  }
  const totalLikes = inspirations.length + products.length;
  const topStyles = [...styleCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  if (!hydrated) return null;

  return (
    <section className="space-y-6">
      {topStyles.length > 0 && (
        <div className="card space-y-3 p-5">
          <h2 className="font-heading text-xl font-semibold">Votre profil déco</h2>
          {topStyles.map(([style, count]) => (
            <div key={style} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{STYLE_LABELS[style as keyof typeof STYLE_LABELS]}</span>
                <span className="text-muted">{Math.round((count / totalLikes) * 100)} %</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(count / totalLikes) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl">
            Vos coups de cœur {mode === "inspiration" ? "· ambiances" : "· produits"}
          </h2>
          <Link href="/coups-de-coeur" className="text-sm font-semibold text-accent hover:underline">
            Tout voir et classer →
          </Link>
        </div>
        {(mode === "inspiration" ? inspirations.length : products.length) === 0 ? (
          <p className="text-sm text-muted">Swipez à droite pour retrouver ici ce qui vous plaît.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {mode === "inspiration"
              ? inspirations.map((i) => (
                  <FavoriteTile
                    key={i.id}
                    title={i.title}
                    subtitle={STYLE_LABELS[i.style]}
                    visual={<Visual palette={i.palette} seed={i.id} image={i.image} alt={i.title} />}
                    onSave={() => onSave([{ kind: "inspiration", inspirationId: i.id }])}
                    onRemove={() => unlike("inspiration", i.id)}
                  />
                ))
              : products.map((p) => (
                  <FavoriteTile
                    key={p.id}
                    title={p.name}
                    subtitle={formatPrice(p.price)}
                    visual={<Visual palette={p.palette} seed={p.id} category={p.category} image={p.image} alt={p.name} />}
                    onSave={() => onSave([{ kind: "product", productId: p.id }])}
                    onRemove={() => unlike("product", p.id)}
                  />
                ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FavoriteTile({
  title,
  subtitle,
  visual,
  onSave,
  onRemove,
}: {
  title: string;
  subtitle: string;
  visual: React.ReactNode;
  onSave: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="group card overflow-hidden">
      <div className="relative aspect-square">
        {visual}
        <div className="absolute inset-x-2 bottom-2 flex justify-between gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
          <button onClick={onSave} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
            Enregistrer
          </button>
          <button onClick={onRemove} aria-label={`Retirer ${title}`} className="rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
            ✕
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="line-clamp-1 text-sm font-medium">{title}</p>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
    </div>
  );
}
