import { connection, NextResponse } from "next/server";
import { affiliateUrl, isAllowedBuyLink } from "@/lib/server/affiliate";

/**
 * Passerelle « Acheter via Hestia » : enregistre le clic, puis redirige vers la page
 * produit de l'enseigne (avec l'affiliation quand un programme est configuré).
 */
export async function GET(request: Request) {
  await connection();
  const { searchParams, origin } = new URL(request.url);
  const productUrl = searchParams.get("u") ?? "";
  if (!isAllowedBuyLink(productUrl, searchParams.get("s"))) {
    return NextResponse.redirect(new URL("/creation?lien=invalide", origin), 302);
  }
  const { url, affiliated } = affiliateUrl(productUrl);
  // Comptage anonyme des clics : l'enseigne et le jour, rien sur la personne
  // (ni adresse IP, ni identifiant, ni page d'origine, ni heure précise).
  console.info(JSON.stringify({ event: "buy_click", host: new URL(productUrl).hostname, affiliated, day: new Date().toISOString().slice(0, 10) }));
  const response = NextResponse.redirect(url, 302);
  response.headers.set("Cache-Control", "no-store");
  // L'enseigne ne voit pas de quelle page d'Hestia vient la visite.
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
