"use client";

import type { FeedItem } from "./feed";
import { favoriteKey, type FavoriteKey, type NewBoardItem, useHestia } from "./store";
import type { Photo } from "./types";

export const DUPES_PHOTO_KEY = "hestia:dupes-photo";

/** Prépare l'outil Dupes avec cette photo comme inspiration. */
export function rememberPhotoForDupes(photo: Photo) {
  try {
    sessionStorage.setItem(DUPES_PHOTO_KEY, JSON.stringify(photo));
  } catch {
    /* navigation privée : l'utilisateur déposera l'image lui-même */
  }
}

export function favoriteKeyOf(item: FeedItem): FavoriteKey {
  return item.kind === "photo" ? favoriteKey("photo", item.photo.id) : favoriteKey(item.kind, item.item.id);
}

export function boardItemOf(item: FeedItem): NewBoardItem {
  if (item.kind === "photo") return { kind: "photo", photo: item.photo };
  return item.kind === "product" ? { kind: "product", productId: item.item.id } : { kind: "inspiration", inspirationId: item.item.id };
}

/** Est-ce un coup de cœur ? (abonnement réactif au store) */
export function useIsLiked(item: FeedItem): boolean {
  return useHestia((s) =>
    item.kind === "photo"
      ? Boolean(s.likedPhotos[item.photo.id])
      : item.kind === "product"
        ? s.likedProducts.includes(item.item.id)
        : s.likedInspirations.includes(item.item.id),
  );
}

export function toggleLike(item: FeedItem, liked: boolean) {
  const store = useHestia.getState();
  if (item.kind === "photo") {
    if (liked) store.unlike("photo", item.photo.id);
    else store.likePhoto(item.photo);
  } else if (liked) {
    store.unlike(item.kind, item.item.id);
  } else {
    store.swipe(item.kind, item.item.id, true);
  }
}
