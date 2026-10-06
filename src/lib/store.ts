"use client";

import { useEffect, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Board, BoardItem, Photo } from "./types";

export type SwipeKind = "product" | "inspiration";

/** Distributive Omit, so that each BoardItem variant keeps its own fields. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
export type NewBoardItem = DistributiveOmit<BoardItem, "id" | "addedAt">;

/** Catégorie de coups de cœur créée par l'utilisateur. */
export interface FavoriteCategory {
  id: string;
  name: string;
  color: string;
}

/** Types de coups de cœur : produits et ambiances du catalogue, photos du fil. */
export type FavoriteKind = SwipeKind | "photo";

/** Clé unique d'un coup de cœur : « product:jp-vase », « photo:12345 »… */
export type FavoriteKey = `${FavoriteKind}:${string}`;
export const favoriteKey = (kind: FavoriteKind, id: string): FavoriteKey => `${kind}:${id}`;
export function parseFavoriteKey(key: FavoriteKey): { kind: FavoriteKind; id: string } {
  const index = key.indexOf(":");
  return { kind: key.slice(0, index) as FavoriteKind, id: key.slice(index + 1) };
}

/** Teintes proposées aux catégories, tirées de la direction artistique. */
export const CATEGORY_COLORS = ["#b4532f", "#6b6e3a", "#b98b3e", "#8f3d20", "#7d8f8a", "#a8677a"];

interface HestiaState {
  boards: Board[];
  likedProducts: string[];
  likedInspirations: string[];
  /** Photos aimées dans le fil, conservées en entier (elles ne sont pas dans le catalogue). */
  likedPhotos: Record<string, Photo>;
  /** Éléments déjà vus en swipe (aimés ou non), pour ne pas les reproposer. */
  seen: Record<SwipeKind, string[]>;
  /** Catégories personnelles de coups de cœur, et leur attribution (plusieurs possibles). */
  favoriteCategories: FavoriteCategory[];
  favoriteTags: Record<FavoriteKey, string[]>;
  /** Ordre choisi à la main par l'utilisateur. */
  favoriteOrder: FavoriteKey[];
  likedAt: Record<FavoriteKey, number>;

  createBoard: (name: string, description?: string) => string;
  renameBoard: (id: string, name: string, description?: string) => void;
  deleteBoard: (id: string) => void;
  addToBoard: (boardId: string, item: NewBoardItem) => void;
  removeFromBoard: (boardId: string, itemId: string) => void;

  swipe: (kind: SwipeKind, id: string, liked: boolean) => void;
  unlike: (kind: FavoriteKind, id: string) => void;
  likePhoto: (photo: Photo) => void;
  resetSeen: (kind: SwipeKind) => void;

  createFavoriteCategory: (name: string) => string;
  renameFavoriteCategory: (id: string, name: string) => void;
  recolorFavoriteCategory: (id: string, color: string) => void;
  deleteFavoriteCategory: (id: string) => void;
  /** Ajoute (on = true) ou retire une catégorie sur un ou plusieurs coups de cœur. */
  setFavoriteCategory: (keys: FavoriteKey[], categoryId: string, on: boolean) => void;
  setFavoriteOrder: (keys: FavoriteKey[]) => void;
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
      likedPhotos: {},
      seen: { product: [], inspiration: [] },
      favoriteCategories: [],
      favoriteTags: {},
      favoriteOrder: [],
      likedAt: {},

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
          const isNewLike = liked && !likes.includes(id);
          const fav = favoriteKey(kind, id);
          return {
            ...(isNewLike && {
              likedAt: { ...state.likedAt, [fav]: Date.now() },
              favoriteOrder: [fav, ...state.favoriteOrder.filter((k) => k !== fav)],
            }),
            seen: {
              ...state.seen,
              [kind]: state.seen[kind].includes(id)
                ? state.seen[kind]
                : [...state.seen[kind], id],
            },
            [key]: isNewLike ? [id, ...likes] : likes,
          };
        }),

      unlike: (kind, id) =>
        set((state) => {
          const fav = favoriteKey(kind, id);
          const favoriteTags = { ...state.favoriteTags };
          const likedAt = { ...state.likedAt };
          delete favoriteTags[fav];
          delete likedAt[fav];
          const likedPhotos = { ...state.likedPhotos };
          delete likedPhotos[id];
          return {
            ...(kind === "product"
              ? { likedProducts: state.likedProducts.filter((x) => x !== id) }
              : kind === "inspiration"
                ? { likedInspirations: state.likedInspirations.filter((x) => x !== id) }
                : { likedPhotos }),
            favoriteTags,
            likedAt,
            favoriteOrder: state.favoriteOrder.filter((k) => k !== fav),
          };
        }),

      likePhoto: (photo) =>
        set((state) => {
          if (state.likedPhotos[photo.id]) return {};
          const fav = favoriteKey("photo", photo.id);
          return {
            likedPhotos: { ...state.likedPhotos, [photo.id]: photo },
            likedAt: { ...state.likedAt, [fav]: Date.now() },
            favoriteOrder: [fav, ...state.favoriteOrder.filter((k) => k !== fav)],
          };
        }),

      resetSeen: (kind) =>
        set((state) => ({ seen: { ...state.seen, [kind]: [] } })),

      createFavoriteCategory: (name) => {
        const id = uid();
        set((state) => ({
          favoriteCategories: [
            ...state.favoriteCategories,
            { id, name, color: CATEGORY_COLORS[state.favoriteCategories.length % CATEGORY_COLORS.length] },
          ],
        }));
        return id;
      },

      renameFavoriteCategory: (id, name) =>
        set((state) => ({
          favoriteCategories: state.favoriteCategories.map((c) => (c.id === id ? { ...c, name } : c)),
        })),

      recolorFavoriteCategory: (id, color) =>
        set((state) => ({
          favoriteCategories: state.favoriteCategories.map((c) => (c.id === id ? { ...c, color } : c)),
        })),

      deleteFavoriteCategory: (id) =>
        set((state) => ({
          favoriteCategories: state.favoriteCategories.filter((c) => c.id !== id),
          favoriteTags: Object.fromEntries(
            Object.entries(state.favoriteTags).map(([key, ids]) => [key, ids.filter((x) => x !== id)]),
          ),
        })),

      setFavoriteCategory: (keys, categoryId, on) =>
        set((state) => {
          const favoriteTags = { ...state.favoriteTags };
          for (const key of keys) {
            const current = favoriteTags[key] ?? [];
            favoriteTags[key] = on
              ? current.includes(categoryId) ? current : [...current, categoryId]
              : current.filter((x) => x !== categoryId);
          }
          return { favoriteTags };
        }),

      setFavoriteOrder: (keys) => set({ favoriteOrder: keys }),
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
