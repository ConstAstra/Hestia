import Link from "next/link";
import { Laurel, Meander } from "@/components/Ornaments";
import { Visual } from "@/components/Visual";

/* Palettes de la direction artistique : crème, terracotta, olive, ocre. */
const DA_PALETTES = [
  ["#f3e6d3", "#c66a45", "#6b6e3a"],
  ["#ebe6cf", "#7d8046", "#b98b3e"],
  ["#f4e1d1", "#b4532f", "#8f3d20"],
];

const FEATURES = [
  {
    href: "/dupes",
    kicker: "Dupes IA",
    title: "Votre inspiration Pinterest, dans votre budget",
    text: "Ajoutez l'image qui vous fait rêver et une photo de votre pièce, fixez un budget : l'IA repère chaque pièce et trouve des équivalents abordables, réellement en vente.",
    cta: "Trouver mes dupes",
  },
  {
    href: "/swipe",
    kicker: "Swipe",
    title: "Découvrez votre style, un swipe à la fois",
    text: "À droite si vous aimez, à gauche sinon. Swipez des ambiances pour cerner vos goûts, ou des produits par catégorie pour dénicher la pièce parfaite.",
    cta: "Commencer à swiper",
  },
  {
    href: "/tableaux",
    kicker: "Tableaux",
    title: "Vos mood boards, toujours sous la main",
    text: "Rassemblez vos coups de cœur, vos photos, vos dupes et vos notes dans des tableaux par pièce ou par projet.",
    cta: "Créer un tableau",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 pt-4 md:grid-cols-2 md:pt-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-olive">
            <Laurel className="h-6 w-9" />
            <p className="kicker before:hidden">Gardienne du foyer</p>
            <Laurel className="h-6 w-9" flip />
          </div>
          <h1 className="font-display text-[2.6rem] leading-[1.05] md:text-7xl">
            Le foyer de vos rêves, <em className="font-medium text-accent">sans le prix des rêves.</em>
          </h1>
          <p className="max-w-lg text-lg text-muted">
            Comme Hestia veillait sur la flamme de chaque maison, Hestia transforme vos inspirations en listes
            d&apos;achats concrètes, affine votre style et garde toutes vos idées au même endroit.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dupes" className="btn-primary px-6 py-3 text-base">
              Recréer une inspiration
            </Link>
            <Link href="/swipe" className="btn-ghost px-6 py-3 text-base">
              Explorer les styles
            </Link>
          </div>
        </div>
        {/* Portique : une colonnade d'arches */}
        <div className="grid grid-cols-3 items-end gap-3" aria-hidden>
          {DA_PALETTES.map((palette, index) => (
            <div key={index} className={`arch border border-border ${index === 1 ? "aspect-[3/5.4]" : "aspect-[3/4.6]"}`}>
              <Visual palette={palette} seed={`portique-${index}`} alt="" />
            </div>
          ))}
          <div className="col-span-3 h-2 rounded-full bg-olive/25" />
        </div>
      </section>

      <Meander className="text-gold/50" />

      <section className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Link key={feature.href} href={feature.href} className="card group flex flex-col overflow-hidden p-3 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="arch aspect-[4/3]">
              <Visual palette={DA_PALETTES[index]} seed={feature.href} alt="" className="transition duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <p className="kicker">
                {["I", "II", "III"][index]} · {feature.kicker}
              </p>
              <h2 className="font-display text-2xl leading-snug">{feature.title}</h2>
              <p className="flex-1 text-sm text-muted">{feature.text}</p>
              <span className="text-sm font-medium text-accent-strong">{feature.cta} →</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
