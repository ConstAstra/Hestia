# Hestia

Application web de décoration d'intérieur, en français, pensée pour le grand public.

## Fonctionnalités

0. **Fil d'inspiration** (`/`) : mosaïque de photos réelles d'intérieurs de tous styles (Pexels), défilement infini, recherche libre et thèmes (pièces, styles, envies). Un clic ouvre la fiche de la photo, avec « Enregistrer », « J'aime », « Recréer ce look avec Hestia » (vers l'outil de création) et des idées similaires à l'infini. Le fil « Pour vous » s'oriente selon les styles aimés.

1. **Outil de création** (`/creation`, anciennement « Dupes IA ») : l'utilisateur dépose une inspiration (photo enregistrée ou capture d'écran), et s'il le souhaite une photo de sa pièce, puis fixe un budget. Claude analyse l'image, identifie chaque pièce qui fait l'ambiance, cherche sur le web des équivalents réellement en vente chez des enseignes qui livrent en France, puis renvoie :
   - une sélection qui tient dans le budget, en distinguant les pièces essentielles des pièces bonus ;
   - la palette de couleurs ;
   - des conseils d'agencement ;
   - des astuces pour réduire la facture.

   Un **choix de style** ouvre la personnalisation : vingt-deux styles (moderne, contemporain, scandinave, mid-century, industriel, bohème, vintage, art déco revisité, campagne anglaise, maison de vacances, wabi-sabi, kinfolk, haussmannien, classique contemporain, minimalisme chaleureux, méditerranéen, dopamine, japandi, campagne chic, maximaliste, bord de mer, pastel doux). Chacun a sa fiche : son esprit, ses incontournables, sa palette et ses matières, que l'on peut adopter en un geste. Deux styles au plus sont transmis à Hestia.

   Un **studio de couleurs** permet aussi de choisir ses teintes de façon ludique : un nuancier de 62 couleurs déco classées par familles (dont violets et mauves, pastels et couleurs dopamine). Au clic, chaque couleur affiche une fiche avec son code hexadécimal (à copier), une description, les pièces qui lui conviennent et des associations à adopter en un geste. On y trouve aussi les palettes des tendances et un tirage « Surprenez-moi ». La palette choisie (six couleurs au plus) est transmise à Hestia, qui oriente les dupes vers ces teintes.

   Une **matériauthèque** fonctionne sur le même principe : 24 matières (bois, fibres naturelles, textiles, pierre, métaux, verre et céramique), chacune présentée par un échantillon dessiné. Sa fiche donne une description, les pièces qui lui conviennent, un conseil « Bon à savoir » et des associations (matières et couleurs). Adopter une association ou une « ambiance matières » (Japandi, Méditerranée, Art déco…) complète aussi la palette de couleurs. Les matières choisies (cinq au plus) sont transmises à Hestia.

   **Produits réels uniquement.** Pour chaque produit retenu, Hestia ouvre la fiche de l'enseigne et en recopie le nom exact, la référence, le prix, les dimensions, la matière, le coloris et la disponibilité (en ligne, en magasin). Côté serveur, tout produit dont la page n'a pas été vue pendant la recherche est écarté, et le total est recalculé. Les fiches effectivement ouvertes portent le badge « Fiche vérifiée ».

   **Achat via Hestia (affiliation).** Le lien produit et le bouton « Acheter sur … via Hestia » passent par `/acheter`. Cette passerelle enregistre le clic (journal `buy_click`), ajoute les paramètres d'affiliation du programme de l'enseigne (`AFFILIATE_PROGRAMS`), puis redirige. Les liens sont signés (`AFFILIATE_LINK_SECRET`) pour que la passerelle ne serve pas de redirection ouverte. La mention légale des liens affiliés figure sous les résultats.

   **Enregistrement automatique.** Chaque création est rangée d'office dans un tableau de l'onglet « Mes créations » (page Tableaux). Son titre reprend ses caractéristiques, par exemple « Méditerranéen · Salon · Terracotta, lin & bleu ardoise · Travertin & rotin · 500 € ». Le tableau réunit l'inspiration, le résumé de l'ambiance et les produits, et garde le style, la pièce, la palette, les matières et le budget.

   La progression des recherches s'affiche en direct. Chaque dupe peut aussi être ajouté à un autre tableau.
1. **Seconde main** (`/seconde-main`) : une recherche Hestia (`/api/second-hand`) trouve de 3 à 6 annonces réelles de meubles et d'objets d'occasion sur Selency, Label Emmaüs, Leboncoin, Vinted, eBay, Brocante Lab ou Pamono. Elle tient compte d'un budget et d'une ville facultatifs. Chaque annonce donne l'état, la localisation, les dimensions, la matière, le prix et le numéro d'annonce, avec le lien d'achat via Hestia ; les annonces sont vérifiées comme les produits neufs, et accompagnées de conseils de chine. L'onglet présente aussi douze pièces classiques à chiner (avec ce qu'il faut vérifier et des liens de recherche directs vers Leboncoin, Vinted et eBay) et les plateformes recommandées.
1. **Où l'acheter** (fiche d'un produit aimé, dans Coups de cœur) : les produits du swipe sont des modèles types, et non des références marchandes. Un clic sur un produit aimé ouvre sa fiche (style, matières, budget indicatif). « Trouver où l'acheter » lance alors une recherche Hestia (`/api/offers`) qui rapporte de 1 à 3 offres réelles, avec leur référence, leur prix, leurs dimensions, leur matière, leur coloris, l'enseigne, le lien produit et le bouton « Acheter via Hestia ». Ces offres sont vérifiées comme dans l'outil de création et conservées sur l'appareil ; la carte du coup de cœur affiche ensuite « Dès … chez … ».
1. **Tendances** (`/tendances`) : huit tendances déco éditoriales (bois foncé, une seule couleur partout, chiné, rayures et carreaux, courbes, cuisine de campagne, lumière douce, touche de rouge), chacune avec son texte, sa palette, trois conseils pour l'adopter et une galerie de photos ; « Voir plus d'idées » ouvre le fil filtré sur la tendance (`/?tendance=…`). Les tendances **s'actualisent depuis le web** : Claude mène une veille (magazines, salons, sites spécialisés) avec la recherche web et en tire une nouvelle sélection, datée et sourcée. La sélection éditoriale de `src/lib/trends.ts` sert de repli.
2. **Swipe** (`/swipe`) : des cartes à la façon de Tinder. On glisse à droite pour garder, à gauche pour passer ; les boutons et les flèches du clavier fonctionnent aussi. Deux modes :
   - *Ambiances* : on swipe des inspirations par style et par pièce ;
   - *Produits* : on swipe des produits, avec une recherche plein texte et des filtres par catégorie.

   Chaque carte affiche les **pastilles de sa palette** (extraite automatiquement des photos). Les coups de cœur alimentent un **profil déco** (styles dominants) et **« Vos couleurs »**, la palette personnelle qui se dégage de tout ce qui a été aimé, également visible dans l'onglet Coups de cœur.
3. **Coups de cœur** (`/coups-de-coeur`) : tout ce qui a été aimé en swipant. L'utilisateur crée ses propres catégories (nom, couleur), y range chaque élément (plusieurs catégories possibles, y compris en sélection multiple), et classe le tout à sa guise : ordre manuel par glisser-déposer ou flèches, ou tri par date, prix, style ou nom.
4. **Tableaux** (`/tableaux`) : des mood boards affichés en grille. On y ajoute des photos personnelles, des notes de couleur, des coups de cœur et des dupes. Chaque tableau se renomme et se supprime.

## Direction artistique

La direction artistique s'inspire de la mythologie grecque, revue dans un esprit moderne : chaleureuse et élégante.

- **Palette :** fond terracotta clair, cartes crème, olive, avec des touches de safran et de rose poudré. Un mode sombre est prévu.
- **Typographies, auto-hébergées :** Weekdays Roman Slant de Manfred Klein pour les titres (**licence à vérifier avant mise en ligne**, voir `public/fonts/weekdays-roman-slant/`), Inter pour le texte courant (moderne et très lisible, proche des polices système utilisées par les réseaux sociaux ; SIL Open Font License), Cormorant Garamond pour le nom de marque.
- **Logo :** H-maison olive, flamme du foyer, soleil terracotta et rameaux d'olivier, redessiné en vectoriel (`src/components/LogoEmblem.tsx`).
- **Icônes :** dessinées à la main, trait d'encre sur tache de couleur organique (`src/components/Ornaments.tsx`).
- **Mise en page :** les photos d'abord, en mosaïque à coins arrondis sur fond très clair ; le terracotta est réservé aux actions.

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis renseigner ANTHROPIC_API_KEY et PEXELS_API_KEY
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
| Fil d'inspiration : API photos, thèmes, mosaïque, idées | `src/app/api/photos`, `src/lib/server/pexels.ts`, `src/lib/topics.ts`, `src/components/Pins.tsx` |
| Catalogue de démonstration (48 produits, 16 ambiances) | `src/lib/catalog.ts` |
| Visuels génératifs (en l'absence de photo produit) | `src/components/Visual.tsx` |

Côté IA, le modèle `claude-opus-5-5` travaille en réflexion adaptative, avec un effort `medium`. Ses outils sont `web_search` et `web_fetch`, et le repli serveur (`fallbacks: "default"`) prend le relais en cas de refus. Le modèle n'a pas le droit d'inventer d'URL. Les liens qu'il n'a pas vus pendant ses recherches portent la mention « Lien à vérifier ».

Côté navigateur, les images sont redimensionnées (1568 px au plus) avant l'envoi. La route valide toutes les entrées et limite le nombre de recherches par IP (`DUPES_HOURLY_LIMIT`, 5 par heure par défaut).

## Actualisation des tendances

- **Automatique** : quand la dernière veille a plus de 7 jours, la visite suivante de la page Tendances en lance une nouvelle en arrière-plan (sans faire attendre le visiteur ; 6 h d'attente avant de réessayer en cas d'échec).
- **Planifiée** : `vercel.json` appelle `/api/trends/refresh` chaque lundi à 6 h (UTC) avec `CRON_SECRET`.
- **Manuelle** : `curl -X POST -H "Authorization: Bearer $TRENDS_REFRESH_SECRET" https://<votre-site>/api/trends/refresh`.
- **Stockage** : fichier `.data/trends.json` (ou `TRENDS_STORE_PATH`). Sur un hébergement serverless, où le disque est éphémère, brancher un stockage clé-valeur dans `src/lib/server/trends-store.ts`.
- Seules les sources réellement consultées pendant la recherche sont affichées.

## Avant une mise en ligne publique

- **Comptes et synchronisation** : les tableaux vivent pour l'instant dans le navigateur, avec une limite d'environ 5 Mo. Il faudra brancher une authentification et une base de données (Supabase, par exemple) et y stocker les images.
- **Catalogue réel** : remplacer `src/lib/catalog.ts` par un flux produit (programmes d'affiliation Awin ou Effiliation, API des enseignes) avec de vraies photos (champ `image`). Les liens d'affiliation sur les dupes peuvent aussi financer le service.
- **Limitation de débit partagée** : le limiteur actuel garde ses compteurs en mémoire. Sur un hébergement serverless ou multi-instances, il faudra Redis ou Upstash.
- **Affiliation** : inscrivez-vous aux programmes des enseignes (souvent via Awin, Effiliation, Kwanko ou Amazon Partenaires), puis renseignez `AFFILIATE_PROGRAMS`. Le journal `buy_click` peut être branché sur un outil d'analyse pour suivre les clics.
- **Coûts IA** : chaque recherche de dupes appelle Claude avec plusieurs recherches web. Il faudra surveiller la consommation et, le cas échéant, réserver la fonctionnalité aux comptes connectés.
- **Juridique** : mentions légales, politique de confidentialité (des photos d'intérieur sont transmises à l'API Anthropic) et CGU.
