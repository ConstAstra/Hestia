/*
 * Tendances déco : sélection éditoriale d'Hestia. Chaque tendance a son texte,
 * sa palette, ses conseils et les requêtes qui alimentent sa galerie de photos
 * (en anglais, langue la mieux indexée par la banque d'images).
 */
export interface Trend {
  id: string;
  label: string;
  title: string;
  description: string;
  tips: string[];
  palette: string[];
  queries: string[];
}

export const TRENDS: Trend[] = [
  {
    id: "bois-fonce",
    label: "Matière",
    title: "Le grand retour du bois foncé",
    description:
      "Noyer, chêne fumé, brun chocolat : après des années de bois blond, les essences sombres réchauffent les intérieurs et leur donnent une profondeur rassurante.",
    tips: [
      "Commencez par une pièce forte : buffet, table basse ou tête de lit en noyer.",
      "Associez-le à du crème et du lin pour garder de la lumière.",
      "Chinez : le mobilier vintage en bois foncé abonde en seconde main.",
    ],
    palette: ["#4a3426", "#7a5236", "#b08a62", "#e9dcc8", "#f5efe6"],
    queries: ["dark wood interior", "walnut furniture living room"],
  },
  {
    id: "color-drenching",
    label: "Couleur",
    title: "Une seule couleur, partout",
    description:
      "Murs, plafond, plinthes et portes peints du même ton : la pièce devient un cocon enveloppant. Une manière audacieuse et étonnamment apaisante d'oser la couleur.",
    tips: [
      "Choisissez une teinte un peu grisée ou terreuse, plus facile à vivre qu'un ton vif.",
      "Variez les finitions (mat au mur, satiné sur les boiseries) pour garder du relief.",
      "Testez d'abord dans une petite pièce : entrée, toilettes ou bureau.",
    ],
    palette: ["#8a4b3a", "#a8634e", "#c98b72", "#e6c3b0", "#f4e4d8"],
    queries: ["monochrome painted room", "color drenched room interior"],
  },
  {
    id: "vintage-chine",
    label: "Esprit",
    title: "Le charme du chiné",
    description:
      "Meubles de famille, trouvailles de brocante et objets qui ont une histoire : un intérieur unique, plus durable et plus personnel que le tout-neuf.",
    tips: [
      "Mélangez les époques : une commode ancienne sous une lampe contemporaine.",
      "Rénovez plutôt que remplacer : une nouvelle teinte, de nouvelles poignées.",
      "Gardez un fil conducteur (une couleur, une matière) pour éviter l'effet bric-à-brac.",
    ],
    palette: ["#6b4a3a", "#a2794f", "#c9b38f", "#5f6b4e", "#efe6d4"],
    queries: ["vintage eclectic interior", "antique furniture home decor"],
  },
  {
    id: "rayures-carreaux",
    label: "Motif",
    title: "Rayures et carreaux à l'honneur",
    description:
      "Le motif fait son retour sur les coussins, les rideaux, les abat-jours et même les murs. Graphique, joyeux, il apporte du caractère en un geste.",
    tips: [
      "Démarrez petit : des coussins ou une nappe à carreaux suffisent à transformer une pièce.",
      "Mariez une grande et une petite échelle de motif dans les mêmes couleurs.",
      "Un abat-jour rayé est la touche la plus simple et la plus tendance.",
    ],
    palette: ["#2f4a6b", "#b5543a", "#e8c26a", "#f2ebdd", "#6f7d5c"],
    queries: ["striped interior decor", "checkered pattern home decor"],
  },
  {
    id: "courbes",
    label: "Forme",
    title: "Tout en courbes",
    description:
      "Canapés arrondis, miroirs organiques, tables ovales : les formes douces apaisent le regard et rendent une pièce plus accueillante.",
    tips: [
      "Un canapé ou un fauteuil en bouclette arrondi devient vite la pièce maîtresse.",
      "Adoucissez les angles avec un miroir ou un tapis aux formes organiques.",
      "Ne courbez pas tout : quelques lignes droites gardent l'ensemble structuré.",
    ],
    palette: ["#efe6da", "#d8c4a8", "#b89a7a", "#8a7560", "#f8f3ec"],
    queries: ["curved sofa interior", "organic shapes interior design"],
  },
  {
    id: "cuisine-campagne",
    label: "Pièce",
    title: "La cuisine façon maison de campagne",
    description:
      "Façades en bois peint, étagères ouvertes, vaisselle apparente et meubles dépareillés : la cuisine redevient une pièce à vivre, chaleureuse et sans chichis.",
    tips: [
      "Remplacez quelques placards hauts par des étagères ouvertes.",
      "Peignez les façades dans un vert sauge, un bleu gris ou un crème.",
      "Ajoutez un buffet ou un vaisselier chiné à la place d'un meuble standard.",
    ],
    palette: ["#7d8f6e", "#a8b59a", "#e8e0cf", "#b98a5a", "#4a4036"],
    queries: ["farmhouse kitchen", "english country kitchen interior"],
  },
  {
    id: "lumiere-douce",
    label: "Ambiance",
    title: "La lumière en petites touches",
    description:
      "On oublie le plafonnier unique : lampes à poser, appliques et abat-jours en tissu plissé multiplient les points de lumière pour une atmosphère tamisée.",
    tips: [
      "Visez au moins trois sources de lumière par pièce, à des hauteurs différentes.",
      "Préférez des ampoules chaudes (2 700 K) et des abat-jours en tissu.",
      "Une petite lampe sur une étagère ou un plan de travail change tout le soir.",
    ],
    palette: ["#f4d9a8", "#e3a85f", "#b5683a", "#5a3a28", "#fbf2e2"],
    queries: ["cozy lamp lighting interior", "table lamp warm light decor"],
  },
  {
    id: "rouge-bordeaux",
    label: "Couleur",
    title: "Une touche de rouge",
    description:
      "Bordeaux, cerise ou rouge brique : une pointe de rouge, sur un abat-jour, un coussin ou un pied de lampe, réveille instantanément un intérieur neutre.",
    tips: [
      "Une seule touche suffit : le rouge attire l'œil, gardez-le en accent.",
      "Le bordeaux se marie à merveille avec le bois foncé et le crème.",
      "Répétez la couleur deux ou trois fois dans la pièce pour l'ancrer.",
    ],
    palette: ["#6e2532", "#9e3a3a", "#c8553d", "#e9d8c4", "#3a2a22"],
    queries: ["burgundy interior accents", "red accent home decor"],
  },
];

export const TRENDS_BY_ID: Record<string, Trend> = Object.fromEntries(TRENDS.map((t) => [t.id, t]));
