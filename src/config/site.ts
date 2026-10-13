/**
 * Canonical site URL for metadata and Open Graph. Uses NEXT_PUBLIC_SITE_URL, then Vercel's production domain,
 * then localhost. Blank or malformed values are skipped, and a missing protocol is assumed to be https.
 */
function resolveSiteUrl() {
  for (const raw of [process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).origin;
    } catch {
      console.warn(`[site] Ignoring invalid site URL: "${value}"`);
    }
  }
  return "http://localhost:3000";
}

// Business details used across the landing page.
// TODO(before launch): replace the placeholder contact details below.
export const site = {
  name: "Baytouna.ae",
  shortName: "Baytouna",
  tagline: "Your Partner from A to Z",
  description:
    "Baytouna turns UAE property into hands-free income for global owners — handover, furnishing, long-term or holiday-home management, and help buying or selling when the time is right.",
  url: resolveSiteUrl(),
  email: "hello@baytouna.ae", // placeholder — confirm this mailbox exists
  whatsapp: "971500000000", // placeholder — international format, digits only
  phoneDisplay: "+971 50 000 0000", // placeholder
  location: "Dubai, United Arab Emirates",
  coverage: "Dubai, Abu Dhabi and the Northern Emirates",
  reportTurnaround: "48 hours",
} as const;

export function whatsappLink(message = "Hi Baytouna, I'd like to know more about investing in the UAE.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
