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
export const site = {
  name: "Baytouna.ae",
  shortName: "Baytouna",
  tagline: "Your Partner from A to Z",
  description:
    "Baytouna is the one-stop shop for UAE property owners: one team and one dashboard, with licensed specialists handling snagging, furnishing, tenants, maintenance and sales. Get a free property report for your unit.",
  url: resolveSiteUrl(),
  email: "hello@baytouna.ae",
  whatsapp: "971526692426", // international format, digits only
  phoneDisplay: "+971 52 669 2426",
  location: "Dubai, United Arab Emirates",
  coverage: "Dubai, Abu Dhabi and the Northern Emirates",
  reportTurnaround: "48 hours",
  /** Calendly / Cal.com link for booking the report walkthrough call. Leave empty to book via WhatsApp. */
  bookingUrl: "",
  /** Google Analytics 4 measurement ID. Loads only in production and only after cookie consent. */
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-V387M4WQX6",
  /** Meta Pixel ID. Loads only in production and only after cookie consent. */
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "4093844800921406",
} as const;

/** Where "Book a call" goes: the booking page if set, otherwise WhatsApp with a ready-made message. */
export function bookingLink(message = "Hi Baytouna, I'd like to book a call about my property.") {
  return site.bookingUrl || whatsappLink(message);
}

export function whatsappLink(message = "Hi Baytouna, I'd like to know more about the owner dashboard.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
