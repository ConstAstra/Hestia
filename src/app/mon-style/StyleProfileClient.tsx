"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatPrice } from "@/lib/catalog";
import { PersonalityCard } from "@/components/PersonalityCard";
import { computeInsights, portrait, type Share } from "@/lib/insights";
import { styleIdFromLabel } from "@/lib/personalities";
import { DECOR_MATERIALS } from "@/lib/materials";
import { useHestia, useHydrated } from "@/lib/store";

const percent = (share: number) => `${Math.round(share * 100)} %`;
const MATERIAL_SWATCH = Object.fromEntries(DECOR_MATERIALS.map((m) => [m.name.toLowerCase(), m.swatch]));

/** Barres horizontales d'une seule teinte : la longueur porte la part, le libellé l'identité. */
function Bars({ items, swatch }: { items: Share[]; swatch?: (label: string) => string | undefined }) {
  const max = Math.max(...items.map((i) => i.share), 0.0001);
  return (
    <ul className="space-y-2.5">
      {items.map((item) => {
        const texture = swatch?.(item.label);
        return (
          <li key={item.label} className="group grid grid-cols-[minmax(0,9rem)_1fr_3rem] items-center gap-3 text-sm" title={`${item.label} : ${percent(item.share)}`}>
            <span className="flex min-w-0 items-center gap-2">
              {texture && <span className="h-4 w-4 shrink-0 rounded-full border border-black/5" style={{ background: texture }} aria-hidden />}
              <span className="truncate">{item.label}</span>
            </span>
            <span className="h-2.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden>
              <span
                className="block h-full rounded-full bg-accent transition-[width] duration-700 group-hover:bg-accent-strong"
                style={{ width: `${(item.share / max) * 100}%` }}
              />
            </span>
            <span className="text-right text-xs tabular-nums text-muted">{percent(item.share)}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Barre empilée en trois parts, chacune nommée en clair sous la barre. */
function Split({ parts }: { parts: { label: string; share: number; color: string }[] }) {
  return (
    <div className="space-y-2">
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" aria-hidden>
        {parts
          .filter((p) => p.share > 0)
          .map((p) => (
            <span key={p.label} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${p.share * 100}%`, background: p.color }} title={`${p.label} : ${percent(p.share)}`} />
          ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} aria-hidden />
            {p.label} <span className="tabular-nums text-muted">{percent(p.share)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tile({ value, label, hint }: { value: string; label: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-surface-muted px-4 py-4">
      <p className="font-display text-4xl leading-none">{value}</p>
      <p className="mt-2 text-sm font-medium">{label}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="card space-y-4 p-5 md:p-6">
      <div>
        <h2 className="font-display text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function StyleProfileClient() {
  const hydrated = useHydrated();
  const likedProducts = useHestia((s) => s.likedProducts);
  const likedInspirations = useHestia((s) => s.likedInspirations);
  const likedPhotos = useHestia((s) => s.likedPhotos);
  const seen = useHestia((s) => s.seen);
  const boards = useHestia((s) => s.boards);
  const likedAt = useHestia((s) => s.likedAt);

  // Calculé seulement une fois les données de l'appareil chargées (jamais au prérendu).
  const insights = useMemo(
    () => (hydrated ? computeInsights({ likedProducts, likedInspirations, likedPhotos, seen, boards, likedAt }) : null),
    [hydrated, likedProducts, likedInspirations, likedPhotos, seen, boards, likedAt],
  );
  const lines = useMemo(() => (insights ? portrait(insights) : []), [insights]);

  const header = (
    <header className="space-y-3">
      <p className="kicker">Mon style</p>
      <h1 className="font-display text-4xl md:text-6xl">Votre profil déco</h1>
      <p className="max-w-2xl text-muted">
        Ce que vos coups de cœur, vos swipes et vos créations disent de vos goûts. Tout est calculé sur votre appareil, et
        s&apos;affine à chaque cœur.
      </p>
      <Link href="/quiz" className="group inline-flex items-center gap-3 rounded-full bg-gradient-hestia py-2 pl-2 pr-5 text-sm text-white shadow-lg transition hover:-translate-y-0.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/25 font-heading">?</span>
        <span className="font-heading">Découvrez votre style de déco, et ce qu&apos;il veut dire de vous →</span>
      </Link>
    </header>
  );

  if (!insights) {
    return (
      <div className="space-y-8">
        {header}
        <div className="h-64 animate-pulse rounded-3xl bg-surface-muted" />
      </div>
    );
  }

  if (!insights.enough) {
    return (
      <div className="space-y-8">
        {header}
        <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
          <p className="font-display text-2xl">Votre profil se dessine encore</p>
          <p className="max-w-md text-sm text-muted">
            Aimez au moins trois ambiances, produits ou photos (ou lancez une création) : Hestia vous dira alors quels styles,
            couleurs et matières vous ressemblent.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/swipe" className="btn-primary">
              Swiper quelques idées
            </Link>
            <Link href="/creation" className="btn-ghost">
              Lancer une création
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const top = insights.styles[0];
  const topStyleId = top ? styleIdFromLabel(top.label) : undefined;
  const maxWeek = Math.max(...insights.weeks.map((w) => w.count), 1);

  return (
    <div className="space-y-8">
      {header}

      {/* Portrait */}
      <section className="overflow-hidden rounded-[1.75rem] border border-border">
        <div className="flex h-3" aria-hidden>
          {insights.colors.slice(0, 6).map((c) => (
            <span key={c.label} className="flex-1" style={{ background: c.hex }} />
          ))}
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_1.3fr] md:p-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Votre style dominant</p>
            <p className="font-display text-5xl leading-tight md:text-6xl">{top?.label ?? "En cours"}</p>
            {top && <p className="text-sm text-muted">{percent(top.share)} de vos préférences</p>}
          </div>
          <div className="space-y-2 text-sm leading-relaxed md:text-base">
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/creation" className="btn-primary">
                Créer dans mon style ✦
              </Link>
              <Link href="/coups-de-coeur" className="btn-ghost">
                Revoir mes coups de cœur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {topStyleId && <PersonalityCard styleId={topStyleId} intro="D'après ce que vous avez aimé, voici ce que ça dit de vous" />}

      {/* Chiffres clés */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile value={String(insights.totals.likes)} label="Coups de cœur" hint={`${insights.totals.inspirations} ambiances · ${insights.totals.products} produits · ${insights.totals.photos} photos`} />
        <Tile value={String(insights.totals.creations)} label={`Création${insights.totals.creations > 1 ? "s" : ""}`} hint="Avec l'outil de création" />
        <Tile value={String(insights.totals.boards)} label={`Tableau${insights.totals.boards > 1 ? "x" : ""}`} hint="Créations comprises" />
        <Tile
          value={insights.swipeKeepRate === null ? "—" : percent(insights.swipeKeepRate)}
          label="Gardé au swipe"
          hint={insights.swipeKeepRate === null ? "Swipez un peu plus pour le savoir" : "Part des cartes que vous gardez"}
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Section title="Vos styles" subtitle="D'après vos ambiances, vos produits et vos créations.">
          <Bars items={insights.styles} />
        </Section>

        <Section title="Vos couleurs" subtitle="Les teintes qui reviennent dans ce que vous aimez.">
          <ul className="grid grid-cols-4 gap-3 sm:grid-cols-8 lg:grid-cols-4 xl:grid-cols-8">
            {insights.colors.map((c) => (
              <li key={c.label} className="flex flex-col items-center gap-1 text-center" title={`${c.label} · ${c.hex.toUpperCase()} : ${percent(c.share)}`}>
                <span className="h-11 w-11 rounded-full border border-black/5 shadow-sm" style={{ background: c.hex }} />
                <span className="text-[11px] leading-tight">{c.label}</span>
                <span className="text-[10px] tabular-nums text-muted">{percent(c.share)}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-4 pt-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-sm font-semibold">Chaud ou froid ?</p>
              <Split
                parts={[
                  { label: "Chaudes", share: insights.temperature.warm, color: "#C0603D" },
                  { label: "Neutres", share: insights.temperature.neutral, color: "#CBBFAE" },
                  { label: "Froides", share: insights.temperature.cool, color: "#5C7088" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold">Clair ou profond ?</p>
              <Split
                parts={[
                  { label: "Claires", share: insights.lightness.light, color: "#E2D3B8" },
                  { label: "Moyennes", share: insights.lightness.mid, color: "#B98A5A" },
                  { label: "Profondes", share: insights.lightness.deep, color: "#5A3A28" },
                ]}
              />
            </div>
          </div>
        </Section>

        {insights.materials.length > 0 && (
          <Section title="Vos matières" subtitle="Celles des produits aimés et de vos créations.">
            <Bars items={insights.materials} swatch={(label) => MATERIAL_SWATCH[label.toLowerCase()]} />
          </Section>
        )}

        {insights.rooms.length > 0 && (
          <Section title="Vos pièces" subtitle="Les pièces des ambiances que vous aimez et de vos projets.">
            <Bars items={insights.rooms} />
          </Section>
        )}

        {insights.categories.length > 0 && (
          <Section title="Vos types de meubles" subtitle="Les produits que vous gardez au swipe.">
            <Bars items={insights.categories} />
          </Section>
        )}

        <Section title="Budget et activité">
          <div className="grid grid-cols-2 gap-3">
            <Tile
              value={insights.budget.averageProduct === null ? "—" : formatPrice(insights.budget.averageProduct)}
              label="Prix moyen aimé"
              hint="Produits du swipe (indicatif)"
            />
            <Tile
              value={insights.budget.averageCreation === null ? "—" : formatPrice(insights.budget.averageCreation)}
              label="Budget moyen"
              hint="Par création"
            />
          </div>
          <div className="space-y-2 pt-1">
            <p className="text-sm font-semibold">Vos coups de cœur, semaine après semaine</p>
            <div className="flex h-28 items-end gap-2" role="img" aria-label={insights.weeks.map((w) => `semaine du ${w.label} : ${w.count}`).join(", ")}>
              {insights.weeks.map((week, index) => (
                <div key={index} className="group relative flex h-full flex-1 flex-col justify-end" title={`Semaine du ${week.label} : ${week.count} coup${week.count > 1 ? "s" : ""} de cœur`}>
                  <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-foreground px-1.5 py-0.5 text-[10px] text-background opacity-0 transition group-hover:opacity-100">
                    {week.count}
                  </span>
                  <span
                    className="block rounded-t-[4px] bg-olive transition group-hover:bg-foreground"
                    style={{ height: `${Math.max((week.count / maxWeek) * 100, week.count ? 6 : 2)}%`, opacity: week.count ? 1 : 0.25 }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 text-[10px] text-muted">
              {insights.weeks.map((week, index) => (
                <span key={index} className="flex-1 truncate text-center">
                  {index % 2 === 1 || index === 7 ? week.label : ""}
                </span>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
