/*
 * Matériauthèque de l'outil de création : les matières qui font une ambiance, chacune
 * avec son caractère, les pièces où elle excelle, un conseil pratique et des
 * associations (autres matières et couleurs) qui lui vont bien.
 */

export type MaterialFamily = "bois" | "fibres" | "textiles" | "mineraux" | "metaux" | "verre";

export const MATERIAL_FAMILY_LABELS: Record<MaterialFamily, string> = {
  bois: "Bois",
  fibres: "Fibres naturelles",
  textiles: "Textiles",
  mineraux: "Pierre & minéral",
  metaux: "Métaux",
  verre: "Verre & céramique",
};

export interface DecorMaterial {
  id: string;
  name: string;
  family: MaterialFamily;
  /** Caractère en quelques mots, pour l'étiquette de la fiche. */
  mood: string;
  description: string;
  rooms: string[];
  /** Conseil pratique : entretien, budget, alternative abordable… */
  tip: string;
  /** Échantillon dessiné en CSS (fond), pour évoquer la texture sans image. */
  swatch: string;
  /** Associations : d'autres matières (identifiants) et des couleurs qui l'accompagnent. */
  pairings: { name: string; materials: string[]; colors: string[] }[];
}

export const DECOR_MATERIALS: DecorMaterial[] = [
  // Bois
  {
    id: "chene-clair", name: "Chêne clair", family: "bois", mood: "Lumineux et intemporel",
    description: "Le bois blond par excellence : son veinage discret réchauffe une pièce sans l'alourdir. Il traverse les styles, du scandinave au japandi.",
    rooms: ["Salon", "Chambre", "Salle à manger"],
    tip: "Le placage chêne offre le même rendu pour une fraction du prix du massif.",
    swatch: "repeating-linear-gradient(97deg, #dcbf93 0 7px, #cfa877 7px 9px, #e2c89f 9px 16px, #d4b083 16px 18px)",
    pairings: [
      { name: "Japandi", materials: ["lin", "gres-emaille", "papier"], colors: ["#F4EFE6", "#CBBFAE", "#3A3A3A"] },
      { name: "Scandinave doux", materials: ["laine", "metal-noir"], colors: ["#F4EFE6", "#9AAB8C", "#C9C9C4"] },
    ],
  },
  {
    id: "noyer", name: "Noyer", family: "bois", mood: "Profond et feutré",
    description: "Un bois brun aux reflets chauds, emblème du mobilier vintage des années 60. Il donne immédiatement de la profondeur et un air de maison habitée.",
    rooms: ["Salon", "Bureau", "Chambre"],
    tip: "Chinez-le en seconde main : les buffets d'époque sont souvent moins chers que le neuf.",
    swatch: "repeating-linear-gradient(94deg, #6b4a32 0 6px, #5a3c28 6px 8px, #7a5538 8px 15px, #4e3322 15px 17px)",
    pairings: [
      { name: "Mid-century", materials: ["velours", "laiton", "cannage"], colors: ["#C9A12E", "#2C6470", "#F4EFE6"] },
      { name: "Bibliothèque anglaise", materials: ["cuir", "laine"], colors: ["#6E2532", "#2F5446", "#D8C09A"] },
    ],
  },
  {
    id: "bois-brut", name: "Bois brut", family: "bois", mood: "Authentique et rustique",
    description: "Des planches marquées par le temps, nœuds et fissures compris. Il raconte une histoire et apporte une chaleur sans apprêt.",
    rooms: ["Cuisine", "Salle à manger", "Entrée"],
    tip: "Le bois de récupération est écologique ; une huile mate suffit à le protéger.",
    swatch: "radial-gradient(ellipse 6px 4px at 30% 40%, #5e4632 0 60%, transparent 70%), repeating-linear-gradient(92deg, #a08466 0 5px, #8e735a 5px 7px, #ab8f70 7px 13px)",
    pairings: [
      { name: "Ferme moderne", materials: ["lin", "metal-noir", "terre-cuite"], colors: ["#F4EFE6", "#7F9C8E", "#3A3A3A"] },
      { name: "Chalet", materials: ["laine", "cuir"], colors: ["#9E4A32", "#E2D3B8", "#2F5446"] },
    ],
  },
  // Fibres naturelles
  {
    id: "rotin", name: "Rotin", family: "fibres", mood: "Bohème et solaire",
    description: "Fibre souple tressée en courbes généreuses, le rotin évoque les vacances et les vérandas. Il allège visuellement le mobilier grâce à ses jours.",
    rooms: ["Salon", "Véranda", "Chambre"],
    tip: "Évitez le plein soleil prolongé, qui le dessèche ; un chiffon humide suffit à l'entretenir.",
    swatch: "repeating-linear-gradient(45deg, #c9a46a 0 3px, #b08850 3px 5px), repeating-linear-gradient(-45deg, rgba(120,85,45,.35) 0 2px, transparent 2px 5px)",
    pairings: [
      { name: "Riviera", materials: ["lin", "terre-cuite"], colors: ["#F4EFE6", "#C0603D", "#5C7088"] },
      { name: "Jungle douce", materials: ["jute", "bouclette"], colors: ["#2F5446", "#E2D3B8", "#CF9A3A"] },
    ],
  },
  {
    id: "cannage", name: "Cannage", family: "fibres", mood: "Raffiné et léger",
    description: "Le motif ajouré des chaises bistrot, revenu en grâce sur les buffets et les têtes de lit. Il apporte de la légèreté et un charme artisanal.",
    rooms: ["Chambre", "Salle à manger", "Salon"],
    tip: "On trouve du cannage au mètre pour relooker soi-même une façade de meuble.",
    swatch: "radial-gradient(circle, #f4efe6 0 2.5px, transparent 3px) 0 0/10px 10px, repeating-linear-gradient(0deg, #c79f63 0 2px, transparent 2px 5px), repeating-linear-gradient(90deg, #c79f63 0 2px, transparent 2px 5px), repeating-linear-gradient(45deg, #b48b52 0 1.5px, #e8d6b4 1.5px 5px)",
    pairings: [
      { name: "Parisien", materials: ["noyer", "marbre", "laiton"], colors: ["#F4EFE6", "#1F2F45", "#C08A8A"] },
      { name: "Maison de vacances", materials: ["chene-clair", "lin"], colors: ["#BFD0DC", "#F4EFE6", "#D8C09A"] },
    ],
  },
  {
    id: "jute", name: "Jute", family: "fibres", mood: "Brut et chaleureux",
    description: "Fibre robuste au tressage épais, surtout utilisée en tapis. Elle ancre une pièce et apporte une texture terrienne très apaisante.",
    rooms: ["Salon", "Entrée", "Chambre"],
    tip: "Un tapis en jute est l'une des pièces les plus abordables pour réchauffer un sol.",
    swatch: "repeating-linear-gradient(0deg, #b8995f 0 2px, #a3844e 2px 4px), repeating-linear-gradient(90deg, rgba(90,65,30,.25) 0 2px, transparent 2px 4px)",
    pairings: [
      { name: "Wabi-sabi", materials: ["lin", "gres-emaille", "beton-cire"], colors: ["#CBBFAE", "#F4EFE6", "#5A3A28"] },
      { name: "Bohème", materials: ["rotin", "laine"], colors: ["#C0603D", "#CF9A3A", "#F4EFE6"] },
    ],
  },
  {
    id: "liege", name: "Liège", family: "fibres", mood: "Doux et chaleureux",
    description: "Léger, isolant et agréable au toucher, le liège revient en tables d'appoint, en luminaires et en murs. Une matière douce, très années 70.",
    rooms: ["Bureau", "Chambre d'enfant", "Salon"],
    tip: "Matériau renouvelable : l'écorce se récolte sans abattre l'arbre.",
    swatch: "radial-gradient(circle at 20% 30%, #8a5f3a 0 1.5px, transparent 2px) 0 0/9px 9px, radial-gradient(circle at 70% 60%, #c99a6a 0 2px, transparent 2.5px) 0 0/11px 11px, #b17f52",
    pairings: [
      { name: "Seventies", materials: ["bouclette", "verre-cannele"], colors: ["#C9A12E", "#9E4A32", "#F1DFA4"] },
      { name: "Atelier", materials: ["chene-clair", "metal-noir"], colors: ["#F4EFE6", "#6F7A3B", "#3A3A3A"] },
    ],
  },
  // Textiles
  {
    id: "lin", name: "Lin", family: "textiles", mood: "Naturel et décontracté",
    description: "Froissé avec élégance, le lin respire et s'adoucit à chaque lavage. Il donne aux rideaux, aux housses et aux draps une nonchalance chic.",
    rooms: ["Chambre", "Salon", "Salle à manger"],
    tip: "Le lin lavé n'a pas besoin d'être repassé : son froissé fait tout son charme.",
    swatch: "repeating-linear-gradient(0deg, rgba(150,130,100,.25) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(150,130,100,.2) 0 1px, transparent 1px 3px), #e4d6bd",
    pairings: [
      { name: "Bord de mer", materials: ["chene-clair", "rotin"], colors: ["#F4EFE6", "#5C7088", "#BFD0DC"] },
      { name: "Campagne", materials: ["bois-brut", "terre-cuite"], colors: ["#7F9C8E", "#E2D3B8", "#9E4A32"] },
    ],
  },
  {
    id: "velours", name: "Velours", family: "textiles", mood: "Enveloppant et glamour",
    description: "Sa surface qui accroche la lumière rend chaque couleur plus intense. Sur un canapé ou des coussins, le velours apporte un luxe immédiat.",
    rooms: ["Salon", "Chambre", "Bureau"],
    tip: "Préférez un velours côtelé ou un velours « performance », plus résistant aux taches.",
    swatch: "linear-gradient(135deg, #2f5446 0%, #3f6b5a 35%, #24443a 60%, #3a6252 100%)",
    pairings: [
      { name: "Art déco", materials: ["laiton", "marbre"], colors: ["#2F5446", "#C9A12E", "#F4EFE6"] },
      { name: "Boudoir", materials: ["noyer", "verre-cannele"], colors: ["#C08A8A", "#6E2532", "#E3B5A8"] },
    ],
  },
  {
    id: "bouclette", name: "Bouclette", family: "textiles", mood: "Cocooning et moderne",
    description: "Ce tissu bouclé, doux comme une peau de mouton, habille fauteuils et banquettes arrondis. Il invite au repos et adoucit les lignes.",
    rooms: ["Salon", "Chambre"],
    tip: "Brossez-la régulièrement et protégez-la des griffes : les boucles s'accrochent facilement.",
    swatch: "radial-gradient(circle, #fbf8f2 0 2px, #e9e2d6 2.5px, transparent 3.5px) 0 0/7px 7px, radial-gradient(circle, #f6f1e8 0 2px, transparent 3px) 3.5px 3.5px/7px 7px, #ece5d9",
    pairings: [
      { name: "Nuage", materials: ["travertin", "chene-clair"], colors: ["#F4EFE6", "#CBBFAE", "#D8C09A"] },
      { name: "Dopamine", materials: ["terrazzo", "velours", "chrome", "bouclette"], colors: ["#E0218A", "#FF7A1A", "#FFC72C", "#1FB5AC"] },
  { name: "Douceur pastel", materials: ["bouclette", "cannage", "chene-clair", "verre-cannele"], colors: ["#F6C6D4", "#C3E6D2", "#CFE3F3", "#F5C9A8"] },
  { name: "Néo-seventies", materials: ["liege", "chrome"], colors: ["#B98A5A", "#F1DFA4", "#5A3A28"] },
    ],
  },
  {
    id: "laine", name: "Laine", family: "textiles", mood: "Chaud et douillet",
    description: "Grosses mailles, plaids tissés ou tapis berbères : la laine apporte chaleur réelle et visuelle. La matière de l'hiver, à l'honneur toute l'année.",
    rooms: ["Salon", "Chambre"],
    tip: "Un plaid en laine recyclée réchauffe un canapé pour un petit budget.",
    swatch: "repeating-linear-gradient(60deg, #d9cbb5 0 3px, #cbbba2 3px 5px), repeating-linear-gradient(-60deg, rgba(160,140,110,.35) 0 3px, transparent 3px 6px)",
    pairings: [
      { name: "Hygge", materials: ["chene-clair", "gres-emaille"], colors: ["#F4EFE6", "#C9C9C4", "#B98A5A"] },
      { name: "Refuge", materials: ["bois-brut", "cuir"], colors: ["#9E4A32", "#2F5446", "#E2D3B8"] },
    ],
  },
  {
    id: "cuir", name: "Cuir", family: "textiles", mood: "Patiné et caractériel",
    description: "Le cuir se bonifie avec le temps et prend une patine unique. Un fauteuil club ou des poignées en cuir suffisent à donner du caractère.",
    rooms: ["Salon", "Bureau", "Entrée"],
    tip: "Le cuir végétal ou le cuir recyclé sont de bonnes alternatives ; nourrissez-le une à deux fois par an.",
    swatch: "radial-gradient(ellipse at 30% 25%, rgba(255,220,180,.35), transparent 55%), linear-gradient(160deg, #a5623a, #7c4325)",
    pairings: [
      { name: "Club", materials: ["noyer", "laiton"], colors: ["#2F5446", "#6E2532", "#D8C09A"] },
      { name: "Industriel chaleureux", materials: ["metal-noir", "beton-cire"], colors: ["#3A3A3A", "#C9C9C4", "#B98A5A"] },
    ],
  },
  // Pierre & minéral
  {
    id: "marbre", name: "Marbre", family: "mineraux", mood: "Noble et lumineux",
    description: "Ses veines uniques font de chaque pièce un objet précieux. En plateau de table, en tablette ou en simple bougeoir, il apporte une touche d'élégance.",
    rooms: ["Cuisine", "Salle de bain", "Salon"],
    tip: "Le marbre craint les acides (citron, vinaigre) : préférez-le pour les objets et les tables d'appoint.",
    swatch: "linear-gradient(120deg, transparent 40%, rgba(150,150,150,.45) 42%, transparent 44%), linear-gradient(60deg, transparent 62%, rgba(170,165,160,.4) 63%, transparent 65%), linear-gradient(135deg, #f7f5f1, #e7e3dc)",
    pairings: [
      { name: "Haussmannien", materials: ["laiton", "cannage", "noyer"], colors: ["#F4EFE6", "#1F2F45", "#C9C9C4"] },
      { name: "Glamour", materials: ["velours", "chrome"], colors: ["#E3B5A8", "#2F5446", "#F4EFE6"] },
    ],
  },
  {
    id: "travertin", name: "Travertin", family: "mineraux", mood: "Solaire et sculptural",
    description: "Pierre crème creusée de petites alvéoles, très prisée pour les tables basses et les lampes. Elle a la douceur des maisons méditerranéennes.",
    rooms: ["Salon", "Salle de bain", "Entrée"],
    tip: "Un travertin « rebouché » est plus facile à entretenir que la version brute.",
    swatch: "repeating-linear-gradient(2deg, #e5d4b8 0 5px, #dcc7a6 5px 6px, #eadcc4 6px 11px), radial-gradient(ellipse 4px 2px at 40% 50%, #c4ab85 0 60%, transparent 70%)",
    pairings: [
      { name: "Méditerranée", materials: ["lin", "terre-cuite", "rotin"], colors: ["#F4EFE6", "#C0603D", "#6F7A3B"] },
      { name: "Sculptural", materials: ["bouclette", "chene-clair"], colors: ["#CBBFAE", "#D8C09A", "#5A3A28"] },
    ],
  },
  {
    id: "terrazzo", name: "Terrazzo", family: "mineraux", mood: "Joyeux et graphique",
    description: "Éclats de marbre pris dans un liant, le terrazzo mêle les couleurs avec fantaisie. Au sol ou en objet, il donne du peps sans fausse note.",
    rooms: ["Salle de bain", "Cuisine", "Entrée"],
    tip: "Les carreaux effet terrazzo en grès cérame imitent très bien l'original, pour moins cher.",
    swatch: "radial-gradient(circle at 20% 30%, #c0603d 0 3px, transparent 3.5px), radial-gradient(circle at 70% 20%, #5c7088 0 2.5px, transparent 3px), radial-gradient(circle at 55% 70%, #9aab8c 0 3.5px, transparent 4px), radial-gradient(circle at 85% 80%, #3a3a3a 0 2px, transparent 2.5px), radial-gradient(circle at 30% 80%, #d8c09a 0 2.5px, transparent 3px), #efe9df",
    pairings: [
      { name: "Pop italienne", materials: ["chrome", "chene-clair"], colors: ["#C0603D", "#BFD0DC", "#F4EFE6"] },
      { name: "Graphique", materials: ["metal-noir", "verre-cannele"], colors: ["#3A3A3A", "#9AAB8C", "#F4EFE6"] },
    ],
  },
  {
    id: "beton-cire", name: "Béton ciré", family: "mineraux", mood: "Brut et contemporain",
    description: "Une surface minérale continue, aux nuances nuageuses. Il structure l'espace avec sobriété et se réchauffe au contact du bois et des textiles.",
    rooms: ["Salle de bain", "Cuisine", "Salon"],
    tip: "Les enduits effet béton s'appliquent sur un carrelage existant, sans travaux lourds.",
    swatch: "radial-gradient(ellipse at 25% 30%, rgba(255,255,255,.35), transparent 50%), radial-gradient(ellipse at 75% 70%, rgba(80,80,80,.2), transparent 55%), #a9a6a0",
    pairings: [
      { name: "Loft", materials: ["metal-noir", "cuir", "bois-brut"], colors: ["#3A3A3A", "#B98A5A", "#C9C9C4"] },
      { name: "Minimal doux", materials: ["lin", "chene-clair"], colors: ["#F4EFE6", "#CBBFAE", "#7F9C8E"] },
    ],
  },
  {
    id: "terre-cuite", name: "Terre cuite", family: "mineraux", mood: "Chaleureux et provençal",
    description: "Tomettes, pots et vaisselle : la terre cuite apporte la chaleur du Sud et une imperfection artisanale. Elle vieillit merveilleusement bien.",
    rooms: ["Cuisine", "Salle à manger", "Terrasse"],
    tip: "Les vraies tomettes anciennes se chinent ; pensez à les traiter contre les taches.",
    swatch: "linear-gradient(90deg, transparent 47%, rgba(245,235,220,.8) 47% 53%, transparent 53%) 0 0/24px 24px, linear-gradient(0deg, transparent 47%, rgba(245,235,220,.8) 47% 53%, transparent 53%) 0 0/24px 24px, linear-gradient(135deg, #c0603d, #a9502f)",
    pairings: [
      { name: "Mas provençal", materials: ["lin", "bois-brut", "zellige"], colors: ["#F4EFE6", "#6F7A3B", "#5C7088"] },
      { name: "Sud solaire", materials: ["rotin", "travertin"], colors: ["#CF9A3A", "#F4EFE6", "#2C6470"] },
    ],
  },
  {
    id: "zellige", name: "Zellige", family: "mineraux", mood: "Vibrant et artisanal",
    description: "Ces petits carreaux d'argile émaillés à la main jouent avec la lumière grâce à leurs irrégularités. Chaque mur devient une mosaïque vivante.",
    rooms: ["Salle de bain", "Cuisine"],
    tip: "Réservez-le à une crédence ou un pan de mur : un petit métrage suffit à faire effet.",
    swatch: "linear-gradient(90deg, transparent 46%, #e9e2d6 46% 54%, transparent 54%) 0 0/16px 16px, linear-gradient(0deg, transparent 46%, #e9e2d6 46% 54%, transparent 54%) 0 0/16px 16px, conic-gradient(from 45deg, #2c6470, #3b7a86, #285a64, #346f7b, #2c6470)",
    pairings: [
      { name: "Riad", materials: ["laiton", "terre-cuite"], colors: ["#2C6470", "#F4EFE6", "#CF9A3A"] },
      { name: "Fraîcheur", materials: ["chene-clair", "lin"], colors: ["#7F9C8E", "#F4EFE6", "#C9C9C4"] },
    ],
  },
  // Métaux
  {
    id: "laiton", name: "Laiton", family: "metaux", mood: "Doré et précieux",
    description: "Un métal aux reflets d'or chaud, qui se patine joliment. En luminaire, en poignées ou en pieds de table, il illumine une pièce par petites touches.",
    rooms: ["Salon", "Cuisine", "Salle de bain"],
    tip: "Le laiton brossé marque moins les traces de doigts que le laiton poli.",
    swatch: "linear-gradient(135deg, #b8892f 0%, #e6c66e 30%, #c99a3e 55%, #f1d78c 75%, #a87a28 100%)",
    pairings: [
      { name: "Art déco", materials: ["velours", "marbre"], colors: ["#2F5446", "#1F2F45", "#F4EFE6"] },
      { name: "Chaleur dorée", materials: ["noyer", "lin"], colors: ["#E2D3B8", "#9E4A32", "#F4EFE6"] },
    ],
  },
  {
    id: "metal-noir", name: "Métal noir", family: "metaux", mood: "Graphique et affirmé",
    description: "Fines structures en acier ou fer forgé, il dessine des lignes nettes dans l'espace. Il apporte du contraste et une touche d'atelier.",
    rooms: ["Cuisine", "Bureau", "Entrée"],
    tip: "Une verrière ou des étagères en métal noir structurent une pièce sans la cloisonner.",
    swatch: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.18), transparent 50%), linear-gradient(160deg, #2b2b2b, #1a1a1a)",
    pairings: [
      { name: "Atelier", materials: ["bois-brut", "cuir", "beton-cire"], colors: ["#3A3A3A", "#B98A5A", "#F4EFE6"] },
      { name: "Japandi graphique", materials: ["chene-clair", "lin"], colors: ["#F4EFE6", "#CBBFAE", "#6F7A3B"] },
    ],
  },
  {
    id: "chrome", name: "Chrome", family: "metaux", mood: "Rétro-futuriste",
    description: "Brillant comme un miroir, le chrome signe le design des années 70 et le style Bauhaus. Il reflète la lumière et apporte une touche ludique.",
    rooms: ["Salon", "Salle à manger", "Salle de bain"],
    tip: "Associez-le à des matières chaudes pour éviter un effet trop froid.",
    swatch: "linear-gradient(135deg, #8e9297 0%, #f2f4f6 30%, #a7abb0 50%, #e4e7ea 70%, #7d8186 100%)",
    pairings: [
      { name: "Bauhaus", materials: ["cuir", "verre-cannele"], colors: ["#A32638", "#F1DFA4", "#3A3A3A"] },
      { name: "Space age", materials: ["bouclette", "terrazzo"], colors: ["#C9A12E", "#F4EFE6", "#C0603D"] },
    ],
  },
  // Verre & céramique
  {
    id: "verre-cannele", name: "Verre cannelé", family: "verre", mood: "Lumineux et rétro",
    description: "Strié de fines cannelures, il diffuse la lumière tout en préservant l'intimité. Parfait pour une porte de buffet, une cloison ou une lampe.",
    rooms: ["Salle de bain", "Cuisine", "Salon"],
    tip: "Un film adhésif cannelé transforme une vitre ordinaire pour quelques euros.",
    swatch: "repeating-linear-gradient(90deg, rgba(255,255,255,.75) 0 2px, rgba(190,210,215,.55) 2px 5px, rgba(255,255,255,.35) 5px 7px), linear-gradient(180deg, #d9e5e8, #c4d4d8)",
    pairings: [
      { name: "Années folles", materials: ["laiton", "velours"], colors: ["#2F5446", "#E3B5A8", "#F4EFE6"] },
      { name: "Lumière douce", materials: ["chene-clair", "papier"], colors: ["#F4EFE6", "#BFD0DC", "#CBBFAE"] },
    ],
  },
  {
    id: "gres-emaille", name: "Grès émaillé", family: "verre", mood: "Artisanal et sensible",
    description: "Vaisselle, vases et lampes au toucher granuleux, souvent mouchetés : le grès porte la trace de la main du céramiste. Chaque pièce est unique.",
    rooms: ["Cuisine", "Salle à manger", "Salon"],
    tip: "Mélangez les pièces dépareillées : l'imperfection fait partie du charme.",
    swatch: "radial-gradient(circle at 25% 35%, #6b5a48 0 1px, transparent 1.5px) 0 0/8px 8px, radial-gradient(circle at 65% 70%, #8a7660 0 1px, transparent 1.5px) 0 0/11px 11px, radial-gradient(ellipse at 30% 25%, rgba(255,255,255,.5), transparent 60%), #d9cdb9",
    pairings: [
      { name: "Wabi-sabi", materials: ["lin", "jute", "chene-clair"], colors: ["#CBBFAE", "#F4EFE6", "#5A3A28"] },
      { name: "Table de campagne", materials: ["bois-brut", "terre-cuite"], colors: ["#7F9C8E", "#E2D3B8", "#C0603D"] },
    ],
  },
  {
    id: "papier", name: "Papier washi", family: "verre", mood: "Poétique et léger",
    description: "Le papier japonais des lanternes diffuse une lumière douce et chaude. Suspensions et lampes en papier apportent légèreté et sérénité.",
    rooms: ["Chambre", "Salon", "Bureau"],
    tip: "Une suspension en papier est l'un des luminaires de designer les plus abordables.",
    swatch: "repeating-linear-gradient(0deg, rgba(200,185,160,.35) 0 1px, transparent 1px 9px), radial-gradient(ellipse at 50% 40%, #fffaf0, #efe4cf)",
    pairings: [
      { name: "Japandi", materials: ["chene-clair", "lin", "gres-emaille"], colors: ["#F4EFE6", "#CBBFAE", "#3A3A3A"] },
      { name: "Cocon", materials: ["bouclette", "laine"], colors: ["#E3B5A8", "#F4EFE6", "#D8C09A"] },
    ],
  },
];

export const MATERIALS_BY_ID: Record<string, DecorMaterial> = Object.fromEntries(DECOR_MATERIALS.map((m) => [m.id, m]));

/** Ambiances prêtes à l'emploi : un accord de matières et sa palette, comme les palettes tendance. */
export const MATERIAL_MOODS: { name: string; materials: string[]; colors: string[] }[] = [
  { name: "Japandi", materials: ["chene-clair", "lin", "papier", "gres-emaille"], colors: ["#F4EFE6", "#CBBFAE", "#3A3A3A", "#6F7A3B"] },
  { name: "Méditerranée", materials: ["travertin", "terre-cuite", "lin", "rotin"], colors: ["#F4EFE6", "#C0603D", "#5C7088", "#6F7A3B"] },
  { name: "Art déco", materials: ["velours", "laiton", "marbre", "noyer"], colors: ["#2F5446", "#C9A12E", "#F4EFE6", "#1F2F45"] },
  { name: "Bohème", materials: ["rotin", "jute", "laine", "terre-cuite"], colors: ["#C0603D", "#CF9A3A", "#E2D3B8", "#2F5446"] },
  { name: "Loft industriel", materials: ["metal-noir", "beton-cire", "cuir", "bois-brut"], colors: ["#3A3A3A", "#B98A5A", "#C9C9C4", "#F4EFE6"] },
  { name: "Néo-seventies", materials: ["bouclette", "liege", "chrome", "verre-cannele"], colors: ["#C9A12E", "#9E4A32", "#F1DFA4", "#5A3A28"] },
];
