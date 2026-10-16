"use client";

import { useEffect, useRef, useState } from "react";
import { DupeCard } from "@/components/DupeCard";
import { Visual } from "@/components/Visual";
import { CATEGORY_LABELS, formatPrice, PRODUCTS_BY_ID, STYLE_LABELS } from "@/lib/catalog";
import type { OffersStreamEvent } from "@/lib/offers-schema";
import { useHestia } from "@/lib/store";

/**
 * Fiche d'un produit aimé dans le swipe. Les produits du swipe sont des modèles types :
 * « Où l'acheter » demande à Hestia de trouver des offres réelles (référence, prix,
 * dimensions, enseigne, lien d'achat via Hestia), vérifiées comme dans l'outil de création.
 */
export function ProductDetailDialog({ productId, onClose }: { productId: string | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const product = productId ? PRODUCTS_BY_ID[productId] : undefined;
  const saved = useHestia((s) => (productId ? s.productOffers[productId] : undefined));
  const setProductOffers = useHestia((s) => s.setProductOffers);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  const close = () => {
    abortRef.current?.abort();
    setLoading(false);
    setStatus(null);
    setError(null);
    onClose();
  };

  const search = async () => {
    if (!product) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setStatus("Hestia part à la recherche de ce produit…");
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
        signal: controller.signal,
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
          const event = JSON.parse(line) as OffersStreamEvent;
          if (event.type === "status") setStatus(event.message);
          if (event.type === "error") setError(event.message);
          if (event.type === "result") setProductOffers(product.id, event.offers);
        }
      }
    } catch (e) {
      if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
      setStatus(null);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onClick={(event) => event.target === dialogRef.current && close()}
      className="m-auto max-h-[92vh] w-[min(94vw,760px)] overflow-y-auto rounded-3xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/40"
    >
      {product && (
        <div className="space-y-6 p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <p className="kicker">Coup de cœur · {CATEGORY_LABELS[product.category]}</p>
            <button onClick={close} className="-mt-1 rounded-full px-2 text-2xl leading-none text-muted hover:text-foreground" aria-label="Fermer">
              ×
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl">
              <Visual palette={product.palette} seed={product.id} category={product.category} image={product.image} alt={product.name} />
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-3xl leading-tight">{product.name}</h2>
              <p className="text-sm text-muted">{product.description}</p>
              <dl className="grid grid-cols-1 gap-1 text-sm">
                <div className="flex gap-2">
                  <dt className="text-muted">Style :</dt>
                  <dd>{STYLE_LABELS[product.style]}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted">Matières :</dt>
                  <dd>{product.materials.join(", ")}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted">Budget indicatif :</dt>
                  <dd>environ {formatPrice(product.price)}</dd>
                </div>
              </dl>
              <p className="rounded-2xl bg-surface-muted px-4 py-3 text-xs text-muted">
                Ce coup de cœur est un modèle type, choisi pour son style. Hestia vous trouve les produits réels qui lui correspondent, avec
                leur référence, leur prix, leurs dimensions et l&apos;enseigne où les acheter.
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-2xl">Où l&apos;acheter</h3>
              {saved && !loading && (
                <button onClick={search} className="text-xs font-semibold text-accent hover:underline">
                  Actualiser la recherche
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center gap-3 rounded-2xl bg-surface-muted px-4 py-4 text-sm" role="status">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
                <span>{status} Cela prend en général une à deux minutes.</span>
              </div>
            ) : saved ? (
              saved.offers.length ? (
                <>
                  <p className="text-xs text-muted">
                    Trouvé le {new Date(saved.foundAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} · prix et
                    disponibilités à vérifier sur la fiche avant d&apos;acheter.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {saved.offers.map((offer) => (
                      <DupeCard key={offer.url} dupe={offer} />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted">
                    Les liens « Acheter via Hestia » peuvent être des liens affiliés : Hestia perçoit alors une petite commission, sans aucun
                    surcoût pour vous.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted">Hestia n&apos;a pas trouvé d&apos;offre fiable pour ce produit. Réessayez un peu plus tard.</p>
              )
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border p-5">
                <p className="text-sm">Hestia cherche ce produit chez les enseignes et vous rapporte les fiches réelles, vérifiées.</p>
                <button onClick={search} className="btn-primary">
                  Trouver où l&apos;acheter ✦
                </button>
              </div>
            )}
            {error && <p className="text-sm text-accent-strong">{error}</p>}
          </section>
        </div>
      )}
    </dialog>
  );
}
