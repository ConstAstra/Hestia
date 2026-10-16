"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AddToBoardDialog } from "@/components/AddToBoardDialog";
import { type ChosenColor, ColorStudio } from "@/components/ColorStudio";
import { DupeCard } from "@/components/DupeCard";
import { ImageDrop } from "@/components/ImageDrop";
import { MaterialStudio } from "@/components/MaterialStudio";
import { StyleStudio } from "@/components/StyleStudio";
import { formatPrice, ROOM_LABELS } from "@/lib/catalog";
import type { DupesStreamEvent } from "@/lib/dupes-schema";
import { MATERIALS_BY_ID } from "@/lib/materials";
import { STYLES_BY_ID } from "@/lib/styles";
import { creationTitle } from "@/lib/creation-title";
import { compressImage, type CompressedImage } from "@/lib/image";
import { DUPES_PHOTO_KEY } from "@/lib/actions";
import { type NewBoardItem, useHestia } from "@/lib/store";
import type { CreationInfo, Dupe, DupesResult, Photo } from "@/lib/types";

interface Picked {
  /** Image déposée par l'utilisateur, prête pour l'API. */
  api?: CompressedImage;
  /** Ou photo venue du fil d'inspiration (« Recréer ce look »). */
  photo?: Photo;
  /** Version légère pour l'aperçu et les tableaux (stockés localement). */
  thumb: string;
}

async function prepare(file: File): Promise<Picked> {
  const [api, thumb] = await Promise.all([compressImage(file), compressImage(file, 720, 0.8)]);
  return { api, thumb: thumb.dataUrl };
}

const BUDGET_PRESETS = [200, 500, 1000, 2500];

export function DupesClient() {
  const [inspiration, setInspiration] = useState<Picked | null>(null);
  const [room, setRoom] = useState<Picked | null>(null);
  const [budget, setBudget] = useState(500);
  const [roomType, setRoomType] = useState("salon");
  const [notes, setNotes] = useState("");
  const [colors, setColors] = useState<ChosenColor[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DupesResult | null>(null);
  const [discarded, setDiscarded] = useState(0);
  const [savedBoard, setSavedBoard] = useState<{ id: string; name: string } | null>(null);
  const createCreationBoard = useHestia((s) => s.createCreationBoard);
  const [saving, setSaving] = useState<NewBoardItem[] | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Photo choisie dans le fil (« Recréer ce look ») : on la reprend comme inspiration.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(DUPES_PHOTO_KEY);
      if (!stored) return;
      sessionStorage.removeItem(DUPES_PHOTO_KEY);
      const photo = JSON.parse(stored) as Photo;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique du stockage de session au montage
      setInspiration({ photo, thumb: photo.src.medium });
    } catch {
      /* stockage indisponible : l'utilisateur déposera l'image lui-même */
    }
  }, []);

  const handleFile = (setter: (picked: Picked) => void) => async (file: File) => {
    setError(null);
    try {
      setter(await prepare(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image illisible.");
    }
  };

  const submit = async () => {
    if (!inspiration) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setResult(null);
    setSavedBoard(null);
    setLog([]);

    try {
      const response = await fetch("/api/dupes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          inspiration: inspiration.api ? { mediaType: inspiration.api.mediaType, data: inspiration.api.base64 } : undefined,
          inspirationUrl: inspiration.photo?.src.large,
          room: room?.api ? { mediaType: room.api.mediaType, data: room.api.base64 } : undefined,
          budget,
          roomType: ROOM_LABELS[roomType as keyof typeof ROOM_LABELS],
          notes: notes.trim() || undefined,
          styles: styles.length ? styles.map((id) => STYLES_BY_ID[id]?.name ?? id) : undefined,
          colors: colors.length ? colors : undefined,
          materials: materials.length ? materials.map((id) => MATERIALS_BY_ID[id]?.name ?? id) : undefined,
        }),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Le service est indisponible pour le moment.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as DupesStreamEvent;
          if (event.type === "status") setLog((previous) => [...previous, event.message]);
          if (event.type === "error") setError(event.message);
          if (event.type === "result") {
            setResult(event.result);
            setDiscarded(event.discarded);
            setSavedBoard(autoSave(event.result));
          }
        }
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        setError(e instanceof Error ? e.message : "Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  /** Enregistre automatiquement la création dans un tableau « Mes créations », titré d'après ses caractéristiques. */
  const autoSave = (created: DupesResult) => {
    const info: CreationInfo = {
      styles: styles.map((id) => STYLES_BY_ID[id]?.name ?? id),
      room: ROOM_LABELS[roomType as keyof typeof ROOM_LABELS],
      colors: colors.length ? colors : created.palette.slice(0, 5),
      materials: materials.map((id) => MATERIALS_BY_ID[id]?.name ?? id),
      budget,
      total: created.dupes.reduce((sum, dupe) => sum + dupe.price, 0),
    };
    const items: NewBoardItem[] = [];
    if (inspiration?.photo) items.push({ kind: "photo", photo: inspiration.photo });
    else if (inspiration) items.push({ kind: "image", src: inspiration.thumb, caption: "Inspiration" });
    items.push({ kind: "note", text: created.ambianceSummary, color: "#f6e2d8" });
    for (const dupe of created.dupes) items.push({ kind: "dupe", dupe });
    const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    const name = creationTitle(info);
    const description = `Création du ${date} · ${created.dupes.length} produit${created.dupes.length > 1 ? "s" : ""} · ${formatPrice(info.total)} pour un budget de ${formatPrice(budget)}`;
    return { id: createCreationBoard(name, description, info, items), name };
  };

  const saveAll = () => {
    if (!result) return;
    const items: NewBoardItem[] = [];
    if (inspiration?.photo) items.push({ kind: "photo", photo: inspiration.photo });
    else if (inspiration) items.push({ kind: "image", src: inspiration.thumb, caption: "Inspiration" });
    for (const dupe of result.dupes) items.push({ kind: "dupe", dupe });
    setSaving(items);
  };

  return (
    <div className="space-y-10">
      <header className="max-w-2xl space-y-3">
        <p className="kicker">Outil de création</p>
        <h1 className="font-display text-4xl md:text-6xl leading-tight">Recréez une inspiration, dans votre budget</h1>
        <p className="text-muted">
          Ajoutez l&apos;inspiration qui vous plaît (une photo enregistrée ou une capture d&apos;écran), ajoutez
          si vous le souhaitez une photo de votre pièce, et laissez Hestia dénicher les équivalents.
        </p>
      </header>

      <section className="card grid gap-6 p-5 md:grid-cols-2 md:p-8">
        <ImageDrop
          label="1. Votre inspiration"
          hint="Cliquez, glissez une image ou collez-la (Ctrl/Cmd + V)"
          preview={inspiration?.thumb ?? null}
          onFile={handleFile(setInspiration)}
          onClear={() => setInspiration(null)}
        />
        <ImageDrop
          label="2. Votre pièce (facultatif)"
          hint="Une photo de la pièce à aménager, pour des conseils sur mesure"
          preview={room?.thumb ?? null}
          onFile={handleFile(setRoom)}
          onClear={() => setRoom(null)}
        />

        <div className="space-y-3">
          <label className="text-sm font-semibold" htmlFor="budget">
            3. Votre budget total : <span className="text-accent-strong">{formatPrice(budget)}</span>
          </label>
          <input
            id="budget"
            type="range"
            min={50}
            max={5000}
            step={50}
            value={budget}
            onChange={(event) => setBudget(Number(event.target.value))}
            className="w-full accent-[var(--accent)]"
          />
          <div className="flex flex-wrap gap-2">
            {BUDGET_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setBudget(preset)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  budget === preset ? "border-accent bg-accent-soft text-accent-strong" : "border-border"
                }`}
              >
                {formatPrice(preset)}
              </button>
            ))}
            <input
              type="number"
              min={30}
              max={50000}
              value={budget}
              onChange={(event) => setBudget(Math.max(0, Number(event.target.value)))}
              className="input w-28 py-1"
              aria-label="Budget personnalisé en euros"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold" htmlFor="roomType">
            4. Quelques précisions
          </label>
          <select id="roomType" value={roomType} onChange={(event) => setRoomType(event.target.value)} className="input">
            {Object.entries(ROOM_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={600}
            rows={3}
            placeholder="Ex. : je garde mon canapé gris, j'ai un chat, je préfère la seconde main…"
            className="input resize-none"
          />
        </div>

        <div className="min-w-0 space-y-3 border-t border-border pt-6 md:col-span-2">
          <div>
            <p className="text-sm font-semibold">5. Votre style (facultatif)</p>
            <p className="text-sm text-muted">
              Moderne, bohème, kinfolk, méditerranéen… Choisissez l&apos;esprit de votre projet, et adoptez si vous le souhaitez sa palette et
              ses matières.
            </p>
          </div>
          <StyleStudio
            value={styles}
            onChange={setStyles}
            onAdoptPalette={(nextColors, nextMaterials) => {
              setColors(nextColors.slice(0, 6));
              setMaterials(nextMaterials.slice(0, 5));
            }}
          />
        </div>

        <div className="min-w-0 space-y-3 border-t border-border pt-6 md:col-span-2">
          <div>
            <p className="text-sm font-semibold">6. Vos couleurs (facultatif)</p>
            <p className="text-sm text-muted">
              Composez la palette de votre projet : Hestia privilégiera des pièces dans ces teintes.
            </p>
          </div>
          <ColorStudio value={colors} onChange={setColors} />
        </div>

        <div className="min-w-0 space-y-3 border-t border-border pt-6 md:col-span-2">
          <div>
            <p className="text-sm font-semibold">7. Vos matières (facultatif)</p>
            <p className="text-sm text-muted">
              Bois, fibres, pierre, métal… Choisissez les matières de votre projet : Hestia cherchera des pièces qui les mettent à
              l&apos;honneur.
            </p>
          </div>
          <MaterialStudio value={materials} onChange={setMaterials} colors={colors} onColorsChange={setColors} />
        </div>

        <div className="flex flex-col items-start gap-3 md:col-span-2 md:flex-row md:items-center">
          <button onClick={submit} disabled={!inspiration || loading || budget < 30} className="btn-primary px-7 py-3 text-base">
            {loading ? "Recherche en cours…" : "Trouver mes dupes ✦"}
          </button>
          {loading && (
            <button onClick={() => abortRef.current?.abort()} className="text-sm text-muted underline">
              Annuler
            </button>
          )}
          {!inspiration && <p className="text-sm text-muted">Ajoutez d&apos;abord une image d&apos;inspiration.</p>}
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-2xl border border-nope/40 bg-nope/10 px-5 py-4 text-sm">
          {error}
        </p>
      )}

      {loading && (
        <section className="card space-y-3 p-6" aria-live="polite">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 animate-ping rounded-full bg-accent" aria-hidden />
            <p className="font-medium">Hestia chine pour vous… cela prend en général une à trois minutes.</p>
          </div>
          <ul className="space-y-1 text-sm text-muted">
            {log.slice(-6).map((line, index) => (
              <li key={`${index}-${line}`}>• {line}</li>
            ))}
          </ul>
        </section>
      )}

      {result && <Results result={result} budget={budget} discarded={discarded} savedBoard={savedBoard} onSave={setSaving} onSaveAll={saveAll} />}

      <AddToBoardDialog items={saving} onClose={() => setSaving(null)} />
    </div>
  );
}

function Results({
  result,
  budget,
  discarded,
  savedBoard,
  onSave,
  onSaveAll,
}: {
  result: DupesResult;
  budget: number;
  discarded: number;
  savedBoard: { id: string; name: string } | null;
  onSave: (items: NewBoardItem[]) => void;
  onSaveAll: () => void;
}) {
  const total = result.dupes.reduce((sum, dupe) => sum + dupe.price, 0);
  const ratio = Math.min(1, total / budget);
  const groups: [string, Dupe[]][] = [
    ["Les essentiels", result.dupes.filter((d) => d.priority === "essentiel")],
    ["Si le budget le permet", result.dupes.filter((d) => d.priority === "bonus")],
  ];

  return (
    <section className="space-y-8">
      <div className="card space-y-5 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display text-3xl">L&apos;ambiance décryptée</h2>
            <p className="text-muted">{result.ambianceSummary}</p>
          </div>
        </div>
        {savedBoard && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-olive-soft/60 px-4 py-3 text-sm" role="status">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-olive text-white" aria-hidden>
              ✓
            </span>
            <p className="min-w-0 flex-1">
              Enregistrée automatiquement dans <span className="font-semibold">Tableaux › Mes créations</span>
              <span className="block truncate text-muted">« {savedBoard.name} »</span>
            </p>
            <Link href={`/tableaux/${savedBoard.id}`} className="btn-primary py-2">
              Voir le tableau
            </Link>
            <button onClick={onSaveAll} className="btn-ghost py-2">
              Ajouter à un autre tableau
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {result.palette.map((color) => (
            <div key={`${color.hex}-${color.name}`} className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm">
              <span className="h-7 w-7 rounded-full border border-border" style={{ background: color.hex }} aria-hidden />
              {color.name}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total : {formatPrice(total)}</span>
            <span className={total > budget ? "font-medium text-accent-strong" : "text-muted"}>
              Budget : {formatPrice(budget)}
              {total > budget && ` · dépassé de ${formatPrice(total - budget)}`}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
            <div className={`h-full rounded-full ${total > budget ? "bg-accent" : "bg-olive"}`} style={{ width: `${ratio * 100}%` }} />
          </div>
        </div>
        <div className="rounded-2xl bg-surface-muted p-5">
          <h3 className="mb-1 font-semibold">Pour votre pièce</h3>
          <p className="text-sm text-muted">{result.roomAdvice}</p>
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-2xl bg-olive-soft/60 px-4 py-3 text-sm">
        <span aria-hidden>✓</span>
        <span>
          Chaque produit a été trouvé en ligne par Hestia, avec sa référence et son prix relevés sur la fiche de l&apos;enseigne.
          {discarded > 0 &&
            ` ${discarded} proposition${discarded > 1 ? "s" : ""} non confirmée${discarded > 1 ? "s" : ""} en ligne ${discarded > 1 ? "ont" : "a"} été écartée${discarded > 1 ? "s" : ""}.`}
        </span>
      </p>

      {groups.map(([title, dupes]) =>
        dupes.length ? (
          <div key={title} className="space-y-4">
            <h3 className="font-display text-2xl">{title}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {dupes.map((dupe) => (
                <DupeCard key={dupe.url + dupe.productName} dupe={dupe} onSave={() => onSave([{ kind: "dupe", dupe }])} />
              ))}
            </div>
          </div>
        ) : null,
      )}

      {result.budgetTips.length > 0 && (
        <div className="card p-6">
          <h3 className="mb-3 font-display text-2xl">Astuces budget</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted">
            {result.budgetTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted">
        Les prix et disponibilités proviennent de recherches web au moment de la demande et peuvent avoir changé. Vérifiez
        toujours la fiche produit avant d&apos;acheter. Les liens « Acheter via Hestia » peuvent être des liens affiliés : Hestia
        perçoit alors une petite commission, sans aucun surcoût pour vous.
      </p>
    </section>
  );
}
