import Anthropic from "@anthropic-ai/sdk";
import { DupesRequestSchema, type DupesStreamEvent } from "@/lib/dupes-schema";
import { findDupes } from "@/lib/server/dupes";
import { guardAiRoute, readJson } from "@/lib/server/guard";

// Les recherches web peuvent prendre plusieurs minutes.
export const maxDuration = 300;

const HOURLY_LIMIT = Number(process.env.DUPES_HOURLY_LIMIT ?? 5);

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return Response.json(
      { error: "Hestia n'est pas encore configurée sur ce serveur (ANTHROPIC_API_KEY manquante)." },
      { status: 503 },
    );
  }

  const blocked = guardAiRoute(request, "dupes", HOURLY_LIMIT);
  if (blocked) return blocked;

  // Deux images d'au plus ~6 Mo en base64, plus le texte : 13 Mo suffisent largement.
  const read = await readJson(request, 13_000_000);
  if (!read.ok) return Response.json({ error: read.error }, { status: read.status });
  const body = read.body;
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
    return "Hestia n'est pas configurée (clé API manquante ou invalide).";
  }
  if (error instanceof Anthropic.BadRequestError) {
    return "L'image n'a pas pu être analysée. Essayez avec un autre fichier.";
  }
  if (error instanceof Anthropic.APIError) {
    return "Hestia est momentanément indisponible. Réessayez plus tard.";
  }
  return "Une erreur inattendue est survenue.";
}
