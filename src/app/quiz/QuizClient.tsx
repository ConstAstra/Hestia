"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PersonalityCard } from "@/components/PersonalityCard";
import { Visual } from "@/components/Visual";
import { COLORS_BY_HEX } from "@/lib/colors";
import { MATERIALS_BY_ID } from "@/lib/materials";
import { burstHearts, confetti, haptic } from "@/lib/celebrate";
import { computeQuizResult, QUIZ, type QuizResult } from "@/lib/quiz";
import { useHestia, useHydrated } from "@/lib/store";
import { renderStory, shareStory } from "@/lib/story";
import { STYLES_BY_ID } from "@/lib/styles";

export function QuizClient() {
  const hydrated = useHydrated();
  const saved = useHestia((s) => s.quizResult);
  const setQuizResult = useHestia((s) => s.setQuizResult);
  const [step, setStep] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [picked, setPicked] = useState<string | null>(null);

  const start = () => {
    setAnswers({});
    setStep(0);
  };

  const choose = (optionId: string, tile?: Element) => {
    if (step === null || picked) return;
    burstHearts(tile, 10);
    haptic(8);
    const question = QUIZ[step];
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    setPicked(optionId);
    // Un court instant pour voir la sélection, puis la question suivante.
    setTimeout(() => {
      setPicked(null);
      if (step + 1 < QUIZ.length) setStep(step + 1);
      else {
        setQuizResult(computeQuizResult(next));
        setStep(null);
        // Le grand moment : pluie de confettis à la révélation du style.
        setTimeout(() => {
          confetti(120);
          haptic([20, 40, 20]);
        }, 150);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 320);
  };

  if (step !== null) {
    const question = QUIZ[step];
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Barres de progression façon stories */}
        <div className="flex gap-1.5" aria-label={`Question ${step + 1} sur ${QUIZ.length}`}>
          {QUIZ.map((q, i) => (
            <span key={q.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
              <span className={`block h-full rounded-full bg-gradient-hestia transition-all duration-500 ${i <= step ? "w-full" : "w-0"}`} />
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted">
          <button onClick={() => (step === 0 ? setStep(null) : setStep(step - 1))} className="rounded-full px-2 py-1 hover:text-foreground">
            ← Retour
          </button>
          <span className="tabular-nums">
            {step + 1} / {QUIZ.length}
          </span>
        </div>

        <div key={question.id} className="rise space-y-6">
          <div className="space-y-2">
            <h1 className="font-display text-3xl md:text-5xl">{question.title}</h1>
            {question.subtitle && <p className="text-muted">{question.subtitle}</p>}
          </div>

          {question.kind === "visual" && (
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {question.options.map((option) => (
                <li key={option.id}>
                  <button
                    onClick={(event) => choose(option.id, event.currentTarget)}
                    className={`group w-full overflow-hidden rounded-3xl border-2 bg-surface text-left transition hover:-translate-y-1 hover:shadow-lg active:scale-95 ${
                      picked === option.id ? "border-transparent ring-4 ring-[#ee5d78]" : "border-border"
                    }`}
                  >
                    <span className="block aspect-square overflow-hidden">
                      <Visual palette={option.palette} seed={option.id} category={option.category} alt="" />
                    </span>
                    <span className="block p-3 font-heading text-sm">{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {question.kind === "palette" && (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options.map((option) => (
                <li key={option.id}>
                  <button
                    onClick={(event) => choose(option.id, event.currentTarget)}
                    className={`w-full overflow-hidden rounded-3xl border-2 bg-surface text-left transition hover:-translate-y-1 hover:shadow-lg active:scale-95 ${
                      picked === option.id ? "border-transparent ring-4 ring-[#ee5d78]" : "border-border"
                    }`}
                  >
                    <span className="flex h-20">
                      {option.palette.map((hex) => (
                        <span key={hex} className="flex-1" style={{ background: hex }} title={COLORS_BY_HEX[hex.toLowerCase()]?.name} />
                      ))}
                    </span>
                    <span className="block p-3 font-heading text-sm">{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {question.kind === "material" && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {question.options.map((option) => (
                <li key={option.id}>
                  <button
                    onClick={(event) => choose(option.id, event.currentTarget)}
                    className={`w-full overflow-hidden rounded-3xl border-2 bg-surface text-left transition hover:-translate-y-1 hover:shadow-lg active:scale-95 ${
                      picked === option.id ? "border-transparent ring-4 ring-[#ee5d78]" : "border-border"
                    }`}
                  >
                    <span className="block aspect-[4/3]" style={{ background: option.material ? MATERIALS_BY_ID[option.material]?.swatch : undefined }} />
                    <span className="block p-3 font-heading text-sm">{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {question.kind === "choice" && (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options.map((option) => (
                <li key={option.id}>
                  <button
                    onClick={(event) => choose(option.id, event.currentTarget)}
                    className={`flex w-full items-center gap-4 rounded-3xl border-2 bg-surface p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${
                      picked === option.id ? "border-transparent ring-4 ring-[#ee5d78]" : "border-border"
                    }`}
                  >
                    <span className="h-11 w-11 shrink-0 rounded-2xl" style={{ background: option.palette[0] }} aria-hidden />
                    <span>
                      <span className="block font-heading">{option.label}</span>
                      {option.hint && <span className="block text-xs text-muted">{option.hint}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  if (hydrated && saved) return <Result result={saved} onRestart={start} />;

  return (
    <div className="mx-auto max-w-3xl">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-warm px-6 py-14 text-white md:px-12 md:py-20">
        <span className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15" aria-hidden />
        <span className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10" aria-hidden />
        <div className="relative space-y-5">
          <p className="font-heading text-sm uppercase tracking-[0.18em] opacity-90">Le test · 2 minutes</p>
          <h1 className="font-display text-4xl md:text-6xl">
            Découvrez votre style de déco
            <span className="mt-2 block font-heading text-xl font-medium italic tracking-normal opacity-90 md:text-2xl">
              et ce qu&apos;il veut dire de vous
            </span>
          </h1>
          <p className="max-w-xl text-lg opacity-95">
            Dix questions sur vos envies, un canapé, une table, une lumière, une couleur de mur… et Hestia vous révèle votre style, vos couleurs, les
            pièces qui vous ressemblent, et ce que tout cela dit de votre personnalité.
          </p>
          <button onClick={start} className="btn bg-white px-7 py-3 text-base text-[#a8442a] shadow-xl hover:-translate-y-0.5">
            Commencer le test →
          </button>
        </div>
      </section>
    </div>
  );
}

function Result({ result, onRestart }: { result: QuizResult; onRestart: () => void }) {
  const style = STYLES_BY_ID[result.styleId];
  const second = result.secondStyleId ? STYLES_BY_ID[result.secondStyleId] : undefined;
  const [preview, setPreview] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (preview && dialog && !dialog.open) dialog.showModal();
  }, [preview]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview.url);
  }, [preview]);

  if (!style) return null;

  const openShare = async () => {
    setBusy(true);
    try {
      const blob = await renderStory(result);
      setPreview({ blob, url: URL.createObjectURL(blob) });
    } finally {
      setBusy(false);
    }
  };
  const share = async () => {
    if (!preview) return;
    const outcome = await shareStory(preview.blob, style.name);
    setNotice(outcome === "downloaded" ? "Image enregistrée : publiez-la en story depuis votre galerie." : outcome === "shared" ? "Partagé !" : null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rise relative overflow-hidden rounded-[2rem] bg-gradient-warm p-6 text-white md:p-10">
        <span className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15" aria-hidden />
        <div className="relative space-y-3">
          <p className="font-heading text-sm uppercase tracking-[0.18em] opacity-90">Votre style de déco</p>
          <h1 className="font-display text-5xl md:text-7xl">{style.name}</h1>
          <p className="font-heading text-lg">
            {Math.round(result.match * 100)} % de compatibilité · {style.tagline}
          </p>
          <p className="max-w-2xl opacity-95">{style.description}</p>
          {second && <p className="text-sm opacity-90">Avec une touche de {second.name.toLowerCase()}.</p>}
          <div className="flex flex-wrap gap-2 pt-3">
            <button onClick={openShare} disabled={busy} className="btn bg-white px-6 py-3 text-[#a8442a] shadow-xl hover:-translate-y-0.5">
              <span className="grid h-6 w-5 place-items-center rounded-[5px] border-2 border-current" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-current" />
              </span>
              {busy ? "Préparation…" : "Partager en story"}
            </button>
            <Link href="/creation?quiz=1" className="btn border-2 border-white/70 px-6 py-3 text-white hover:bg-white/15">
              Créer ce projet ✦
            </Link>
          </div>
        </div>
      </section>

      <PersonalityCard styleId={result.styleId} />

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card space-y-4 p-6">
          <h2 className="font-heading text-xl">Votre palette</h2>
          <ul className="flex flex-wrap gap-4">
            {result.palette.map((hex) => (
              <li key={hex} className="flex w-16 flex-col items-center gap-1.5 text-center">
                <span className="h-14 w-14 rounded-full border border-black/5 shadow-sm" style={{ background: hex }} />
                <span className="text-[11px] leading-tight">{COLORS_BY_HEX[hex.toLowerCase()]?.name ?? hex}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card space-y-4 p-6">
          <h2 className="font-heading text-xl">Vos matières</h2>
          <ul className="flex flex-wrap gap-2">
            {result.materials.map((id) => (
              <li key={id} className="flex items-center gap-2 rounded-full bg-surface-muted py-1 pl-1 pr-3 text-sm">
                <span className="h-7 w-7 rounded-full border border-black/5" style={{ background: MATERIALS_BY_ID[id]?.swatch }} />
                {MATERIALS_BY_ID[id]?.name ?? id}
              </li>
            ))}
          </ul>
        </section>
        <section className="card space-y-3 p-6 md:col-span-2">
          <h2 className="font-heading text-xl">Vos incontournables</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {result.pieces.map((piece) => (
              <li key={piece} className="flex items-start gap-3 rounded-2xl bg-surface-muted px-4 py-3 text-sm">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-hestia" aria-hidden />
                {piece}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">
            {[result.room && `Pièce : ${result.room}`, result.budget && `budget d'environ ${result.budget.toLocaleString("fr-FR")} €`].filter(Boolean).join(" · ")}
          </p>
        </section>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/creation?quiz=1" className="btn-primary px-6 py-3">
          Trouver les produits de ce projet ✦
        </Link>
        <Link href="/mon-style" className="btn-ghost px-6 py-3">
          Voir mes statistiques
        </Link>
        <button onClick={onRestart} className="btn-ghost px-6 py-3">
          Refaire le test
        </button>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => {
          setPreview(null);
          setNotice(null);
        }}
        onClick={(event) => event.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto w-[min(92vw,420px)] rounded-3xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/60"
      >
        {preview && (
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg">Votre story</h2>
              <button onClick={() => dialogRef.current?.close()} className="px-2 text-2xl leading-none text-muted hover:text-foreground" aria-label="Fermer">
                ×
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- image générée localement */}
            <img src={preview.url} alt={`Story : mon style déco ${style.name}`} className="mx-auto max-h-[60vh] rounded-2xl shadow-lg" />
            <button onClick={share} className="btn w-full bg-gradient-warm py-3 text-base text-white shadow-[0_10px_24px_-10px_#a8442a] hover:-translate-y-0.5">
              Partager en story ↗
            </button>
            <p className="text-center text-xs text-muted">
              {notice ?? "Sur mobile, choisissez Instagram, TikTok ou WhatsApp. Sur ordinateur, l'image s'enregistre."}
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
}
