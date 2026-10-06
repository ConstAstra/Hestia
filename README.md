# Hestia

Application web de décoration d'intérieur, en français, pensée pour le grand public.

## Fonctionnalités

1. **Dupes IA** (`/dupes`) : l'utilisateur dépose une inspiration (épingle Pinterest enregistrée ou capture), et s'il le souhaite une photo de sa pièce, puis fixe un budget. Claude analyse l'image, identifie chaque pièce qui fait l'ambiance, cherche sur le web des équivalents réellement en vente chez des enseignes qui livrent en France, puis renvoie :
   - une sélection qui tient dans le budget, en distinguant les pièces essentielles des pièces bonus ;
   - la palette de couleurs ;
   - des conseils d'agencement ;
   - des astuces pour réduire la facture.

   La progression des recherches s'affiche en direct. Chaque dupe, ou la sélection entière, peut être enregistré dans un tableau.
2. **Swipe** (`/swipe`) : des cartes à la façon de Tinder. On glisse à droite pour garder, à gauche pour passer ; les boutons et les flèches du clavier fonctionnent aussi. Deux modes :
   - *Ambiances* : on swipe des inspirations par style et par pièce ;
   - *Produits* : on swipe des produits, avec une recherche plein texte et des filtres par catégorie.

   Les coups de cœur alimentent un **profil déco**, qui indique les styles dominants.
3. **Coups de cœur** (`/coups-de-coeur`) : tout ce qui a été aimé en swipant. L'utilisateur crée ses propres catégories (nom, couleur), y range chaque élément (plusieurs catégories possibles, y compris en sélection multiple), et classe le tout à sa guise : ordre manuel par glisser-déposer ou flèches, ou tri par date, prix, style ou nom.
4. **Tableaux** (`/tableaux`) : des mood boards dans l'esprit de Pinterest, affichés en grille. On y épingle des photos personnelles, des notes de couleur, des coups de cœur et des dupes. Chaque tableau se renomme et se supprime.

## Direction artistique

La direction artistique s'inspire de la mythologie grecque, revue dans un esprit moderne : chaleureuse et élégante.

- **Palette :** crème de marbre, terracotta d'amphore, olive, avec une touche d'ocre pour les ornements. Un mode sombre est prévu.
- **Typographies, auto-hébergées :** Instrument Serif pour les grands titres, Playfair Display pour tous les autres textes, Cormorant Garamond pour le nom de marque.
- **Logo :** H-maison olive, flamme du foyer, soleil terracotta et rameaux d'olivier, redessiné en vectoriel (`src/components/LogoEmblem.tsx`).
- **Icônes :** dessinées à la main, trait d'encre sur tache de couleur organique (`src/components/Ornaments.tsx`).
- **Motifs :** les images sont encadrées en arche, des frises en méandre et des rameaux de laurier ornent les pages, et les illustrations génératives font apparaître portiques et colonnes cannelées.

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis renseigner ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

Vérifications : `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Architecture

| Élément | Emplacement |
|---|---|
| Next.js 16 (App Router), React 19, Tailwind CSS 4 | `src/app` |
| Route IA (flux NDJSON) | `src/app/api/dupes/route.ts` |
| Appel Claude : vision, recherche web, outil `submit_dupes` en mode strict | `src/lib/server/dupes.ts` |
| Schémas Zod partagés client/serveur | `src/lib/dupes-schema.ts` |
| État local (tableaux, likes), persisté dans `localStorage` | `src/lib/store.ts` |
| Catalogue de démonstration (48 produits, 16 ambiances) | `src/lib/catalog.ts` |
| Visuels génératifs (en l'absence de photo produit) | `src/components/Visual.tsx` |

Côté IA, le modèle `claude-opus-5-5` travaille en réflexion adaptative, avec un effort `medium`. Ses outils sont `web_search` et `web_fetch`, et le repli serveur (`fallbacks: "default"`) prend le relais en cas de refus. Le modèle n'a pas le droit d'inventer d'URL. Les liens qu'il n'a pas vus pendant ses recherches portent la mention « Lien à vérifier ».

Côté navigateur, les images sont redimensionnées (1568 px au plus) avant l'envoi. La route valide toutes les entrées et limite le nombre de recherches par IP (`DUPES_HOURLY_LIMIT`, 5 par heure par défaut).

## Avant une mise en ligne publique

- **Comptes et synchronisation** : les tableaux vivent pour l'instant dans le navigateur, avec une limite d'environ 5 Mo. Il faudra brancher une authentification et une base de données (Supabase, par exemple) et y stocker les images.
- **Catalogue réel** : remplacer `src/lib/catalog.ts` par un flux produit (programmes d'affiliation Awin ou Effiliation, API des enseignes) avec de vraies photos (champ `image`). Les liens d'affiliation sur les dupes peuvent aussi financer le service.
- **Limitation de débit partagée** : le limiteur actuel garde ses compteurs en mémoire. Sur un hébergement serverless ou multi-instances, il faudra Redis ou Upstash.
- **Coûts IA** : chaque recherche de dupes appelle Claude avec plusieurs recherches web. Il faudra surveiller la consommation et, le cas échéant, réserver la fonctionnalité aux comptes connectés.
- **Juridique** : mentions légales, politique de confidentialité (des photos d'intérieur sont transmises à l'API Anthropic) et CGU.
