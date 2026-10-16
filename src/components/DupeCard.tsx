"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/catalog";
import type { Dupe } from "@/lib/types";

/** Fiche produit réelle : un dupe de l'outil de création ou une offre « Où l'acheter ». */
type ListedProduct = Omit<Dupe, "originalItem" | "category" | "priority"> & { originalItem?: string };

/** Lien d'achat via Hestia ; repli pour les dupes enregistrés avant l'affiliation. */
function buyLink(dupe: ListedProduct) {
  if (dupe.buyUrl) return dupe.buyUrl;
  return `/acheter?${new URLSearchParams({ u: dupe.url, r: dupe.retailer })}`;
}

export function DupeCard({ dupe, onSave }: { dupe: ListedProduct; onSave?: () => void }) {
  const [copied, setCopied] = useState(false);
  let host = dupe.retailer;
  let shortUrl = dupe.url;
  try {
    const url = new URL(dupe.url);
    host = url.hostname.replace(/^www\./, "");
    shortUrl = `${host}${url.pathname}`;
  } catch {}
  const buy = buyLink(dupe);
  const facts = [
    dupe.dimensions && ["Dimensions", dupe.dimensions],
    dupe.material && ["Matière", dupe.material],
    dupe.color && ["Coloris", dupe.color],
    ["Où le trouver", [dupe.retailer, dupe.availability].filter(Boolean).join(" · ")],
  ].filter(Boolean) as [string, string][];

  const copyReference = async () => {
    if (!dupe.reference) return;
    try {
      await navigator.clipboard.writeText(dupe.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <article className="card flex min-w-0 flex-col gap-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {dupe.originalItem && (
          <p className="text-xs uppercase tracking-wider text-muted">
            Inspiré de : <span className="normal-case tracking-normal text-foreground">{dupe.originalItem}</span>
          </p>
        )}
        {dupe.verified && (
          <span className="rounded-full bg-olive-soft px-2.5 py-0.5 text-[11px] font-semibold text-olive" title="Hestia a ouvert et lu la fiche produit">
            ✓ Fiche vérifiée
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold leading-snug">{dupe.productName}</h4>
          <p className="text-sm text-muted">{dupe.retailer}</p>
        </div>
        <p className="shrink-0 font-heading text-xl font-semibold text-accent-strong">{formatPrice(dupe.price)}</p>
      </div>

      {dupe.reference && (
        <button
          type="button"
          onClick={copyReference}
          className="self-start rounded-lg bg-surface-muted px-2.5 py-1 font-mono text-xs transition hover:bg-border"
          title="Copier la référence"
        >
          Réf. {dupe.reference} {copied ? "· copiée ✓" : "· copier"}
        </button>
      )}

      {dupe.details && <p className="text-sm">{dupe.details}</p>}

      <dl className="grid grid-cols-1 gap-1 text-xs">
        {facts.map(([label, value]) => (
          <div key={label} className="flex gap-2">
            <dt className="shrink-0 text-muted">{label} :</dt>
            <dd className="min-w-0">{value}</dd>
          </div>
        ))}
        <div className="flex gap-2">
          <dt className="shrink-0 text-muted">Lien produit :</dt>
          <dd className="min-w-0 truncate">
            <a href={buy} target="_blank" rel="sponsored nofollow noopener" className="underline decoration-border underline-offset-2 hover:text-accent">
              {shortUrl}
            </a>
          </dd>
        </div>
      </dl>

      <p className="flex-1 text-sm text-muted">{dupe.whyItMatches}</p>

      <div className="flex flex-wrap items-center gap-2">
        <a href={buy} target="_blank" rel="sponsored nofollow noopener" className="btn-primary py-2">
          Acheter sur {host} via Hestia ↗
        </a>
        {onSave && (
          <button onClick={onSave} className="btn-ghost py-2">
            Enregistrer
          </button>
        )}
      </div>
    </article>
  );
}
