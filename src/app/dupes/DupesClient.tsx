"use client";

import { useRef, useState } from "react";
import { AddToBoardDialog } from "@/components/AddToBoardDialog";
import { DupeCard } from "@/components/DupeCard";
import { ImageDrop } from "@/components/ImageDrop";
import { formatPrice, ROOM_LABELS } from "@/lib/catalog";
import type { DupesStreamEvent } from "@/lib/dupes-schema";
import { compressImage, type CompressedImage } from "@/lib/image";
import type { NewBoardItem } from "@/lib/store";
import type { Dupe, DupesResult } from "@/lib/types";

interface Picked {
  api: CompressedImage;
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
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DupesResult | null>(null);
  const [verified, setVerified] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<NewBoardItem[] | null>(null);
  const abortRef = useRef<AbortController | null>(null);

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
    setLog([]);

    try {
      const response = await fetch("/api/dupes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          inspiration: { mediaType: inspiration.api.mediaType, data: inspiration.api.base64 },
          room: room ? { mediaType: room.api.mediaType, data: room.api.base64 } : undefined,
          budget,
          roomType: ROOM_LABELS[roomType as keyof typeof ROOM_LABELS],
          notes: notes.trim() || undefined,
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
            setVerified(new Set(event.verifiedUrls));
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

  const saveAll = () => {
    if (!result) return;
    const items: NewBoardItem[] = [];
    if (inspiration) items.push({ kind: "image", src: inspiration.thumb, caption: "Inspiration" });
    for (const dupe of result.dupes) items.push({ kind: "dupe", dupe });
    setSaving(items);
  };

  return (
    <div className="space-y-10">
      <header className="max-w-2xl space-y-3">
        <p className="kicker">Dupes IA</p>
        <h1 className="font-display text-4xl font-semibold leading-tight">Recréez une inspiration, dans votre budget</h1>
        <p className="text-muted">
          Enregistrez l&apos;épingle Pinterest qui vous plaît (capture d&apos;écran ou « Télécharger l&apos;image »), ajoutez
          si vous le souhaitez une photo de votre pièce, et laissez l&apos;IA dénicher les équivalents.
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
            <p className="font-medium">L&apos;IA chine pour vous… cela prend en général une à trois minutes.</p>
          </div>
          <ul className="space-y-1 text-sm text-muted">
            {log.slice(-6).map((line, index) => (
              <li key={`${index}-${line}`}>• {line}</li>
            ))}
          </ul>
        </section>
      )}

      {result && <Results result={result} budget={budget} verified={verified} onSave={setSaving} onSaveAll={saveAll} />}

      <AddToBoardDialog items={saving} onClose={() => setSaving(null)} />
    </div>
  );
}

function Results({
  result,
  budget,
  verified,
  onSave,
  onSaveAll,
}: {
  result: DupesResult;
  budget: number;
  verified: Set<string>;
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
            <h2 className="font-display text-3xl font-semibold">L&apos;ambiance décryptée</h2>
            <p className="text-muted">{result.ambianceSummary}</p>
          </div>
          <button onClick={onSaveAll} className="btn-primary">
            Tout enregistrer dans un tableau
          </button>
        </div>
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
            <span className="text-muted">Budget : {formatPrice(budget)}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
            <div className={`h-full rounded-full ${total > budget ? "bg-nope" : "bg-olive"}`} style={{ width: `${ratio * 100}%` }} />
          </div>
        </div>
        <div className="rounded-2xl bg-surface-muted p-5">
          <h3 className="mb-1 font-semibold">Pour votre pièce</h3>
          <p className="text-sm text-muted">{result.roomAdvice}</p>
        </div>
      </div>

      {groups.map(([title, dupes]) =>
        dupes.length ? (
          <div key={title} className="space-y-4">
            <h3 className="font-display text-2xl font-semibold">{title}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {dupes.map((dupe) => (
                <DupeCard key={dupe.url + dupe.productName} dupe={dupe} verified={verified.has(dupe.url)} onSave={() => onSave([{ kind: "dupe", dupe }])} />
              ))}
            </div>
          </div>
        ) : null,
      )}

      {result.budgetTips.length > 0 && (
        <div className="card p-6">
          <h3 className="mb-3 font-display text-2xl font-semibold">Astuces budget</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted">
            {result.budgetTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted">
        Les prix et disponibilités proviennent de recherches web au moment de la demande et peuvent avoir changé. Vérifiez
        toujours la fiche produit avant d&apos;acheter.
      </p>
    </section>
  );
}
