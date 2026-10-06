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
        <h1 className="font-display text-3xl md:text-5xl">Vos mood boards</h1>
        <p className="text-muted">Un tableau par pièce, par projet ou par envie : épinglez-y tout ce qui vous inspire.</p>
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
      ) : boards.length === 0 ? (
        <p className="text-center text-muted">Aucun tableau pour l&apos;instant. Créez le premier ci-dessus !</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {boards.map((board) => {
            const covers = board.items.slice(0, 3);
            return (
              <Link key={board.id} href={`/tableaux/${board.id}`} className="group space-y-2">
                <div className="grid aspect-square grid-cols-[2fr_1fr] grid-rows-2 gap-1 overflow-hidden rounded-3xl bg-surface-muted transition group-hover:opacity-90">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className={`overflow-hidden bg-surface-muted ${index === 0 ? "row-span-2" : ""}`}>
                      {covers[index] && <BoardItemThumb item={covers[index]} />}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold">{board.name}</p>
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
  );
}
