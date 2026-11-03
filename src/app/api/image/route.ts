import { clientIp, isSameOrigin } from "@/lib/server/guard";
import { checkRateLimit } from "@/lib/server/rate-limit";

const MAX_BYTES = 8_000_000;

/**
 * Relais des photos Pexels : le serveur d'Hestia va chercher l'image et la renvoie, pour que
 * les visiteurs ne soient jamais en contact direct avec Pexels. Seul images.pexels.com est
 * relayé ; aucune donnée du visiteur (adresse, cookies, page d'origine) n'est transmise.
 */
export async function GET(request: Request) {
  if (!isSameOrigin(request)) return new Response("Origine non autorisée.", { status: 403 });
  const limit = checkRateLimit(`image:${clientIp(request)}`, 3000);
  if (!limit.ok) return new Response("Trop de requêtes.", { status: 429 });

  let target: URL;
  try {
    target = new URL(new URL(request.url).searchParams.get("u") ?? "");
  } catch {
    return new Response("Adresse invalide.", { status: 400 });
  }
  if (target.protocol !== "https:" || target.hostname !== "images.pexels.com") {
    return new Response("Adresse non autorisée.", { status: 400 });
  }

  const upstream = await fetch(target, {
    headers: { Accept: "image/avif,image/webp,image/jpeg,image/*" },
    referrerPolicy: "no-referrer",
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  const type = upstream?.headers.get("content-type") ?? "";
  if (!upstream?.ok || !upstream.body || !type.startsWith("image/") || type.includes("svg")) {
    return new Response("Image indisponible.", { status: 502 });
  }
  const length = Number(upstream.headers.get("content-length") ?? 0);
  if (length > MAX_BYTES) return new Response("Image trop lourde.", { status: 502 });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=604800, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
