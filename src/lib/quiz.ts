import type { ProductCategory } from "./types";
import { DECOR_STYLES, STYLES_BY_ID } from "./styles";

/*
 * Questionnaire « Découvrez votre projet déco » : huit questions visuelles. Chaque
 * réponse donne des points à des styles (src/lib/styles.ts) et peut apporter une
 * pièce, une palette, une matière, la pièce à transformer ou le budget.
 */

export interface QuizOption {
  id: string;
  label: string;
  /** Sous-titre court. */
  hint?: string;
  /** Points donnés aux styles. */
  styles: Record<string, number>;
  /** Visuel : couleurs de la tuile, illustration éventuelle, ou échantillon de matière. */
  palette: string[];
  category?: ProductCategory;
  material?: string;
  /** Ce que la réponse apporte au projet. */
  piece?: string;
  room?: string;
  budget?: number;
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle?: string;
  /** Rendu des tuiles : grandes illustrations, palettes, échantillons ou simples pastilles. */
  kind: "visual" | "palette" | "material" | "choice";
  options: QuizOption[];
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "room", title: "Quelle pièce voulez-vous transformer ?", kind: "choice",
    options: [
      { id: "salon", label: "Salon", styles: {}, palette: ["#E2D3B8"], room: "Salon" },
      { id: "chambre", label: "Chambre", styles: {}, palette: ["#BFD0DC"], room: "Chambre" },
      { id: "cuisine", label: "Cuisine", styles: {}, palette: ["#9AAB8C"], room: "Cuisine" },
      { id: "salle-a-manger", label: "Salle à manger", styles: {}, palette: ["#D9A55B"], room: "Salle à manger" },
      { id: "bureau", label: "Bureau", styles: {}, palette: ["#C9C9C4"], room: "Bureau" },
      { id: "salle-de-bain", label: "Salle de bain", styles: {}, palette: ["#B9D3C6"], room: "Salle de bain" },
      { id: "entree", label: "Entrée", styles: {}, palette: ["#C4927A"], room: "Entrée" },
      { id: "exterieur", label: "Balcon ou terrasse", styles: {}, palette: ["#B5C27A"], room: "Extérieur" },
    ],
  },
  {
    id: "weekend", title: "Votre week-end idéal ?", subtitle: "Pas de mauvaise réponse : suivez votre instinct.", kind: "choice",
    options: [
      { id: "terrasse", label: "Brunch au soleil sur une terrasse", styles: { mediterraneen: 3, "maison-de-vacances": 2, boheme: 1 }, palette: ["#C0603D"] },
      { id: "puces", label: "Chiner aux puces dès 8 h", styles: { vintage: 3, "mid-century": 2, "campagne-anglaise": 1 }, palette: ["#C9A12E"] },
      { id: "expo", label: "Une expo, puis un café design", styles: { moderne: 2, contemporain: 2, "art-deco": 1, "minimalisme-chaleureux": 1 }, palette: ["#1C1C1C"] },
      { id: "chalet", label: "Plaid, thé et pluie contre les vitres", styles: { scandinave: 2, kinfolk: 2, "wabi-sabi": 1, campagne: 1 }, palette: ["#9AAB8C"] },
      { id: "fete", label: "Une soirée haute en couleurs", styles: { dopamine: 3, maximaliste: 2 }, palette: ["#E0218A"] },
      { id: "plage", label: "Pieds nus au bord de la mer", styles: { "bord-de-mer": 3, "maison-de-vacances": 2 }, palette: ["#5C7088"] },
    ],
  },
  {
    id: "palette", title: "Quelle palette vous fait de l'œil ?", kind: "palette",
    options: [
      { id: "neutres", label: "Neutres doux", styles: { japandi: 2, "minimalisme-chaleureux": 2, kinfolk: 2, "wabi-sabi": 1 }, palette: ["#F4EFE6", "#E2D3B8", "#CBBFAE", "#B5A88F", "#5A3A28"] },
      { id: "terres", label: "Terres solaires", styles: { mediterraneen: 2, boheme: 2, "maison-de-vacances": 1 }, palette: ["#C0603D", "#D9A55B", "#E2D3B8", "#6F7A3B", "#F4EFE6"] },
      { id: "bleus", label: "Bleus et blancs", styles: { "bord-de-mer": 2, scandinave: 2, "maison-de-vacances": 1 }, palette: ["#F4EFE6", "#BFD0DC", "#5C7088", "#1F2F45", "#D8C09A"] },
      { id: "profonds", label: "Profonds et dorés", styles: { "art-deco": 2, "classique-contemporain": 2, haussmannien: 1, maximaliste: 1 }, palette: ["#2F5446", "#1F2F45", "#6E2532", "#C9A12E", "#F4EFE6"] },
      { id: "pastels", label: "Pastels", styles: { pastel: 3, "campagne-anglaise": 1 }, palette: ["#F6C6D4", "#C3E6D2", "#CFE3F3", "#F5C9A8", "#D9C6E8"] },
      { id: "vives", label: "Couleurs vives", styles: { dopamine: 3, maximaliste: 1 }, palette: ["#E0218A", "#FF7A1A", "#FFC72C", "#1FB5AC", "#8A3FFC"] },
    ],
  },
  {
    id: "sofa", title: "Le canapé de vos rêves ?", kind: "visual",
    options: [
      { id: "bouclette", label: "Arrondi en bouclette", styles: { contemporain: 3, pastel: 1 }, palette: ["#F4EFE6", "#E2D3B8", "#CBBFAE"], category: "canape", piece: "Un canapé arrondi en bouclette" },
      { id: "chesterfield", label: "Chesterfield en cuir", styles: { industriel: 2, vintage: 2, haussmannien: 1 }, palette: ["#7C4325", "#A5623A", "#3A3A3A"], category: "canape", piece: "Un canapé Chesterfield en cuir patiné" },
      { id: "lin-bas", label: "Bas, en lin lavé", styles: { japandi: 3, kinfolk: 2, "wabi-sabi": 1 }, palette: ["#E2D3B8", "#CBBFAE", "#9C978D"], category: "canape", piece: "Un canapé bas en lin lavé" },
      { id: "velours", label: "Velours vert profond", styles: { "art-deco": 3, maximaliste: 2, "classique-contemporain": 1 }, palette: ["#2F5446", "#3F6B5A", "#C9A12E"], category: "canape", piece: "Un canapé en velours vert profond" },
      { id: "banquette", label: "Banquette et coussins", styles: { boheme: 3, mediterraneen: 2 }, palette: ["#C0603D", "#D9A55B", "#F4EFE6"], category: "canape", piece: "Une banquette maçonnée garnie de coussins" },
      { id: "modulable", label: "Modulable et graphique", styles: { moderne: 3, scandinave: 1, "minimalisme-chaleureux": 1 }, palette: ["#C9C9C4", "#9C978D", "#1C1C1C"], category: "canape", piece: "Un canapé modulable aux lignes nettes" },
    ],
  },
  {
    id: "material", title: "La matière que vous aimeriez toucher tous les jours ?", kind: "material",
    options: [
      { id: "chene", label: "Chêne clair", styles: { scandinave: 2, japandi: 2, "minimalisme-chaleureux": 1 }, palette: [], material: "chene-clair" },
      { id: "rotin", label: "Rotin", styles: { boheme: 2, "maison-de-vacances": 2, mediterraneen: 1 }, palette: [], material: "rotin" },
      { id: "velours", label: "Velours", styles: { "art-deco": 2, maximaliste: 2, "mid-century": 1 }, palette: [], material: "velours" },
      { id: "travertin", label: "Travertin", styles: { contemporain: 2, mediterraneen: 2, "wabi-sabi": 1 }, palette: [], material: "travertin" },
      { id: "metal", label: "Métal noir", styles: { industriel: 3, moderne: 1 }, palette: [], material: "metal-noir" },
      { id: "lin", label: "Lin", styles: { kinfolk: 2, campagne: 2, "wabi-sabi": 1 }, palette: [], material: "lin" },
      { id: "laiton", label: "Laiton", styles: { haussmannien: 2, "mid-century": 2, "classique-contemporain": 1 }, palette: [], material: "laiton" },
      { id: "terrazzo", label: "Terrazzo", styles: { dopamine: 2, pastel: 1, moderne: 1 }, palette: [], material: "terrazzo" },
    ],
  },
  {
    id: "light", title: "Le luminaire coup de cœur ?", kind: "visual",
    options: [
      { id: "papier", label: "Suspension en papier", styles: { japandi: 2, kinfolk: 2 }, palette: ["#FFFAF0", "#EFE4CF", "#CBBFAE"], category: "luminaire", piece: "Une grande suspension en papier" },
      { id: "champignon", label: "Lampe champignon", styles: { "mid-century": 2, vintage: 2, dopamine: 1 }, palette: ["#FF7A1A", "#F1DFA4", "#C9A12E"], category: "luminaire", piece: "Une lampe champignon rétro" },
      { id: "lustre", label: "Lustre en laiton", styles: { haussmannien: 3, "art-deco": 2, "classique-contemporain": 1 }, palette: ["#C9A12E", "#F1DFA4", "#1F2F45"], category: "luminaire", piece: "Un lustre en laiton" },
      { id: "rotin", label: "Suspension en rotin", styles: { boheme: 2, mediterraneen: 2, "maison-de-vacances": 1 }, palette: ["#C9A46A", "#E2D3B8", "#C0603D"], category: "luminaire", piece: "Une suspension en rotin tressé" },
      { id: "atelier", label: "Spot d'atelier noir", styles: { industriel: 3, moderne: 1 }, palette: ["#3A3A3A", "#9C978D", "#B98A5A"], category: "luminaire", piece: "Une lampe d'atelier en métal noir" },
      { id: "sculpture", label: "Lampe sculpturale", styles: { contemporain: 2, "wabi-sabi": 2 }, palette: ["#CBBFAE", "#D8C09A", "#5A3A28"], category: "luminaire", piece: "Une lampe sculpturale en pierre ou céramique" },
    ],
  },
  {
    id: "objects", title: "Et les objets, chez vous ?", kind: "choice",
    options: [
      { id: "peu", label: "Le moins possible, tout est rangé", styles: { "minimalisme-chaleureux": 3, japandi: 2, moderne: 1 }, palette: ["#F4EFE6"] },
      { id: "histoire", label: "Quelques trouvailles qui ont une histoire", styles: { vintage: 2, "wabi-sabi": 2, campagne: 1 }, palette: ["#B98A5A"] },
      { id: "collections", label: "Des collections partout, j'assume", styles: { maximaliste: 3, boheme: 2, dopamine: 1 }, palette: ["#6E2532"] },
      { id: "fleurs", label: "Des fleurs, du linge brodé, des bougies", styles: { "campagne-anglaise": 3, kinfolk: 1, pastel: 1 }, palette: ["#C08A8A"] },
    ],
  },
  {
    id: "budget", title: "Quel budget pour ce projet ?", subtitle: "Hestia trouvera des pièces à votre portée.", kind: "choice",
    options: [
      { id: "petit", label: "Moins de 300 €", hint: "Les petites touches qui changent tout", styles: {}, palette: ["#9AAB8C"], budget: 250 },
      { id: "moyen", label: "300 à 1 000 €", hint: "De quoi transformer une pièce", styles: {}, palette: ["#D9A55B"], budget: 800 },
      { id: "grand", label: "1 000 à 3 000 €", hint: "Les pièces maîtresses", styles: {}, palette: ["#C0603D"], budget: 2000 },
      { id: "projet", label: "Plus de 3 000 €", hint: "Un vrai projet de fond", styles: {}, palette: ["#6E2532"], budget: 4000 },
    ],
  },
];

export interface QuizResult {
  styleId: string;
  secondStyleId?: string;
  /** Adéquation du style dominant, de 0 à 1. */
  match: number;
  palette: string[];
  pieces: string[];
  materials: string[];
  room?: string;
  budget?: number;
  answers: Record<string, string>;
  doneAt: number;
}

export function computeQuizResult(answers: Record<string, string>): QuizResult {
  const scores = new Map<string, number>(DECOR_STYLES.map((s) => [s.id, 0]));
  const chosen = QUIZ.map((q) => q.options.find((o) => o.id === answers[q.id])).filter((o): o is QuizOption => !!o);
  for (const option of chosen) for (const [id, points] of Object.entries(option.styles)) scores.set(id, (scores.get(id) ?? 0) + points);
  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const [first, second] = ranked;
  const total = chosen.reduce((sum, o) => sum + Math.max(0, ...Object.values(o.styles)), 0) || 1;
  const style = STYLES_BY_ID[first[0]];
  const paletteOption = chosen.find((o) => QUIZ.find((q) => q.id === "palette")?.options.includes(o));
  const palette = [...new Set([...(paletteOption?.palette.slice(0, 3) ?? []), ...style.palette])].slice(0, 5);
  const pieces = chosen.flatMap((o) => (o.piece ? [o.piece] : []));
  pieces.push(...style.signatures.slice(0, 4 - pieces.length));
  const materials = [...new Set([...chosen.flatMap((o) => (o.material ? [o.material] : [])), ...style.materials])].slice(0, 4);
  return {
    styleId: first[0],
    secondStyleId: second && second[1] > 0 ? second[0] : undefined,
    match: Math.min(0.99, Math.max(0.55, first[1] / total)),
    palette,
    pieces,
    materials,
    room: chosen.find((o) => o.room)?.room,
    budget: chosen.find((o) => o.budget)?.budget,
    answers,
    doneAt: Date.now(),
  };
}
