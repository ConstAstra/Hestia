"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AddToBoardDialog } from "@/components/AddToBoardDialog";
import { PaletteDots, PaletteSwatches } from "@/components/PaletteSwatches";
import { PinDialog, PinImage } from "@/components/Pins";
import { type FeedItem, itemRatio, usePhotoFeed } from "@/lib/feed";
import type { NewBoardItem } from "@/lib/store";
import { type Trend, TRENDS } from "@/lib/trends";

/** Une couleur phare par tendance : la palette de la saison. */
const SEASON_COLORS = TRENDS.map((trend) => trend.palette[1]);

export function TrendsClient() {
  const [opened, setOpened] = useState<FeedItem | null>(null);
  const [saving, setSaving] = useState<NewBoardItem[] | null>(null);

  return (
    <div className="space-y-12">
      <header className="max-w-3xl space-y-3">
        <p className="kicker">Tendances</p>
        <h1 className="font-display text-4xl md:text-6xl">Les tendances déco du moment</h1>
        <p className="text-lg text-muted">
          Notre sélection des envies qui transforment les intérieurs, avec des idées concrètes pour les adopter chez vous,
          quel que soit votre style.
        </p>
      </header>

      <section className="card space-y-4 p-6">
        <div>
          <h2 className="font-display text-2xl">Les couleurs de la saison</h2>
          <p className="text-sm text-muted">Une teinte phare pour chaque tendance.</p>
        </div>
        <PaletteSwatches colors={SEASON_COLORS} />
      </section>

      <nav aria-label="Tendances" className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
        {TRENDS.map((trend) => (
          <a key={trend.id} href={`#${trend.id}`} className="shrink-0 rounded-full bg-surface px-4 py-2 text-sm hover:bg-surface-muted">
            {trend.title}
          </a>
        ))}
      </nav>

      {TRENDS.map((trend, index) => (
        <TrendSection key={trend.id} trend={trend} index={index} onOpen={setOpened} />
      ))}

      <PinDialog item={opened} onClose={() => setOpened(null)} onOpen={setOpened} onSave={setSaving} />
      <AddToBoardDialog items={saving} onClose={() => setSaving(null)} />
    </div>
  );
}

function TrendSection({ trend, index, onOpen }: { trend: Trend; index: number; onOpen: (item: FeedItem) => void }) {
  return (
    <section id={trend.id} className="scroll-mt-24 space-y-5 border-t border-border pt-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
        <div className="space-y-4">
          <p className="kicker">
            {String(index + 1).padStart(2, "0")} · {trend.label}
          </p>
          <h2 className="font-display text-3xl md:text-4xl">{trend.title}</h2>
          <p className="text-muted">{trend.description}</p>
          <PaletteDots colors={trend.palette} />
          <div className="space-y-2">
            <h3 className="text-sm uppercase tracking-[0.15em] text-accent">Comment l&apos;adopter</h3>
            <ul className="space-y-2">
              {trend.tips.map((tip) => (
                <li key={tip} className="flex gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <Link href={`/?tendance=${trend.id}`} className="btn-primary">
            Voir plus d&apos;idées →
          </Link>
        </div>
        <TrendGallery trend={trend} onOpen={onOpen} />
      </div>
    </section>
  );
}

/** Galerie horizontale : les premières photos de la tendance. */
function TrendGallery({ trend, onOpen }: { trend: Trend; onOpen: (item: FeedItem) => void }) {
  const { items, loading, loadMore } = usePhotoFeed(trend.queries);

  useEffect(() => {
    void loadMore();
    // Une seule page suffit pour la galerie ; « Voir plus d'idées » ouvre le fil complet.
  }, [loadMore]);

  const gallery = items.slice(0, 10);
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] lg:mx-0 lg:px-0">
      {gallery.length === 0 &&
        (loading || items.length === 0) &&
        Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-72 w-48 shrink-0 animate-pulse rounded-2xl" style={{ background: trend.palette[i % trend.palette.length] }} />
        ))}
      {gallery.map((item) => (
        <button
          key={item.key}
          onClick={() => onOpen(item)}
          className="h-72 shrink-0 overflow-hidden rounded-2xl bg-surface-muted transition hover:opacity-90"
          style={{ width: `${Math.round(288 / Math.min(Math.max(itemRatio(item), 0.6), 1.8))}px` }}
          aria-label="Voir cette idée"
        >
          <div className="h-full [&_img]:h-full [&_img]:object-cover [&>div]:h-full">
            <PinImage item={item} />
          </div>
        </button>
      ))}
    </div>
  );
}
