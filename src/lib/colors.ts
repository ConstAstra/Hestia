/*
 * Nuancier de l'outil de création : des teintes de décoration choisies, chacune
 * avec son ambiance, les pièces où elle excelle et des associations qui lui vont bien.
 */

export type ColorFamily = "neutres" | "terres" | "verts" | "bleus" | "roses" | "jaunes" | "profonds";

export const FAMILY_LABELS: Record<ColorFamily, string> = {
  neutres: "Neutres",
  terres: "Terres",
  verts: "Verts",
  bleus: "Bleus",
  roses: "Roses & rouges",
  jaunes: "Jaunes & ocres",
  profonds: "Profonds",
};

export interface DecorColor {
  id: string;
  name: string;
  hex: string;
  family: ColorFamily;
  /** Ambiance en quelques mots, pour l'étiquette de la fiche. */
  mood: string;
  description: string;
  rooms: string[];
  /** Associations : chacune est une petite palette qui inclut la couleur. */
  pairings: { name: string; colors: string[] }[];
}

export const DECOR_COLORS: DecorColor[] = [
  // Neutres
  {
    id: "blanc-casse", name: "Blanc cassé", hex: "#F4EFE6", family: "neutres", mood: "Lumineux et doux",
    description: "Plus chaleureux qu'un blanc pur, il agrandit l'espace sans jamais paraître froid. La toile de fond idéale pour faire chanter les matières et les couleurs vives.",
    rooms: ["Salon", "Chambre", "Petits espaces"],
    pairings: [
      { name: "Douceur naturelle", colors: ["#F4EFE6", "#E2D3B8", "#9AAB8C"] },
      { name: "Contraste chic", colors: ["#F4EFE6", "#1F2F45", "#B98A5A"] },
    ],
  },
  {
    id: "lin", name: "Lin", hex: "#E2D3B8", family: "neutres", mood: "Naturel et apaisant",
    description: "La couleur du tissu brut : une base chaleureuse qui adoucit tout ce qu'elle touche. Elle s'accorde avec le bois, le rotin et les plantes.",
    rooms: ["Chambre", "Salon", "Salle à manger"],
    pairings: [
      { name: "Bord de mer", colors: ["#E2D3B8", "#F4EFE6", "#5C7088"] },
      { name: "Maison de campagne", colors: ["#E2D3B8", "#7F9C8E", "#9E4A32"] },
    ],
  },
  {
    id: "grege", name: "Grège", hex: "#CBBFAE", family: "neutres", mood: "Élégant et discret",
    description: "Entre gris et beige, le grège est le neutre sophistiqué par excellence. Il calme une pièce tout en lui donnant de la profondeur.",
    rooms: ["Salon", "Entrée", "Bureau"],
    pairings: [
      { name: "Minéral", colors: ["#CBBFAE", "#F4EFE6", "#3A3A3A"] },
      { name: "Feutré", colors: ["#CBBFAE", "#C08A8A", "#5A3A28"] },
    ],
  },
  {
    id: "gris-perle", name: "Gris perle", hex: "#C9C9C4", family: "neutres", mood: "Calme et lumineux",
    description: "Un gris clair aux reflets doux, moderne sans être austère. Il met en valeur le métal, le verre et les touches de couleur franche.",
    rooms: ["Salle de bain", "Cuisine", "Bureau"],
    pairings: [
      { name: "Scandinave", colors: ["#C9C9C4", "#F4EFE6", "#B98A5A"] },
      { name: "Pop discrète", colors: ["#C9C9C4", "#CF9A3A", "#2F5446"] },
    ],
  },
  // Terres
  {
    id: "terracotta", name: "Terracotta", hex: "#C0603D", family: "terres", mood: "Chaleureux et solaire",
    description: "La couleur de la terre cuite apporte le soleil du Sud dans la maison. Sur un pan de mur ou en textiles, elle réchauffe instantanément une pièce.",
    rooms: ["Salon", "Salle à manger", "Entrée"],
    pairings: [
      { name: "Méditerranée", colors: ["#C0603D", "#F4EFE6", "#5C7088"] },
      { name: "Bohème", colors: ["#C0603D", "#CF9A3A", "#6F7A3B"] },
    ],
  },
  {
    id: "sable", name: "Sable", hex: "#D8C09A", family: "terres", mood: "Doux et ensoleillé",
    description: "Un beige doré qui évoque les dunes et les vacances. Plus vivant qu'un neutre classique, il réchauffe sans s'imposer.",
    rooms: ["Chambre", "Salon", "Salle de bain"],
    pairings: [
      { name: "Dunes", colors: ["#D8C09A", "#F4EFE6", "#B98A5A"] },
      { name: "Oasis", colors: ["#D8C09A", "#7F9C8E", "#C0603D"] },
    ],
  },
  {
    id: "camel", name: "Camel", hex: "#B98A5A", family: "terres", mood: "Cosy et rassurant",
    description: "La teinte du cuir patiné : elle apporte de la chaleur et un côté rétro très chic, idéale pour un fauteuil, un tapis ou un mur d'accent.",
    rooms: ["Salon", "Bureau", "Chambre"],
    pairings: [
      { name: "Vintage", colors: ["#B98A5A", "#2F5446", "#F4EFE6"] },
      { name: "Club anglais", colors: ["#B98A5A", "#6E2532", "#E2D3B8"] },
    ],
  },
  {
    id: "brique", name: "Brique", hex: "#9E4A32", family: "terres", mood: "Authentique et généreux",
    description: "Un rouge-brun profond qui rappelle les briques anciennes. Il donne du caractère et une vraie chaleur, surtout associé au bois.",
    rooms: ["Cuisine", "Salle à manger", "Bureau"],
    pairings: [
      { name: "Atelier", colors: ["#9E4A32", "#3A3A3A", "#E2D3B8"] },
      { name: "Automne", colors: ["#9E4A32", "#CF9A3A", "#6F7A3B"] },
    ],
  },
  // Verts
  {
    id: "sauge", name: "Vert sauge", hex: "#9AAB8C", family: "verts", mood: "Apaisant et naturel",
    description: "Un vert grisé tout en douceur, qui apaise et fait entrer la nature à l'intérieur. Une valeur sûre, facile à vivre dans toutes les pièces.",
    rooms: ["Chambre", "Cuisine", "Salle de bain"],
    pairings: [
      { name: "Jardin", colors: ["#9AAB8C", "#F4EFE6", "#B98A5A"] },
      { name: "Herbier", colors: ["#9AAB8C", "#E3B5A8", "#E2D3B8"] },
    ],
  },
  {
    id: "olive", name: "Vert olive", hex: "#6F7A3B", family: "verts", mood: "Chaleureux et terrien",
    description: "Le vert des oliviers, chaud et légèrement doré. Il réchauffe un intérieur tout en restant naturel, superbe avec le bois foncé et le lin.",
    rooms: ["Salon", "Cuisine", "Bureau"],
    pairings: [
      { name: "Provence", colors: ["#6F7A3B", "#E2D3B8", "#C0603D"] },
      { name: "Bois et feuillage", colors: ["#6F7A3B", "#5A3A28", "#F4EFE6"] },
    ],
  },
  {
    id: "eucalyptus", name: "Eucalyptus", hex: "#7F9C8E", family: "verts", mood: "Frais et serein",
    description: "Un vert bleuté qui respire la fraîcheur. Parfait pour une salle de bain façon spa ou une chambre où l'on veut se ressourcer.",
    rooms: ["Salle de bain", "Chambre"],
    pairings: [
      { name: "Spa", colors: ["#7F9C8E", "#F4EFE6", "#CBBFAE"] },
      { name: "Forêt douce", colors: ["#7F9C8E", "#2F5446", "#D8C09A"] },
    ],
  },
  {
    id: "vert-sapin", name: "Vert sapin", hex: "#2F5446", family: "verts", mood: "Profond et élégant",
    description: "Un vert sombre et enveloppant, qui donne une allure de bibliothèque ou de club. Sur un mur ou une cuisine, il crée un cocon raffiné.",
    rooms: ["Salon", "Bureau", "Cuisine"],
    pairings: [
      { name: "Bibliothèque", colors: ["#2F5446", "#B98A5A", "#F4EFE6"] },
      { name: "Velours", colors: ["#2F5446", "#E3B5A8", "#CF9A3A"] },
    ],
  },
  {
    id: "vert-amande", name: "Vert amande", hex: "#C5CFA6", family: "verts", mood: "Léger et rétro",
    description: "Un vert pastel tendre au charme vintage. Il apporte de la fraîcheur sans écraser, idéal en cuisine ou dans une chambre d'enfant.",
    rooms: ["Cuisine", "Chambre d'enfant", "Salle de bain"],
    pairings: [
      { name: "Années 50", colors: ["#C5CFA6", "#E3B5A8", "#F4EFE6"] },
      { name: "Verger", colors: ["#C5CFA6", "#CF9A3A", "#5A3A28"] },
    ],
  },
  // Bleus
  {
    id: "bleu-poudre", name: "Bleu poudré", hex: "#BFD0DC", family: "bleus", mood: "Aérien et paisible",
    description: "Un bleu ciel adouci de gris, qui ouvre l'espace et invite au calme. Une couleur douce pour bien dormir ou pour une salle de bain lumineuse.",
    rooms: ["Chambre", "Salle de bain", "Chambre d'enfant"],
    pairings: [
      { name: "Nuage", colors: ["#BFD0DC", "#F4EFE6", "#CBBFAE"] },
      { name: "Faïence", colors: ["#BFD0DC", "#1F2F45", "#E2D3B8"] },
    ],
  },
  {
    id: "bleu-ardoise", name: "Bleu ardoise", hex: "#5C7088", family: "bleus", mood: "Intemporel et apaisant",
    description: "Le bleu des toits de Paris : profond, légèrement grisé, d'une élégance intemporelle. Dans une chambre, il crée une atmosphère sereine qui traverse les modes.",
    rooms: ["Chambre", "Salon", "Bureau"],
    pairings: [
      { name: "Bord de mer", colors: ["#5C7088", "#F4EFE6", "#D8C09A"] },
      { name: "Parisien", colors: ["#5C7088", "#C08A8A", "#E2D3B8"] },
    ],
  },
  {
    id: "bleu-canard", name: "Bleu canard", hex: "#2C6470", family: "bleus", mood: "Audacieux et chic",
    description: "Entre bleu et vert, il a la profondeur des grands velours. Parfait pour un mur d'accent, un canapé ou une cuisine qui ose la couleur.",
    rooms: ["Salon", "Cuisine", "Salle à manger"],
    pairings: [
      { name: "Art déco", colors: ["#2C6470", "#CF9A3A", "#F4EFE6"] },
      { name: "Rétro chaleureux", colors: ["#2C6470", "#C0603D", "#E2D3B8"] },
    ],
  },
  {
    id: "bleu-nuit", name: "Bleu nuit", hex: "#1F2F45", family: "bleus", mood: "Profond et feutré",
    description: "Un bleu presque noir, plus doux que le noir lui-même. Il enveloppe une pièce et fait briller le laiton, le bois clair et le blanc.",
    rooms: ["Chambre", "Bureau", "Salon"],
    pairings: [
      { name: "Nuit étoilée", colors: ["#1F2F45", "#CF9A3A", "#F4EFE6"] },
      { name: "Marine", colors: ["#1F2F45", "#BFD0DC", "#B98A5A"] },
    ],
  },
  // Roses & rouges
  {
    id: "rose-poudre", name: "Rose poudré", hex: "#E3B5A8", family: "roses", mood: "Tendre et enveloppant",
    description: "Un rose adouci de beige, loin du rose bonbon. Il apporte de la chaleur et de la douceur, flatteur à la lumière du soir.",
    rooms: ["Chambre", "Salon", "Chambre d'enfant"],
    pairings: [
      { name: "Douceur", colors: ["#E3B5A8", "#F4EFE6", "#9AAB8C"] },
      { name: "Moderne", colors: ["#E3B5A8", "#3A3A3A", "#E2D3B8"] },
    ],
  },
  {
    id: "vieux-rose", name: "Vieux rose", hex: "#C08A8A", family: "roses", mood: "Romantique et vintage",
    description: "Un rose fané au charme d'antan, plus profond et plus mature que le rose poudré. Il se marie à merveille au bois et aux tissus anciens.",
    rooms: ["Chambre", "Salle à manger", "Salon"],
    pairings: [
      { name: "Boudoir", colors: ["#C08A8A", "#6E2532", "#E2D3B8"] },
      { name: "Charme ancien", colors: ["#C08A8A", "#7F9C8E", "#F4EFE6"] },
    ],
  },
  {
    id: "bordeaux", name: "Bordeaux", hex: "#6E2532", family: "roses", mood: "Riche et cosy",
    description: "Un rouge profond comme un grand vin, qui apporte de la richesse et une ambiance feutrée. Une touche suffit : coussin, abat-jour ou fauteuil.",
    rooms: ["Salon", "Salle à manger", "Bureau"],
    pairings: [
      { name: "Hiver douillet", colors: ["#6E2532", "#E2D3B8", "#B98A5A"] },
      { name: "Contraste vif", colors: ["#6E2532", "#E3B5A8", "#2F5446"] },
    ],
  },
  {
    id: "rouge-cerise", name: "Rouge cerise", hex: "#A32638", family: "roses", mood: "Joyeux et énergique",
    description: "Un rouge franc et gourmand qui réveille un intérieur neutre. À doser en accent, sur un objet ou un pied de lampe, pour un effet immédiat.",
    rooms: ["Cuisine", "Salon", "Entrée"],
    pairings: [
      { name: "Bistrot", colors: ["#A32638", "#F4EFE6", "#3A3A3A"] },
      { name: "Gaieté", colors: ["#A32638", "#BFD0DC", "#F1DFA4"] },
    ],
  },
  // Jaunes & ocres
  {
    id: "ocre", name: "Ocre", hex: "#CF9A3A", family: "jaunes", mood: "Solaire et vivant",
    description: "Un jaune terreux et chaud, plein de lumière. Il apporte une énergie douce, très beau en textiles ou sur un meuble peint.",
    rooms: ["Salon", "Cuisine", "Entrée"],
    pairings: [
      { name: "Soleil", colors: ["#CF9A3A", "#F4EFE6", "#5C7088"] },
      { name: "Épices", colors: ["#CF9A3A", "#9E4A32", "#5A3A28"] },
    ],
  },
  {
    id: "moutarde", name: "Moutarde", hex: "#C9A12E", family: "jaunes", mood: "Rétro et audacieux",
    description: "Le jaune des années 70, franc et plein de caractère. Sur un fauteuil en velours ou un coussin, il donne instantanément du peps.",
    rooms: ["Salon", "Bureau", "Chambre d'enfant"],
    pairings: [
      { name: "Seventies", colors: ["#C9A12E", "#2C6470", "#E2D3B8"] },
      { name: "Graphique", colors: ["#C9A12E", "#3A3A3A", "#F4EFE6"] },
    ],
  },
  {
    id: "jaune-beurre", name: "Jaune beurre", hex: "#F1DFA4", family: "jaunes", mood: "Doux et accueillant",
    description: "Un jaune pâle et crémeux, comme une lumière de fin de journée. Il égaye sans éblouir, parfait dans une cuisine ou une pièce peu lumineuse.",
    rooms: ["Cuisine", "Salle à manger", "Petits espaces"],
    pairings: [
      { name: "Petit-déjeuner", colors: ["#F1DFA4", "#F4EFE6", "#9AAB8C"] },
      { name: "Campagne anglaise", colors: ["#F1DFA4", "#5C7088", "#B98A5A"] },
    ],
  },
  // Profonds
  {
    id: "chocolat", name: "Chocolat", hex: "#5A3A28", family: "profonds", mood: "Gourmand et enveloppant",
    description: "Un brun riche qui remplace le noir avec plus de chaleur. Très tendance avec le retour du bois foncé, il donne une profondeur rassurante.",
    rooms: ["Salon", "Chambre", "Bureau"],
    pairings: [
      { name: "Café crème", colors: ["#5A3A28", "#E2D3B8", "#F4EFE6"] },
      { name: "Bois sombre", colors: ["#5A3A28", "#6F7A3B", "#CF9A3A"] },
    ],
  },
  {
    id: "anthracite", name: "Anthracite", hex: "#3A3A3A", family: "profonds", mood: "Moderne et graphique",
    description: "Un gris très foncé, plus doux qu'un noir pur. Il structure une pièce et fait ressortir les matières naturelles et les couleurs vives.",
    rooms: ["Cuisine", "Salle de bain", "Bureau"],
    pairings: [
      { name: "Loft", colors: ["#3A3A3A", "#B98A5A", "#F4EFE6"] },
      { name: "Contraste doux", colors: ["#3A3A3A", "#E3B5A8", "#CBBFAE"] },
    ],
  },
];

export const COLORS_BY_HEX: Record<string, DecorColor> = Object.fromEntries(DECOR_COLORS.map((c) => [c.hex.toLowerCase(), c]));
