import Anthropic from "@anthropic-ai/sdk";
import { DupesRequestSchema, type DupesStreamEvent } from "@/lib/dupes-schema";
import { findDupes } from "@/lib/server/dupes";
import { checkRateLimit, clientIp } from "@/lib/server/rate-limit";

// Les recherches web peuvent prendre plusieurs minutes.
export const maxDuration = 300;

const HOURLY_LIMIT = Number(process.env.DUPES_HOURLY_LIMIT ?? 5);

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return Response.json(
      { error: "Le service IA n'est pas encore configuré sur ce serveur (ANTHROPIC_API_KEY manquante)." },
      { status: 503 },
    );
  }

  const limit = checkRateLimit(clientIp(request), HOURLY_LIMIT);
  if (!limit.ok) {
    return Response.json(
      { error: "Vous avez atteint la limite de recherches pour cette heure. Revenez un peu plus tard !" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }
  const parsed = DupesRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Requête invalide." },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: DupesStreamEvent) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      try {
        await findDupes(parsed.data, emit, request.signal);
      } catch (error) {
        if (!request.signal.aborted) {
          console.error("[dupes]", error);
          emit({ type: "error", message: errorMessage(error) });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function errorMessage(error: unknown): string {
  if (error instanceof Anthropic.RateLimitError) {
    return "Le service est très sollicité. Réessayez dans quelques instants.";
  }
  if (error instanceof Anthropic.AuthenticationError) {
    return "Le service IA n'est pas configuré (clé API manquante ou invalide).";
  }
  if (error instanceof Anthropic.BadRequestError) {
    return "L'image n'a pas pu être analysée. Essayez avec un autre fichier.";
  }
  if (error instanceof Anthropic.APIError) {
    return "Le service IA est momentanément indisponible. Réessayez plus tard.";
  }
  return "Une erreur inattendue est survenue.";
}
