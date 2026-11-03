import Anthropic from "@anthropic-ai/sdk";
import { SecondHandRequestSchema, type SecondHandStreamEvent } from "@/lib/second-hand-schema";
import { guardAiRoute, readJson } from "@/lib/server/guard";
import { findSecondHand } from "@/lib/server/second-hand";

// Une recherche de seconde main prend en général une à deux minutes.
export const maxDuration = 300;

const HOURLY_LIMIT = Number(process.env.SECONDHAND_HOURLY_LIMIT ?? 10);

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return Response.json({ error: "Hestia n'est pas encore configurée sur ce serveur (ANTHROPIC_API_KEY manquante)." }, { status: 503 });
  }
  const blocked = guardAiRoute(request, "second-hand", HOURLY_LIMIT);
  if (blocked) return blocked;

  const read = await readJson(request, 4000);
  if (!read.ok) return Response.json({ error: read.error }, { status: read.status });
  const body = read.body;
  const parsed = SecondHandRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide." }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: SecondHandStreamEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      try {
        await findSecondHand(parsed.data, emit, request.signal);
      } catch (error) {
        if (!request.signal.aborted) {
          console.error("[second-hand]", error);
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
