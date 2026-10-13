// Page copy lives here so it can be edited without touching layout code.
// Positioning: a one-stop shop. Baytouna is the single team the owner deals with; vetted, licensed partners do the
// work (regulated work only ever by licensed partners) and Baytouna coordinates it and tracks it in the dashboard.
import { site } from "@/config/site";

/** The strip under the hero — what owners get, at a glance. */
export const pillars = [
  { value: "1", label: "dashboard for every unit, document and payment" },
  { value: "0", label: "flights needed to stay on top of it" },
  { value: "24/7", label: "view of your property, wherever you live" },
  { value: "1", label: "team that handles everything else" },
];

export const comparison = [
  {
    topic: "Handover",
    alone: "Chasing the developer for snag updates from abroad.",
    withUs: "Snagging done by licensed inspectors, tracked with photos until fixed.",
  },
  {
    topic: "Documents",
    alone: "Title deed, SPA and contracts scattered across email threads.",
    withUs: "One secure vault, always to hand.",
  },
  {
    topic: "Payments",
    alone: "Instalments and service charges found when the late notice arrives.",
    withUs: "Reminders before every due date.",
  },
  {
    topic: "Rent",
    alone: "Finding tenants, chasing cheques and reconciling agents' statements.",
    withUs: "Tenants found and managed by our licensed partner; rent in one view."
  },
  {
    topic: "Maintenance",
    alone: "Late-night calls about air conditioning and leaks.",
    withUs: "Fixed by vetted technicians, logged with photos and invoices.",
  },
  {
    topic: "Value",
    alone: "Guessing what it's worth, and who to trust to sell it.",
    withUs: "Value tracked; valuations and sales through licensed partners.",
  },
];

/** The dashboard's core features, shown next to the product preview. */
export const platformFeatures = [
  { title: "Handover tracker", body: "Snags, utilities, keys and access cards — every step with photos.", icon: "handover" },
  { title: "Document vault", body: "Title deed, SPA, tenancy contracts and receipts in one place.", icon: "vault" },
  { title: "Payments & reminders", body: "Instalments, service charges and renewals, before they're due.", icon: "payments" },
  { title: "Rent & costs", body: "What came in, what went out, and your net income.", icon: "rent" },
  { title: "Maintenance log", body: "Requests, quotes and fixes, tracked from report to done.", icon: "maintenance" },
  { title: "Value trend", body: "How your unit's value moves, from public transaction data.", icon: "value" },
] as const;

/** Who sits behind the one-stop shop — shown as chips in the "You → Baytouna → specialists" diagram. */
export const specialists = [
  "Snagging inspectors",
  "Furnishing studio",
  "Leasing & management (RERA-licensed)",
  "Holiday-home operator",
  "Maintenance teams",
  "Brokers & valuers",
];

/** Everything handled across the life of the property. `handledBy` names the licensed partners behind each stage. */
export const stages = [
  {
    tag: "Before & at handover",
    title: "Handover",
    lead: "Your unit inspected, set up and ready — without flying in.",
    points: [
      "Snagging inspection and defect follow-up, with photos",
      "Utilities, internet and access cards set up",
      "Keys collected under your power of attorney",
      "Rent-ready furnishing at a fixed price",
    ],
    handledBy: "Licensed snagging inspectors and our furnishing studio",
  },
  {
    tag: "Every month",
    title: "Own & rent",
    lead: "Tenants, upkeep and paperwork handled, and every dirham tracked.",
    points: [
      "Tenants found, screened and managed",
      "Holiday-home letting, if it earns you more",
      "Maintenance and repairs, with quotes and photos",
      "Rent, costs and renewals in your dashboard",
    ],
    handledBy: "RERA-licensed leasing and management partners, and a licensed holiday-home operator",
  },
  {
    tag: "When you're ready",
    title: "Grow or exit",
    lead: "Valuations, sales and your next unit, on real numbers.",
    points: [
      "Valuations whenever you need one",
      "Selling, with your full history ready to share",
      "Your next property added in minutes",
      "Value trend from public transaction data",
    ],
    handledBy: "Licensed brokers and registered valuers",
  },
] as const;

export const principles = [
  { title: "One team for everything", body: "You message us. We brief the right specialist and log every update in your dashboard." },
  { title: "Licensed for every job", body: "Every partner is vetted, and regulated work is only ever done by licensed professionals." },
  { title: "Your data stays yours", body: "Documents are shared only with your permission, and never sold." },
];

/** How it works: free report → call → dashboard. */
export const journey = [
  {
    title: "Tell us about your property",
    body: "Three quick steps, about a minute. Getting your keys, already own, or several units.",
    icon: "start",
  },
  {
    title: "Get your free report",
    body: `Running costs, key dates, rental outlook and value trend — in your inbox within ${site.reportTurnaround}.`,
    icon: "report",
  },
  {
    title: "Book a call",
    body: "We walk you through the report and answer anything — no sales pitch.",
    icon: "call",
  },
  {
    title: "We set up your dashboard",
    body: "Documents, dates and your handover or rental details, set up for you.",
    icon: "setup",
  },
  {
    title: "We handle the rest",
    body: "Snagging, furnishing, tenants and repairs handled by our partners — every update in your dashboard.",
    icon: "track",
  },
] as const;

/** Phases of the journey, by step index (0-based, inclusive). */
export const phases = [
  { name: "Free", from: 0, to: 2 },
  { name: "Founding owners", from: 3, to: 4 },
];

export const reportContents = [
  { title: "Running costs", body: "Service charges, fees, utilities and furnishing — what owning really costs." },
  { title: "Key dates", body: "Handover, payments, renewals and deadlines, in order." },
  { title: "Rental outlook", body: "Long-term and holiday-home ranges for your community." },
  { title: "Value trend", body: "How prices for comparable units have moved." },
  { title: "Your checklist", body: "What to do next — for handover, renting or selling." },
];

export const reportSmallPrint =
  "Rental outlook prepared with our RERA-licensed leasing partner. Value trend based on public Dubai Land Department transaction data. Not a formal valuation.";

/** The people behind Baytouna. TODO(before launch): real names, roles, one-line bios and photos (/public/team/…). */
export const team = [
  { name: "Founder name", role: "Co-founder · Owner experience", bio: "One line about you and why you started Baytouna.", photo: "" },
  { name: "Founder name", role: "Co-founder · Product", bio: "One line about you and what you're building.", photo: "" },
];

export const faqs = [
  {
    q: "What is Baytouna?",
    a: "An owner dashboard for UAE property, with one team behind it. Handover, documents, payments, maintenance and rent are tracked in one place — and when something needs doing, you message us and we coordinate it.",
  },
  {
    q: "What can you handle for me?",
    a: "Everything your property needs: snagging and handover, furnishing, finding and managing tenants, holiday-home letting, maintenance, valuations and selling. You deal with one team, and every job is tracked in your dashboard.",
  },
  {
    q: "What's in the free property report?",
    a: `Running costs, key dates, a rental outlook and value trend for your unit, plus a checklist of next steps. It arrives within ${site.reportTurnaround}, and you can book a call to walk through it.`,
  },
  {
    q: "Is the dashboard free?",
    a: "Founding owners get it free for their first unit while we build it with them. We'll always tell you before anything becomes paid.",
  },
  {
    q: "Who does the work?",
    a: "Our network of vetted partners: licensed snagging inspectors, a furnishing studio, RERA-licensed leasing and management companies, a licensed holiday-home operator, maintenance teams, brokers and valuers. We coordinate them, you deal only with us, and their updates appear in your dashboard.",
  },
  {
    q: "Do I need to be in the UAE?",
    a: "No. Everything — from handover to renewals — can be followed from your dashboard, wherever you live. Where someone needs to act on your behalf, a power of attorney covers it.",
  },
  {
    q: "Can I add a property I'm still waiting for?",
    a: "Yes. Off-plan units can be tracked from payment plan to handover, and ready units from day one.",
  },
  {
    q: "Is my data safe?",
    a: "Your documents are visible only to you and anyone you choose to share them with. We never sell your data.",
  },
  {
    q: "Which areas do you cover?",
    a: `${site.coverage}.`,
  },
];
