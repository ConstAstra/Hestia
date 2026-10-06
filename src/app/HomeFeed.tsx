"use client";

import { useMemo, useState } from "react";
import { AddToBoardDialog } from "@/components/AddToBoardDialog";
import { PinDialog, PinFeed } from "@/components/Pins";
import { INSPIRATIONS_BY_ID, PRODUCTS_BY_ID } from "@/lib/catalog";
import type { FeedItem } from "@/lib/feed";
import { type NewBoardItem, useHestia } from "@/lib/store";
import { forYouQueries, TOPICS } from "@/lib/topics";
import type { DecorStyle } from "@/lib/types";

type Selection = { type: "for-you" } | { type: "topic"; id: string } | { type: "search"; text: string };

export function HomeFeed() {
  const [selection, setSelection] = useState<Selection>({ type: "for-you" });
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState<FeedItem | null>(null);
  const [saving, setSaving] = useState<NewBoardItem[] | null>(null);
  const likedProducts = useHestia((s) => s.likedProducts);
  const likedInspirations = useHestia((s) => s.likedInspirations);

  // Styles préférés, déduits des coups de cœur, pour personnaliser « Pour vous ».
  const favoriteStyles = useMemo(() => {
    const counts = new Map<DecorStyle, number>();
    for (const id of likedInspirations) {
      const style = INSPIRATIONS_BY_ID[id]?.style;
      if (style) counts.set(style, (counts.get(style) ?? 0) + 2);
    }
    for (const id of likedProducts) {
      const style = PRODUCTS_BY_ID[id]?.style;
      if (style) counts.set(style, (counts.get(style) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([style]) => style);
  }, [likedProducts, likedInspirations]);

  const queries = useMemo(() => {
    if (selection.type === "search") return [selection.text];
    if (selection.type === "topic") return TOPICS.find((t) => t.id === selection.id)?.queries ?? [];
    return forYouQueries(favoriteStyles);
  }, [selection, favoriteStyles]);

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-sm transition ${
      active ? "bg-foreground text-background" : "bg-surface text-foreground hover:bg-surface-muted"
    }`;

  return (
    <div className="space-y-5">
      <div className="sticky top-16 z-20 -mx-4 space-y-3 bg-background/95 px-4 pb-3 pt-2 backdrop-blur">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const text = search.trim();
            setSelection(text ? { type: "search", text } : { type: "for-you" });
            window.scrollTo({ top: 0 });
          }}
          className="relative"
        >
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
            ⌕
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher : salon cosy, cuisine campagne, chambre d'enfant, tapis berbère…"
            className="w-full rounded-full border border-border bg-surface py-3.5 pl-11 pr-4 text-base outline-none transition focus:border-accent"
            enterKeyHint="search"
          />
        </form>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
          <button className={chip(selection.type === "for-you")} onClick={() => setSelection({ type: "for-you" })}>
            Pour vous
          </button>
          {selection.type === "search" && <span className={chip(true)}>« {selection.text} »</span>}
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              className={chip(selection.type === "topic" && selection.id === topic.id)}
              onClick={() => {
                setSelection({ type: "topic", id: topic.id });
                window.scrollTo({ top: 0 });
              }}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      <PinFeed key={queries.join("|")} queries={queries} onOpen={setOpened} onSave={setSaving} />

      <PinDialog item={opened} onClose={() => setOpened(null)} onOpen={setOpened} onSave={setSaving} />
      <AddToBoardDialog items={saving} onClose={() => setSaving(null)} />
    </div>
  );
}
