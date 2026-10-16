"use client";

import { useEffect, useMemo, useState } from "react";
import { COLORS_BY_HEX, type ColorFamily, DECOR_COLORS, type DecorColor, FAMILY_LABELS } from "@/lib/colors";
import { colorName } from "@/lib/palette";
import { TRENDS } from "@/lib/trends";
import type { LiveTrendsResponse } from "@/lib/trends-schema";

export interface ChosenColor {
  name: string;
  hex: string;
}

const MAX_COLORS = 6;

export const named = (hex: string): ChosenColor => ({ hex, name: COLORS_BY_HEX[hex.toLowerCase()]?.name ?? colorName(hex) });

/** Texte lisible (clair ou foncé) sur une couleur donnée. */
export function readableOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const luminance = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return luminance > 0.6 ? "#2b2420" : "#ffffff";
}

/**
 * Studio de couleurs : nuancier par familles, fiche détaillée au clic (code, description,
 * associations), palettes tendance et tirage au sort, pour composer la palette du projet.
 */
export function ColorStudio({ value, onChange }: { value: ChosenColor[]; onChange: (colors: ChosenColor[]) => void }) {
  const [family, setFamily] = useState<ColorFamily | "all">("all");
  const [active, setActive] = useState<DecorColor | null>(null);
  const [copied, setCopied] = useState(false);
  const [trendPalettes, setTrendPalettes] = useState(TRENDS.map((t) => ({ title: t.title, palette: t.palette })));

  // Palettes tendance : celles de l'onglet Tendances (actualisées depuis le web quand c'est possible).
  useEffect(() => {
    let alive = true;
    fetch("/api/trends")
      .then((response) => response.json() as Promise<LiveTrendsResponse>)
      .then((data) => alive && setTrendPalettes(data.trends.map((t) => ({ title: t.title, palette: t.palette }))))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const swatches = useMemo(() => (family === "all" ? DECOR_COLORS : DECOR_COLORS.filter((c) => c.family === family)), [family]);
  const isChosen = (hex: string) => value.some((c) => c.hex.toLowerCase() === hex.toLowerCase());

  const toggle = (hex: string) => {
    if (isChosen(hex)) onChange(value.filter((c) => c.hex.toLowerCase() !== hex.toLowerCase()));
    else if (value.length < MAX_COLORS) onChange([...value, named(hex)]);
  };
  const adopt = (palette: string[]) => onChange(palette.slice(0, MAX_COLORS).map(named));
  const surprise = () => {
    const color = DECOR_COLORS[Math.floor(Math.random() * DECOR_COLORS.length)];
    const pairing = color.pairings[Math.floor(Math.random() * color.pairings.length)];
    adopt(pairing.colors);
    setActive(color);
  };
  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* presse-papiers indisponible : le code reste affiché */
    }
  };

  return (
    <div className="min-w-0 space-y-5">
      {/* Palette du projet */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-h-12 flex-1 flex-wrap items-center gap-2 rounded-2xl border border-dashed border-border bg-surface-muted/50 p-2">
          {value.length === 0 ? (
            <span className="px-2 text-sm text-muted">Touchez une couleur pour la découvrir, puis ajoutez-la à votre palette.</span>
          ) : (
            value.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => toggle(color.hex)}
                className="pop flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-semibold shadow-sm"
                style={{ background: color.hex, color: readableOn(color.hex) }}
                aria-label={`Retirer ${color.name}`}
              >
                <span className="h-6 w-6 rounded-full border-2 border-white/70" style={{ background: color.hex }} />
                {color.name} ×
              </button>
            ))
          )}
        </div>
        <button type="button" onClick={surprise} className="btn-ghost">
          🎲 Surprenez-moi
        </button>
      </div>

      {/* Familles */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {(["all", ...Object.keys(FAMILY_LABELS)] as (ColorFamily | "all")[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFamily(f)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition ${
              family === f ? "bg-foreground text-background" : "bg-surface-muted hover:bg-border"
            }`}
          >
            {f === "all" ? "Toutes" : FAMILY_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Nuancier */}
      <ul className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6 lg:grid-cols-9">
        {swatches.map((color) => {
          const chosen = isChosen(color.hex);
          const selected = active?.id === color.id;
          return (
            <li key={color.id}>
              <button
                type="button"
                onClick={() => {
                  setActive(color);
                  setCopied(false);
                }}
                className="group flex w-full flex-col items-center gap-1.5"
                aria-pressed={selected}
                aria-label={`${color.name}, ${color.hex}`}
              >
                <span
                  className={`relative grid h-14 w-14 place-items-center rounded-full border border-black/5 shadow-sm transition group-hover:-rotate-6 group-hover:scale-110 ${
                    selected ? "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-surface" : ""
                  }`}
                  style={{ background: color.hex }}
                >
                  {chosen && (
                    <span className="pop text-lg font-bold" style={{ color: readableOn(color.hex) }}>
                      ✓
                    </span>
                  )}
                </span>
                <span className="text-center text-[11px] leading-tight">{color.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Fiche de la couleur */}
      {active && (
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3 p-5" style={{ background: active.hex, color: readableOn(active.hex) }}>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] opacity-80">{active.mood}</p>
              <h3 className="font-display text-3xl">{active.name}</h3>
            </div>
            <button
              type="button"
              onClick={() => copy(active.hex)}
              className="rounded-full bg-white/85 px-4 py-2 font-mono text-sm text-[#2b2420] shadow transition hover:bg-white"
              title="Copier le code couleur"
            >
              {copied ? "Copié ✓" : `${active.hex} · copier`}
            </button>
          </div>
          <div className="space-y-4 p-5">
            <p className="text-sm leading-relaxed">{active.description}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted">Idéale pour :</span>
              {active.rooms.map((room) => (
                <span key={room} className="rounded-full bg-surface-muted px-2.5 py-1">
                  {room}
                </span>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Elle se marie bien avec…</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {active.pairings.map((pairing) => (
                  <div key={pairing.name} className="flex items-center gap-3 rounded-2xl bg-surface-muted/60 p-3">
                    <div className="flex -space-x-2">
                      {pairing.colors.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => {
                            const next = COLORS_BY_HEX[hex.toLowerCase()];
                            if (next) setActive(next);
                          }}
                          className="h-9 w-9 rounded-full border-2 border-white shadow-sm transition hover:z-10 hover:scale-110"
                          style={{ background: hex }}
                          title={`${named(hex).name} · ${hex}`}
                          aria-label={`Voir ${named(hex).name}`}
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{pairing.name}</p>
                      <p className="truncate text-[11px] text-muted">{pairing.colors.map((hex) => named(hex).name).join(" · ")}</p>
                    </div>
                    <button type="button" onClick={() => adopt(pairing.colors)} className="shrink-0 text-xs font-semibold text-accent hover:underline">
                      Adopter
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggle(active.hex)}
              disabled={!isChosen(active.hex) && value.length >= MAX_COLORS}
              className={isChosen(active.hex) ? "btn-ghost" : "btn-primary"}
            >
              {isChosen(active.hex) ? "Retirer de ma palette" : value.length >= MAX_COLORS ? "Palette complète (6 couleurs)" : "Ajouter à ma palette"}
            </button>
          </div>
        </div>
      )}

      {/* Palettes tendance */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Palettes tendance</p>
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {trendPalettes.map((trend) => (
            <button
              key={trend.title}
              type="button"
              onClick={() => adopt(trend.palette)}
              className="w-44 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface text-left transition hover:-translate-y-0.5 hover:shadow-md"
              title="Adopter cette palette"
            >
              <span className="flex h-14">
                {trend.palette.map((hex) => (
                  <span key={hex} className="flex-1" style={{ background: hex }} />
                ))}
              </span>
              <span className="block p-2.5 text-xs font-medium leading-snug">{trend.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
