"use client";

import { useEffect, useRef, useState } from "react";
import { type FavoriteKey, useHestia } from "@/lib/store";

interface CategoryPickerDialogProps {
  /** Coups de cœur à classer ; null = fenêtre fermée. */
  keys: FavoriteKey[] | null;
  onClose: () => void;
}

/** Fenêtre « Classer » : coche les catégories d'un ou de plusieurs coups de cœur. */
export function CategoryPickerDialog({ keys, onClose }: CategoryPickerDialogProps) {
  const categories = useHestia((s) => s.favoriteCategories);
  const tags = useHestia((s) => s.favoriteTags);
  const setFavoriteCategory = useHestia((s) => s.setFavoriteCategory);
  const createFavoriteCategory = useHestia((s) => s.createFavoriteCategory);
  const [newName, setNewName] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (keys && !dialog.open) dialog.showModal();
    if (!keys && dialog.open) dialog.close();
  }, [keys]);

  const count = keys?.length ?? 0;
  const stateOf = (categoryId: string): "all" | "some" | "none" => {
    if (!keys?.length) return "none";
    const withTag = keys.filter((key) => tags[key]?.includes(categoryId)).length;
    return withTag === keys.length ? "all" : withTag > 0 ? "some" : "none";
  };

  const create = () => {
    const name = newName.trim();
    if (!name || !keys) return;
    const id = createFavoriteCategory(name);
    setFavoriteCategory(keys, id, true);
    setNewName("");
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      className="m-auto w-[min(92vw,420px)] rounded-[1.75rem] border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/40"
    >
      <div className="p-6">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-heading text-2xl">Classer</h2>
          <button onClick={onClose} className="rounded-full px-2 text-2xl leading-none text-muted hover:text-foreground" aria-label="Fermer">
            ×
          </button>
        </div>
        <p className="mb-4 text-sm text-muted">
          {count > 1 ? `${count} coups de cœur sélectionnés.` : "Choisissez une ou plusieurs catégories."}
        </p>

        <ul className="mb-4 max-h-72 space-y-1 overflow-y-auto">
          {categories.length === 0 && (
            <li className="py-2 text-sm text-muted">Aucune catégorie pour l&apos;instant : créez la première ci-dessous.</li>
          )}
          {categories.map((category) => {
            const state = stateOf(category.id);
            return (
              <li key={category.id}>
                <button
                  onClick={() => keys && setFavoriteCategory(keys, category.id, state !== "all")}
                  aria-pressed={state === "all"}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left hover:bg-surface-muted"
                >
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 text-xs font-bold text-white"
                    style={{ borderColor: category.color, background: state === "all" ? category.color : "transparent" }}
                    aria-hidden
                  >
                    {state === "all" ? "✓" : state === "some" ? <span className="h-0.5 w-2.5 rounded" style={{ background: category.color }} /> : null}
                  </span>
                  <span className="flex-1 font-medium">{category.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            create();
          }}
        >
          <input
            className="input"
            placeholder="Nouvelle catégorie (ex. : Salon, Rêve, À acheter)"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            maxLength={40}
          />
          <button className="btn-primary shrink-0" disabled={!newName.trim()}>
            Créer
          </button>
        </form>
        <button onClick={onClose} className="btn-ghost mt-4 w-full">
          Terminé
        </button>
      </div>
    </dialog>
  );
}
