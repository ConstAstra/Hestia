import Link from "next/link";
import { Visual } from "@/components/Visual";
import { INSPIRATIONS } from "@/lib/catalog";

const FEATURES = [
  {
    href: "/dupes",
    kicker: "Dupes IA",
    title: "Votre inspiration Pinterest, dans votre budget",
    text: "Ajoutez l'image qui vous fait rêver et une photo de votre pièce, fixez un budget : l'IA repère chaque pièce et trouve des équivalents abordables, réellement en vente.",
    cta: "Trouver mes dupes",
    inspiration: INSPIRATIONS[2],
  },
  {
    href: "/swipe",
    kicker: "Swipe",
    title: "Découvrez votre style, un swipe à la fois",
    text: "À droite si vous aimez, à gauche sinon. Swipez des ambiances pour cerner vos goûts, ou des produits par catégorie pour dénicher la pièce parfaite.",
    cta: "Commencer à swiper",
    inspiration: INSPIRATIONS[8],
  },
  {
    href: "/tableaux",
    kicker: "Tableaux",
    title: "Vos mood boards, toujours sous la main",
    text: "Rassemblez vos coups de cœur, vos photos, vos dupes et vos notes dans des tableaux par pièce ou par projet.",
    cta: "Créer un tableau",
    inspiration: INSPIRATIONS[12],
  },
];

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="grid items-center gap-8 pt-4 md:grid-cols-2 md:pt-10">
        <div className="space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Décoration d&apos;intérieur</p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
            Le foyer de vos rêves, sans le prix des rêves.
          </h1>
          <p className="max-w-lg text-lg text-muted">
            Hestia transforme vos inspirations en listes d&apos;achats concrètes, vous aide à affiner votre style et garde
            toutes vos idées au même endroit.
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
        <div className="grid grid-cols-3 gap-3" aria-hidden>
          {INSPIRATIONS.slice(0, 6).map((inspiration, index) => (
            <div
              key={inspiration.id}
              className={`overflow-hidden rounded-3xl ${index % 2 ? "mt-8 aspect-[3/4]" : "aspect-[3/5]"}`}
            >
              <Visual palette={inspiration.palette} seed={inspiration.id} alt="" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <Link key={feature.href} href={feature.href} className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-[16/10] overflow-hidden">
              <Visual palette={feature.inspiration.palette} seed={feature.href} alt="" className="transition duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{feature.kicker}</p>
              <h2 className="font-display text-2xl font-semibold leading-snug">{feature.title}</h2>
              <p className="flex-1 text-sm text-muted">{feature.text}</p>
              <span className="text-sm font-semibold text-accent-strong">{feature.cta} →</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
