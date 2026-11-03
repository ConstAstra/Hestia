/*
 * Limiteur en mémoire. Suffisant pour un seul serveur ; en déploiement multi-instances
 * (serverless), remplacer par un store partagé (Redis / Upstash) — voir README.
 */
const HOUR_MS = 60 * 60 * 1000;
const hits = new Map<string, { windowMs: number; times: number[] }>();

export function checkRateLimit(key: string, limit: number, windowMs = HOUR_MS): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const recent = (hits.get(key)?.times ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, { windowMs, times: recent });
    return { ok: false, retryAfterSec: Math.ceil((recent[0] + windowMs - now) / 1000) };
  }
  recent.push(now);
  hits.set(key, { windowMs, times: recent });
  // Ménage : chaque clé garde sa propre fenêtre (une heure, un jour…).
  if (hits.size > 10_000) {
    for (const [k, entry] of hits) {
      if (entry.times.every((t) => now - t >= entry.windowMs)) hits.delete(k);
    }
  }
  return { ok: true, retryAfterSec: 0 };
}
