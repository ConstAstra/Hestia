"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type ChosenColor, named } from "@/components/ColorStudio";
import {
  DECOR_MATERIALS,
  type DecorMaterial,
  MATERIAL_FAMILY_LABELS,
  MATERIAL_MOODS,
  type MaterialFamily,
  MATERIALS_BY_ID,
} from "@/lib/materials";

const MAX_MATERIALS = 5;
const MAX_COLORS = 6;

function Swatch({ material, className = "" }: { material: DecorMaterial; className?: string }) {
  return <span className={`block border border-black/5 ${className}`} style={{ background: material.swatch }} />;
}

/**
 * Matériauthèque : matières par familles, fiche détaillée au clic (description, pièces,
 * conseil, associations de matières et de couleurs) et ambiances prêtes à adopter.
 * Adopter une association complète aussi la palette de couleurs du projet.
 */
export function MaterialStudio({
  value,
  onChange,
  colors,
  onColorsChange,
}: {
  value: string[];
  onChange: (materials: string[]) => void;
  colors: ChosenColor[];
  onColorsChange: (colors: ChosenColor[]) => void;
}) {
  const [family, setFamily] = useState<MaterialFamily | "all">("all");
  const [active, setActive] = useState<DecorMaterial | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // La fiche s'ouvre sous la grille : on l'amène à l'écran (indispensable sur mobile).
  useEffect(() => {
    if (active) sheetRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [active]);
  const [notice, setNotice] = useState<string | null>(null);

  const swatches = useMemo(
    () => (family === "all" ? DECOR_MATERIALS : DECOR_MATERIALS.filter((m) => m.family === family)),
    [family],
  );
  const isChosen = (id: string) => value.includes(id);

  const toggle = (id: string) => {
    if (isChosen(id)) onChange(value.filter((m) => m !== id));
    else if (value.length < MAX_MATERIALS) onChange([...value, id]);
  };

  /** Adopte un accord : ses matières remplacent la sélection, ses couleurs s'ajoutent à la palette. */
  const adopt = (materials: string[], hexes: string[], label: string) => {
    onChange([...new Set(materials)].filter((id) => MATERIALS_BY_ID[id]).slice(0, MAX_MATERIALS));
    const known = new Set(colors.map((c) => c.hex.toLowerCase()));
    const added = hexes.filter((hex) => !known.has(hex.toLowerCase())).slice(0, Math.max(0, MAX_COLORS - colors.length));
    if (added.length) onColorsChange([...colors, ...added.map(named)]);
    setNotice(
      added.length
        ? `« ${label} » adopté : ${added.length} couleur${added.length > 1 ? "s" : ""} ajoutée${added.length > 1 ? "s" : ""} à votre palette.`
        : `« ${label} » adopté.`,
    );
  };

  const surprise = () => {
    const material = DECOR_MATERIALS[Math.floor(Math.random() * DECOR_MATERIALS.length)];
    const pairing = material.pairings[Math.floor(Math.random() * material.pairings.length)];
    adopt([material.id, ...pairing.materials], pairing.colors, pairing.name);
    setActive(material);
  };

  return (
    <div className="min-w-0 space-y-5">
      {/* Matières du projet */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-h-12 min-w-[15rem] flex-1 flex-wrap items-center gap-2 rounded-2xl border border-dashed border-border bg-surface-muted/50 p-2">
          {value.length === 0 ? (
            <span className="px-2 text-sm text-muted">Touchez une matière pour la découvrir, puis ajoutez-la à votre sélection.</span>
          ) : (
            value.map((id) => {
              const material = MATERIALS_BY_ID[id];
              if (!material) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  className="pop flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 text-xs font-semibold shadow-sm"
                  aria-label={`Retirer ${material.name}`}
                >
                  <Swatch material={material} className="h-6 w-6 rounded-full" />
                  {material.name} ×
                </button>
              );
            })
          )}
        </div>
        <button type="button" onClick={surprise} className="btn-ghost">
          🎲 Surprenez-moi
        </button>
      </div>
      {notice && (
        <p className="pop text-sm text-olive" role="status">
          {notice}
        </p>
      )}

      {/* Familles */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {(["all", ...Object.keys(MATERIAL_FAMILY_LABELS)] as (MaterialFamily | "all")[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFamily(f)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition ${
              family === f ? "bg-foreground text-background" : "bg-surface-muted hover:bg-border"
            }`}
          >
            {f === "all" ? "Toutes" : MATERIAL_FAMILY_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Échantillons */}
      <ul className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6 lg:grid-cols-8">
        {swatches.map((material) => {
          const chosen = isChosen(material.id);
          const selected = active?.id === material.id;
          return (
            <li key={material.id}>
              <button
                type="button"
                onClick={() => setActive(material)}
                className="group flex w-full flex-col items-center gap-1.5"
                aria-pressed={selected}
                aria-label={material.name}
              >
                <span
                  className={`relative grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-black/5 shadow-sm transition group-hover:rotate-3 group-hover:scale-110 ${
                    selected ? "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-surface" : ""
                  }`}
                  style={{ background: material.swatch }}
                >
                  {chosen && (
                    <span className="pop grid h-6 w-6 place-items-center rounded-full bg-white/90 text-sm font-bold text-[#2b2420]">✓</span>
                  )}
                </span>
                <span className="text-center text-[11px] leading-tight">{material.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Fiche de la matière */}
      {active && (
        <div ref={sheetRef} className="scroll-mt-24 scroll-mb-28 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="relative p-5" style={{ background: active.swatch }}>
            <div className="inline-block rounded-2xl bg-white/85 px-4 py-2 text-[#2b2420] shadow-sm backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.14em] opacity-75">{active.mood}</p>
              <h3 className="font-display text-3xl">{active.name}</h3>
            </div>
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
            <p className="rounded-2xl bg-surface-muted/60 px-4 py-3 text-sm">
              <span className="font-semibold">Bon à savoir · </span>
              {active.tip}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Elle s&apos;associe bien avec…</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {active.pairings.map((pairing) => {
                  const partners = pairing.materials.map((id) => MATERIALS_BY_ID[id]).filter(Boolean);
                  return (
                    <div key={pairing.name} className="space-y-2.5 rounded-2xl bg-surface-muted/60 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{pairing.name}</p>
                        <button
                          type="button"
                          onClick={() => adopt([active.id, ...pairing.materials], pairing.colors, pairing.name)}
                          className="shrink-0 text-xs font-semibold text-accent hover:underline"
                        >
                          Adopter
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {partners.map((partner) => (
                          <button
                            key={partner.id}
                            type="button"
                            onClick={() => setActive(partner)}
                            className="flex items-center gap-1.5 rounded-full bg-surface py-0.5 pl-0.5 pr-2.5 text-[11px] shadow-sm transition hover:scale-105"
                            title={`Voir ${partner.name}`}
                          >
                            <Swatch material={partner} className="h-6 w-6 rounded-full" />
                            {partner.name}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex -space-x-1.5">
                          {pairing.colors.map((hex) => (
                            <span
                              key={hex}
                              className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                              style={{ background: hex }}
                              title={`${named(hex).name} · ${hex}`}
                            />
                          ))}
                        </span>
                        <span className="truncate text-[11px] text-muted">{pairing.colors.map((hex) => named(hex).name).join(" · ")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggle(active.id)}
              disabled={!isChosen(active.id) && value.length >= MAX_MATERIALS}
              className={isChosen(active.id) ? "btn-ghost" : "btn-primary"}
            >
              {isChosen(active.id)
                ? "Retirer de ma sélection"
                : value.length >= MAX_MATERIALS
                  ? "Sélection complète (5 matières)"
                  : "Ajouter à ma sélection"}
            </button>
          </div>
        </div>
      )}

      {/* Ambiances matières */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Ambiances matières</p>
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {MATERIAL_MOODS.map((mood) => (
            <button
              key={mood.name}
              type="button"
              onClick={() => adopt(mood.materials, mood.colors, mood.name)}
              className="w-44 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface text-left transition hover:-translate-y-0.5 hover:shadow-md"
              title="Adopter cette ambiance (matières et couleurs)"
            >
              <span className="flex h-14">
                {mood.materials.map((id) => (
                  <span key={id} className="flex-1" style={{ background: MATERIALS_BY_ID[id]?.swatch }} />
                ))}
              </span>
              <span className="flex h-1.5">
                {mood.colors.map((hex) => (
                  <span key={hex} className="flex-1" style={{ background: hex }} />
                ))}
              </span>
              <span className="block p-2.5 text-xs font-medium leading-snug">{mood.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
