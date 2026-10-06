import type {
  DecorStyle,
  Inspiration,
  Product,
  ProductCategory,
  RoomType,
} from "./types";

/*
 * Catalogue de démonstration. Les produits sont des archétypes (pas des
 * références marchandes réelles) : ils alimentent le swipe et les tableaux
 * en attendant le branchement d'un flux d'affiliation (voir README).
 */

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  canape: "Canapés",
  fauteuil: "Fauteuils",
  table: "Tables",
  chaise: "Chaises",
  luminaire: "Luminaires",
  tapis: "Tapis",
  rangement: "Rangements",
  lit: "Lits",
  textile: "Textiles",
  deco: "Objets déco",
  miroir: "Miroirs",
  plante: "Plantes & pots",
};

export const STYLE_LABELS: Record<DecorStyle, string> = {
  japandi: "Japandi",
  boheme: "Bohème",
  scandinave: "Scandinave",
  industriel: "Industriel",
  "mid-century": "Mid-century",
  minimaliste: "Minimaliste",
  "classique-chic": "Classique chic",
  mediterraneen: "Méditerranéen",
};

export const ROOM_LABELS: Record<RoomType, string> = {
  salon: "Salon",
  chambre: "Chambre",
  cuisine: "Cuisine",
  "salle-a-manger": "Salle à manger",
  bureau: "Bureau",
  "salle-de-bain": "Salle de bain",
  entree: "Entrée",
  exterieur: "Extérieur",
};

type P = Omit<Product, "id">;

const p = (
  id: string,
  name: string,
  category: ProductCategory,
  style: DecorStyle,
  price: number,
  palette: string[],
  materials: string[],
  description: string,
): [string, P] => [
  id,
  { name, category, style, price, palette, materials, description },
];

const RAW: [string, P][] = [
  // Japandi
  p("jp-canape", "Canapé bas en lin écru", "canape", "japandi", 890, ["#e8e0d2", "#c9bba5", "#8a7a66"], ["lin", "chêne"], "Assise basse et profonde, piètement en chêne clair."),
  p("jp-table", "Table basse ronde en frêne", "table", "japandi", 240, ["#d9c3a0", "#a88a63", "#5e4b37"], ["frêne"], "Plateau épais aux bords adoucis, finition huilée."),
  p("jp-suspension", "Suspension papier de riz", "luminaire", "japandi", 59, ["#f4efe6", "#e0d6c3", "#b9a98f"], ["papier", "bambou"], "Lumière diffuse et douce, grand diamètre 60 cm."),
  p("jp-tapis", "Tapis en jute tissé main", "tapis", "japandi", 149, ["#cdb48b", "#a38a62", "#6f5c40"], ["jute"], "Tissage serré, 160 × 230 cm."),
  p("jp-vase", "Vase en grès texturé", "deco", "japandi", 35, ["#6b6258", "#9a8f82", "#3f3a34"], ["grès"], "Émail mat, finition brute faite main."),
  p("jp-banc", "Banc en chêne massif", "rangement", "japandi", 320, ["#c8a77a", "#8f6f48", "#4a3a26"], ["chêne"], "Ligne épurée, idéal en entrée ou bout de lit."),

  // Bohème
  p("bo-fauteuil", "Fauteuil en rotin coquille", "fauteuil", "boheme", 210, ["#c79a5b", "#9a7040", "#5c4022"], ["rotin"], "Dossier arrondi tressé, coussin terracotta."),
  p("bo-tapis", "Tapis berbère à motifs", "tapis", "boheme", 260, ["#efe6d6", "#2e2a26", "#b45a3c"], ["laine"], "Losanges noirs sur fond crème, poils épais."),
  p("bo-suspension", "Suspension en osier tressé", "luminaire", "boheme", 79, ["#d1a46b", "#a5793f", "#6b4a22"], ["osier"], "Forme cloche, projette des ombres graphiques."),
  p("bo-coussins", "Lot de coussins terracotta & ocre", "textile", "boheme", 45, ["#b45a3c", "#d49a4a", "#efe0c9"], ["coton", "lin"], "Trois housses brodées, franges et pompons."),
  p("bo-miroir", "Miroir soleil en rotin", "miroir", "boheme", 69, ["#c9975a", "#e8d5b5", "#7c5a33"], ["rotin", "verre"], "Diamètre 80 cm, rayons tressés."),
  p("bo-plante", "Ficus lyrata en panier", "plante", "boheme", 55, ["#4f6b3a", "#7f9a5c", "#c8a676"], ["végétal", "jonc"], "Grandes feuilles vernissées, cache-pot tressé."),

  // Scandinave
  p("sc-canape", "Canapé 3 places gris perle", "canape", "scandinave", 690, ["#c9cbcc", "#a2a6a8", "#e9e7e2"], ["polyester", "hêtre"], "Pieds compas en hêtre, coussins déhoussables."),
  p("sc-chaise", "Chaise à barreaux en hêtre", "chaise", "scandinave", 89, ["#e3cfa9", "#bfa478", "#f3ede2"], ["hêtre"], "Dossier à barreaux, assise galbée."),
  p("sc-table", "Table à manger ovale blanche", "table", "scandinave", 420, ["#f4f2ee", "#d8d2c6", "#b89c74"], ["MDF laqué", "chêne"], "Six couverts, pieds fuselés en chêne."),
  p("sc-lampadaire", "Lampadaire trépied en bois", "luminaire", "scandinave", 99, ["#efe9df", "#c3a57b", "#7a6247"], ["chêne", "lin"], "Abat-jour tissu blanc cassé."),
  p("sc-plaid", "Plaid en laine gaufrée", "textile", "scandinave", 49, ["#dcd8cf", "#b8b2a6", "#f6f4ef"], ["laine"], "Gaufrage nid d'abeille, 130 × 170 cm."),
  p("sc-etagere", "Étagère murale en échelle", "rangement", "scandinave", 119, ["#e6d3b3", "#bb9b6c", "#f2ece0"], ["pin"], "Cinq niveaux, appui mural sans perçage."),

  // Industriel
  p("in-canape", "Canapé Chesterfield cuir cognac", "canape", "industriel", 1290, ["#8a4b24", "#5c2f14", "#b36b37"], ["cuir"], "Capitonnage profond, accoudoirs roulés."),
  p("in-table", "Table basse métal & bois recyclé", "table", "industriel", 189, ["#3a3a3a", "#8b6a47", "#5b4430"], ["acier", "bois recyclé"], "Plateau en planches brutes, cadre acier noir."),
  p("in-suspension", "Suspension métal noir façon atelier", "luminaire", "industriel", 65, ["#232323", "#4a4a4a", "#c9a15f"], ["acier"], "Abat-jour émaillé, intérieur laiton."),
  p("in-etagere", "Bibliothèque acier & chêne", "rangement", "industriel", 299, ["#2b2b2b", "#a07a4e", "#5e4a35"], ["acier", "chêne"], "Cinq tablettes, montants tubulaires."),
  p("in-tabouret", "Tabouret de bar Tolix", "chaise", "industriel", 79, ["#4b4f52", "#7a8084", "#2a2c2e"], ["acier"], "Métal brut vernis, empilable."),
  p("in-miroir", "Miroir fenêtre d'atelier", "miroir", "industriel", 129, ["#1f1f1f", "#d9dcdd", "#6d6d6d"], ["acier", "verre"], "Six carreaux, cadre noir mat, 90 × 120 cm."),

  // Mid-century
  p("mc-fauteuil", "Fauteuil lounge velours moutarde", "fauteuil", "mid-century", 349, ["#c99a2e", "#8f6b18", "#5a3e22"], ["velours", "noyer"], "Assise enveloppante, pieds obliques."),
  p("mc-buffet", "Enfilade en noyer à portes cannées", "rangement", "mid-century", 549, ["#7a4a2a", "#a87b4f", "#d9c19c"], ["noyer", "cannage"], "Quatre portes, 180 cm."),
  p("mc-lampe", "Lampe champignon en opaline", "luminaire", "mid-century", 75, ["#f3eadb", "#d6a24a", "#7a5a2c"], ["verre", "laiton"], "Lumière chaude, variateur intégré."),
  p("mc-tapis", "Tapis géométrique vert sapin", "tapis", "mid-century", 199, ["#2f5446", "#d9b46b", "#f0e6d2"], ["laine"], "Arches imbriquées, 200 × 290 cm."),
  p("mc-chaise", "Chaise coque en noyer", "chaise", "mid-century", 129, ["#8a5a35", "#c7a079", "#2b2b2b"], ["contreplaqué", "acier"], "Assise moulée, pieds épingle."),
  p("mc-horloge", "Horloge soleil laiton", "deco", "mid-century", 89, ["#c49a45", "#8c6a2b", "#2b2b2b"], ["laiton"], "Rayons rayonnants, mécanisme silencieux."),

  // Minimaliste
  p("mi-canape", "Canapé modulable blanc cassé", "canape", "minimaliste", 1090, ["#f1eee8", "#dcd6cb", "#b5ada0"], ["bouclette"], "Modules combinables, tissu bouclette."),
  p("mi-table", "Table basse travertin", "table", "minimaliste", 450, ["#e3d4bd", "#c9b496", "#a08d70"], ["travertin"], "Pierre naturelle, pied central monolithe."),
  p("mi-applique", "Applique murale sphère", "luminaire", "minimaliste", 85, ["#f7f5f0", "#d9d4ca", "#a6a097"], ["verre", "acier"], "Globe opalin, fixation discrète."),
  p("mi-lit", "Lit plateforme en chêne clair", "lit", "minimaliste", 690, ["#e3cfa9", "#c1a679", "#f2ede4"], ["chêne"], "Tête de lit basse, 160 × 200 cm."),
  p("mi-linge", "Parure de lit en lin lavé sable", "textile", "minimaliste", 129, ["#d8c6a8", "#bba584", "#efe6d6"], ["lin"], "Housse et deux taies, toucher froissé."),
  p("mi-vase", "Vase céramique blanc sculptural", "deco", "minimaliste", 42, ["#f4f1ea", "#dad3c6", "#b3aa9b"], ["céramique"], "Forme organique asymétrique."),

  // Classique chic
  p("cc-canape", "Canapé velours vert émeraude", "canape", "classique-chic", 990, ["#1f5a46", "#2f7a60", "#c6a25a"], ["velours", "laiton"], "Accoudoirs arrondis, pieds dorés."),
  p("cc-miroir", "Miroir doré mouluré", "miroir", "classique-chic", 159, ["#c6a25a", "#e6d29a", "#8a6a2c"], ["résine", "verre"], "Style Louis XVI, 70 × 110 cm."),
  p("cc-lustre", "Lustre en laiton à pampilles", "luminaire", "classique-chic", 229, ["#d9b766", "#f3ebd3", "#8f7333"], ["laiton", "verre"], "Six bras, pampilles en verre taillé."),
  p("cc-chaise", "Chaise médaillon cannée", "chaise", "classique-chic", 179, ["#efe7d6", "#c9b48a", "#8b7350"], ["hêtre", "cannage"], "Dossier médaillon, assise lin."),
  p("cc-tapis", "Tapis persan vintage bordeaux", "tapis", "classique-chic", 320, ["#7a2430", "#c9905a", "#2a2f4a"], ["laine"], "Motifs floraux délavés, 170 × 240 cm."),
  p("cc-console", "Console en marbre & laiton", "rangement", "classique-chic", 390, ["#efece6", "#c6a25a", "#9a9590"], ["marbre", "laiton"], "Plateau marbre blanc veiné, structure fine."),

  // Méditerranéen
  p("me-table", "Table en bois flotté", "table", "mediterraneen", 360, ["#cfc3ad", "#a3967c", "#e9e3d6"], ["bois flotté"], "Patine blanchie, pièce unique."),
  p("me-chaise", "Chaise paillée bleue", "chaise", "mediterraneen", 69, ["#2f5d8a", "#d8b97a", "#f2ead8"], ["hêtre", "paille"], "Assise paillée, bois laqué bleu."),
  p("me-suspension", "Suspension en raphia", "luminaire", "mediterraneen", 89, ["#d9bd8c", "#b3925c", "#f2e6cf"], ["raphia"], "Franges naturelles, effet ombrelle."),
  p("me-jarre", "Jarre en terre cuite", "deco", "mediterraneen", 59, ["#c06a40", "#9a4f2c", "#e4b48e"], ["terre cuite"], "Hauteur 60 cm, pour branches d'olivier."),
  p("me-olivier", "Olivier en pot", "plante", "mediterraneen", 79, ["#6f7d55", "#9fae84", "#c06a40"], ["végétal", "terre cuite"], "1,20 m, pot en terre cuite."),
  p("me-linge", "Nappe en lin rayé", "textile", "mediterraneen", 39, ["#f2ead8", "#2f5d8a", "#d8c7a2"], ["lin"], "Rayures bleues tissées, 160 × 250 cm."),
];

export const PRODUCTS: Product[] = RAW.map(([id, data]) => ({ id, ...data }));

export const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((product) => [product.id, product]),
);

export const INSPIRATIONS: Inspiration[] = [
  { id: "insp-japandi-salon", title: "Salon japandi baigné de lumière", style: "japandi", room: "salon", palette: ["#efe8dc", "#c9b79a", "#7d6b55", "#3f3a34"], mood: "Calme, matières naturelles, lignes basses", keywords: ["lin", "chêne", "papier de riz"], productIds: ["jp-canape", "jp-table", "jp-suspension", "jp-tapis", "jp-vase"] },
  { id: "insp-japandi-entree", title: "Entrée zen & épurée", style: "japandi", room: "entree", palette: ["#e9e1d3", "#b89f7c", "#4a3a26"], mood: "Accueil apaisant, rangement invisible", keywords: ["banc", "grès"], productIds: ["jp-banc", "jp-vase", "jp-suspension"] },
  { id: "insp-boheme-salon", title: "Salon bohème solaire", style: "boheme", room: "salon", palette: ["#efe0c9", "#d49a4a", "#b45a3c", "#4f6b3a"], mood: "Chaleureux, voyageur, plein de textures", keywords: ["rotin", "berbère", "plantes"], productIds: ["bo-fauteuil", "bo-tapis", "bo-suspension", "bo-coussins", "bo-plante"] },
  { id: "insp-boheme-chambre", title: "Chambre cocon bohème", style: "boheme", room: "chambre", palette: ["#f1e6d4", "#c9975a", "#b45a3c"], mood: "Douceur, terracotta et fibres tressées", keywords: ["miroir soleil", "coussins"], productIds: ["bo-miroir", "bo-coussins", "bo-suspension", "bo-plante"] },
  { id: "insp-scandi-salle", title: "Salle à manger scandinave", style: "scandinave", room: "salle-a-manger", palette: ["#f4f2ee", "#e3cfa9", "#a2a6a8"], mood: "Lumineux, convivial, bois blond", keywords: ["chaises à barreaux", "table ovale"], productIds: ["sc-table", "sc-chaise", "sc-lampadaire"] },
  { id: "insp-scandi-salon", title: "Salon hygge", style: "scandinave", room: "salon", palette: ["#e9e7e2", "#c9cbcc", "#bfa478"], mood: "Cocooning nordique, plaids et lumière douce", keywords: ["plaid", "échelle"], productIds: ["sc-canape", "sc-plaid", "sc-etagere", "sc-lampadaire"] },
  { id: "insp-indus-loft", title: "Loft industriel", style: "industriel", room: "salon", palette: ["#232323", "#5c2f14", "#8b6a47", "#d9dcdd"], mood: "Brut, cuir patiné, métal noir", keywords: ["chesterfield", "verrière"], productIds: ["in-canape", "in-table", "in-suspension", "in-etagere", "in-miroir"] },
  { id: "insp-indus-cuisine", title: "Cuisine atelier", style: "industriel", room: "cuisine", palette: ["#2a2c2e", "#7a8084", "#c9a15f"], mood: "Esprit bistrot, métal et laiton", keywords: ["tabourets", "suspensions"], productIds: ["in-tabouret", "in-suspension"] },
  { id: "insp-mc-salon", title: "Salon mid-century", style: "mid-century", room: "salon", palette: ["#c99a2e", "#7a4a2a", "#2f5446", "#f0e6d2"], mood: "Rétro chic, noyer et velours", keywords: ["enfilade", "opaline"], productIds: ["mc-fauteuil", "mc-buffet", "mc-lampe", "mc-tapis", "mc-horloge"] },
  { id: "insp-mc-bureau", title: "Bureau vintage inspirant", style: "mid-century", room: "bureau", palette: ["#8a5a35", "#d6a24a", "#2b2b2b"], mood: "Concentré, élégant, chaleureux", keywords: ["chaise coque", "lampe"], productIds: ["mc-chaise", "mc-lampe", "mc-horloge"] },
  { id: "insp-mini-salon", title: "Salon minimaliste minéral", style: "minimaliste", room: "salon", palette: ["#f1eee8", "#e3d4bd", "#b5ada0"], mood: "Silence visuel, pierre et bouclette", keywords: ["travertin", "bouclette"], productIds: ["mi-canape", "mi-table", "mi-applique", "mi-vase"] },
  { id: "insp-mini-chambre", title: "Chambre lin & chêne", style: "minimaliste", room: "chambre", palette: ["#efe6d6", "#d8c6a8", "#c1a679"], mood: "Repos absolu, tons sable", keywords: ["lin lavé", "lit plateforme"], productIds: ["mi-lit", "mi-linge", "mi-applique"] },
  { id: "insp-chic-salon", title: "Salon parisien haussmannien", style: "classique-chic", room: "salon", palette: ["#1f5a46", "#c6a25a", "#efece6", "#7a2430"], mood: "Élégance, moulures et laiton", keywords: ["velours", "miroir doré"], productIds: ["cc-canape", "cc-miroir", "cc-lustre", "cc-tapis", "cc-console"] },
  { id: "insp-chic-salle", title: "Salle à manger cannée", style: "classique-chic", room: "salle-a-manger", palette: ["#efe7d6", "#c9b48a", "#d9b766"], mood: "Raffiné et lumineux", keywords: ["médaillon", "lustre"], productIds: ["cc-chaise", "cc-lustre", "cc-console"] },
  { id: "insp-med-terrasse", title: "Terrasse méditerranéenne", style: "mediterraneen", room: "exterieur", palette: ["#f2ead8", "#2f5d8a", "#c06a40", "#6f7d55"], mood: "Vacances, terre cuite et olivier", keywords: ["chaises paillées", "jarre"], productIds: ["me-table", "me-chaise", "me-jarre", "me-olivier", "me-linge"] },
  { id: "insp-med-cuisine", title: "Cuisine ensoleillée du Sud", style: "mediterraneen", room: "cuisine", palette: ["#f2e6cf", "#d9bd8c", "#2f5d8a"], mood: "Simple, solaire, artisanal", keywords: ["raphia", "lin rayé"], productIds: ["me-suspension", "me-linge", "me-chaise", "me-jarre"] },
];

export const INSPIRATIONS_BY_ID: Record<string, Inspiration> = Object.fromEntries(
  INSPIRATIONS.map((inspiration) => [inspiration.id, inspiration]),
);

export function formatPrice(value: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}
