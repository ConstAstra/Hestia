export type ProductCategory =
  | "canape"
  | "fauteuil"
  | "table"
  | "chaise"
  | "luminaire"
  | "tapis"
  | "rangement"
  | "lit"
  | "textile"
  | "deco"
  | "miroir"
  | "plante";

export type DecorStyle =
  | "japandi"
  | "boheme"
  | "scandinave"
  | "industriel"
  | "mid-century"
  | "minimaliste"
  | "classique-chic"
  | "mediterraneen";

export type RoomType =
  | "salon"
  | "chambre"
  | "cuisine"
  | "salle-a-manger"
  | "bureau"
  | "salle-de-bain"
  | "entree"
  | "exterieur";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  style: DecorStyle;
  price: number;
  /** Couleurs dominantes, utilisées pour le visuel génératif. */
  palette: string[];
  materials: string[];
  description: string;
  /** Photo réelle si disponible ; sinon un visuel génératif est affiché. */
  image?: string;
  url?: string;
  retailer?: string;
}

export interface Inspiration {
  id: string;
  title: string;
  style: DecorStyle;
  room: RoomType;
  palette: string[];
  mood: string;
  keywords: string[];
  image?: string;
  /** Produits du catalogue qui composent cette ambiance. */
  productIds: string[];
}

/** Une photo d'inspiration issue de la banque d'images (Pexels). */
export interface Photo {
  id: string;
  width: number;
  height: number;
  alt: string;
  /** Couleur moyenne, affichée pendant le chargement. */
  color: string;
  src: { medium: string; large: string; original: string };
  photographer: string;
  photographerUrl: string;
  /** Page de la photo chez le fournisseur (crédit obligatoire). */
  pageUrl: string;
}

/** Un élément épinglé dans un tableau. */
export type BoardItem =
  | { id: string; kind: "product"; productId: string; addedAt: number }
  | { id: string; kind: "inspiration"; inspirationId: string; addedAt: number }
  | { id: string; kind: "image"; src: string; caption?: string; addedAt: number }
  | { id: string; kind: "note"; text: string; color: string; addedAt: number }
  | { id: string; kind: "dupe"; dupe: Dupe; addedAt: number }
  | { id: string; kind: "photo"; photo: Photo; addedAt: number };

export interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  items: BoardItem[];
}

/** Une pièce repérée dans l'inspiration et son équivalent abordable. */
export interface Dupe {
  /** L'objet tel qu'il apparaît sur la photo d'inspiration. */
  originalItem: string;
  category: string;
  productName: string;
  retailer: string;
  price: number;
  url: string;
  whyItMatches: string;
  /** "essentiel" = indispensable pour l'ambiance ; "bonus" = si le budget le permet. */
  priority: "essentiel" | "bonus";
}

export interface DupesResult {
  ambianceSummary: string;
  palette: { name: string; hex: string }[];
  roomAdvice: string;
  dupes: Dupe[];
  totalPrice: number;
  budgetTips: string[];
}
