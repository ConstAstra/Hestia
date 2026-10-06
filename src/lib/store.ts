"use client";

import { useEffect, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Board, BoardItem } from "./types";

export type SwipeKind = "product" | "inspiration";

/** Distributive Omit, so that each BoardItem variant keeps its own fields. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
export type NewBoardItem = DistributiveOmit<BoardItem, "id" | "addedAt">;

interface HestiaState {
  boards: Board[];
  likedProducts: string[];
  likedInspirations: string[];
  /** Éléments déjà vus en swipe (aimés ou non), pour ne pas les reproposer. */
  seen: Record<SwipeKind, string[]>;

  createBoard: (name: string, description?: string) => string;
  renameBoard: (id: string, name: string, description?: string) => void;
  deleteBoard: (id: string) => void;
  addToBoard: (boardId: string, item: NewBoardItem) => void;
  removeFromBoard: (boardId: string, itemId: string) => void;

  swipe: (kind: SwipeKind, id: string, liked: boolean) => void;
  unlike: (kind: SwipeKind, id: string) => void;
  resetSeen: (kind: SwipeKind) => void;
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const STORAGE_FULL_EVENT = "hestia:storage-full";

/** localStorage dont les dépassements de quota sont signalés au lieu de planter. */
const safeLocalStorage: Storage = {
  get length() {
    return localStorage.length;
  },
  clear: () => localStorage.clear(),
  key: (index) => localStorage.key(index),
  getItem: (key) => localStorage.getItem(key),
  removeItem: (key) => localStorage.removeItem(key),
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      window.dispatchEvent(new Event(STORAGE_FULL_EVENT));
    }
  },
};

const touch = (board: Board, items: BoardItem[]): Board => ({
  ...board,
  items,
  updatedAt: Date.now(),
});

export const useHestia = create<HestiaState>()(
  persist(
    (set) => ({
      boards: [],
      likedProducts: [],
      likedInspirations: [],
      seen: { product: [], inspiration: [] },

      createBoard: (name, description) => {
        const id = uid();
        const now = Date.now();
        set((state) => ({
          boards: [
            { id, name, description, createdAt: now, updatedAt: now, items: [] },
            ...state.boards,
          ],
        }));
        return id;
      },

      renameBoard: (id, name, description) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id
              ? { ...board, name, description, updatedAt: Date.now() }
              : board,
          ),
        })),

      deleteBoard: (id) =>
        set((state) => ({ boards: state.boards.filter((board) => board.id !== id) })),

      addToBoard: (boardId, item) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? touch(board, [
                  { ...item, id: uid(), addedAt: Date.now() } as BoardItem,
                  ...board.items,
                ])
              : board,
          ),
        })),

      removeFromBoard: (boardId, itemId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? touch(board, board.items.filter((item) => item.id !== itemId))
              : board,
          ),
        })),

      swipe: (kind, id, liked) =>
        set((state) => {
          const key = kind === "product" ? "likedProducts" : "likedInspirations";
          const likes = state[key];
          return {
            seen: {
              ...state.seen,
              [kind]: state.seen[kind].includes(id)
                ? state.seen[kind]
                : [...state.seen[kind], id],
            },
            [key]: liked && !likes.includes(id) ? [id, ...likes] : likes,
          };
        }),

      unlike: (kind, id) =>
        set((state) =>
          kind === "product"
            ? { likedProducts: state.likedProducts.filter((x) => x !== id) }
            : { likedInspirations: state.likedInspirations.filter((x) => x !== id) },
        ),

      resetSeen: (kind) =>
        set((state) => ({ seen: { ...state.seen, [kind]: [] } })),
    }),
    {
      name: "hestia-v1",
      storage: createJSONStorage(() => safeLocalStorage),
      // Réhydratation manuelle après le montage pour éviter les écarts SSR/client.
      skipHydration: true,
    },
  ),
);

// `persist` n'existe pas côté serveur (pas de localStorage) : accès optionnel.
const subscribeHydration = (onChange: () => void) =>
  useHestia.persist?.onFinishHydration(onChange) ?? (() => {});
const getHydrated = () => useHestia.persist?.hasHydrated() ?? false;
const getServerHydrated = () => false;

/** Renvoie true une fois l'état local (localStorage) chargé côté client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeHydration, getHydrated, getServerHydrated);
}

/** À monter une fois (layout) : charge l'état sauvegardé après l'hydratation React. */
export function useRehydrateOnMount(): void {
  useEffect(() => {
    if (!useHestia.persist.hasHydrated()) void useHestia.persist.rehydrate();
  }, []);
}
