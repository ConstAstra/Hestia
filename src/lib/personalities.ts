import { DECOR_STYLES } from "./styles";

/*
 * « Ce que votre style dit de vous » : un portrait ludique par style de décoration
 * (identifiants de src/lib/styles.ts). Rédigé sans marque de genre.
 */

export interface StylePersonality {
  /** Le surnom, façon horoscope. */
  title: string;
  text: string;
  traits: string[];
  /** Le petit défaut qu'on vous pardonne. */
  flaw: string;
}

export const PERSONALITIES: Record<string, StylePersonality> = {
  moderne: {
    title: "L'esprit vif",
    text: "Vous allez droit au but et vous aimez que les choses fonctionnent. Chez vous, chaque objet mérite sa place, et le désordre vous empêche de penser.",
    traits: ["Efficacité", "Détermination", "Une longueur d'avance"],
    flaw: "Vous rangez la télécommande avant que vos invités aient fini de s'en servir.",
  },
  contemporain: {
    title: "L'œil dans l'air du temps",
    text: "Vous sentez les tendances avant tout le monde, mais vous ne gardez que celles qui vous ressemblent. Votre intérieur évolue avec vous, et c'est très bien comme ça.",
    traits: ["Curiosité", "Sens du beau", "Adaptabilité"],
    flaw: "Vous avez déjà changé trois fois la place du canapé ce mois-ci.",
  },
  scandinave: {
    title: "Le cocon lumineux",
    text: "Pour vous, le bonheur tient dans une bougie allumée, un plaid et une tasse fumante. Vous êtes la personne chez qui tout le monde se sent bien sans savoir pourquoi.",
    traits: ["Chaleur", "Simplicité", "Accueil"],
    flaw: "Vous possédez au moins quatre plaids, et vous en voulez un cinquième.",
  },
  "mid-century": {
    title: "L'élégance rétro",
    text: "Vous avez l'âme d'un personnage de film des années 60 : un goût sûr, un brin de nostalgie et un sens inné du style. Vous préférez une belle pièce d'époque à dix objets sans histoire.",
    traits: ["Raffinement", "Nostalgie", "Goût sûr"],
    flaw: "Vous refusez toute lampe qui n'a pas de pied en laiton.",
  },
  industriel: {
    title: "L'âme d'atelier",
    text: "Authentique et sans chichis, vous aimez ce qui est brut, solide et fait pour durer. Vous avez sans doute déjà démonté quelque chose « juste pour voir comment c'était fait ».",
    traits: ["Franchise", "Créativité", "Débrouillardise"],
    flaw: "Vous trouvez qu'une brique apparente vaut tous les papiers peints du monde.",
  },
  boheme: {
    title: "L'esprit libre",
    text: "Votre intérieur raconte vos voyages, réels ou rêvés. Vous mélangez sans peur, vous chinez au gré des envies, et chez vous, il y a toujours de la place pour une personne de plus.",
    traits: ["Liberté", "Générosité", "Rêverie"],
    flaw: "Votre collection de plantes a besoin d'un planning d'arrosage.",
  },
  vintage: {
    title: "L'âme de chine",
    text: "Vous croyez aux objets qui ont une histoire et aux secondes chances. Le dimanche matin, on vous trouve plus souvent aux puces qu'au lit.",
    traits: ["Patience", "Romantisme", "Engagement"],
    flaw: "« Je ne fais que regarder » : vous ne repartez jamais les mains vides.",
  },
  "art-deco": {
    title: "La star de la soirée",
    text: "Vous aimez ce qui brille, ce qui a du panache, ce qui fait « waouh ». Recevoir est un art pour vous, et votre salon est votre scène.",
    traits: ["Charisme", "Audace", "Panache"],
    flaw: "Pour vous, un coussin sans velours n'est qu'un brouillon de coussin.",
  },
  "campagne-anglaise": {
    title: "Le cœur romantique",
    text: "Tasses dépareillées, bouquets du jardin, fauteuil qui invite à la lecture : vous cultivez la douceur de vivre et l'art des petits plaisirs.",
    traits: ["Tendresse", "Attention", "Poésie"],
    flaw: "Vous avez plus de tasses que d'amis à inviter pour le thé.",
  },
  "maison-de-vacances": {
    title: "L'été éternel",
    text: "Pour vous, la vie est plus belle pieds nus. Vous transformez chaque pièce en parenthèse estivale, et votre bonne humeur est contagieuse.",
    traits: ["Bonne humeur", "Légèreté", "Sociabilité"],
    flaw: "Vous laissez traîner du sable dans votre panier, même en novembre.",
  },
  "wabi-sabi": {
    title: "La sagesse sereine",
    text: "Vous avez compris que la perfection est ennuyeuse. Vous aimez les objets patinés, les fissures qui racontent quelque chose et le temps qui passe sans se presser.",
    traits: ["Sérénité", "Profondeur", "Authenticité"],
    flaw: "Votre vase ébréché est votre objet préféré, et vous le défendrez.",
  },
  kinfolk: {
    title: "L'art de ralentir",
    text: "Vous savez savourer : un repas qui dure, une lumière douce, des conversations qui comptent. Votre intérieur ressemble à une page de magazine, sans jamais avoir l'air posé.",
    traits: ["Contemplation", "Délicatesse", "Hospitalité"],
    flaw: "Vous photographiez votre café avant de le boire.",
  },
  haussmannien: {
    title: "Le chic parisien",
    text: "Moulures, parquet qui craque et un soupçon d'insolence : vous avez une élégance naturelle, que vous portez sans effort apparent.",
    traits: ["Élégance", "Exigence", "Esprit"],
    flaw: "Vous jugez (un peu) les gens qui n'ont pas de cheminée.",
  },
  "classique-contemporain": {
    title: "L'élégance en équilibre",
    text: "Vous aimez les codes, mais vous adorez les bousculer. Entre héritage et modernité, vous trouvez toujours le juste milieu, avec un goût très sûr.",
    traits: ["Mesure", "Culture", "Raffinement"],
    flaw: "Vous mettez trois semaines à choisir une poignée de porte.",
  },
  "minimalisme-chaleureux": {
    title: "L'essentiel avec douceur",
    text: "Vous savez ce qui compte vraiment, et vous gardez le reste à distance. Votre intérieur respire, et vous aussi.",
    traits: ["Sérénité", "Lucidité", "Douceur"],
    flaw: "Vous avez déjà donné un objet le jour même où on vous l'a offert.",
  },
  mediterraneen: {
    title: "Le soleil intérieur",
    text: "Vous avez le goût des grandes tablées, des après-midi qui s'étirent et des gens qui parlent fort. Chez vous, on reste toujours plus longtemps que prévu.",
    traits: ["Joie", "Convivialité", "Générosité"],
    flaw: "Vous servez l'apéritif à 17 h « parce que c'est l'été quelque part ».",
  },
  dopamine: {
    title: "La boule d'énergie",
    text: "Vous ne faites rien à moitié, et surtout pas les couleurs. Votre intérieur vous remonte le moral, et celui de tous ceux qui y entrent.",
    traits: ["Enthousiasme", "Audace", "Optimisme"],
    flaw: "Le beige vous donne des sueurs froides.",
  },
  japandi: {
    title: "L'âme zen",
    text: "Du calme et de la réflexion : vous préférez peu d'objets, mais beaux. Vous trouvez la paix dans une pièce bien ordonnée, une tasse de thé et la lumière du matin.",
    traits: ["Sérénité", "Exigence", "Introspection"],
    flaw: "Un objet de trop sur une étagère vous empêche de dormir.",
  },
  campagne: {
    title: "Le cœur sur la main",
    text: "Grande table, pain frais et porte toujours ouverte : vous aimez les choses vraies et les gens simples. Votre maison sent bon le dimanche.",
    traits: ["Chaleur", "Fidélité", "Authenticité"],
    flaw: "Vous cuisinez toujours pour dix, même à deux.",
  },
  maximaliste: {
    title: "La passion des collections",
    text: "Plus, c'est plus, et vous l'assumez avec panache. Chaque objet chez vous a une histoire, et vous adorez la raconter.",
    traits: ["Passion", "Curiosité", "Expressivité"],
    flaw: "Il n'existe plus un centimètre de mur libre chez vous.",
  },
  "bord-de-mer": {
    title: "L'âme marine",
    text: "Vous avez besoin d'horizon, d'air et de lumière. Même en ville, votre intérieur sent l'iode et les vacances, et vous apaise en un instant.",
    traits: ["Liberté", "Paix", "Lumière"],
    flaw: "Vous ramenez un galet de chaque balade, et ils s'accumulent.",
  },
  pastel: {
    title: "La douceur rêveuse",
    text: "Tendresse, poésie et un brin de gourmandise : vous voyez la vie en couleurs douces. Votre intérieur est un nuage où il fait bon se poser.",
    traits: ["Douceur", "Optimisme", "Créativité"],
    flaw: "Vous choisissez vos coussins comme des macarons.",
  },
};

/** Correspondance des libellés de style du catalogue vers les styles détaillés. */
const ALIASES: Record<string, string> = { minimaliste: "minimalisme-chaleureux", "classique chic": "haussmannien" };

export function styleIdFromLabel(label: string): string | undefined {
  const key = label.toLowerCase();
  return ALIASES[key] ?? DECOR_STYLES.find((style) => style.name.toLowerCase() === key)?.id;
}
