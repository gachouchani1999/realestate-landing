// Business details used across the landing page.
// TODO(before launch): replace the placeholder contact details below.
export const site = {
  name: "Propora UAE",
  shortName: "Propora",
  tagline: "Your Partner from A to Z",
  description:
    "Propora turns UAE property into hands-free income for global owners — handover, furnishing, long-term or holiday-home management, and help buying or selling when the time is right.",
  // Canonical and Open Graph URLs. On Vercel this falls back to the project's production domain automatically.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  email: "hello@propora.ae", // placeholder
  whatsapp: "971500000000", // placeholder — international format, digits only
  phoneDisplay: "+971 50 000 0000", // placeholder
  location: "Dubai, United Arab Emirates",
  coverage: "Dubai, Abu Dhabi and the Northern Emirates",
  reportTurnaround: "48 hours",
} as const;

export function whatsappLink(message = "Hi Propora, I'd like to know more about investing in the UAE.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
