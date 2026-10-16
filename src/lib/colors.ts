/*
 * Nuancier de l'outil de création : des teintes de décoration choisies, chacune
 * avec son ambiance, les pièces où elle excelle et des associations qui lui vont bien.
 */

export type ColorFamily = "neutres" | "terres" | "verts" | "bleus" | "roses" | "jaunes" | "violets" | "pastels" | "dopamine" | "profonds";

export const FAMILY_LABELS: Record<ColorFamily, string> = {
  neutres: "Neutres",
  terres: "Terres",
  verts: "Verts",
  bleus: "Bleus",
  roses: "Roses & rouges",
  jaunes: "Jaunes & ocres",
  violets: "Violets & mauves",
  pastels: "Pastels",
  dopamine: "Dopamine",
  profonds: "Profonds",
};

export interface DecorColor {
  id: string;
  name: string;
  hex: string;
  family: ColorFamily;
  /** Collections supplémentaires où la teinte apparaît aussi (ex. un bleu poudré parmi les pastels). */
  also?: ColorFamily[];
  /** Ambiance en quelques mots, pour l'étiquette de la fiche. */
  mood: string;
  description: string;
  rooms: string[];
  /** Associations : chacune est une petite palette qui inclut la couleur. */
  pairings: { name: string; colors: string[] }[];
}

const BASE_COLORS: DecorColor[] = [
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
    id: "vert-amande", name: "Vert amande", hex: "#C5CFA6", family: "verts", also: ["pastels"], mood: "Léger et rétro",
    description: "Un vert pastel tendre au charme vintage. Il apporte de la fraîcheur sans écraser, idéal en cuisine ou dans une chambre d'enfant.",
    rooms: ["Cuisine", "Chambre d'enfant", "Salle de bain"],
    pairings: [
      { name: "Années 50", colors: ["#C5CFA6", "#E3B5A8", "#F4EFE6"] },
      { name: "Verger", colors: ["#C5CFA6", "#CF9A3A", "#5A3A28"] },
    ],
  },
  // Bleus
  {
    id: "bleu-poudre", name: "Bleu poudré", hex: "#BFD0DC", family: "bleus", also: ["pastels"], mood: "Aérien et paisible",
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
    id: "rouge-cerise", name: "Rouge cerise", hex: "#A32638", family: "roses", also: ["dopamine"], mood: "Joyeux et énergique",
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
    id: "jaune-beurre", name: "Jaune beurre", hex: "#F1DFA4", family: "jaunes", also: ["pastels"], mood: "Doux et accueillant",
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

/** Teintes ajoutées au nuancier ; elles rejoignent leur famille à l'affichage. */
const MORE_COLORS: DecorColor[] = [
  {
    id: "mastic", name: "Mastic", hex: "#B5A88F", family: "neutres", mood: "Chaud et rassurant",
    description: "Un beige grisé, un peu plus profond que le lin, qui habille un salon d'une chaleur discrète. Il sert de liant entre les bois, les pierres et les tissus.",
    rooms: ["Salon", "Entrée", "Chambre"],
    pairings: [
      { name: "Maison de famille", colors: ["#B5A88F", "#F4EFE6", "#2F5446"] },
      { name: "Terre douce", colors: ["#B5A88F", "#C4927A", "#5A3A28"] },
    ],
  },
  {
    id: "gris-galet", name: "Gris galet", hex: "#9C978D", family: "neutres", mood: "Minéral et serein",
    description: "Le gris chaud des galets polis par la mer. Plus doux qu'un gris ciment, il apaise une pièce et laisse les matières naturelles s'exprimer.",
    rooms: ["Salle de bain", "Salon", "Bureau"],
    pairings: [
      { name: "Bord de rivière", colors: ["#9C978D", "#F4EFE6", "#7F9C8E"] },
      { name: "Atelier", colors: ["#9C978D", "#3A3A3A", "#B98A5A"] },
    ],
  },
  {
    id: "argile", name: "Argile", hex: "#C4927A", family: "terres", mood: "Doux et terrien",
    description: "Une terre rosée, entre le nude et la terracotta. Elle réchauffe un mur sans l'écraser et adore les lumières de fin de journée.",
    rooms: ["Chambre", "Salon", "Salle de bain"],
    pairings: [
      { name: "Désert", colors: ["#C4927A", "#E2D3B8", "#6F7A3B"] },
      { name: "Nude chic", colors: ["#C4927A", "#F4EFE6", "#3A3A3A"] },
    ],
  },
  {
    id: "rouille", name: "Rouille", hex: "#A5532A", family: "terres", mood: "Automnal et vibrant",
    description: "Un orange brûlé aux accents cuivrés, qui évoque les feuilles d'automne. En velours ou en coussins, il apporte une énergie chaleureuse.",
    rooms: ["Salon", "Bureau", "Salle à manger"],
    pairings: [
      { name: "Automne", colors: ["#A5532A", "#E2D3B8", "#2F5446"] },
      { name: "Seventies", colors: ["#A5532A", "#C9A12E", "#5A3A28"] },
    ],
  },
  {
    id: "vert-pistache", name: "Vert pistache", hex: "#B5C27A", family: "verts", mood: "Frais et gourmand",
    description: "Un vert tendre et acidulé qui donne un coup de fraîcheur immédiat. Idéal sur des chaises, une porte ou des façades de cuisine.",
    rooms: ["Cuisine", "Chambre d'enfant", "Salle à manger"],
    pairings: [
      { name: "Glacier italien", colors: ["#B5C27A", "#F2D3CB", "#F4EFE6"] },
      { name: "Potager", colors: ["#B5C27A", "#C0603D", "#E2D3B8"] },
    ],
  },
  {
    id: "vert-d-eau", name: "Vert d'eau", hex: "#B9D3C6", family: "verts", also: ["pastels"], mood: "Léger et rafraîchissant",
    description: "Une teinte entre bleu et vert, transparente comme une eau claire. Elle agrandit les petites pièces et apporte calme et fraîcheur.",
    rooms: ["Salle de bain", "Chambre", "Petits espaces"],
    pairings: [
      { name: "Spa", colors: ["#B9D3C6", "#F4EFE6", "#CBBFAE"] },
      { name: "Gustavien", colors: ["#B9D3C6", "#C9C9C4", "#C08A8A"] },
    ],
  },
  {
    id: "kaki", name: "Kaki", hex: "#7D7B52", family: "verts", mood: "Brut et élégant",
    description: "Un vert-brun sourd, d'inspiration militaire, devenu un grand classique déco. Il s'associe à merveille avec le cuir, le bois et le lin.",
    rooms: ["Salon", "Bureau", "Chambre"],
    pairings: [
      { name: "Safari", colors: ["#7D7B52", "#D8C09A", "#5A3A28"] },
      { name: "Kaki moderne", colors: ["#7D7B52", "#F4EFE6", "#E07A5F"] },
    ],
  },
  {
    id: "bleu-klein", name: "Bleu Klein", hex: "#2E4BA8", family: "bleus", also: ["dopamine"], mood: "Audacieux et artistique",
    description: "Un bleu outremer intense, hommage au peintre Yves Klein. En touche (une chaise, un vase, un cadre), il électrise un intérieur neutre.",
    rooms: ["Salon", "Bureau", "Entrée"],
    pairings: [
      { name: "Galerie d'art", colors: ["#2E4BA8", "#F4EFE6", "#1C1C1C"] },
      { name: "Méditerranée vive", colors: ["#2E4BA8", "#E8D25A", "#F4EFE6"] },
    ],
  },
  {
    id: "bleu-ciel", name: "Bleu ciel", hex: "#8FB8D8", family: "bleus", mood: "Aérien et joyeux",
    description: "Le bleu d'un ciel d'été, un peu plus franc que le bleu poudré. Il ouvre l'espace et apporte une gaieté naturelle.",
    rooms: ["Chambre d'enfant", "Salle de bain", "Chambre"],
    pairings: [
      { name: "Été", colors: ["#8FB8D8", "#F4EFE6", "#D9A55B"] },
      { name: "Vichy", colors: ["#8FB8D8", "#F2D3CB", "#C9C9C4"] },
    ],
  },
  {
    id: "corail", name: "Corail", hex: "#E07A5F", family: "roses", also: ["dopamine"], mood: "Solaire et énergique",
    description: "Entre le rose et l'orange, le corail respire la bonne humeur. Il réveille une pièce neutre et se marie aux verts comme aux bleus profonds.",
    rooms: ["Salon", "Cuisine", "Salle à manger"],
    pairings: [
      { name: "Tropiques", colors: ["#E07A5F", "#2F5446", "#F4EFE6"] },
      { name: "Riviera", colors: ["#E07A5F", "#1F2F45", "#E2D3B8"] },
    ],
  },
  {
    id: "framboise", name: "Framboise", hex: "#B4405F", family: "roses", also: ["dopamine"], mood: "Pétillant et affirmé",
    description: "Un rose profond et fruité, qui ose sans en faire trop. En velours ou en accent, il donne du caractère à un salon ou une chambre.",
    rooms: ["Salon", "Chambre", "Bureau"],
    pairings: [
      { name: "Maximaliste", colors: ["#B4405F", "#2C6470", "#CF9A3A"] },
      { name: "Boudoir", colors: ["#B4405F", "#F2D3CB", "#5A3A28"] },
    ],
  },
  {
    id: "rose-blush", name: "Rose blush", hex: "#F2D3CB", family: "roses", also: ["pastels"], mood: "Tendre et lumineux",
    description: "Un rose à peine teinté, presque un blanc rosé. Il adoucit la lumière et donne une atmosphère enveloppante sans jamais être mièvre.",
    rooms: ["Chambre", "Salle de bain", "Petits espaces"],
    pairings: [
      { name: "Douceur", colors: ["#F2D3CB", "#F4EFE6", "#9AAB8C"] },
      { name: "Contraste tendre", colors: ["#F2D3CB", "#6E2532", "#CBBFAE"] },
    ],
  },
  {
    id: "jaune-citron", name: "Jaune citron", hex: "#E8D25A", family: "jaunes", also: ["dopamine"], mood: "Vitaminé et pop",
    description: "Un jaune franc et lumineux qui apporte un rayon de soleil instantané. À doser par petites touches : une lampe, une chaise, un coussin.",
    rooms: ["Cuisine", "Bureau", "Chambre d'enfant"],
    pairings: [
      { name: "Pop", colors: ["#E8D25A", "#2E4BA8", "#F4EFE6"] },
      { name: "Citronnier", colors: ["#E8D25A", "#7F9C8E", "#F4EFE6"] },
    ],
  },
  {
    id: "miel", name: "Miel", hex: "#D9A55B", family: "jaunes", mood: "Doré et chaleureux",
    description: "Un jaune ambré, doux comme le miel de lavande. Il réchauffe une pièce et sublime les bois clairs et les fibres naturelles.",
    rooms: ["Salon", "Salle à manger", "Chambre"],
    pairings: [
      { name: "Ruche", colors: ["#D9A55B", "#F4EFE6", "#5A3A28"] },
      { name: "Provence", colors: ["#D9A55B", "#B8A9C9", "#6F7A3B"] },
    ],
  },
  {
    id: "lavande", name: "Lavande", hex: "#B8A9C9", family: "violets", also: ["pastels"], mood: "Rêveur et apaisant",
    description: "Le mauve des champs de Provence, poudré et lumineux. Il apaise une chambre et apporte une touche de poésie inattendue.",
    rooms: ["Chambre", "Salle de bain", "Chambre d'enfant"],
    pairings: [
      { name: "Champ de lavande", colors: ["#B8A9C9", "#F4EFE6", "#9AAB8C"] },
      { name: "Pastel moderne", colors: ["#B8A9C9", "#F1DFA4", "#C9C9C4"] },
    ],
  },
  {
    id: "lilas", name: "Lilas", hex: "#CDB9D6", family: "violets", also: ["pastels"], mood: "Frais et romantique",
    description: "Un violet très clair au parfum printanier. Associé au blanc et au bois, il garde une fraîcheur délicate, loin de l'effet bonbon.",
    rooms: ["Chambre", "Salle de bain", "Petits espaces"],
    pairings: [
      { name: "Printemps", colors: ["#CDB9D6", "#F4EFE6", "#B5C27A"] },
      { name: "Néo-rétro", colors: ["#CDB9D6", "#A5532A", "#E2D3B8"] },
    ],
  },
  {
    id: "mauve", name: "Mauve", hex: "#9C7A97", family: "violets", mood: "Feutré et sophistiqué",
    description: "Un violet grisé, élégant et un brin mélancolique. Il apporte de la profondeur sans assombrir, parfait pour un salon cosy.",
    rooms: ["Salon", "Chambre", "Bureau"],
    pairings: [
      { name: "Crépuscule", colors: ["#9C7A97", "#E3B5A8", "#1F2F45"] },
      { name: "Bruyère", colors: ["#9C7A97", "#7D7B52", "#F4EFE6"] },
    ],
  },
  {
    id: "prune", name: "Prune", hex: "#5E2F4A", family: "violets", mood: "Intense et luxueux",
    description: "Un violet profond aux reflets de vin. Sur un mur sombre ou un canapé en velours, il crée une ambiance théâtrale et enveloppante.",
    rooms: ["Salon", "Salle à manger", "Bureau"],
    pairings: [
      { name: "Cabinet de curiosités", colors: ["#5E2F4A", "#C9A12E", "#F4EFE6"] },
      { name: "Velours du soir", colors: ["#5E2F4A", "#E3B5A8", "#2F5446"] },
    ],
  },
  {
    id: "noir", name: "Noir", hex: "#1C1C1C", family: "profonds", mood: "Chic et radical",
    description: "Le noir structure, souligne et donne de l'élégance. En petites touches (cadres, luminaires, pieds de meubles), il ancre toute la décoration.",
    rooms: ["Cuisine", "Entrée", "Salle de bain"],
    pairings: [
      { name: "Noir et blanc", colors: ["#1C1C1C", "#F4EFE6", "#CBBFAE"] },
      { name: "Japandi sombre", colors: ["#1C1C1C", "#B98A5A", "#7D7B52"] },
    ],
  },
  {
    id: "bronze", name: "Bronze", hex: "#6B5532", family: "profonds", mood: "Ambré et patiné",
    description: "Un brun doré, comme un métal ancien patiné. Il donne une richesse discrète et s'associe naturellement au laiton et au velours.",
    rooms: ["Salon", "Bureau", "Salle à manger"],
    pairings: [
      { name: "Patine", colors: ["#6B5532", "#E2D3B8", "#2C6470"] },
      { name: "Cuivré", colors: ["#6B5532", "#A5532A", "#F4EFE6"] },
    ],
  },
  // Pastels
  {
    id: "peche", name: "Pêche", hex: "#F5C9A8", family: "pastels", mood: "Velouté et solaire",
    description: "Un orangé tout en douceur, comme la peau d'une pêche mûre. Il réchauffe une pièce avec tendresse et flatte toutes les carnations.",
    rooms: ["Chambre", "Salon", "Salle de bain"],
    pairings: [
      { name: "Sorbet", colors: ["#F5C9A8", "#C3E6D2", "#F4EFE6"] },
      { name: "Pêche & sauge", colors: ["#F5C9A8", "#9AAB8C", "#E2D3B8"] },
    ],
  },
  {
    id: "menthe", name: "Menthe", hex: "#C3E6D2", family: "pastels", mood: "Frais et pétillant",
    description: "Un vert menthe glacée, plus vif que le vert d'eau. Il rafraîchit instantanément une cuisine ou une salle de bain et adore les touches de rose.",
    rooms: ["Cuisine", "Salle de bain", "Chambre d'enfant"],
    pairings: [
      { name: "Glace menthe-fraise", colors: ["#C3E6D2", "#F6C6D4", "#F4EFE6"] },
      { name: "Diner rétro", colors: ["#C3E6D2", "#F0412A", "#F4EFE6"] },
    ],
  },
  {
    id: "bleu-pastel", name: "Bleu pastel", hex: "#CFE3F3", family: "pastels", mood: "Doux et cotonneux",
    description: "Un bleu laiteux, léger comme un nuage. Il apaise et agrandit l'espace, idéal pour une chambre ou une salle de bain lumineuse.",
    rooms: ["Chambre", "Chambre d'enfant", "Salle de bain"],
    pairings: [
      { name: "Nuage", colors: ["#CFE3F3", "#F4EFE6", "#F6EE9E"] },
      { name: "Pastel graphique", colors: ["#CFE3F3", "#D9C6E8", "#1C1C1C"] },
    ],
  },
  {
    id: "rose-dragee", name: "Rose dragée", hex: "#F6C6D4", family: "pastels", mood: "Gourmand et joyeux",
    description: "Le rose des confiseries d'antan, frais et assumé. Associé à du vert ou du rouge, il devient résolument moderne.",
    rooms: ["Chambre", "Chambre d'enfant", "Salle de bain"],
    pairings: [
      { name: "Pâtisserie", colors: ["#F6C6D4", "#DCE9B5", "#F4EFE6"] },
      { name: "Rose & rouge", colors: ["#F6C6D4", "#A32638", "#F4EFE6"] },
    ],
  },
  {
    id: "citron-pastel", name: "Citron pastel", hex: "#F6EE9E", family: "pastels", mood: "Lumineux et tendre",
    description: "Un jaune acidulé adouci, comme un sorbet citron. Il apporte de la lumière aux pièces orientées au nord sans jamais agresser.",
    rooms: ["Cuisine", "Entrée", "Petits espaces"],
    pairings: [
      { name: "Limonade", colors: ["#F6EE9E", "#CFE3F3", "#F4EFE6"] },
      { name: "Jardin d'été", colors: ["#F6EE9E", "#7F9C8E", "#F2D3CB"] },
    ],
  },
  {
    id: "parme", name: "Parme", hex: "#D9C6E8", family: "pastels", mood: "Poétique et délicat",
    description: "Un violet pâle aux reflets bleutés, nommé d'après la violette de Parme. Il donne une touche rêveuse, très jolie avec le jaune et le vert.",
    rooms: ["Chambre", "Salle de bain", "Bureau"],
    pairings: [
      { name: "Violette", colors: ["#D9C6E8", "#DCE9B5", "#F4EFE6"] },
      { name: "Parme & ocre", colors: ["#D9C6E8", "#CF9A3A", "#CBBFAE"] },
    ],
  },
  {
    id: "pistache-pastel", name: "Pistache pastel", hex: "#DCE9B5", family: "pastels", mood: "Tendre et printanier",
    description: "Un vert anis très doux, qui évoque les jeunes pousses. Il égaye sans dominer et s'entend avec tous les autres pastels.",
    rooms: ["Cuisine", "Chambre d'enfant", "Salle à manger"],
    pairings: [
      { name: "Macaron", colors: ["#DCE9B5", "#F6C6D4", "#F5C9A8"] },
      { name: "Printemps doux", colors: ["#DCE9B5", "#F4EFE6", "#B98A5A"] },
    ],
  },
  // Dopamine
  {
    id: "fuchsia", name: "Rose fuchsia", hex: "#E0218A", family: "dopamine", mood: "Électrisant et audacieux",
    description: "Le rose qui ose tout : vibrant, joyeux, impossible à ignorer. En fauteuil, en vase ou en pan de mur, c'est la signature du décor dopamine.",
    rooms: ["Salon", "Bureau", "Entrée"],
    pairings: [
      { name: "Fuchsia & orange", colors: ["#E0218A", "#FF7A1A", "#F4EFE6"] },
      { name: "Électrique", colors: ["#E0218A", "#1E90FF", "#FFC72C"] },
    ],
  },
  {
    id: "orange-vitamine", name: "Orange vitaminé", hex: "#FF7A1A", family: "dopamine", mood: "Énergique et solaire",
    description: "Un orange franc qui fait l'effet d'un jus pressé au réveil. Il stimule, réchauffe et met de bonne humeur dès qu'on entre dans la pièce.",
    rooms: ["Cuisine", "Salle à manger", "Bureau"],
    pairings: [
      { name: "Agrumes", colors: ["#FF7A1A", "#FFC72C", "#F4EFE6"] },
      { name: "Contraste vitaminé", colors: ["#FF7A1A", "#1FB5AC", "#F6C6D4"] },
    ],
  },
  {
    id: "jaune-soleil", name: "Jaune soleil", hex: "#FFC72C", family: "dopamine", mood: "Rayonnant et optimiste",
    description: "Un jaune éclatant, comme un soleil de midi. Il illumine une entrée ou une cuisine et appelle les associations les plus joyeuses.",
    rooms: ["Cuisine", "Entrée", "Chambre d'enfant"],
    pairings: [
      { name: "Bauhaus", colors: ["#FFC72C", "#1E90FF", "#F0412A"] },
      { name: "Tournesol", colors: ["#FFC72C", "#6CC24A", "#F4EFE6"] },
    ],
  },
  {
    id: "vert-pomme", name: "Vert pomme", hex: "#6CC24A", family: "dopamine", mood: "Pétillant et naturel",
    description: "Un vert acidulé et plein de vitalité, qui fait entrer le printemps toute l'année. Il dynamise une cuisine ou un coin bureau.",
    rooms: ["Cuisine", "Bureau", "Chambre d'enfant"],
    pairings: [
      { name: "Fraise-pomme", colors: ["#6CC24A", "#FF8FC7", "#F4EFE6"] },
      { name: "Jungle pop", colors: ["#6CC24A", "#FFC72C", "#2F5446"] },
    ],
  },
  {
    id: "turquoise", name: "Turquoise", hex: "#1FB5AC", family: "dopamine", mood: "Lagon et évasion",
    description: "Le bleu-vert des lagons, éclatant et rafraîchissant. Il évoque les vacances et se marie divinement à l'orange et au rose.",
    rooms: ["Salle de bain", "Salon", "Cuisine"],
    pairings: [
      { name: "Lagon", colors: ["#1FB5AC", "#F4EFE6", "#D9A55B"] },
      { name: "Miami", colors: ["#1FB5AC", "#FF8FC7", "#FFC72C"] },
    ],
  },
  {
    id: "bleu-electrique", name: "Bleu électrique", hex: "#1E90FF", family: "dopamine", mood: "Vif et graphique",
    description: "Un bleu lumineux, presque fluo, qui donne un coup de jeune immédiat. Parfait sur un meuble laqué ou une étagère, avec du blanc franc.",
    rooms: ["Bureau", "Chambre d'enfant", "Salon"],
    pairings: [
      { name: "Bleu & rouge", colors: ["#1E90FF", "#F0412A", "#F4EFE6"] },
      { name: "Néon doux", colors: ["#1E90FF", "#FF8FC7", "#F6EE9E"] },
    ],
  },
  {
    id: "violet-electrique", name: "Violet électrique", hex: "#8A3FFC", family: "dopamine", mood: "Créatif et futuriste",
    description: "Un violet intense et lumineux, entre rêve et science-fiction. En touche, il donne une énergie créative unique à un bureau ou une chambre d'ado.",
    rooms: ["Bureau", "Chambre", "Salon"],
    pairings: [
      { name: "Néon", colors: ["#8A3FFC", "#FF7A1A", "#F4EFE6"] },
      { name: "Galaxie", colors: ["#8A3FFC", "#1FB5AC", "#1C1C1C"] },
    ],
  },
  {
    id: "rose-bonbon", name: "Rose bonbon", hex: "#FF8FC7", family: "dopamine", mood: "Ludique et pop",
    description: "Un rose sucré et lumineux, régressif dans le meilleur sens du terme. Il apporte une légèreté joyeuse, surtout en contraste avec le vert ou le rouge.",
    rooms: ["Chambre", "Chambre d'enfant", "Salle de bain"],
    pairings: [
      { name: "Barbiecore", colors: ["#FF8FC7", "#E0218A", "#F4EFE6"] },
      { name: "Bonbon acidulé", colors: ["#FF8FC7", "#6CC24A", "#FFC72C"] },
    ],
  },
  {
    id: "rouge-tomate", name: "Rouge tomate", hex: "#F0412A", family: "dopamine", mood: "Vif et gourmand",
    description: "Un rouge orangé éclatant, plus pop que le rouge cerise. Une lampe, une chaise ou un buffet de cette couleur suffisent à donner du peps.",
    rooms: ["Cuisine", "Salle à manger", "Entrée"],
    pairings: [
      { name: "Trattoria", colors: ["#F0412A", "#F4EFE6", "#2F5446"] },
      { name: "Rouge & rose", colors: ["#F0412A", "#F6C6D4", "#FFC72C"] },
    ],
  },
];

const FAMILY_ORDER = Object.keys(FAMILY_LABELS) as ColorFamily[];
export const DECOR_COLORS: DecorColor[] = [...BASE_COLORS, ...MORE_COLORS].sort(
  (a, b) => FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family),
);

export const COLORS_BY_HEX: Record<string, DecorColor> = Object.fromEntries(DECOR_COLORS.map((c) => [c.hex.toLowerCase(), c]));
