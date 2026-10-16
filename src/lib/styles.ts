/*
 * Styles de décoration de l'outil de création : chacun avec son esprit, ses
 * incontournables, sa palette (teintes du nuancier) et ses matières (matériauthèque).
 */

export interface DecorStyleSheet {
  id: string;
  name: string;
  /** Une accroche de quelques mots. */
  tagline: string;
  description: string;
  /** Les incontournables du style. */
  signatures: string[];
  /** Teintes du nuancier (codes de src/lib/colors.ts). */
  palette: string[];
  /** Matières de la matériauthèque (identifiants de src/lib/materials.ts). */
  materials: string[];
  emoji: string;
}

export const DECOR_STYLES: DecorStyleSheet[] = [
  {
    id: "mediterraneen", name: "Méditerranéen", emoji: "🌊", tagline: "Le soleil du Sud à la maison",
    description: "Murs blanchis à la chaux, terre cuite, lin froissé et touches de bleu : une maison de vacances où le temps ralentit. Les formes sont arrondies, les matières brutes, la lumière reine.",
    signatures: ["Murs à la chaux ou enduits", "Tomettes et terre cuite", "Arches et formes arrondies", "Lin, rotin et osier", "Céramiques artisanales"],
    palette: ["#F4EFE6", "#C0603D", "#5C7088", "#6F7A3B", "#D8C09A"],
    materials: ["terre-cuite", "lin", "rotin", "travertin", "zellige"],
  },
  {
    id: "dopamine", name: "Dopamine", emoji: "🌈", tagline: "Des couleurs qui rendent heureux",
    description: "Le décor qui ose tout : couleurs vives, formes généreuses et mélanges joyeux. On s'entoure de ce qui fait sourire, sans se soucier des règles.",
    signatures: ["Couleurs saturées associées sans complexe", "Meubles aux formes rondes et ludiques", "Motifs graphiques", "Objets fantaisie et pièces pop", "Laque et chrome"],
    palette: ["#E0218A", "#FF7A1A", "#FFC72C", "#1FB5AC", "#8A3FFC"],
    materials: ["terrazzo", "velours", "chrome", "bouclette"],
  },
  {
    id: "japandi", name: "Japandi", emoji: "🍵", tagline: "La sérénité, en toute simplicité",
    description: "La rencontre du minimalisme japonais et de la chaleur scandinave. Peu d'objets, mais beaux ; des lignes basses, du bois clair et des matières naturelles.",
    signatures: ["Mobilier bas et épuré", "Bois clair et touches de noir", "Céramique artisanale", "Luminaires en papier", "Espaces dégagés"],
    palette: ["#F4EFE6", "#CBBFAE", "#3A3A3A", "#6F7A3B", "#B98A5A"],
    materials: ["chene-clair", "lin", "papier", "gres-emaille"],
  },
  {
    id: "boheme", name: "Bohème", emoji: "🪶", tagline: "Libre, chaleureux et voyageur",
    description: "Un intérieur qui raconte des voyages : tapis berbères, fibres tressées, plantes à profusion et couleurs de terre. On superpose, on chine, on mélange.",
    signatures: ["Tapis berbères superposés", "Rotin, jute et macramé", "Plantes en abondance", "Coussins et textiles mélangés", "Objets chinés"],
    palette: ["#C0603D", "#CF9A3A", "#E2D3B8", "#2F5446", "#A5532A"],
    materials: ["rotin", "jute", "laine", "terre-cuite"],
  },
  {
    id: "scandinave", name: "Scandinave", emoji: "🌲", tagline: "Lumineux, simple et douillet",
    description: "Clarté, bois blond et textiles douillets : l'art nordique de rendre une maison accueillante. Fonctionnel avant tout, mais toujours chaleureux.",
    signatures: ["Murs clairs et lumière naturelle", "Bois blond", "Plaids et laine", "Mobilier fonctionnel aux pieds fins", "Touches de vert"],
    palette: ["#F4EFE6", "#C9C9C4", "#B98A5A", "#9AAB8C", "#3A3A3A"],
    materials: ["chene-clair", "laine", "lin", "metal-noir"],
  },
  {
    id: "industriel", name: "Industriel", emoji: "🏭", tagline: "L'esprit loft et atelier",
    description: "Briques apparentes, métal noir, cuir patiné et bois brut : l'esprit des anciennes usines transformées en lofts. Graphique et chaleureux à la fois.",
    signatures: ["Métal noir et verrières", "Cuir patiné", "Bois brut et récupération", "Béton et brique", "Suspensions d'atelier"],
    palette: ["#3A3A3A", "#B98A5A", "#C9C9C4", "#9E4A32", "#F4EFE6"],
    materials: ["metal-noir", "cuir", "bois-brut", "beton-cire"],
  },
  {
    id: "mid-century", name: "Mid-century", emoji: "🪑", tagline: "Le design des années 50-60",
    description: "Les lignes iconiques du design d'après-guerre : pieds compas, bois de noyer, courbes élégantes et couleurs franches. Rétro, mais toujours moderne.",
    signatures: ["Pieds compas fuselés", "Noyer et teck", "Formes organiques", "Couleurs moutarde, canard, orange", "Luminaires en laiton"],
    palette: ["#C9A12E", "#2C6470", "#A5532A", "#F4EFE6", "#5A3A28"],
    materials: ["noyer", "velours", "laiton", "cannage"],
  },
  {
    id: "art-deco", name: "Art déco", emoji: "✨", tagline: "Glamour et géométrie",
    description: "L'élégance des années folles : velours profonds, laiton doré, marbre et motifs géométriques. Un style théâtral, raffiné, qui aime le spectaculaire.",
    signatures: ["Velours aux couleurs profondes", "Laiton et finitions dorées", "Marbre", "Motifs géométriques et éventails", "Miroirs et courbes"],
    palette: ["#2F5446", "#C9A12E", "#1F2F45", "#F4EFE6", "#6E2532"],
    materials: ["velours", "laiton", "marbre", "verre-cannele"],
  },
  {
    id: "wabi-sabi", name: "Wabi-sabi", emoji: "🍂", tagline: "La beauté de l'imparfait",
    description: "Une philosophie japonaise qui célèbre l'imperfection, l'usure et le passage du temps. Matières brutes, tons de terre, objets faits main.",
    signatures: ["Enduits irréguliers", "Céramique faite main", "Lin froissé", "Bois patiné", "Tons de terre et de pierre"],
    palette: ["#CBBFAE", "#E2D3B8", "#5A3A28", "#9C978D", "#B5A88F"],
    materials: ["gres-emaille", "lin", "jute", "beton-cire"],
  },
  {
    id: "minimaliste", name: "Minimaliste", emoji: "◻️", tagline: "Moins, mais mieux",
    description: "Le juste nécessaire, chaque objet à sa place : des lignes nettes, une palette restreinte et beaucoup d'espace pour respirer.",
    signatures: ["Peu d'objets, bien choisis", "Rangements invisibles", "Palette restreinte", "Lignes nettes", "Matières de qualité"],
    palette: ["#F4EFE6", "#C9C9C4", "#1C1C1C", "#CBBFAE"],
    materials: ["chene-clair", "beton-cire", "metal-noir", "lin"],
  },
  {
    id: "classique-chic", name: "Classique chic", emoji: "🏛️", tagline: "L'élégance à la parisienne",
    description: "Moulures, parquet en point de Hongrie, cheminée de marbre et mobilier de caractère : le charme haussmannien, mélangé avec des pièces contemporaines.",
    signatures: ["Moulures et parquet", "Marbre et laiton", "Mélange ancien et contemporain", "Miroirs dorés", "Tons neutres et profonds"],
    palette: ["#F4EFE6", "#1F2F45", "#CBBFAE", "#C9A12E", "#C08A8A"],
    materials: ["marbre", "laiton", "cannage", "noyer"],
  },
  {
    id: "campagne", name: "Campagne chic", emoji: "🌾", tagline: "La douceur de la maison de famille",
    description: "Bois brut, lin lavé, vaisselle chinée et bouquets de fleurs séchées : une maison de campagne chaleureuse, authentique et sans prétention.",
    signatures: ["Bois brut et poutres", "Lin et vichy", "Vaisselle chinée", "Fleurs séchées", "Grande table conviviale"],
    palette: ["#E2D3B8", "#7F9C8E", "#9E4A32", "#F4EFE6", "#D9A55B"],
    materials: ["bois-brut", "lin", "terre-cuite", "gres-emaille"],
  },
  {
    id: "maximaliste", name: "Maximaliste", emoji: "🦚", tagline: "Plus, c'est plus",
    description: "Motifs, couleurs, collections et souvenirs se répondent dans une joyeuse abondance. Un intérieur généreux, personnel et plein d'histoires.",
    signatures: ["Papiers peints à motifs", "Murs de cadres", "Couleurs profondes associées", "Collections exposées", "Velours et franges"],
    palette: ["#6E2532", "#2C6470", "#CF9A3A", "#5E2F4A", "#2F5446"],
    materials: ["velours", "laiton", "laine", "noyer"],
  },
  {
    id: "bord-de-mer", name: "Bord de mer", emoji: "🐚", tagline: "Fraîcheur et air marin",
    description: "Blanc, bleu et sable, bois flotté et fibres naturelles : l'atmosphère d'une maison de plage, lumineuse et décontractée.",
    signatures: ["Blanc et bleus", "Bois clair ou flotté", "Lin et coton", "Fibres naturelles", "Rayures marinières"],
    palette: ["#F4EFE6", "#5C7088", "#BFD0DC", "#D8C09A", "#1F2F45"],
    materials: ["chene-clair", "lin", "rotin", "jute"],
  },
  {
    id: "pastel", name: "Pastel doux", emoji: "🍬", tagline: "Tendre et poétique",
    description: "Des teintes douces comme des macarons, des formes arrondies et des matières moelleuses : un cocon léger et rêveur.",
    signatures: ["Murs pastel", "Formes arrondies", "Bouclette et velours", "Bois clair", "Touches de doré"],
    palette: ["#F6C6D4", "#C3E6D2", "#CFE3F3", "#F5C9A8", "#D9C6E8"],
    materials: ["bouclette", "cannage", "chene-clair", "verre-cannele"],
  },
];

export const STYLES_BY_ID: Record<string, DecorStyleSheet> = Object.fromEntries(DECOR_STYLES.map((s) => [s.id, s]));
