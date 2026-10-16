"use client";

import { useEffect, useRef, useState } from "react";
import { type ChosenColor, named } from "@/components/ColorStudio";
import { MATERIALS_BY_ID } from "@/lib/materials";
import { DECOR_STYLES, type DecorStyleSheet } from "@/lib/styles";

const MAX_STYLES = 2;

/**
 * Choix du style : cartes de styles, fiche au clic (esprit, incontournables, palette,
 * matières) et adoption en un geste de la palette et des matières du style.
 */
export function StyleStudio({
  value,
  onChange,
  onAdoptPalette,
}: {
  value: string[];
  onChange: (styles: string[]) => void;
  onAdoptPalette: (colors: ChosenColor[], materials: string[]) => void;
}) {
  const [active, setActive] = useState<DecorStyleSheet | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // La fiche s'ouvre sous la grille : on l'amène à l'écran (indispensable sur mobile).
  useEffect(() => {
    if (active) sheetRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [active]);
  const [notice, setNotice] = useState<string | null>(null);
  const isChosen = (id: string) => value.includes(id);

  const toggle = (id: string) => {
    if (isChosen(id)) onChange(value.filter((s) => s !== id));
    else onChange([...value, id].slice(-MAX_STYLES));
  };

  const adopt = (style: DecorStyleSheet) => {
    if (!isChosen(style.id)) toggle(style.id);
    onAdoptPalette(style.palette.map(named), style.materials);
    setNotice(`Palette et matières « ${style.name} » ajoutées aux étapes suivantes.`);
  };

  return (
    <div className="min-w-0 space-y-5">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {DECOR_STYLES.map((style) => {
          const chosen = isChosen(style.id);
          const selected = active?.id === style.id;
          return (
            <li key={style.id}>
              <button
                type="button"
                onClick={() => {
                  setActive(style);
                  setNotice(null);
                }}
                aria-pressed={selected}
                className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-surface text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                  selected ? "border-foreground ring-1 ring-foreground" : "border-border"
                }`}
              >
                <span className="flex h-16">
                  {style.palette.map((hex) => (
                    <span key={hex} className="flex-1" style={{ background: hex }} />
                  ))}
                </span>
                <span className="flex h-2">
                  {style.materials.map((id) => (
                    <span key={id} className="flex-1" style={{ background: MATERIALS_BY_ID[id]?.swatch }} />
                  ))}
                </span>
                <span className="flex flex-1 flex-col gap-0.5 p-3">
                  <span className="text-sm font-semibold">
                    {style.name}
                  </span>
                  <span className="text-[11px] leading-snug text-muted">{style.tagline}</span>
                </span>
                {chosen && (
                  <span className="pop absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-sm font-bold text-[#2b2420] shadow">
                    ✓
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {active && (
        <div ref={sheetRef} className="scroll-mt-24 scroll-mb-28 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="flex h-24">
            {active.palette.map((hex) => (
              <span key={hex} className="flex-1" style={{ background: hex }} />
            ))}
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">{active.tagline}</p>
              <h3 className="font-display text-3xl">
                {active.name}
              </h3>
            </div>
            <p className="text-sm leading-relaxed">{active.description}</p>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Les incontournables</p>
              <div className="flex flex-wrap gap-2">
                {active.signatures.map((signature) => (
                  <span key={signature} className="rounded-full bg-surface-muted px-3 py-1 text-xs">
                    {signature}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold">Sa palette</p>
                <div className="flex flex-wrap gap-2">
                  {active.palette.map((hex) => (
                    <span key={hex} className="flex items-center gap-1.5 rounded-full border border-border py-0.5 pl-0.5 pr-2.5 text-[11px]">
                      <span className="h-5 w-5 rounded-full border border-black/5" style={{ background: hex }} />
                      {named(hex).name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Ses matières</p>
                <div className="flex flex-wrap gap-2">
                  {active.materials.map((id) => {
                    const material = MATERIALS_BY_ID[id];
                    return material ? (
                      <span key={id} className="flex items-center gap-1.5 rounded-full border border-border py-0.5 pl-0.5 pr-2.5 text-[11px]">
                        <span className="h-5 w-5 rounded-full border border-black/5" style={{ background: material.swatch }} />
                        {material.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => toggle(active.id)} className={isChosen(active.id) ? "btn-ghost" : "btn-primary"}>
                {isChosen(active.id) ? "Retirer ce style" : "Choisir ce style"}
              </button>
              <button type="button" onClick={() => adopt(active)} className="btn-ghost">
                Adopter sa palette et ses matières
              </button>
            </div>
            {notice && (
              <p className="pop text-sm text-olive" role="status">
                {notice}
              </p>
            )}
          </div>
        </div>
      )}
      <p className="text-xs text-muted">Deux styles au plus : Hestia sait aussi marier les influences.</p>
    </div>
  );
}
