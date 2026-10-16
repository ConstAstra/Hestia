"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BoardItemThumb } from "@/components/BoardItemView";
import { useHestia, useHydrated } from "@/lib/store";

const SUGGESTIONS = ["Salon cocooning", "Chambre parentale", "Coin bureau", "Terrasse d'été"];

export function BoardsClient() {
  const hydrated = useHydrated();
  const router = useRouter();
  const boards = useHestia((s) => s.boards);
  const createBoard = useHestia((s) => s.createBoard);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tab, setTab] = useState<"all" | "creations" | "boards">("all");
  const creations = boards.filter((b) => b.creation);
  const personal = boards.filter((b) => !b.creation);
  const shown = tab === "creations" ? creations : tab === "boards" ? personal : boards;
  const TABS = [
    ["all", "Tous", boards.length],
    ["creations", "Mes créations", creations.length],
    ["boards", "Mes tableaux", personal.length],
  ] as const;

  const create = (boardName: string) => {
    const trimmed = boardName.trim();
    if (!trimmed) return;
    const id = createBoard(trimmed, description.trim() || undefined);
    router.push(`/tableaux/${id}`);
  };

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="kicker">Tableaux</p>
        <h1 className="font-display text-4xl md:text-6xl">Vos mood boards</h1>
        <p className="max-w-2xl text-muted">
          Un tableau, c&apos;est un mood board : une page où vous réunissez, pour un même projet, les photos, produits, couleurs et
          notes qui vous inspirent.
        </p>
        <ul className={`${hydrated && boards.length > 0 ? "hidden sm:grid" : "grid"} gap-3 pt-2 sm:grid-cols-3`}>
          {[
            ["Vos créations", "Chaque projet de l'outil de création s'y range automatiquement, avec ses produits et son titre."],
            ["Vos idées", "Enregistrez-y des photos du fil, des coups de cœur ou vos propres images, depuis toute l'application."],
            ["Vos notes", "Ajoutez des post-it, des mesures, des envies : tout le projet au même endroit."],
          ].map(([title, text]) => (
            <li key={title} className="rounded-2xl bg-surface-muted px-4 py-3">
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </header>

      <form
        className="card grid gap-3 p-5 md:grid-cols-[1fr_1.4fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          create(name);
        }}
      >
        <input className="input" placeholder="Nom du tableau" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
        <input className="input" placeholder="Description (facultatif)" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={140} />
        <button className="btn-primary" disabled={!name.trim()}>
          Créer le tableau
        </button>
        <div className="flex flex-wrap gap-2 md:col-span-3">
          <span className="text-xs text-muted">Idées :</span>
          {SUGGESTIONS.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => setName(suggestion)} className="rounded-full border border-border px-3 py-0.5 text-xs hover:border-accent">
              {suggestion}
            </button>
          ))}
        </div>
      </form>

      {!hydrated ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square animate-pulse rounded-3xl bg-surface-muted" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer les tableaux">
            {TABS.map(([value, label, count]) => (
              <button
                key={value}
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === value ? "bg-foreground text-background" : "bg-surface-muted hover:bg-border"
                }`}
              >
                {label} <span className="opacity-60">{count}</span>
              </button>
            ))}
          </div>
          {shown.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
              {tab === "creations" ? (
                <>
                  <p className="font-display text-2xl">Pas encore de création</p>
                  <p className="max-w-md text-sm text-muted">
                    Chaque projet de l&apos;outil de création s&apos;enregistre ici automatiquement, avec un titre qui reprend son style, sa
                    pièce, ses couleurs, ses matières et son budget.
                  </p>
                  <Link href="/creation" className="btn-primary">
                    Lancer une création ✦
                  </Link>
                </>
              ) : (
                <>
                  <p className="font-display text-2xl">Aucun tableau pour l&apos;instant</p>
                  <p className="max-w-md text-sm text-muted">Créez votre premier tableau ci-dessus, ou partez d&apos;une suggestion.</p>
                </>
              )}
            </div>
          ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {shown.map((board) => {
            // Couvertures : les visuels d'abord, les notes et fiches produit ensuite.
            const visual = (kind: string) => ["photo", "image", "inspiration", "product"].includes(kind);
            const covers = [...board.items.filter((i) => visual(i.kind)), ...board.items.filter((i) => !visual(i.kind))].slice(0, 3);
            return (
              <Link key={board.id} href={`/tableaux/${board.id}`} className="group space-y-2">
                <div className="grid aspect-square grid-cols-[2fr_1fr] grid-rows-2 gap-1 overflow-hidden rounded-3xl bg-surface-muted transition group-hover:opacity-90">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className={`overflow-hidden bg-surface-muted ${index === 0 ? "row-span-2" : ""}`}>
                      {covers[index] && <BoardItemThumb item={covers[index]} />}
                    </div>
                  ))}
                </div>
                {board.creation && (
                  <div className="flex h-1.5 overflow-hidden rounded-full" aria-hidden>
                    {board.creation.colors.map((c) => (
                      <span key={c.hex} className="flex-1" style={{ background: c.hex }} />
                    ))}
                  </div>
                )}
                <div>
                  {board.creation && <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Création</p>}
                  <p className="line-clamp-2 font-semibold leading-snug">{board.name}</p>
                  <p className="text-xs text-muted">
                    {board.items.length} idée{board.items.length > 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
          )}
        </div>
      )}
    </div>
  );
}
