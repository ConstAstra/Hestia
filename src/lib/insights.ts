import { CATEGORY_LABELS, INSPIRATIONS_BY_ID, PRODUCTS_BY_ID, ROOM_LABELS, STYLE_LABELS } from "./catalog";
import { colorName } from "./palette";
import type { Board, Photo } from "./types";

/*
 * « Mon style » : ce que révèlent les coups de cœur, les swipes et les créations.
 * Tout est calculé sur l'appareil, à partir des données déjà enregistrées.
 */

export interface Share {
  label: string;
  /** Part de 0 à 1. */
  share: number;
  count: number;
}

export interface ColorShare extends Share {
  hex: string;
}

export interface Insights {
  totals: { likes: number; products: number; inspirations: number; photos: number; creations: number; boards: number };
  /** Part des cartes gardées dans le swipe (null tant qu'il y a trop peu de swipes). */
  swipeKeepRate: number | null;
  styles: Share[];
  colors: ColorShare[];
  /** Répartition chaud / neutre / froid et clair / profond des couleurs aimées. */
  temperature: { warm: number; neutral: number; cool: number };
  lightness: { light: number; mid: number; deep: number };
  materials: Share[];
  rooms: Share[];
  categories: Share[];
  budget: { averageProduct: number | null; averageCreation: number | null };
  /** Coups de cœur des 8 dernières semaines, de la plus ancienne à la plus récente. */
  weeks: { label: string; count: number }[];
  /** Assez de données pour un portrait fiable. */
  enough: boolean;
}

function shares(weights: Map<string, number>, limit = 6): Share[] {
  const total = [...weights.values()].reduce((a, b) => a + b, 0);
  if (!total) return [];
  return [...weights.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count: Math.round(count * 10) / 10, share: count / total }));
}

const add = (map: Map<string, number>, key: string | undefined, weight = 1) => {
  if (key) map.set(key, (map.get(key) ?? 0) + weight);
};
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Teinte (0-360), saturation et luminosité (0-1) d'une couleur. */
function hsl(hex: string) {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s, l };
}

export function computeInsights(state: {
  likedProducts: string[];
  likedInspirations: string[];
  likedPhotos: Record<string, Photo>;
  seen: { product: string[]; inspiration: string[] };
  boards: Board[];
  likedAt: Record<string, number>;
}): Insights {
  const products = state.likedProducts.map((id) => PRODUCTS_BY_ID[id]).filter(Boolean);
  const inspirations = state.likedInspirations.map((id) => INSPIRATIONS_BY_ID[id]).filter(Boolean);
  const photos = Object.values(state.likedPhotos);
  const creations = state.boards.filter((b) => b.creation).map((b) => b.creation!);

  const styles = new Map<string, number>();
  const materials = new Map<string, number>();
  const rooms = new Map<string, number>();
  const categories = new Map<string, number>();
  const colorWeights = new Map<string, { weight: number; hex: string }>();
  const addColor = (hex: string, weight: number) => {
    const name = colorName(hex);
    const entry = colorWeights.get(name);
    if (entry) entry.weight += weight;
    else colorWeights.set(name, { weight, hex });
  };
  const addPalette = (palette: string[], weight = 1) => palette.forEach((hex, rank) => addColor(hex, weight / (rank + 1)));

  for (const p of products) {
    add(styles, STYLE_LABELS[p.style]);
    add(categories, CATEGORY_LABELS[p.category]);
    p.materials.forEach((m) => add(materials, capitalize(m)));
    addPalette(p.palette);
  }
  for (const i of inspirations) {
    add(styles, STYLE_LABELS[i.style]);
    add(rooms, ROOM_LABELS[i.room]);
    addPalette(i.palette);
  }
  for (const photo of photos) addPalette(photo.palette?.length ? photo.palette : [photo.color]);
  // Une création est un choix délibéré : elle compte double.
  for (const c of creations) {
    c.styles.forEach((s) => add(styles, s, 2));
    c.materials.forEach((m) => add(materials, m, 2));
    add(rooms, c.room, 2);
    c.colors.forEach((color) => addColor(color.hex, 2));
  }

  const colorTotal = [...colorWeights.values()].reduce((a, b) => a + b.weight, 0);
  const colors: ColorShare[] = [...colorWeights.entries()]
    .sort((a, b) => b[1].weight - a[1].weight)
    .slice(0, 8)
    .map(([label, { weight, hex }]) => ({ label, hex, count: Math.round(weight * 10) / 10, share: colorTotal ? weight / colorTotal : 0 }));

  const temperature = { warm: 0, neutral: 0, cool: 0 };
  const lightness = { light: 0, mid: 0, deep: 0 };
  for (const { weight, hex } of colorWeights.values()) {
    const { h, s, l } = hsl(hex);
    if (s < 0.18) temperature.neutral += weight;
    else if (h < 75 || h >= 330) temperature.warm += weight;
    else if (h >= 150 && h < 300) temperature.cool += weight;
    else temperature.neutral += weight;
    if (l > 0.72) lightness.light += weight;
    else if (l > 0.4) lightness.mid += weight;
    else lightness.deep += weight;
  }
  const normalize = <T extends Record<string, number>>(values: T): T => {
    const total = Object.values(values).reduce((a, b) => a + b, 0) || 1;
    return Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v / total])) as T;
  };

  const average = (values: number[]) => (values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null);

  // Activité : coups de cœur par semaine, sur 8 semaines.
  const WEEK = 7 * 24 * 3600 * 1000;
  const now = Date.now();
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = now - (8 - i) * WEEK;
    const date = new Date(start + WEEK);
    return {
      start,
      label: date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      count: 0,
    };
  });
  for (const time of Object.values(state.likedAt)) {
    const index = Math.floor((time - (now - 8 * WEEK)) / WEEK);
    if (index >= 0 && index < 8) weeks[index].count++;
  }

  const swiped = state.seen.product.length + state.seen.inspiration.length;
  const kept = state.seen.product.filter((id) => state.likedProducts.includes(id)).length +
    state.seen.inspiration.filter((id) => state.likedInspirations.includes(id)).length;
  const likes = products.length + inspirations.length + photos.length;

  return {
    totals: { likes, products: products.length, inspirations: inspirations.length, photos: photos.length, creations: creations.length, boards: state.boards.length },
    swipeKeepRate: swiped >= 5 ? kept / swiped : null,
    styles: shares(styles),
    colors,
    temperature: normalize(temperature),
    lightness: normalize(lightness),
    materials: shares(materials),
    rooms: shares(rooms, 5),
    categories: shares(categories, 5),
    budget: { averageProduct: average(products.map((p) => p.price)), averageCreation: average(creations.map((c) => c.budget)) },
    weeks: weeks.map(({ label, count }) => ({ label, count })),
    enough: likes + creations.length * 2 >= 3,
  };
}

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
/** « a », « a et b », « a, b et c ». */
const list = (words: string[]) => (words.length <= 1 ? words.join("") : `${words.slice(0, -1).join(", ")} et ${words[words.length - 1]}`);

/** Un portrait en quelques phrases, rédigé à partir des statistiques. */
export function portrait(insights: Insights): string[] {
  const lines: string[] = [];
  const [style, second] = insights.styles;
  if (style) {
    lines.push(
      second && second.share > 0.2
        ? `Votre cœur balance entre le style ${lower(style.label)} et le style ${lower(second.label)}, avec une préférence pour le premier.`
        : `Votre style de prédilection est le ${lower(style.label)}.`,
    );
  }
  const { warm, cool, neutral } = insights.temperature;
  const tone = warm >= cool && warm >= neutral ? "chaudes" : cool >= neutral ? "froides" : "neutres";
  const { light, deep } = insights.lightness;
  const depth = light > 0.5 ? "claires et lumineuses" : deep > 0.4 ? "profondes et enveloppantes" : "douces, ni trop claires ni trop sombres";
  if (insights.colors.length) {
    const names = insights.colors.slice(0, 3).map((c, i) => (i ? lowerFirst(c.label) : c.label));
    lines.push(`Les teintes ${tone} vous attirent, plutôt ${depth} : ${list(names)} reviennent le plus souvent.`);
  }
  if (insights.materials.length) {
    const top = insights.materials.slice(0, 3).map((m) => lowerFirst(m.label));
    lines.push(`Côté matières, ${list(top)} ${top.length > 1 ? "ont" : "a"} votre préférence.`);
  }
  if (insights.rooms[0]) lines.push(`La pièce qui vous inspire le plus : ${lowerFirst(insights.rooms[0].label)}.`);
  return lines;
}

const lower = (text: string) => text.toLowerCase();
