import { deliver, honeypotFilled, rateLimited, readJson } from "@/lib/lead-delivery";
import { parsePartialLead } from "@/lib/leads";

/**
 * Saves an unfinished attempt (email plus answers so far) so an advisor can follow up with visitors who drop off.
 * Called in the background by the lead flow; it never blocks or errors in the visitor's face.
 */
export async function POST(request: Request) {
  const body = await readJson(request);
  if (body === undefined || honeypotFilled(body)) return new Response(null, { status: 204 });

  if (rateLimited("partial", request, 40)) return new Response(null, { status: 429 });

  const parsed = parsePartialLead(body);
  if ("error" in parsed) return Response.json({ error: parsed.error }, { status: 422 });

  await deliver(
    { event: "lead.partial", ...parsed.lead, savedAt: new Date().toISOString() },
    {
      webhook: process.env.PARTIAL_LEAD_WEBHOOK_URL || process.env.LEAD_WEBHOOK_URL,
      file: "partial-leads.jsonl",
      label: "partial-lead",
    },
  );

  return new Response(null, { status: 202 });
}
