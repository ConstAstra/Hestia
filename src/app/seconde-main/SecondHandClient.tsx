"use client";

import { useEffect, useRef, useState } from "react";
import { AddToBoardDialog } from "@/components/AddToBoardDialog";
import { DupeCard } from "@/components/DupeCard";
import { MATERIALS_BY_ID } from "@/lib/materials";
import { platformSearchLinks, SECOND_HAND_FINDS, SECOND_HAND_PLATFORMS } from "@/lib/second-hand-finds";
import type { Listing, SecondHandStreamEvent } from "@/lib/second-hand-schema";
import type { NewBoardItem } from "@/lib/store";

const QUICK_SEARCHES = ["Buffet vintage", "Chaises cannées", "Fauteuil en rotin", "Table en bois massif", "Lampe vintage", "Miroir ancien"];
const STORAGE_KEY = "hestia:second-hand";

interface SearchState {
  query: string;
  listings: Listing[];
  tips: string[];
  discarded: number;
}

export function SecondHandClient() {
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchState | null>(null);
  const [saving, setSaving] = useState<NewBoardItem[] | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  // On retrouve la dernière recherche en revenant sur l'onglet (pendant la session).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique au montage
      if (saved) setResults(JSON.parse(saved) as SearchState);
    } catch {}
  }, []);

  const search = async (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 2 || loading) return;
    setQuery(trimmed);
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setStatus("Hestia part chiner…");
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    try {
      const response = await fetch("/api/second-hand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          query: trimmed,
          maxPrice: Number(maxPrice) >= 5 ? Number(maxPrice) : undefined,
          city: city.trim() || undefined,
        }),
      });
      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "La recherche n'a pas pu démarrer.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as SecondHandStreamEvent;
          if (event.type === "status") setStatus(event.message);
          if (event.type === "error") setError(event.message);
          if (event.type === "result") {
            const next = { query: trimmed, listings: event.listings, tips: event.tips, discarded: event.discarded };
            setResults(next);
            try {
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {}
          }
        }
      }
    } catch (e) {
      if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
      setStatus(null);
    }
  };

  const save = (listing: Listing) =>
    setSaving([{ kind: "dupe", dupe: { ...listing, originalItem: "Seconde main", category: "Seconde main", priority: "bonus" } }]);

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <p className="kicker">Seconde main</p>
        <h1 className="font-display text-4xl md:text-6xl">Chiner, c&apos;est décorer autrement</h1>
        <p className="max-w-2xl text-muted">
          Des meubles et objets d&apos;occasion réellement en vente, trouvés par Hestia sur les plateformes de seconde main : plus
          de caractère, des prix doux, et une déco plus responsable.
        </p>
      </header>

      <form
        className="card space-y-4 p-5 md:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void search(query);
        }}
      >
        <div className="grid gap-3 md:grid-cols-[1fr_160px_200px_auto]">
          <input
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Que cherchez-vous ? Ex. : buffet en teck, chaises cannées…"
            maxLength={120}
            aria-label="Ce que vous cherchez"
          />
          <input
            className="input"
            inputMode="numeric"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value.replace(/\D/g, ""))}
            placeholder="Budget max (€)"
            aria-label="Budget maximum en euros"
          />
          <input className="input" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Ville (facultatif)" maxLength={60} aria-label="Ville" />
          <button className="btn-primary" disabled={query.trim().length < 2 || loading}>
            {loading ? "Recherche…" : "Chiner avec Hestia ✦"}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Idées :</span>
          {QUICK_SEARCHES.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void search(suggestion)}
              disabled={loading}
              className="rounded-full bg-surface-muted px-3 py-1 text-xs transition hover:bg-border disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>

      <section ref={resultsRef} className="scroll-mt-24 space-y-5" aria-live="polite">
        {loading && (
          <div className="flex items-center gap-3 rounded-2xl bg-surface-muted px-4 py-4 text-sm" role="status">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
            <span>{status} Cela prend en général une à deux minutes.</span>
            <button type="button" onClick={() => abortRef.current?.abort()} className="ml-auto text-xs text-muted underline">
              Annuler
            </button>
          </div>
        )}
        {error && <p className="rounded-2xl bg-accent-soft px-4 py-3 text-sm text-accent-strong">{error}</p>}
        {results && !loading && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="font-display text-3xl">Annonces pour « {results.query} »</h2>
              <p className="text-xs text-muted">
                Annonces trouvées en ligne et vérifiées par Hestia
                {results.discarded > 0 && ` · ${results.discarded} non confirmée${results.discarded > 1 ? "s" : ""} écartée${results.discarded > 1 ? "s" : ""}`}
              </p>
            </div>
            {results.listings.length ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.listings.map((listing) => (
                  <DupeCard key={listing.url} dupe={listing} onSave={() => save(listing)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">Aucune annonce fiable cette fois-ci : essayez une formulation plus large, ou les liens directs ci-dessous.</p>
            )}
            {results.tips.length > 0 && (
              <div className="rounded-3xl bg-olive-soft/50 p-5">
                <h3 className="mb-2 font-semibold">Les conseils de chine d&apos;Hestia</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {results.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-muted">
              Les annonces de seconde main partent vite : vérifiez la disponibilité, l&apos;état et les conditions de retrait avant
              d&apos;acheter. Les liens « Acheter via Hestia » peuvent être des liens affiliés, sans surcoût pour vous.
            </p>
          </>
        )}
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-display text-3xl">Les pièces à chiner</h2>
          <p className="text-sm text-muted">Des classiques que l&apos;on trouve facilement d&apos;occasion, et ce qu&apos;il faut vérifier avant d&apos;acheter.</p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SECOND_HAND_FINDS.map((find) => (
            <li key={find.id} className="card flex flex-col overflow-hidden">
              <div className="h-20" style={{ background: MATERIALS_BY_ID[find.material]?.swatch }} aria-hidden />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{find.era}</p>
                  <h3 className="font-semibold leading-snug">{find.name}</h3>
                </div>
                <p className="text-sm text-muted">{find.description}</p>
                <p className="rounded-xl bg-surface-muted px-3 py-2 text-xs">
                  <span className="font-semibold">À vérifier · </span>
                  {find.check}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                  <button type="button" onClick={() => void search(find.query)} disabled={loading} className="btn-primary px-4 py-1.5 text-xs">
                    Chiner avec Hestia
                  </button>
                  {platformSearchLinks(find.query).map((link) => (
                    <a key={link.name} href={link.href} target="_blank" rel="sponsored nofollow noopener" className="text-xs text-muted underline hover:text-foreground">
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-3xl">Où chiner</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECOND_HAND_PLATFORMS.map((platform) => (
            <li key={platform.name}>
              <a
                href={platform.url}
                target="_blank"
                rel="noopener nofollow"
                className="flex h-full flex-col rounded-2xl border border-border p-4 transition hover:border-olive hover:bg-olive-soft/40"
              >
                <span className="font-semibold">{platform.name} ↗</span>
                <span className="text-sm text-muted">{platform.note}</span>
              </a>
            </li>
          ))}
          <li className="flex flex-col rounded-2xl bg-surface-muted p-4">
            <span className="font-semibold">Et près de chez vous</span>
            <span className="text-sm text-muted">Ressourceries, dépôts-ventes, vide-greniers et brocantes du week-end : les meilleures trouvailles s&apos;y cachent.</span>
          </li>
        </ul>
      </section>

      <AddToBoardDialog items={saving} onClose={() => setSaving(null)} />
    </div>
  );
}
