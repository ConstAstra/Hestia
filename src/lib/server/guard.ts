import { timingSafeEqual } from "node:crypto";
import { checkRateLimit } from "./rate-limit";

/*
 * Protections communes des routes d'API : identification fiable du client, origine des
 * requêtes, taille des corps, plafond quotidien des recherches IA (le poste de coût) et
 * comparaison de secrets à temps constant.
 */

/**
 * Adresse IP du client. Les en-têtes posés par l'hébergeur passent d'abord : sur Vercel,
 * x-vercel-forwarded-for et x-real-ip sont fixés par la plateforme et ne peuvent pas être
 * falsifiés. Le premier élément de x-forwarded-for, lui, est fourni par le client : on ne
 * l'utilise que si TRUST_PROXY_HOPS indique combien de mandataires de confiance précèdent
 * l'application (on lit alors l'adresse ajoutée par le dernier d'entre eux).
 */
export function clientIp(request: Request): string {
  const platform = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-real-ip");
  if (platform) return platform.split(",")[0].trim();
  const hops = Number(process.env.TRUST_PROXY_HOPS ?? 0);
  const forwarded = request.headers.get("x-forwarded-for");
  if (hops > 0 && forwarded) {
    const chain = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    return chain[Math.max(0, chain.length - hops)] ?? "inconnu";
  }
  return "inconnu";
}

/**
 * Les routes d'API ne servent que les pages d'Hestia : une requête envoyée depuis un autre
 * site (dont le navigateur indique l'origine) est refusée, pour qu'on ne puisse pas
 * consommer nos recherches depuis l'extérieur.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  try {
    const allowed = new Set([new URL(request.url).host, ...(process.env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean)]);
    const host = new URL(origin).host;
    return allowed.has(host) || allowed.has(origin);
  } catch {
    return false;
  }
}

/** Lit un corps JSON en refusant ce qui dépasse `maxBytes` (sans tout charger en mémoire). */
export async function readJson(request: Request, maxBytes: number): Promise<{ ok: true; body: unknown } | { ok: false; status: number; error: string }> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > maxBytes) return { ok: false, status: 413, error: "Requête trop volumineuse." };
  if (!request.body) return { ok: false, status: 400, error: "Requête invalide." };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return { ok: false, status: 413, error: "Requête trop volumineuse." };
    }
    chunks.push(value);
  }
  try {
    return { ok: true, body: JSON.parse(Buffer.concat(chunks).toString("utf8")) };
  } catch {
    return { ok: false, status: 400, error: "Requête invalide." };
  }
}

/**
 * Garde-fous d'une route de recherche IA : origine, limite par client et par heure, puis
 * plafond quotidien commun à tout le site (AI_DAILY_LIMIT), pour borner la facture même si
 * des milliers d'adresses différentes se relaient.
 */
export function guardAiRoute(request: Request, route: string, hourlyLimit: number): Response | null {
  if (!isSameOrigin(request)) return Response.json({ error: "Origine non autorisée." }, { status: 403 });
  const perClient = checkRateLimit(`${route}:${clientIp(request)}`, hourlyLimit);
  if (!perClient.ok) {
    return Response.json(
      { error: "Vous avez atteint la limite de recherches pour cette heure. Revenez un peu plus tard !" },
      { status: 429, headers: { "Retry-After": String(perClient.retryAfterSec) } },
    );
  }
  const daily = checkRateLimit("ia:global", Number(process.env.AI_DAILY_LIMIT ?? 500), 24 * 3600 * 1000);
  if (!daily.ok) {
    return Response.json(
      { error: "Hestia a beaucoup chiné aujourd'hui : les recherches reprennent demain. Merci de votre patience !" },
      { status: 429, headers: { "Retry-After": String(daily.retryAfterSec) } },
    );
  }
  return null;
}

/** Compare deux secrets sans laisser fuiter, par le temps de réponse, leur début commun. */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
