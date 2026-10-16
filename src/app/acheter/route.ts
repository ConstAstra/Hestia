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
  // Journal des clics (à brancher sur un outil d'analyse) : enseigne, produit, affiliation.
  console.info(
    JSON.stringify({ event: "buy_click", retailer: searchParams.get("r"), host: new URL(productUrl).hostname, affiliated, at: new Date().toISOString() }),
  );
  const response = NextResponse.redirect(url, 302);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer-when-downgrade");
  return response;
}
