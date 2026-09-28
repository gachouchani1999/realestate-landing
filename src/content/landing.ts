// Page copy lives here so it can be edited without touching layout code.
import { site } from "@/config/site";

export const marketFacts = [
  { value: "0%", label: "Personal income tax on rental income" },
  { value: "100%", label: "Freehold ownership for foreigners in designated areas" },
  { value: "10-yr", label: "Golden Visa for property investments of AED 2M+" },
  { value: "6–8%", label: "Typical gross rental yields in Dubai¹" },
];

export const comparison = [
  {
    topic: "Handover",
    alone: "Flying in for snagging, utility connections and paperwork.",
    propora: "Snagging, utilities and paperwork handled remotely, on your behalf.",
  },
  {
    topic: "Furnishing",
    alone: "Weeks of quotes and deliveries from thousands of kilometres away.",
    propora: "A turnkey, rent-ready furnishing package at a fixed price.",
  },
  {
    topic: "Income",
    alone: "Chasing agents, viewings, cheques and guest messages.",
    propora: "Screened long-term tenants or a fully run holiday home.",
  },
  {
    topic: "Upkeep",
    alone: "Late-night calls about air conditioning and leaks.",
    propora: "One team handles maintenance, with photos and invoices.",
  },
  {
    topic: "Visibility",
    alone: "Updates only when someone remembers to message you.",
    propora: "A live owner dashboard and quarterly performance reviews.",
  },
  {
    topic: "Next move",
    alone: "Guessing when to buy another unit, refinance or sell.",
    propora: "Decisions made on your property's real performance data.",
  },
];

/** The three ways Propora works with clients — and how it is paid for each. */
export const services = [
  {
    tag: "Start here",
    title: "Handover to income",
    lead: "From keys to first rent, without flying in.",
    points: [
      "Snagging inspection and defect follow-up",
      "Utilities, access cards and move-in permits",
      "Turnkey furnishing designed to rent",
      "Photography, listing and your first tenant or guests",
    ],
    paid: "A fixed package fee, quoted upfront.",
  },
  {
    tag: "Our core",
    title: "Property management",
    lead: "Hands-free income, run by one accountable team.",
    options: [
      {
        name: "Long-term rental",
        body: "Steady, low-effort income: tenant screening, contracts, rent collection, renewals and maintenance.",
        paid: "A percentage of the rent we collect.",
      },
      {
        name: "Holiday home",
        body: "Higher earning potential: pricing, listings, guest service, cleaning and holiday-home permits.",
        paid: "A share of booking revenue.",
      },
    ],
    paid: "If your property isn't earning, neither are we.",
  },
  {
    tag: "When you're ready",
    title: "Buy & sell",
    lead: "Your next unit — and your exit — on real data.",
    points: [
      "Opportunities scored on the performance of units we manage",
      "Negotiation and 100% remote purchase",
      "Valuation and resale timing",
      "Refinancing introductions",
    ],
    paid: "A standard commission, always disclosed before you commit.",
  },
] as const;

export const principles = [
  { title: "We earn when you earn", body: "Management fees come from income we generate — never from vacant months." },
  { title: "Every fee in writing", body: "Packages, percentages and commissions agreed before any work begins." },
  { title: "One team, keys to exit", body: "No hand-offs between agents, managers and brokers with different agendas." },
];

export const journey = [
  {
    title: "Strategy",
    body: "We define your goals, budget, risk appetite and horizon — yield, growth, visa or lifestyle.",
    icon: "compass",
  },
  {
    title: "Sourcing",
    body: "Off-plan and ready units, scored on the real performance of comparable units we manage.",
    icon: "search",
  },
  {
    title: "Due diligence",
    body: "Title, escrow, service charges, rental comparables and developer history — independently verified.",
    icon: "shield",
  },
  {
    title: "Acquisition",
    body: "Negotiation, mortgage support, registration and POA — so you never need to fly in.",
    icon: "handshake",
  },
  {
    title: "Handover & furnishing",
    body: "Snagging inspections, utilities, fit-out and turnkey furnishing packages designed to rent.",
    icon: "sofa",
  },
  {
    title: "Leasing",
    body: "Long-term tenants or a holiday home — pricing, marketing, screening and contracts.",
    icon: "key",
  },
  {
    title: "Management",
    body: "Rent collection, guests, maintenance, renewals and compliance, all handled by one team.",
    icon: "wrench",
  },
  {
    title: "Reporting & exit",
    body: "Live dashboard, quarterly reviews and a clear plan to refinance, buy again or sell.",
    icon: "chart",
  },
] as const;

/** Phases of the A–Z journey, by stage index (0-based, inclusive). */
export const phases = [
  { name: "Acquire", from: 0, to: 3 },
  { name: "Operate", from: 4, to: 6 },
  { name: "Exit", from: 7, to: 7 },
];

/** Stage where most clients join (0-based). */
export const ownerEntryStage = 4;

export const platformFeatures = [
  {
    title: "Live owner dashboard",
    body: "Rent, bookings, occupancy, expenses and valuations — updated in real time.",
    icon: "dashboard",
  },
  {
    title: "One dedicated advisor",
    body: "A single point of contact on WhatsApp, working around your time zone.",
    icon: "advisor",
  },
  {
    title: "Transparent by default",
    body: "Every fee, quote and invoice shared upfront and kept in your document vault.",
    icon: "vault",
  },
  {
    title: "100% remote",
    body: "Handover, leasing and management without flying in — POA and e-signatures handled.",
    icon: "remote",
  },
] as const;

export const estimateContents = {
  owners: {
    heading: "Owners & new keys",
    offer: "Free rental income estimate",
    items: [
      { title: "Long-term vs holiday home", body: "Expected income for your unit under both strategies, side by side." },
      { title: "Occupancy & seasonality", body: "Real demand for your community, month by month." },
      { title: "True cost breakdown", body: "Service charges, fees, furnishing and running costs — no surprises." },
      { title: "Handover-to-income plan", body: "What needs doing, in what order, and how soon you can earn." },
    ],
  },
  buyers: {
    heading: "Buyers & sellers",
    offer: "Free investment report or valuation",
    items: [
      { title: "Strategy for your goals", body: "Yield, growth or Golden Visa — the right play for your timeline." },
      { title: "Units scored on real data", body: "Shortlists ranked by the performance of comparable units we manage." },
      { title: "5-year projection", body: "Rental income, capital growth and net return, stress-tested." },
      { title: "Valuation & exit timing", body: "For sellers: what your unit is worth today and when to list." },
    ],
  },
};

export const steps = [
  { title: "Tell us about your property", body: "Or what you're looking for. Three quick steps, about a minute." },
  {
    title: "Get your free estimate",
    body: `An advisor builds your personalised estimate or report and sends it within ${site.reportTurnaround}.`,
  },
  {
    title: "We take it from there",
    body: "Handover, tenants or guests, management — and your next move when you're ready.",
  },
];

export const faqs = [
  {
    q: "I'm getting my keys soon — when should I contact you?",
    a: "Ideally two to three months before handover. That gives us time to plan snagging, utilities, furnishing and marketing so your unit starts earning within weeks of completion, not months. If you already have your keys, we can start straight away.",
  },
  {
    q: "Long-term tenant or holiday home — which earns more?",
    a: "Holiday homes can earn more in the right community, but income moves with the seasons and running costs are higher. Long-term lets are steadier and lower-effort. Your free estimate compares both for your specific unit, so you can choose on real numbers.",
  },
  {
    q: "How does Propora charge?",
    a: "Handover to income is a fixed package fee, quoted upfront. Long-term management is a percentage of the rent we actually collect, and holiday-home management is a share of booking revenue — so if your property isn't earning, neither are we. For buying and selling we charge a standard commission, always disclosed before you commit.",
  },
  {
    q: "Do I need to be in the UAE?",
    a: "No. We handle handover, setup and management remotely — with a power of attorney where needed — and you follow everything in your owner dashboard.",
  },
  {
    q: "Can I switch from my current property manager?",
    a: "Yes. We review your current setup and contracts, coordinate the handover from your existing manager, and keep your tenant in place where it makes sense.",
  },
  {
    q: "Can foreigners buy property in the UAE?",
    a: "Yes. Foreign nationals can buy freehold property outright in designated areas across Dubai, Abu Dhabi and the other emirates — no local sponsor or residency needed.",
  },
  {
    q: "Can owning property get me a UAE Golden Visa?",
    a: "Property investments of AED 2 million or more can qualify you for a 10-year Golden Visa, subject to current eligibility rules. We can check what you'd qualify for and how to structure a purchase.",
  },
  {
    q: "Which areas do you cover?",
    a: `We work across ${site.coverage}. Recommendations follow your goals and the data — not a single developer or community.`,
  },
];
