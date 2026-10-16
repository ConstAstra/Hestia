import { formatPrice } from "./catalog";
import type { CreationInfo } from "./types";

/** « a », « a & b », « a, b & c ». */
function list(words: string[]) {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} & ${words[words.length - 1]}`;
}

const lower = (word: string, index: number) => (index === 0 ? word : word.charAt(0).toLowerCase() + word.slice(1));

/**
 * Titre d'un tableau de création, tiré de ses caractéristiques :
 * « Méditerranéen · Salon · Terracotta, lin & bleu ardoise · Travertin & rotin · 500 € ».
 */
export function creationTitle(info: CreationInfo): string {
  const parts = [
    info.styles.length ? info.styles.join(" & ") : null,
    info.room ?? null,
    info.colors.length ? list(info.colors.slice(0, 3).map((c, i) => lower(c.name, i))) : null,
    info.materials.length ? list(info.materials.slice(0, 2).map(lower)) : null,
    formatPrice(info.budget),
  ].filter(Boolean);
  return parts.join(" · ");
}
