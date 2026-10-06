/* eslint-disable @next/next/no-img-element -- photos servies par le CDN de la banque d'images */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { Masonry } from "@/components/Masonry";
import { IconHeart } from "@/components/Ornaments";
import { Visual } from "@/components/Visual";
import { boardItemOf, rememberPhotoForDupes, toggleLike, useIsLiked } from "@/lib/actions";
import { formatPrice, STYLE_LABELS } from "@/lib/catalog";
import { type FeedItem, itemRatio, useInfiniteScroll, usePhotoFeed } from "@/lib/feed";
import type { NewBoardItem } from "@/lib/store";

export interface PinHandlers {
  onOpen: (item: FeedItem) => void;
  onSave: (items: NewBoardItem[]) => void;
}

function itemTitle(item: FeedItem) {
  return item.kind === "photo" ? item.photo.alt : item.kind === "product" ? item.item.name : item.item.title;
}

/** Image d'une épingle : vraie photo, ou visuel de démonstration. */
export function PinImage({ item, large = false }: { item: FeedItem; large?: boolean }) {
  if (item.kind === "photo") {
    const { photo } = item;
    return (
      <img
        src={large ? photo.src.large : photo.src.medium}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        width={photo.width}
        height={photo.height}
        className="h-auto w-full"
        style={{ background: photo.color, aspectRatio: `${photo.width} / ${photo.height}` }}
      />
    );
  }
  return (
    <div style={{ aspectRatio: `1 / ${item.ratio}` }}>
      <Visual
        palette={item.item.palette}
        seed={item.item.id}
        category={item.kind === "product" ? item.item.category : undefined}
        image={item.item.image}
        alt={itemTitle(item)}
      />
    </div>
  );
}

/** Une épingle de la mosaïque, avec ses actions au survol (toujours visibles sur mobile). */
export function PinCard({ item, onOpen, onSave }: { item: FeedItem } & PinHandlers) {
  const liked = useIsLiked(item);
  const router = useRouter();

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-2xl bg-surface-muted">
        <button onClick={() => onOpen(item)} className="block w-full cursor-zoom-in" aria-label={`Voir : ${itemTitle(item)}`}>
          <PinImage item={item} />
          <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />
        </button>

        <button
          onClick={() => onSave([boardItemOf(item)])}
          className="absolute right-2.5 top-2.5 rounded-full bg-accent px-4 py-2 text-sm text-white opacity-0 shadow-lg transition hover:bg-accent-strong focus:opacity-100 group-hover:opacity-100 max-md:hidden"
        >
          Enregistrer
        </button>

        <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-2">
          {item.kind === "photo" ? (
            <button
              onClick={() => {
                rememberPhotoForDupes(item.photo);
                router.push("/dupes");
              }}
              className="truncate rounded-full bg-white/90 px-3 py-1.5 text-xs text-foreground opacity-0 shadow transition hover:bg-white focus:opacity-100 group-hover:opacity-100 max-md:hidden"
            >
              ✦ Recréer ce look
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={() => toggleLike(item, liked)}
            aria-pressed={liked}
            aria-label={liked ? "Retirer des coups de cœur" : "Ajouter aux coups de cœur"}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full shadow transition active:scale-90 ${
              liked ? "bg-like text-white" : "bg-white/90 text-foreground hover:bg-white"
            } ${liked ? "" : "md:opacity-0 md:group-hover:opacity-100"}`}
          >
            <IconHeart filled className={`h-5 w-5 ${liked ? "pop" : ""}`} />
          </button>
        </div>
      </div>
      {item.kind !== "photo" && (
        <div className="px-1 pt-2">
          <p className="line-clamp-1 text-sm">{itemTitle(item)}</p>
          <p className="text-xs text-muted">
            {STYLE_LABELS[item.item.style]}
            {item.kind === "product" && ` · ${formatPrice(item.item.price)}`}
          </p>
        </div>
      )}
    </article>
  );
}

/** Mosaïque infinie d'épingles pour une liste de requêtes. */
export function PinFeed({ queries, exclude, ...handlers }: { queries: string[]; exclude?: string } & PinHandlers) {
  const { items, configured, loading, done, loadMore } = usePhotoFeed(queries);
  const visible = useMemo(() => (exclude ? items.filter((i) => i.key !== exclude) : items), [items, exclude]);
  const sentinel = useInfiniteScroll(loadMore, !done);

  // Premier chargement, puis relance tant que le bas de page reste visible.
  useEffect(() => {
    if (done || loading) return;
    const node = sentinel.current;
    if (!node || node.getBoundingClientRect().top < window.innerHeight + 1200) void loadMore();
  }, [items.length, done, loading, loadMore, sentinel]);

  return (
    <div className="space-y-6">
      {configured === false && (
        <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted">
          Mode démonstration : ajoutez une clé <code>PEXELS_API_KEY</code> sur le serveur pour afficher de vraies photos
          d&apos;intérieurs, en nombre illimité.
        </p>
      )}
      <Masonry items={visible} ratio={itemRatio} getKey={(i) => i.key} render={(item) => <PinCard item={item} {...handlers} />} />
      <div ref={sentinel} className="flex justify-center py-8">
        {loading && <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-label="Chargement" />}
        {done && visible.length > 0 && configured && <p className="text-sm text-muted">Vous avez tout vu… pour l&apos;instant !</p>}
      </div>
    </div>
  );
}

/** Fiche d'une épingle : grande image, actions, crédit, puis idées similaires à l'infini. */
export function PinDialog({ item, onClose, ...handlers }: { item: FeedItem | null; onClose: () => void } & PinHandlers) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
    scrollRef.current?.scrollTo({ top: 0 });
  }, [item]);

  const related = useMemo(() => {
    if (!item) return [];
    if (item.kind === "photo") {
      const words = item.photo.alt.split(/\s+/).slice(0, 6).join(" ");
      return [words || "home interior design", "home interior design"];
    }
    return [`${STYLE_LABELS[item.item.style]} interior`];
  }, [item]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-background p-0 text-foreground backdrop:bg-black/50 md:m-auto md:h-[92dvh] md:w-[min(96vw,1100px)] md:rounded-3xl"
    >
      {item && (
        <div ref={scrollRef} className="h-full overflow-y-auto">
          <div className="sticky top-0 z-10 flex justify-end p-3">
            <button onClick={onClose} aria-label="Fermer" className="grid h-10 w-10 place-items-center rounded-full bg-surface text-2xl shadow">
              ×
            </button>
          </div>
          <div className="-mt-12 grid gap-6 px-4 pb-6 md:grid-cols-[1.1fr_1fr] md:px-8">
            <div className="overflow-hidden rounded-3xl bg-surface-muted">
              <PinImage item={item} large />
            </div>
            <PinDetails item={item} onSave={handlers.onSave} onRecreate={(photo) => {
              rememberPhotoForDupes(photo);
              onClose();
              router.push("/dupes");
            }} />
          </div>
          <section className="space-y-4 px-4 pb-10 md:px-8">
            <h3 className="font-display text-2xl">Plus d&apos;idées comme celle-ci</h3>
            <PinFeed key={item.key} queries={related} exclude={item.key} {...handlers} />
          </section>
        </div>
      )}
    </dialog>
  );
}

function PinDetails({
  item,
  onSave,
  onRecreate,
}: {
  item: FeedItem;
  onSave: PinHandlers["onSave"];
  onRecreate: (photo: Extract<FeedItem, { kind: "photo" }>["photo"]) => void;
}) {
  const liked = useIsLiked(item);
  return (
    <div className="flex flex-col gap-5 md:pt-16">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => onSave([boardItemOf(item)])} className="btn-primary">
          Enregistrer
        </button>
        <button onClick={() => toggleLike(item, liked)} aria-pressed={liked} className={liked ? "btn bg-like text-white" : "btn-ghost"}>
          <IconHeart filled className="h-5 w-5" />
          {liked ? "Aimé" : "J'aime"}
        </button>
      </div>
      <h2 className="font-display text-3xl first-letter:uppercase">{itemTitle(item)}</h2>
      {item.kind === "photo" ? (
        <>
          <div className="card space-y-3 p-5">
            <p className="text-lg">Ce look vous plaît&nbsp;?</p>
            <p className="text-sm text-muted">
              L&apos;IA repère chaque pièce de cette photo et vous trouve des équivalents abordables, dans votre budget.
            </p>
            <button onClick={() => onRecreate(item.photo)} className="btn-primary w-full">
              ✦ Recréer ce look avec l&apos;IA
            </button>
          </div>
          <p className="text-sm text-muted">
            Photo :{" "}
            <a href={item.photo.photographerUrl} target="_blank" rel="noopener noreferrer" className="underline">
              {item.photo.photographer}
            </a>{" "}
            sur{" "}
            <a href={item.photo.pageUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Pexels
            </a>
          </p>
        </>
      ) : (
        <p className="text-muted">
          {item.kind === "product" ? `${item.item.description} · ${formatPrice(item.item.price)}` : item.item.mood}
        </p>
      )}
    </div>
  );
}
