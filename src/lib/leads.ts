// Lead shape and validation, shared by the form (client) and the API route (server).

type Option = { value: string; label: string; hint?: string };

export const INTENTS = [
  { value: "handover", label: "I'm getting my keys", hint: "Handover coming up" },
  { value: "owner", label: "I own a property", hint: "Ready, rented or vacant" },
  { value: "portfolio", label: "I own several", hint: "Two or more units" },
  { value: "buy", label: "I'm planning to buy", hint: "See the real costs first" },
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

export const UNIT_COUNTS = [
  { value: "2", label: "2 units" },
  { value: "3-5", label: "3 – 5 units" },
  { value: "6-10", label: "6 – 10 units" },
  { value: "10-plus", label: "More than 10" },
] as const;

export const PORTFOLIO_USES = [
  { value: "long-term", label: "Mostly long-term rentals" },
  { value: "holiday-home", label: "Mostly holiday homes" },
  { value: "mixed", label: "A mix" },
  { value: "vacant", label: "Mostly vacant or self-use" },
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

/** What the owner wants handled and tracked — shapes the report, routes to partners, and doubles as research. */
export const INTERESTS = [
  { value: "handover", label: "Handover & snagging" },
  { value: "furnishing", label: "Furnishing" },
  { value: "tenant", label: "Finding a tenant" },
  { value: "holiday-home", label: "Holiday-home letting" },
  { value: "maintenance", label: "Maintenance" },
  { value: "payments", label: "Payments & service charges" },
  { value: "documents", label: "Documents" },
  { value: "selling", label: "Selling or valuation" },
] as const;

export type Intent = (typeof INTENTS)[number]["value"];
export type Emirate = (typeof EMIRATES)[number]["value"];
export type Interest = (typeof INTERESTS)[number]["value"];
export type DetailField = "propertyType" | "handover" | "currentUse" | "unitCount" | "portfolioUse" | "budget" | "timeline";

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
  portfolio: [
    { field: "unitCount", question: "How many units do you own?", options: UNIT_COUNTS },
    { field: "portfolioUse", question: "How are they used today?", options: PORTFOLIO_USES },
  ],
  buy: [
    { field: "budget", question: "What's your budget?", options: BUDGETS },
    { field: "timeline", question: "When are you looking to buy?", options: TIMELINES },
  ],
};

/** Whether we ask for the community / building (it sharpens the report). Others only pick an emirate. */
export const ASKS_COMMUNITY: Record<Intent, boolean> = { handover: true, owner: true, portfolio: false, buy: false };

/** The free report each visitor gets, and what happens next — the report leads to a call. */
export const OFFERS: Record<Intent, { title: string; short: string; cta: string; next: string[] }> = {
  handover: {
    title: "Get your free handover report",
    short: "handover report",
    cta: "Send me my free report",
    next: [
      "We review your unit, developer and handover date",
      "Your report arrives: checklist, running costs, key dates and rental outlook",
      "Book a call to walk through it and set up your dashboard",
    ],
  },
  owner: {
    title: "Get your free property report",
    short: "property report",
    cta: "Send me my free report",
    next: [
      "We review your unit and how it's used today",
      "Your report arrives: running costs, key dates, rental outlook and value trend",
      "Book a call to walk through it and set up your dashboard",
    ],
  },
  portfolio: {
    title: "Get your free portfolio report",
    short: "portfolio report",
    cta: "Send me my free report",
    next: [
      "We review your units and how they're used",
      "Your report arrives: costs, key dates and value trend across your portfolio",
      "Book a call to walk through it and set up your dashboard",
    ],
  },
  buy: {
    title: "Get your free ownership cost report",
    short: "ownership cost report",
    cta: "Send me my free report",
    next: [
      "We review your budget and timeline",
      "Your report arrives: the real cost of owning, rental outlook and value trends",
      "Book a call to walk through it",
    ],
  },
};

/**
 * Focused free offers for the paid-traffic landing pages. Each presets the intent, asks a single follow-up
 * question, and names the deliverable, so the flow after the email is only a few taps.
 */
export const LANDING_OFFERS = {
  "handover-pack": {
    path: "/handover",
    label: "Handover Pack",
    intent: "handover",
    details: ["handover"],
    short: "Handover Pack",
    cta: "Send my Handover Pack",
    next: [
      "We look up your project, developer and handover stage",
      "Your Handover Pack arrives within 48 hours: your checklist, timeline, defects-window dates and first-week plan",
      "Optional: a short call to walk through it, or to arrange snagging and key collection if you can't fly in",
    ],
  },
  "rent-snapshot": {
    path: "/snapshot",
    label: "Rent snapshot",
    intent: "owner",
    details: ["currentUse"],
    short: "rent & running-cost snapshot",
    cta: "Send my free snapshot",
    next: [
      "We pull the rent and service-charge data for your building",
      "Your snapshot arrives within 48 hours: rent range, yearly costs, net yield and key dates",
      "Optional: a short call to walk through it and what you could change",
    ],
  },
} as const satisfies Record<
  string,
  { path: string; label: string; intent: Intent; details: readonly DetailField[]; short: string; cta: string; next: readonly string[] }
>;

export type OfferKey = keyof typeof LANDING_OFFERS;
export const OFFER_KEYS = Object.keys(LANDING_OFFERS) as OfferKey[];

/** The follow-up questions a lead must answer: both for the intent, or just the landing offer's one. */
export function detailQuestionsFor(intent: Intent, offer?: OfferKey | null) {
  const all = DETAIL_QUESTIONS[intent];
  if (!offer || LANDING_OFFERS[offer].intent !== intent) return all;
  const wanted: readonly DetailField[] = LANDING_OFFERS[offer].details;
  return all.filter((q) => wanted.includes(q.field));
}

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
  /** What they want the dashboard to track. */
  interests: Interest[];
  /** The landing-page offer they asked for, if they came through one. */
  offer?: OfferKey;
  /** Human-readable one-liner for inboxes, spreadsheets and CRMs. */
  summary: string;
  source: LeadSource;
};

export type LeadErrors = Partial<Record<keyof Contact | DetailField | "intent" | "emirate" | "interests", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

/** A WhatsApp number is optional; a lone dialling code (pre-filled from the time zone) counts as none. */
export function phoneOrEmpty(value: string) {
  return value.replace(/\D/g, "").length > 4 ? value.trim() : "";
}

/** One validator per contact field, so the step-by-step flow can check a single answer. */
export const contactFieldError: Record<keyof Contact, (value: string) => string | undefined> = {
  name: (v) => (v.trim().length < 2 ? "Please enter your name." : undefined),
  email: (v) => (EMAIL_RE.test(v.trim()) ? undefined : "Please enter a valid email address."),
  phone: (v) =>
    !phoneOrEmpty(v) || (PHONE_RE.test(v.trim()) && v.replace(/\D/g, "").length >= 7)
      ? undefined
      : "Please include your country code, e.g. +44 7700 900123 — or leave it blank.",
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

export function summarise(intent: Intent, details: Details, emirate?: Emirate, community?: string, offer?: OfferKey) {
  const parts = [
    offer ? LANDING_OFFERS[offer].label : undefined,
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

function parseOffer(value: unknown): OfferKey | undefined {
  return OFFER_KEYS.find((key) => key === value);
}

function parseInterests(value: unknown): Interest[] {
  if (!Array.isArray(value)) return [];
  return INTERESTS.map((o) => o.value).filter((v) => value.includes(v));
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
    phone: phoneOrEmpty(str(b.phone, 40)),
    country: str(b.country, 80),
  };
  const errors = validateContact(contact);

  const intent = oneOf(b.intent, INTENTS);
  const offer = parseOffer(b.offer);
  const details: Details = {};
  if (!intent) {
    errors.intent = "Please tell us what you'd like help with.";
  } else {
    const raw = record(b.details);
    for (const q of detailQuestionsFor(intent, offer)) {
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
      interests: parseInterests(b.interests),
      offer,
      summary: summarise(intent, details, emirate, community, offer),
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
  interests?: Interest[];
  offer?: OfferKey;
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
  const offer = parseOffer(b.offer);

  return {
    lead: {
      id,
      email,
      name: str(b.name, 120) || undefined,
      phone: phoneOrEmpty(str(b.phone, 40)) || undefined,
      country: str(b.country, 80) || undefined,
      intent,
      details: intent ? details : undefined,
      emirate,
      community,
      interests: parseInterests(b.interests),
      offer,
      lastStep: str(b.lastStep, 40) || undefined,
      summary: intent ? summarise(intent, details, emirate, community, offer) : undefined,
      source: parseSource(b.source),
    },
  };
}
