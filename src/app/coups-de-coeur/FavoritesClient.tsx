"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AddToBoardDialog } from "@/components/AddToBoardDialog";
import { CategoryPickerDialog } from "@/components/CategoryPickerDialog";
import { Visual } from "@/components/Visual";
import {
  CATEGORY_LABELS,
  formatPrice,
  INSPIRATIONS_BY_ID,
  PRODUCTS_BY_ID,
  ROOM_LABELS,
  STYLE_LABELS,
} from "@/lib/catalog";
import {
  CATEGORY_COLORS,
  type FavoriteKey,
  favoriteKey,
  type NewBoardItem,
  parseFavoriteKey,
  type SwipeKind,
  useHestia,
  useHydrated,
} from "@/lib/store";
import type { DecorStyle, ProductCategory } from "@/lib/types";

interface Entry {
  key: FavoriteKey;
  kind: SwipeKind;
  id: string;
  title: string;
  subtitle: string;
  price?: number;
  style: DecorStyle;
  palette: string[];
  category?: ProductCategory;
  image?: string;
}

type Sort = "manual" | "recent" | "oldest" | "price-asc" | "price-desc" | "style" | "name";

const SORT_LABELS: Record<Sort, string> = {
  manual: "Mon ordre",
  recent: "Les plus récents",
  oldest: "Les plus anciens",
  "price-asc": "Prix croissant",
  "price-desc": "Prix décroissant",
  style: "Par style",
  name: "Par nom (A → Z)",
};

const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function FavoritesClient() {
  const hydrated = useHydrated();
  const likedProducts = useHestia((s) => s.likedProducts);
  const likedInspirations = useHestia((s) => s.likedInspirations);
  const categories = useHestia((s) => s.favoriteCategories);
  const tags = useHestia((s) => s.favoriteTags);
  const order = useHestia((s) => s.favoriteOrder);
  const likedAt = useHestia((s) => s.likedAt);
  const { unlike, setFavoriteOrder, createFavoriteCategory, renameFavoriteCategory, recolorFavoriteCategory, deleteFavoriteCategory, setFavoriteCategory } =
    useHestia.getState();

  const [activeCategory, setActiveCategory] = useState<"all" | "none" | string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | SwipeKind>("all");
  const [sort, setSort] = useState<Sort>("manual");
  const [query, setQuery] = useState("");
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<FavoriteKey>>(new Set());
  const [picking, setPicking] = useState<FavoriteKey[] | null>(null);
  const [saving, setSaving] = useState<NewBoardItem[] | null>(null);
  const [newCategory, setNewCategory] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [dragKey, setDragKey] = useState<FavoriteKey | null>(null);

  // Tous les coups de cœur, dans l'ordre choisi par l'utilisateur.
  const allEntries: Entry[] = useMemo(() => {
    const liked: FavoriteKey[] = [
      ...likedInspirations.map((id) => favoriteKey("inspiration", id)),
      ...likedProducts.map((id) => favoriteKey("product", id)),
    ];
    const likedSet = new Set(liked);
    const ordered = [...order.filter((k) => likedSet.has(k)), ...liked.filter((k) => !order.includes(k))];
    return ordered.flatMap((key): Entry[] => {
      const { kind, id } = parseFavoriteKey(key);
      if (kind === "product") {
        const p = PRODUCTS_BY_ID[id];
        return p
          ? [{ key, kind, id, title: p.name, subtitle: CATEGORY_LABELS[p.category], price: p.price, style: p.style, palette: p.palette, category: p.category, image: p.image }]
          : [];
      }
      const i = INSPIRATIONS_BY_ID[id];
      return i ? [{ key, kind, id, title: i.title, subtitle: ROOM_LABELS[i.room], style: i.style, palette: i.palette, image: i.image }] : [];
    });
  }, [likedProducts, likedInspirations, order]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: allEntries.length, none: 0 };
    for (const entry of allEntries) {
      const entryTags = tags[entry.key] ?? [];
      if (entryTags.length === 0) result.none++;
      for (const id of entryTags) result[id] = (result[id] ?? 0) + 1;
    }
    return result;
  }, [allEntries, tags]);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = allEntries.filter((entry) => {
      const entryTags = tags[entry.key] ?? [];
      if (activeCategory === "none" && entryTags.length > 0) return false;
      if (activeCategory !== "all" && activeCategory !== "none" && !entryTags.includes(activeCategory)) return false;
      if (typeFilter !== "all" && entry.kind !== typeFilter) return false;
      if (q && !normalize(`${entry.title} ${entry.subtitle} ${STYLE_LABELS[entry.style]}`).includes(q)) return false;
      return true;
    });
    const time = (e: Entry) => likedAt[e.key] ?? 0;
    const price = (e: Entry) => e.price ?? Number.POSITIVE_INFINITY;
    const sorters: Record<Sort, ((a: Entry, b: Entry) => number) | null> = {
      manual: null,
      recent: (a, b) => time(b) - time(a),
      oldest: (a, b) => time(a) - time(b),
      "price-asc": (a, b) => price(a) - price(b),
      "price-desc": (a, b) => (b.price ?? -1) - (a.price ?? -1),
      style: (a, b) => STYLE_LABELS[a.style].localeCompare(STYLE_LABELS[b.style], "fr"),
      name: (a, b) => a.title.localeCompare(b.title, "fr"),
    };
    const sorter = sorters[sort];
    return sorter ? [...filtered].sort(sorter) : filtered;
  }, [allEntries, tags, activeCategory, typeFilter, query, sort, likedAt]);

  const fullOrder = allEntries.map((e) => e.key);

  /** Place `key` juste avant (ou après) `target` dans l'ordre complet. */
  const moveTo = (key: FavoriteKey, target: FavoriteKey, after: boolean) => {
    if (key === target) return;
    const without = fullOrder.filter((k) => k !== key);
    const index = without.indexOf(target) + (after ? 1 : 0);
    without.splice(index, 0, key);
    setFavoriteOrder(without);
  };

  const step = (key: FavoriteKey, direction: -1 | 1) => {
    const index = visible.findIndex((e) => e.key === key);
    const neighbour = visible[index + direction];
    if (neighbour) moveTo(key, neighbour.key, direction === 1);
  };

  const toggleSelected = (key: FavoriteKey) =>
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const activeCat = categories.find((c) => c.id === activeCategory);
  const manual = sort === "manual";

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-3xl bg-surface-muted" />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="kicker">Coups de cœur</p>
          <h1 className="font-display text-4xl">Tout ce que vous avez aimé</h1>
          <p className="text-muted">
            {allEntries.length} coup{allEntries.length > 1 ? "s" : ""} de cœur. Rangez-les dans vos propres catégories et
            classez-les comme bon vous semble.
          </p>
        </div>
        {allEntries.length > 0 && (
          <button
            className={selecting ? "btn-primary" : "btn-ghost"}
            onClick={() => {
              setSelecting(!selecting);
              setSelected(new Set());
            }}
          >
            {selecting ? "Terminer la sélection" : "Sélectionner"}
          </button>
        )}
      </header>

      {allEntries.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
          <p className="font-display text-2xl">Pas encore de coup de cœur</p>
          <p className="max-w-md text-muted">Swipez à droite les ambiances et les produits qui vous plaisent : ils vous attendront ici.</p>
          <Link href="/swipe" className="btn-primary">
            Commencer à swiper
          </Link>
        </div>
      ) : (
        <>
          {/* Catégories */}
          <section className="space-y-3">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <CategoryChip label="Tous" count={counts.all} active={activeCategory === "all"} onClick={() => setActiveCategory("all")} />
              <CategoryChip label="Non classés" count={counts.none} active={activeCategory === "none"} onClick={() => setActiveCategory("none")} />
              {categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  label={category.name}
                  color={category.color}
                  count={counts[category.id] ?? 0}
                  active={activeCategory === category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setEditing(false);
                  }}
                  onDragOver={(event) => dragKey && event.preventDefault()}
                  onDrop={() => dragKey && setFavoriteCategory([dragKey], category.id, true)}
                />
              ))}
              {newCategory === null ? (
                <button onClick={() => setNewCategory("")} className="shrink-0 rounded-full border border-dashed border-accent px-4 py-1.5 text-sm text-accent hover:bg-accent-soft">
                  + Catégorie
                </button>
              ) : (
                <form
                  className="flex shrink-0 gap-1"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!newCategory.trim()) return;
                    setActiveCategory(createFavoriteCategory(newCategory.trim()));
                    setNewCategory(null);
                  }}
                >
                  <input
                    autoFocus
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onBlur={() => !newCategory.trim() && setNewCategory(null)}
                    maxLength={40}
                    placeholder="Nom…"
                    className="input w-40 py-1.5"
                  />
                  <button className="btn-primary py-1.5">OK</button>
                </form>
              )}
            </div>

            {activeCat && (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {editing ? (
                  <>
                    <input
                      defaultValue={activeCat.name}
                      maxLength={40}
                      onBlur={(e) => e.target.value.trim() && renameFavoriteCategory(activeCat.id, e.target.value.trim())}
                      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                      className="input w-48 py-1.5"
                      aria-label="Nom de la catégorie"
                    />
                    <div className="flex gap-1.5">
                      {CATEGORY_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => recolorFavoriteCategory(activeCat.id, color)}
                          aria-label={`Couleur ${color}`}
                          className={`h-6 w-6 rounded-full border-2 ${activeCat.color === color ? "border-foreground" : "border-transparent"}`}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <button
                      className="text-nope underline"
                      onClick={() => {
                        if (window.confirm(`Supprimer la catégorie « ${activeCat.name} » ? Vos coups de cœur seront conservés.`)) {
                          deleteFavoriteCategory(activeCat.id);
                          setActiveCategory("all");
                        }
                      }}
                    >
                      Supprimer
                    </button>
                    <button className="btn-ghost py-1.5" onClick={() => setEditing(false)}>
                      Terminé
                    </button>
                  </>
                ) : (
                  <button className="text-muted underline hover:text-foreground" onClick={() => setEditing(true)}>
                    Renommer, changer la couleur ou supprimer « {activeCat.name} »
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Filtres et tri */}
          <section className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher dans mes coups de cœur…"
              className="input max-w-xs"
            />
            <div className="inline-flex rounded-full border border-border bg-surface p-1 text-sm">
              {(
                [
                  ["all", "Tout"],
                  ["inspiration", "Ambiances"],
                  ["product", "Produits"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setTypeFilter(value)}
                  className={`rounded-full px-3.5 py-1.5 transition ${typeFilter === value ? "bg-accent text-white" : "text-muted"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              Classer :
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="input w-auto py-1.5">
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </section>
          {manual && visible.length > 1 && (
            <p className="text-xs text-muted">
              Astuce : glissez-déposez une carte pour la déplacer (ou utilisez les flèches), et déposez-la sur une catégorie
              pour l&apos;y ranger.
            </p>
          )}

          {visible.length === 0 ? (
            <p className="py-10 text-center text-muted">Rien ici pour l&apos;instant.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {visible.map((entry, index) => {
                const entryCategories = (tags[entry.key] ?? [])
                  .map((id) => categories.find((c) => c.id === id))
                  .filter((c) => c !== undefined);
                const isSelected = selected.has(entry.key);
                return (
                  <article
                    key={entry.key}
                    draggable={manual || categories.length > 0}
                    onDragStart={() => setDragKey(entry.key)}
                    onDragEnd={() => setDragKey(null)}
                    onDragOver={(event) => manual && dragKey && event.preventDefault()}
                    onDrop={() => manual && dragKey && moveTo(dragKey, entry.key, false)}
                    onClick={() => selecting && toggleSelected(entry.key)}
                    className={`card group relative flex flex-col overflow-hidden p-2 transition ${
                      dragKey === entry.key ? "opacity-40" : ""
                    } ${isSelected ? "ring-2 ring-accent" : ""} ${selecting ? "cursor-pointer" : ""}`}
                  >
                    <div className="relative">
                      <div className="arch aspect-[4/5]">
                        <Visual palette={entry.palette} seed={entry.id} category={entry.category} image={entry.image} alt={entry.title} />
                      </div>
                      <span className="absolute bottom-2 left-2 rounded-full bg-surface/90 px-2.5 py-0.5 text-[11px] font-semibold">
                        {entry.kind === "product" ? "Produit" : "Ambiance"}
                      </span>
                      {selecting && (
                        <span
                          className={`absolute -right-0.5 -top-0.5 grid h-8 w-8 place-items-center rounded-full border-2 border-surface text-sm font-bold text-white shadow ${
                            isSelected ? "bg-accent" : "bg-muted/60"
                          }`}
                          aria-hidden
                        >
                          {isSelected ? "✓" : ""}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-2 pt-3">
                      <div>
                        <p className="line-clamp-2 text-sm font-medium leading-snug">{entry.title}</p>
                        <p className="text-xs text-muted">
                          {STYLE_LABELS[entry.style]} · {entry.price !== undefined ? formatPrice(entry.price) : entry.subtitle}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {entryCategories.map((c) => (
                          <span key={c.id} className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: c.color }}>
                            {c.name}
                          </span>
                        ))}
                      </div>
                      {!selecting && (
                        <div className="mt-auto flex items-center gap-1 pt-1">
                          <button onClick={() => setPicking([entry.key])} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-strong hover:bg-accent hover:text-white">
                            Classer
                          </button>
                          <button
                            onClick={() =>
                              setSaving([entry.kind === "product" ? { kind: "product", productId: entry.id } : { kind: "inspiration", inspirationId: entry.id }])
                            }
                            className="rounded-full px-2.5 py-1 text-xs text-muted hover:bg-surface-muted hover:text-foreground"
                          >
                            Tableau
                          </button>
                          <span className="flex-1" />
                          {manual && (
                            <>
                              <button onClick={() => step(entry.key, -1)} disabled={index === 0} aria-label="Déplacer avant" className="rounded-full px-1.5 text-muted hover:text-foreground disabled:opacity-30">
                                ←
                              </button>
                              <button onClick={() => step(entry.key, 1)} disabled={index === visible.length - 1} aria-label="Déplacer après" className="rounded-full px-1.5 text-muted hover:text-foreground disabled:opacity-30">
                                →
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => window.confirm(`Retirer « ${entry.title} » de vos coups de cœur ?`) && unlike(entry.kind, entry.id)}
                            aria-label={`Retirer ${entry.title}`}
                            className="rounded-full px-1.5 text-muted hover:text-nope"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Barre d'actions de la sélection multiple */}
      {selecting && (
        <div className="fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-xl flex-wrap items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 shadow-2xl md:bottom-8">
          <span className="px-1 text-sm font-medium">
            {selected.size} sélectionné{selected.size > 1 ? "s" : ""}
          </span>
          <button className="text-xs text-muted underline" onClick={() => setSelected(new Set(visible.map((e) => e.key)))}>
            Tout
          </button>
          <span className="flex-1" />
          {activeCat && (
            <button
              className="btn-ghost py-1.5"
              disabled={selected.size === 0}
              onClick={() => {
                setFavoriteCategory([...selected], activeCat.id, false);
                setSelected(new Set());
              }}
            >
              Retirer de « {activeCat.name} »
            </button>
          )}
          <button className="btn-primary py-1.5" disabled={selected.size === 0} onClick={() => setPicking([...selected])}>
            Classer…
          </button>
        </div>
      )}

      <CategoryPickerDialog keys={picking} onClose={() => setPicking(null)} />
      <AddToBoardDialog items={saving} onClose={() => setSaving(null)} />
    </div>
  );
}

function CategoryChip({
  label,
  count,
  active,
  color,
  onClick,
  onDragOver,
  onDrop,
}: {
  label: string;
  count: number;
  active: boolean;
  color?: string;
  onClick: () => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDrop?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition ${
        active ? "border-foreground bg-foreground text-background" : "border-border bg-surface hover:border-accent"
      }`}
    >
      {color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} aria-hidden />}
      {label}
      <span className={active ? "opacity-70" : "text-muted"}>{count}</span>
    </button>
  );
}
