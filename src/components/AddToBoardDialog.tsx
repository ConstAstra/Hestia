"use client";

import { useEffect, useRef, useState } from "react";
import { type NewBoardItem, useHestia } from "@/lib/store";

interface AddToBoardDialogProps {
  /** Éléments à enregistrer ; null = fenêtre fermée. */
  items: NewBoardItem[] | null;
  title?: string;
  onClose: () => void;
}

/** Fenêtre « Enregistrer dans un tableau », façon épingle Pinterest. */
export function AddToBoardDialog({ items, title = "Enregistrer dans un tableau", onClose }: AddToBoardDialogProps) {
  const boards = useHestia((s) => s.boards);
  const createBoard = useHestia((s) => s.createBoard);
  const addToBoard = useHestia((s) => s.addToBoard);
  const [newName, setNewName] = useState("");
  const [savedTo, setSavedTo] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (items && !dialog.open) dialog.showModal();
    if (!items && dialog.open) dialog.close();
  }, [items]);

  const save = (boardId: string, boardName: string) => {
    if (!items) return;
    // Ajout en ordre inverse pour conserver l'ordre d'origine en tête du tableau.
    for (const item of [...items].reverse()) addToBoard(boardId, item);
    setSavedTo(boardName);
    setTimeout(() => {
      setSavedTo(null);
      onClose();
    }, 700);
  };

  const createAndSave = () => {
    const name = newName.trim();
    if (!name) return;
    const id = createBoard(name);
    setNewName("");
    save(id, name);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      className="m-auto w-[min(92vw,420px)] rounded-3xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/40"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full px-2 text-2xl leading-none text-muted hover:text-foreground" aria-label="Fermer">
            ×
          </button>
        </div>

        {savedTo ? (
          <p className="rounded-2xl bg-accent-soft px-4 py-6 text-center font-medium text-accent-strong">
            Enregistré dans « {savedTo} » ✓
          </p>
        ) : (
          <>
            <ul className="mb-4 max-h-64 space-y-1 overflow-y-auto">
              {boards.length === 0 && (
                <li className="py-2 text-sm text-muted">Pas encore de tableau : créez le premier ci-dessous.</li>
              )}
              {boards.map((board) => (
                <li key={board.id}>
                  <button
                    onClick={() => save(board.id, board.name)}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left hover:bg-surface-muted"
                  >
                    <span className="font-medium">{board.name}</span>
                    <span className="text-xs text-muted">{board.items.length} idée{board.items.length > 1 ? "s" : ""}</span>
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                createAndSave();
              }}
            >
              <input
                className="input"
                placeholder="Nouveau tableau…"
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                maxLength={60}
              />
              <button className="btn-primary shrink-0" disabled={!newName.trim()}>
                Créer
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
