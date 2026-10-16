import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * Liens d'achat « via Hestia » : chaque bouton « Acheter » pointe vers /acheter, qui
 * enregistre le clic puis redirige vers l'enseigne, avec les paramètres d'affiliation
 * du programme correspondant quand il est configuré.
 *
 * Pour éviter qu'/acheter serve de redirection ouverte, le lien est signé (HMAC) au
 * moment où Hestia propose le produit. Sans secret configuré, seules les enseignes
 * connues sont acceptées.
 */

/** Enseignes de confiance, acceptées même sans signature (anciens tableaux, secret absent). */
const KNOWN_RETAILERS = [
  "ikea.com", "maisonsdumonde.com", "laredoute.fr", "ampm.fr", "hm.com", "zarahome.com", "leroymerlin.fr",
  "castorama.fr", "conforama.fr", "madeindesign.com", "westwing.fr", "bocage.fr", "fnac.com", "darty.com",
  "amazon.fr", "etsy.com", "but.fr", "alinea.com", "habitat.fr", "sostrenegrene.com", "flyingtiger.com",
  "lamaisondevalerie.fr", "boulanger.com", "cdiscount.com", "manomano.fr", "selency.fr", "leboncoin.fr", "vinted.fr", "ebay.fr", "label-emmaus.co", "brocantelab.com", "pamono.fr", "1stdibs.com",
  "kave-home.com", "kavehome.com", "maisonsdumonde.fr", "laredoute.com", "made.com", "bloomingville.com",
];

/**
 * Programmes d'affiliation, par domaine, lus dans AFFILIATE_PROGRAMS (JSON). Deux formes :
 * - des paramètres ajoutés à l'URL : { "amazon.fr": { "params": { "tag": "hestia-21" } } }
 * - un gabarit de lien profond (Awin, Effiliation, Kwanko…) où {url} est l'URL encodée :
 *   { "maisonsdumonde.com": { "template": "https://www.awin1.com/cread.php?awinmid=1&awinaffid=2&ued={url}" } }
 */
type Program = { params?: Record<string, string>; template?: string };

function programs(): Record<string, Program> {
  try {
    return JSON.parse(process.env.AFFILIATE_PROGRAMS || "{}") as Record<string, Program>;
  } catch {
    console.warn("AFFILIATE_PROGRAMS n'est pas un JSON valide : liens d'affiliation désactivés.");
    return {};
  }
}

const bareHost = (url: URL) => url.hostname.toLowerCase().replace(/^www\./, "");
const matchesDomain = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);

function parseShopUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

const secret = () => process.env.AFFILIATE_LINK_SECRET || "";
const sign = (url: string) => createHmac("sha256", secret()).update(url).digest("base64url").slice(0, 22);

/** Lien « Acheter via Hestia » pour une page produit. */
export function hestiaBuyLink(productUrl: string, retailer?: string): string {
  const params = new URLSearchParams({ u: productUrl });
  if (retailer) params.set("r", retailer.slice(0, 60));
  if (secret()) params.set("s", sign(productUrl));
  return `/acheter?${params}`;
}

/** Vérifie un lien reçu par /acheter : signature valide, ou enseigne connue. */
export function isAllowedBuyLink(productUrl: string, signature: string | null): boolean {
  const url = parseShopUrl(productUrl);
  if (!url) return false;
  if (secret() && signature) {
    const expected = Buffer.from(sign(productUrl));
    const given = Buffer.from(signature);
    if (expected.length === given.length && timingSafeEqual(expected, given)) return true;
  }
  const host = bareHost(url);
  return KNOWN_RETAILERS.some((domain) => matchesDomain(host, domain)) || Object.keys(programs()).some((domain) => matchesDomain(host, domain));
}

/** URL finale vers l'enseigne, avec l'affiliation si un programme est configuré pour ce domaine. */
export function affiliateUrl(productUrl: string): { url: string; affiliated: boolean } {
  const url = parseShopUrl(productUrl);
  if (!url) return { url: productUrl, affiliated: false };
  const host = bareHost(url);
  const entry = Object.entries(programs()).find(([domain]) => matchesDomain(host, domain));
  if (!entry) return { url: url.toString(), affiliated: false };
  const [, program] = entry;
  if (program.template) return { url: program.template.replace("{url}", encodeURIComponent(url.toString())), affiliated: true };
  for (const [key, value] of Object.entries(program.params ?? {})) url.searchParams.set(key, value);
  return { url: url.toString(), affiliated: true };
}
