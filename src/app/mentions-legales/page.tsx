import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales d'Hestia, liens d'affiliation, données personnelles et conditions d'utilisation des contenus.",
};

/** Information à compléter par l'éditeur avant la mise en ligne : bien visible pour ne pas l'oublier. */
function ToFill({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-gold-soft px-1.5 py-0.5 text-foreground">[À compléter : {children}]</mark>;
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
      <div className="space-y-3 leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

export default function LegalPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <p className="kicker">Informations légales</p>
        <h1 className="font-display text-4xl md:text-6xl">Mentions légales</h1>
        <p className="text-muted">Dernière mise à jour : <ToFill>date de mise en ligne</ToFill></p>
        <nav aria-label="Sommaire" className="flex flex-wrap gap-2 pt-2 text-sm">
          {[
            ["editeur", "Éditeur"],
            ["hebergement", "Hébergement"],
            ["affiliation", "Liens d'affiliation"],
            ["produits", "Produits et prix"],
            ["donnees", "Données personnelles"],
            ["contenus", "Contenus et photos"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-full bg-surface-muted px-3 py-1 transition hover:bg-border">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <Section id="editeur" title="Éditeur du site">
        <p>
          Hestia est édité par <ToFill>raison sociale et forme juridique</ToFill>, au capital de <ToFill>montant</ToFill>, immatriculée
          au RCS de <ToFill>ville</ToFill> sous le numéro <ToFill>SIREN</ToFill>, dont le siège social est situé <ToFill>adresse</ToFill>.
        </p>
        <p>
          Numéro de TVA intracommunautaire : <ToFill>numéro</ToFill>. Directrice ou directeur de la publication : <ToFill>nom</ToFill>.
          Contact : <ToFill>adresse e-mail de contact</ToFill>.
        </p>
      </Section>

      <Section id="hebergement" title="Hébergement">
        <p>
          Le site est hébergé par <ToFill>nom de l&apos;hébergeur, adresse et téléphone</ToFill>.
        </p>
      </Section>

      <Section id="affiliation" title="Liens d'affiliation">
        <p className="rounded-2xl bg-gradient-warm px-5 py-4 font-medium text-white">
          Certains liens d&apos;Hestia sont des liens affiliés : lorsque vous achetez un produit après avoir cliqué sur « Acheter via
          Hestia », l&apos;enseigne peut nous verser une commission. Cela ne change jamais le prix que vous payez.
        </p>
        <p>
          Les boutons « Acheter via Hestia » et les liens produit passent par une page de redirection d&apos;Hestia, qui compte le
          clic puis vous envoie sur la fiche de l&apos;enseigne. Lorsque l&apos;enseigne a un programme d&apos;affiliation avec nous,
          un identifiant de partenaire est ajouté au lien ; sinon, le lien est direct et Hestia ne perçoit rien.
        </p>
        <p>
          <strong>Comment les produits sont choisis.</strong> Les produits proposés par l&apos;outil de création, par « Où l&apos;acheter »
          et par l&apos;onglet Seconde main sont sélectionnés selon leur ressemblance avec votre inspiration ou votre demande
          (forme, matière, couleur, style), votre budget et leur disponibilité. Le fait qu&apos;une enseigne nous verse ou non une
          commission n&apos;intervient pas dans ce choix. <ToFill>à ajuster si des partenariats influencent un jour le classement</ToFill>
        </p>
        <p>
          Enseignes avec lesquelles Hestia a un partenariat d&apos;affiliation : <ToFill>liste des programmes signés</ToFill>.
        </p>
      </Section>

      <Section id="produits" title="Produits, prix et disponibilités">
        <p>
          Hestia n&apos;est pas un vendeur : les achats se font directement auprès des enseignes, qui restent seules responsables de la
          vente, de la livraison, des retours et du service après-vente.
        </p>
        <p>
          Les prix, références, dimensions et disponibilités sont relevés sur les fiches des enseignes au moment de la recherche ;
          ils peuvent avoir changé depuis. Vérifiez toujours la fiche de l&apos;enseigne avant d&apos;acheter. Les prix des produits du Swipe
          sont indicatifs.
        </p>
        <p>
          Pour la seconde main, les annonces sont publiées par des tiers sur leurs plateformes (Selency, Label Emmaüs, Leboncoin…) :
          vérifiez l&apos;état, la disponibilité et les conditions de retrait avec le vendeur.
        </p>
      </Section>

      <Section id="donnees" title="Données personnelles">
        <p>
          <strong>Sur votre appareil.</strong> Vos coups de cœur, tableaux, créations, résultats du test et statistiques sont
          enregistrés uniquement dans le stockage local de votre navigateur. Hestia ne crée pas de compte et ne les conserve pas sur
          ses serveurs. Vous pouvez les effacer à tout moment en vidant les données du site dans votre navigateur.
        </p>
        <p>
          <strong>Lors d&apos;une recherche.</strong> Quand vous lancez l&apos;outil de création, « Où l&apos;acheter » ou une recherche de
          seconde main, votre demande (et, pour l&apos;outil de création, les images que vous déposez) est transmise à notre
          prestataire d&apos;intelligence artificielle, Anthropic, pour trouver les produits. Les recherches de photos passent par
          Pexels. <ToFill>durées de conservation et garanties des prestataires</ToFill>
        </p>
        <p>
          <strong>Mesure des clics.</strong> Les clics sur « Acheter via Hestia » sont comptés de façon anonyme (enseigne et date).
        </p>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement de vos données : écrivez à
          <ToFill>adresse e-mail dédiée</ToFill>. Vous pouvez aussi saisir la CNIL.
        </p>
      </Section>

      <Section id="contenus" title="Contenus et photos">
        <p>
          Les photos d&apos;intérieurs du fil d&apos;inspiration proviennent de Pexels et appartiennent à leurs photographes, cités sur
          chaque photo. Les noms et marques des enseignes appartiennent à leurs propriétaires respectifs.
        </p>
        <p>
          Le nom Hestia, son logo et les textes du site sont la propriété de <ToFill>éditeur</ToFill>.
        </p>
      </Section>

      <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted">
        Ces mentions sont un modèle de départ : faites-les relire par un ou une juriste avant la mise en ligne publique.{" "}
        <Link href="/" className="underline hover:text-foreground">
          Retour à l&apos;accueil
        </Link>
      </p>
    </article>
  );
}
