import { formatPrice } from "@/lib/catalog";
import type { Dupe } from "@/lib/types";

export function DupeCard({ dupe, verified, onSave }: { dupe: Dupe; verified?: boolean; onSave?: () => void }) {
  let host = dupe.retailer;
  try {
    host = new URL(dupe.url).hostname.replace(/^www\./, "");
  } catch {}
  return (
    <article className="card flex flex-col gap-3 p-5">
      <p className="text-xs uppercase tracking-wider text-muted">
        Inspiré de : <span className="normal-case tracking-normal text-foreground">{dupe.originalItem}</span>
      </p>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold leading-snug">{dupe.productName}</h4>
          <p className="text-sm text-muted">{dupe.retailer}</p>
        </div>
        <p className="font-heading text-xl font-semibold text-accent-strong">{formatPrice(dupe.price)}</p>
      </div>
      <p className="flex-1 text-sm text-muted">{dupe.whyItMatches}</p>
      <div className="flex flex-wrap items-center gap-2">
        <a href={dupe.url} target="_blank" rel="noopener noreferrer nofollow" className="btn-ghost py-2">
          Voir sur {host} ↗
        </a>
        {onSave && (
          <button onClick={onSave} className="btn-ghost py-2">
            Enregistrer
          </button>
        )}
        {verified === false && <span className="text-xs text-muted">Lien à vérifier</span>}
      </div>
    </article>
  );
}
