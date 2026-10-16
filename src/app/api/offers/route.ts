import Anthropic from "@anthropic-ai/sdk";
import { PRODUCTS_BY_ID } from "@/lib/catalog";
import { OffersRequestSchema, type OffersStreamEvent } from "@/lib/offers-schema";
import { findOffers } from "@/lib/server/offers";
import { checkRateLimit, clientIp } from "@/lib/server/rate-limit";

// Une recherche d'offres prend en général une à deux minutes.
export const maxDuration = 300;

const HOURLY_LIMIT = Number(process.env.OFFERS_HOURLY_LIMIT ?? 10);

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return Response.json({ error: "Hestia n'est pas encore configurée sur ce serveur (ANTHROPIC_API_KEY manquante)." }, { status: 503 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }
  const parsed = OffersRequestSchema.safeParse(body);
  const product = parsed.success ? PRODUCTS_BY_ID[parsed.data.productId] : undefined;
  if (!product) return Response.json({ error: "Produit inconnu." }, { status: 404 });

  const limit = checkRateLimit(`offers:${clientIp(request)}`, HOURLY_LIMIT);
  if (!limit.ok) {
    return Response.json(
      { error: "Vous avez atteint la limite de recherches pour cette heure. Revenez un peu plus tard !" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: OffersStreamEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      try {
        await findOffers(product, emit, request.signal);
      } catch (error) {
        if (!request.signal.aborted) {
          console.error("[offers]", error);
          emit({
            type: "error",
            message:
              error instanceof Anthropic.RateLimitError
                ? "Le service est très sollicité. Réessayez dans quelques instants."
                : "Hestia est momentanément indisponible. Réessayez plus tard.",
          });
        }
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
