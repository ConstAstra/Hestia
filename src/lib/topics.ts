import type { DecorStyle } from "./types";

/*
 * Thèmes du fil d'inspiration : pièces, styles et envies, pour parler à tous les goûts.
 * Les requêtes sont en anglais, langue dans laquelle la banque d'images est la mieux indexée ;
 * la recherche libre de l'utilisateur, elle, part telle quelle (en français).
 */
export interface Topic {
  id: string;
  label: string;
  queries: string[];
}

export const TOPICS: Topic[] = [
  { id: "salon", label: "Salon", queries: ["cozy living room interior", "living room decor"] },
  { id: "chambre", label: "Chambre", queries: ["bedroom interior design", "cozy bedroom decor"] },
  { id: "cuisine", label: "Cuisine", queries: ["kitchen interior design", "rustic kitchen decor"] },
  { id: "salle-de-bain", label: "Salle de bain", queries: ["bathroom interior design"] },
  { id: "salle-a-manger", label: "Salle à manger", queries: ["dining room interior"] },
  { id: "bureau", label: "Bureau", queries: ["home office interior"] },
  { id: "enfant", label: "Chambre d'enfant", queries: ["kids room decor", "nursery decor"] },
  { id: "entree", label: "Entrée", queries: ["entryway hallway decor"] },
  { id: "exterieur", label: "Extérieur", queries: ["patio terrace decor", "balcony decor plants"] },
  { id: "boheme", label: "Bohème", queries: ["boho interior decor"] },
  { id: "classique", label: "Classique chic", queries: ["parisian apartment interior", "classic elegant interior"] },
  { id: "campagne", label: "Campagne", queries: ["farmhouse interior", "cottage interior"] },
  { id: "vintage", label: "Vintage", queries: ["vintage interior decor", "retro interior"] },
  { id: "art-deco", label: "Art déco", queries: ["art deco interior"] },
  { id: "maximaliste", label: "Maximaliste", queries: ["maximalist colorful interior", "eclectic interior"] },
  { id: "industriel", label: "Industriel", queries: ["industrial loft interior"] },
  { id: "scandinave", label: "Scandinave", queries: ["scandinavian interior"] },
  { id: "minimaliste", label: "Minimaliste", queries: ["minimalist interior"] },
  { id: "mediterraneen", label: "Méditerranéen", queries: ["mediterranean interior", "greek island house interior"] },
  { id: "japandi", label: "Japandi", queries: ["japandi interior"] },
  { id: "tropical", label: "Tropical", queries: ["tropical interior plants"] },
  { id: "petits-espaces", label: "Petits espaces", queries: ["small apartment interior"] },
  { id: "plantes", label: "Plantes", queries: ["indoor plants home decor"] },
  { id: "diy", label: "DIY", queries: ["diy home decor"] },
  { id: "fetes", label: "Tables de fête", queries: ["table setting decor", "christmas home decor"] },
];

export const TOPICS_BY_ID: Record<string, Topic> = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

/** Correspondance entre les styles du catalogue (profil déco) et les thèmes du fil. */
const STYLE_TOPIC: Record<DecorStyle, string> = {
  japandi: "japandi",
  boheme: "boheme",
  scandinave: "scandinave",
  industriel: "industriel",
  "mid-century": "vintage",
  minimaliste: "minimaliste",
  "classique-chic": "classique",
  mediterraneen: "mediterraneen",
};

/** Requêtes du fil « Pour vous » : les styles aimés d'abord, puis un large éventail. */
export function forYouQueries(favoriteStyles: DecorStyle[]): string[] {
  const preferred = favoriteStyles.flatMap((style) => TOPICS_BY_ID[STYLE_TOPIC[style]]?.queries ?? []);
  const general = [
    "home interior design",
    "cozy living room interior",
    "boho interior decor",
    "bedroom interior design",
    "eclectic interior",
    "kitchen interior design",
    "parisian apartment interior",
    "farmhouse interior",
    "maximalist colorful interior",
    "indoor plants home decor",
    "vintage interior decor",
    "patio terrace decor",
  ];
  return [...new Set([...preferred, ...general])];
}
