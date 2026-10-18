// Meta Conversions API: reports each submitted lead to Meta from the server, so it counts even when the browser
// pixel isn't running (no cookie consent yet, ad blockers, in-app browsers). It shares its event id with the browser
// pixel's Lead event, so Meta counts a lead once when both arrive.
import { createHash } from "node:crypto";
import { site } from "@/config/site";
import type { Lead } from "@/lib/leads";

const GRAPH_URL = process.env.META_GRAPH_URL || "https://graph.facebook.com";
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v24.0";

/** Meta matches on SHA-256 hashes of normalised (trimmed, lower-case) values; the raw values never leave us. */
function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function cookie(request: Request, name: string) {
  const match = request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Meta adds `fbclid` to ad links; as the `fbc` parameter it ties the lead to the ad click without any cookie. */
function clickIdFrom(landingPage: string | undefined, now: number) {
  if (!landingPage) return undefined;
  const fbclid = new URL(landingPage, site.url).searchParams.get("fbclid");
  return fbclid ? `fb.1.${now}.${fbclid}` : undefined;
}

export async function sendMetaLead(lead: Lead & { id: string }, request: Request) {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token || !site.metaPixelId) return "skipped";

  const now = Date.now();
  const phone = lead.phone.replace(/\D/g, "");
  const firstName = lead.name.trim().split(/\s+/)[0] ?? "";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip");

  const body = {
    access_token: token,
    ...(process.env.META_CAPI_TEST_EVENT_CODE ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE } : {}),
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(now / 1000),
        event_id: lead.id,
        action_source: "website",
        event_source_url: new URL(lead.source.landingPage ?? "/", site.url).toString(),
        user_data: {
          em: [sha256(lead.email)],
          ...(phone ? { ph: [sha256(phone)] } : {}),
          ...(firstName ? { fn: [sha256(firstName)] } : {}),
          ...(ip ? { client_ip_address: ip } : {}),
          client_user_agent: request.headers.get("user-agent") ?? "",
          fbc: cookie(request, "_fbc") ?? clickIdFrom(lead.source.landingPage, now),
          fbp: cookie(request, "_fbp"),
        },
        custom_data: { content_category: lead.offer ?? lead.intent },
      },
    ],
  };

  try {
    const res = await fetch(`${GRAPH_URL}/${GRAPH_VERSION}/${site.metaPixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[meta-capi] Lead rejected:", res.status, (await res.text()).slice(0, 300));
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("[meta-capi] Lead not sent:", error);
    return "failed";
  }
}
