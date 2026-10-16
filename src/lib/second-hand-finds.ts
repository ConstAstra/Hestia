/*
 * Pièces à chiner : des classiques que l'on trouve facilement d'occasion, avec ce
 * qu'il faut vérifier avant d'acheter. Pas de prix ici : ils varient trop d'une annonce
 * à l'autre, la recherche Hestia rapporte les annonces réelles.
 */

export interface SecondHandFind {
  id: string;
  name: string;
  era: string;
  description: string;
  /** Points à vérifier avant d'acheter. */
  check: string;
  /** Texte de recherche sur les plateformes. */
  query: string;
  /** Matière principale (matériauthèque), pour l'échantillon de la carte. */
  material: string;
}

export const SECOND_HAND_FINDS: SecondHandFind[] = [
  {
    id: "chaise-cannee", name: "Chaise bistrot cannée", era: "Classique des cafés parisiens", material: "cannage",
    description: "Légère, élégante et indémodable, elle se marie aussi bien à une table de ferme qu'à une table en marbre.",
    check: "L'état du cannage (fils cassés, affaissement) et la solidité des pieds.", query: "chaise bistrot cannée",
  },
  {
    id: "buffet-teck", name: "Buffet en teck scandinave", era: "Années 1950-1960", material: "noyer",
    description: "Pieds fuselés, portes coulissantes, bois chaud : la pièce maîtresse d'un salon mid-century.",
    check: "Les rayures et taches d'eau (le teck se rénove bien à l'huile) et le bon coulissement des portes.", query: "buffet teck scandinave vintage",
  },
  {
    id: "fauteuil-rotin", name: "Fauteuil en rotin", era: "Années 1970", material: "rotin",
    description: "Silhouette généreuse et légère à la fois : il apporte instantanément une touche bohème et solaire.",
    check: "Les fibres cassées ou desséchées et la stabilité de l'assise.", query: "fauteuil rotin vintage",
  },
  {
    id: "chaise-bois-courbe", name: "Chaise en bois courbé", era: "Style bistrot, début du XXe siècle", material: "bois-brut",
    description: "Le bois courbé à la vapeur dessine des lignes souples ; on les dépareille volontiers autour d'une grande table.",
    check: "Le jeu dans les assemblages et l'absence de fissures sur les courbes.", query: "chaise bois courbé bistrot ancienne",
  },
  {
    id: "lampe-champignon", name: "Lampe champignon", era: "Années 1970", material: "chrome",
    description: "Sa silhouette ronde et pop diffuse une lumière douce : un petit objet qui donne du caractère à une console.",
    check: "Le câblage (à refaire si le fil est fendu) et l'interrupteur.", query: "lampe champignon vintage",
  },
  {
    id: "table-ferme", name: "Table de ferme en bois massif", era: "Ancienne, souvent XIXe siècle", material: "bois-brut",
    description: "Grande, robuste et patinée, elle devient le cœur convivial d'une cuisine ou d'une salle à manger.",
    check: "Les vers à bois (petits trous et sciure), le plateau voilé et les dimensions de passage.", query: "table de ferme bois massif ancienne",
  },
  {
    id: "miroir-soleil", name: "Miroir soleil en rotin", era: "Années 1960-1970", material: "rotin",
    description: "Il illumine un mur d'entrée ou de chambre et réchauffe tout de suite une pièce neutre.",
    check: "Les rayons cassés et l'état du tain (taches noires) du miroir.", query: "miroir soleil rotin vintage",
  },
  {
    id: "bonnetiere", name: "Bonnetière ou petite armoire", era: "Ancienne", material: "bois-brut",
    description: "Une armoire étroite qui loge dans une entrée ou une chambre, à garder dans son jus ou à repeindre.",
    check: "Les portes qui ferment bien, la présence des clés et l'état du fond.", query: "bonnetière ancienne",
  },
  {
    id: "table-travertin", name: "Table basse en travertin", era: "Années 1970-1980", material: "travertin",
    description: "La tendance du moment existe en version d'époque, souvent plus massive et moins chère que le neuf.",
    check: "Les éclats sur les arêtes, le poids (prévoir le transport) et les alvéoles rebouchées.", query: "table basse travertin vintage",
  },
  {
    id: "fauteuil-club", name: "Fauteuil club en cuir", era: "Années 1930 à 1970", material: "cuir",
    description: "Profond et patiné, il apporte une note de bibliothèque anglaise et vieillit merveilleusement.",
    check: "Les craquelures du cuir, l'état des ressorts et l'odeur (humidité).", query: "fauteuil club cuir",
  },
  {
    id: "suspension-laiton", name: "Suspension en laiton", era: "Années 1950-1970", material: "laiton",
    description: "Une touche dorée au plafond, qui se patine joliment ; parfaite au-dessus d'une table.",
    check: "Le câblage et les douilles (à faire vérifier) et l'oxydation, qui se nettoie facilement.", query: "suspension laiton vintage",
  },
  {
    id: "tapis-berbere", name: "Tapis berbère", era: "Fait main", material: "laine",
    description: "Laine épaisse et motifs graphiques : il réchauffe le sol et s'accorde à presque tous les styles.",
    check: "Les mites (trous, laine rongée), les franges et l'odeur.", query: "tapis berbère laine",
  },
];

/** Plateformes de seconde main recommandées, avec ce qu'on y trouve. */
export const SECOND_HAND_PLATFORMS = [
  { name: "Selency", url: "https://www.selency.fr", note: "Vintage et design sélectionnés, livraison organisée." },
  { name: "Label Emmaüs", url: "https://www.label-emmaus.co", note: "La boutique en ligne solidaire d'Emmaüs." },
  { name: "Leboncoin", url: "https://www.leboncoin.fr", note: "Le plus grand choix, idéal près de chez soi." },
  { name: "Vinted", url: "https://www.vinted.fr", note: "Petits objets, linge de maison et déco." },
  { name: "eBay", url: "https://www.ebay.fr", note: "Pièces rares, luminaires et objets de collection." },
  { name: "Brocante Lab", url: "https://www.brocantelab.com", note: "Une sélection de brocanteurs professionnels." },
];

/** Recherche directe sur une plateforme (passe par /acheter pour compter le clic). */
export function platformSearchLinks(query: string) {
  const q = encodeURIComponent(query);
  const viaHestia = (url: string, retailer: string) => `/acheter?${new URLSearchParams({ u: url, r: retailer })}`;
  return [
    { name: "Leboncoin", href: viaHestia(`https://www.leboncoin.fr/recherche?text=${q}`, "Leboncoin") },
    { name: "Vinted", href: viaHestia(`https://www.vinted.fr/catalog?search_text=${q}`, "Vinted") },
    { name: "eBay", href: viaHestia(`https://www.ebay.fr/sch/i.html?_nkw=${q}`, "eBay") },
  ];
}
