// Lead shape and validation, shared by the form (client) and the API route (server).

type Option = { value: string; label: string; hint?: string };

export const INTENTS = [
  { value: "handover", label: "I'm getting my keys", hint: "Handover coming up" },
  { value: "owner", label: "I already own", hint: "Earn more, stress less" },
  { value: "buy", label: "I want to buy", hint: "Find the right unit" },
  { value: "sell", label: "I want to sell", hint: "Exit at the right time" },
] as const;

export const PROPERTY_TYPES = [
  { value: "studio-1br", label: "Studio / 1 bed" },
  { value: "2br", label: "2 bedrooms" },
  { value: "3br-plus", label: "3+ bedrooms" },
  { value: "villa", label: "Villa / townhouse" },
] as const;

export const HANDOVER_TIMES = [
  { value: "0-3m", label: "Within 3 months" },
  { value: "3-6m", label: "3 – 6 months" },
  { value: "6-12m", label: "6 – 12 months" },
  { value: "12m-plus", label: "12+ months" },
] as const;

export const CURRENT_USES = [
  { value: "vacant", label: "Vacant" },
  { value: "long-term", label: "Long-term tenant" },
  { value: "holiday-home", label: "Holiday home" },
  { value: "self-use", label: "I use it myself" },
] as const;

export const BUDGETS = [
  { value: "under-1m", label: "Under AED 1M", hint: "≈ under $270k" },
  { value: "1m-2m", label: "AED 1M – 2M", hint: "≈ $270k – $545k" },
  { value: "2m-5m", label: "AED 2M – 5M", hint: "≈ $545k – $1.36M" },
  { value: "5m-plus", label: "AED 5M+", hint: "≈ $1.36M and above" },
] as const;

export const TIMELINES = [
  { value: "0-3m", label: "Within 3 months" },
  { value: "3-6m", label: "3 – 6 months" },
  { value: "6-12m", label: "6 – 12 months" },
  { value: "exploring", label: "Just exploring" },
] as const;

export const EMIRATES = [
  { value: "dubai", label: "Dubai" },
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
  { value: "ajman", label: "Ajman" },
  { value: "other", label: "Other / not sure yet" },
] as const;

export type Intent = (typeof INTENTS)[number]["value"];
export type Emirate = (typeof EMIRATES)[number]["value"];
export type DetailField = "propertyType" | "handover" | "currentUse" | "budget" | "timeline";

/** The two follow-up questions asked for each intent. */
export const DETAIL_QUESTIONS: Record<Intent, { field: DetailField; question: string; options: readonly Option[] }[]> = {
  handover: [
    { field: "propertyType", question: "What are you getting the keys to?", options: PROPERTY_TYPES },
    { field: "handover", question: "When is handover?", options: HANDOVER_TIMES },
  ],
  owner: [
    { field: "propertyType", question: "What do you own?", options: PROPERTY_TYPES },
    { field: "currentUse", question: "How is it used today?", options: CURRENT_USES },
  ],
  buy: [
    { field: "budget", question: "What's your budget?", options: BUDGETS },
    { field: "timeline", question: "When are you looking to buy?", options: TIMELINES },
  ],
  sell: [
    { field: "propertyType", question: "What are you selling?", options: PROPERTY_TYPES },
    { field: "timeline", question: "When would you like to sell?", options: TIMELINES },
  ],
};

/** Whether we ask for the community / building (it sharpens estimates and valuations). Buyers only pick an emirate. */
export const ASKS_COMMUNITY: Record<Intent, boolean> = { handover: true, owner: true, buy: false, sell: true };

/** What each visitor gets for filling in the form. */
export const OFFERS: Record<Intent, { title: string; short: string; cta: string; next: string[] }> = {
  handover: {
    title: "Get your free rental income estimate",
    short: "rental income estimate",
    cta: "Send me my free estimate",
    next: [
      "We review your unit and comparable rentals nearby",
      "Your estimate arrives — long-term vs holiday home, side by side",
      "Optional: a 20-minute call to plan your handover",
    ],
  },
  owner: {
    title: "Get your free rental income estimate",
    short: "rental income estimate",
    cta: "Send me my free estimate",
    next: [
      "We review your unit, current setup and comparable rentals",
      "Your estimate arrives — long-term vs holiday home, side by side",
      "Optional: a 20-minute call about switching to Propora",
    ],
  },
  buy: {
    title: "Get your free investment report",
    short: "investment report",
    cta: "Send me my free report",
    next: [
      "We review your goals and shortlist opportunities",
      "Your report arrives with real performance data",
      "Optional: a 20-minute strategy call with your advisor",
    ],
  },
  sell: {
    title: "Get your free valuation & exit plan",
    short: "valuation & exit plan",
    cta: "Send me my free valuation",
    next: [
      "We review recent sales and buyer demand for your unit",
      "Your valuation & exit plan arrives in your inbox",
      "Optional: a 20-minute call to plan timing",
    ],
  },
};

export type Contact = { name: string; email: string; phone: string; country: string };

export type LeadSource = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPage?: string;
};

export type Details = Partial<Record<DetailField, string>>;

export type Lead = Contact & {
  /** Client-generated id shared with any partial saves of the same attempt. */
  id?: string;
  intent: Intent;
  details: Details;
  emirate: Emirate;
  community?: string;
  /** Human-readable one-liner for inboxes, spreadsheets and CRMs. */
  summary: string;
  source: LeadSource;
};

export type LeadErrors = Partial<Record<keyof Contact | DetailField | "intent" | "emirate", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

/** One validator per contact field, so the step-by-step flow can check a single answer. */
export const contactFieldError: Record<keyof Contact, (value: string) => string | undefined> = {
  name: (v) => (v.trim().length < 2 ? "Please enter your full name." : undefined),
  email: (v) => (EMAIL_RE.test(v.trim()) ? undefined : "Please enter a valid email address."),
  phone: (v) =>
    PHONE_RE.test(v.trim()) && v.replace(/\D/g, "").length >= 7
      ? undefined
      : "Please include your country code, e.g. +44 7700 900123.",
  country: (v) => (v.trim().length < 2 ? "Please tell us where you're based." : undefined),
};

export function validateContact(c: Contact): LeadErrors {
  const errors: LeadErrors = {};
  for (const field of Object.keys(contactFieldError) as (keyof Contact)[]) {
    const message = contactFieldError[field](c[field]);
    if (message) errors[field] = message;
  }
  return errors;
}

export function labelFor(options: readonly Option[], value: string | null | undefined) {
  return options.find((o) => o.value === value)?.label ?? "";
}

export function summarise(intent: Intent, details: Details, emirate?: Emirate, community?: string) {
  const parts = [
    labelFor(INTENTS, intent),
    ...DETAIL_QUESTIONS[intent].map((q) => labelFor(q.options, details[q.field])),
    community,
    emirate && emirate !== "other" ? labelFor(EMIRATES, emirate) : undefined,
  ];
  return parts.filter(Boolean).join(" · ");
}

function str(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function oneOf<T extends string>(value: unknown, options: readonly { value: T }[]): T | null {
  return options.find((o) => o.value === value)?.value ?? null;
}

function record(value: unknown) {
  return (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function uuid(value: unknown) {
  return typeof value === "string" && UUID_RE.test(value) ? value.toLowerCase() : undefined;
}

function parseSource(value: unknown): LeadSource {
  const s = record(value);
  return {
    utmSource: str(s.utmSource, 200) || undefined,
    utmMedium: str(s.utmMedium, 200) || undefined,
    utmCampaign: str(s.utmCampaign, 200) || undefined,
    utmTerm: str(s.utmTerm, 200) || undefined,
    utmContent: str(s.utmContent, 200) || undefined,
    referrer: str(s.referrer, 500) || undefined,
    landingPage: str(s.landingPage, 500) || undefined,
  };
}

export function parseLead(body: unknown): { lead: Lead } | { errors: LeadErrors } {
  const b = record(body);
  const contact: Contact = {
    name: str(b.name, 120),
    email: str(b.email, 200).toLowerCase(),
    phone: str(b.phone, 40),
    country: str(b.country, 80),
  };
  const errors = validateContact(contact);

  const intent = oneOf(b.intent, INTENTS);
  const details: Details = {};
  if (!intent) {
    errors.intent = "Please tell us what you'd like help with.";
  } else {
    const raw = record(b.details);
    for (const q of DETAIL_QUESTIONS[intent]) {
      const value = oneOf(raw[q.field], q.options);
      if (value) details[q.field] = value;
      else errors[q.field] = "Please choose an option.";
    }
  }

  const emirate = oneOf(b.emirate, EMIRATES);
  if (!emirate) errors.emirate = "Please choose an emirate.";

  if (Object.keys(errors).length > 0 || !intent || !emirate) return { errors };

  const community = ASKS_COMMUNITY[intent] ? str(b.community, 120) || undefined : undefined;
  const source = parseSource(b.source);

  return {
    lead: {
      id: uuid(b.id),
      ...contact,
      intent,
      details,
      emirate,
      community,
      summary: summarise(intent, details, emirate, community),
      source,
    },
  };
}

/**
 * An unfinished attempt: saved once we have an email, so an advisor can follow up with people who drop off.
 * Everything except the email and id is optional; whatever is present is validated like a full lead.
 */
export type PartialLead = Partial<Contact> & {
  id: string;
  email: string;
  intent?: Intent;
  details?: Details;
  emirate?: Emirate;
  community?: string;
  /** The question the visitor was on when this was saved. */
  lastStep?: string;
  summary?: string;
  source: LeadSource;
};

export function parsePartialLead(body: unknown): { lead: PartialLead } | { error: string } {
  const b = record(body);
  const id = uuid(b.id);
  const email = str(b.email, 200).toLowerCase();
  if (!id || contactFieldError.email(email)) return { error: "An id and a valid email are required." };

  const intent = oneOf(b.intent, INTENTS) ?? undefined;
  const details: Details = {};
  if (intent) {
    const raw = record(b.details);
    for (const q of DETAIL_QUESTIONS[intent]) {
      const value = oneOf(raw[q.field], q.options);
      if (value) details[q.field] = value;
    }
  }
  const emirate = oneOf(b.emirate, EMIRATES) ?? undefined;
  const community = intent && ASKS_COMMUNITY[intent] ? str(b.community, 120) || undefined : undefined;

  return {
    lead: {
      id,
      email,
      name: str(b.name, 120) || undefined,
      phone: str(b.phone, 40) || undefined,
      country: str(b.country, 80) || undefined,
      intent,
      details: intent ? details : undefined,
      emirate,
      community,
      lastStep: str(b.lastStep, 40) || undefined,
      summary: intent ? summarise(intent, details, emirate, community) : undefined,
      source: parseSource(b.source),
    },
  };
}
