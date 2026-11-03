"use client";

import Link from "next/link";
import { useHestia, useHydrated } from "@/lib/store";
import { STYLES_BY_ID } from "@/lib/styles";
import { TRENDS } from "@/lib/trends";

/** Une bulle façon « story » : anneau dégradé, contenu rond, libellé court. */
function Bubble({ href, label, background, children, seen }: { href: string; label: string; background: string; children?: React.ReactNode; seen?: boolean }) {
  return (
    <li className="shrink-0">
      <Link href={href} className="group flex w-[4.75rem] flex-col items-center gap-1.5 text-center">
        <span className={`story-ring transition group-hover:scale-105 group-active:scale-95 ${seen ? "story-ring-seen" : ""}`}>
          <span className="grid h-16 w-16 place-items-center overflow-hidden text-white" style={{ background }}>
            {children}
          </span>
        </span>
        <span className="w-full truncate text-[11px] font-medium">{label}</span>
      </Link>
    </li>
  );
}

const stripes = (colors: string[]) =>
  `linear-gradient(135deg, ${colors.map((c, i) => `${c} ${(i / colors.length) * 100}% ${((i + 1) / colors.length) * 100}%`).join(", ")})`;

/** Rangée de stories en tête de l'accueil : le test, son style, les tendances, les outils. */
export function StoriesRow() {
  const hydrated = useHydrated();
  const quiz = useHestia((s) => s.quizResult);
  const done = hydrated && !!quiz;
  return (
    <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 pt-1 [scrollbar-width:none]" aria-label="À découvrir">
      <Bubble href="/quiz" label={done ? "Mon test" : "Le test"} background="var(--gradient-warm)">
        <span className="whitespace-pre-line font-heading text-xs leading-tight">{done ? "Mon\nstyle" : "Quel\nstyle ?"}</span>
      </Bubble>
      <Bubble href="/mon-style" label="Mes stats" background={stripes(done ? quiz!.palette : ["#F4EFE6", "#C0603D", "#6F7A3B"])}>
        {done && <span className="rounded-full bg-black/35 px-1.5 text-[10px] font-semibold">{STYLES_BY_ID[quiz!.styleId]?.name.split(" ")[0]}</span>}
      </Bubble>
      {TRENDS.slice(0, 5).map((trend) => (
        <Bubble key={trend.id} href={`/tendances#${trend.id}`} label={trend.title} background={stripes(trend.palette.slice(0, 4))} />
      ))}
      <Bubble href="/seconde-main" label="Chiner" background={stripes(["#B98A5A", "#C9A46A", "#5A3A28"])} />
      <Bubble href="/creation" label="Créer" background={stripes(["#E0218A", "#FF7A1A", "#FFC72C"])} />
    </ul>
  );
}
