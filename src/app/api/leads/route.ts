import { after } from "next/server";
import { deliver, honeypotFilled, rateLimited, readJson } from "@/lib/lead-delivery";
import { parseLead } from "@/lib/leads";
import { sendMetaLead } from "@/lib/meta-capi";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (body === undefined) return Response.json({ error: "Invalid request." }, { status: 400 });

  // Pretend success so bots move on.
  if (honeypotFilled(body)) return Response.json({ ok: true });

  if (rateLimited("submit", request, 5)) {
    return Response.json(
      { error: "Too many requests. Please try again in a few minutes, or message us on WhatsApp." },
      { status: 429 },
    );
  }

  const parsed = parseLead(body);
  if ("errors" in parsed) {
    return Response.json({ error: "Please check the highlighted fields.", fields: parsed.errors }, { status: 422 });
  }

  // Reuse the id from any partial saves of this attempt so a CRM or sheet can update the same record.
  const lead = {
    event: "lead.submitted",
    ...parsed.lead,
    id: parsed.lead.id ?? crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };

  const result = await deliver(lead, { webhook: process.env.LEAD_WEBHOOK_URL, file: "leads.jsonl", label: "lead" });
  if (result === "failed") {
    return Response.json(
      { error: "We couldn't submit your request just now. Please try again, or message us on WhatsApp." },
      { status: 502 },
    );
  }

  // Report the conversion to Meta from the server once the response has gone out, so it counts without the browser
  // pixel. Visitors who explicitly declined cookies are left out.
  if ((body as Record<string, unknown>).consent !== "denied") {
    after(() => sendMetaLead(lead, request));
  }

  return Response.json({ ok: true });
}
