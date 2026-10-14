"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, CalendarClock, Check, ChevronDown, ChevronUp, LoaderCircle, MapPin, MessageCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow } from "@/components/ui";
import { bookingLink, site, whatsappLink } from "@/config/site";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  ASKS_COMMUNITY,
  DETAIL_QUESTIONS,
  EMIRATES,
  INTENTS,
  INTERESTS,
  OFFERS,
  contactFieldError,
  labelFor,
  type Contact,
  type DetailField,
  type Details,
  type Emirate,
  type Intent,
  type Interest,
  type LeadErrors,
  type LeadSource,
} from "@/lib/leads";
import { COMMUNITIES, COUNTRIES, guessCountry } from "@/lib/locations";
import { cornerScatter } from "@/lib/pixels";
import { cn, track, trackMeta } from "@/lib/utils";

type Option = { value: string; label: string; hint?: string };
type ChoiceId = "intent" | DetailField | "emirate";

type Question =
  | { id: ChoiceId; kind: "choice"; title: string; help?: string; options: readonly Option[] }
  | { id: "community"; kind: "community"; title: string; help?: string }
  | { id: "interests"; kind: "multi"; title: string; help?: string; options: readonly Option[] }
  | { id: keyof Contact; kind: "text"; title: string; help?: string }
  | { id: "review"; kind: "review"; title: string; help?: string };

type Answers = Contact & {
  intent: Intent | null;
  details: Details;
  emirate: Emirate | null;
  community: string;
  interests: Interest[];
};

const EMPTY: Answers = {
  intent: null,
  details: {},
  emirate: null,
  community: "",
  interests: [],
  name: "",
  email: "",
  phone: "",
  country: "",
};

const DETAIL_LABELS: Record<DetailField, string> = {
  propertyType: "Property",
  handover: "Handover",
  currentUse: "Currently",
  unitCount: "Units",
  portfolioUse: "Used as",
  budget: "Budget",
  timeline: "Timeline",
};

const TEXT_INPUTS: Record<keyof Contact, { type: string; inputMode?: "email" | "tel" | "text"; autoComplete: string; placeholder: string }> = {
  name: { type: "text", autoComplete: "name", placeholder: "Type your full name" },
  email: { type: "email", inputMode: "email", autoComplete: "email", placeholder: "name@example.com" },
  phone: { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "+44 7700 900123" },
  country: { type: "text", autoComplete: "country-name", placeholder: "e.g. United Kingdom" },
};

const COLS = 12;
const ROWS = 8;
const cornerPixels = cornerScatter({
  width: 480,
  height: 320,
  cell: 24,
  corner: "tr",
  colors: ["#e6eae8", "#dde3e0", "#b5c0bb", "#c3c5a1"],
  seed: 83,
});

/** Focuses the current question's primary control (first option, or the text input). */
function focusQuestion(container: HTMLElement | null) {
  container?.querySelector<HTMLElement>(".flow-question [data-autofocus]")?.focus({ preventScroll: true });
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? "";
}

function buildQuestions(a: Answers, emailLocked: boolean, countryGuessed: boolean): Question[] {
  const offer = OFFERS[a.intent ?? "owner"];
  const first = firstName(a.name);
  const list: Question[] = [
    {
      id: "intent",
      kind: "choice",
      title: "What brings you to Baytouna?",
      help: "Pick one — we'll tailor your free report.",
      options: INTENTS,
    },
  ];
  if (a.intent) {
    for (const q of DETAIL_QUESTIONS[a.intent]) {
      list.push({ id: q.field, kind: "choice", title: q.question, options: q.options });
    }
    list.push({
      id: "emirate",
      kind: "choice",
      title:
        a.intent === "buy"
          ? "Where would you like to buy?"
          : a.intent === "portfolio"
            ? "Where are most of your units?"
            : "Which emirate is the property in?",
      options: EMIRATES,
    });
    if (ASKS_COMMUNITY[a.intent]) {
      list.push({
        id: "community",
        kind: "community",
        title: "Which community or building?",
        help: "Start typing or pick a popular one. Not sure? Skip it.",
      });
    }
    list.push({
      id: "interests",
      kind: "multi",
      title: "What would you like help with?",
      help: "Choose all that apply — we'll handle it, track it, and focus your report on it.",
      options: INTERESTS,
    });
  }
  list.push({ id: "name", kind: "text", title: "What's your full name?" });
  if (!emailLocked) {
    list.push({
      id: "email",
      kind: "text",
      title: first ? `Thanks, ${first}. What's your email?` : "What's your email?",
      help: `We'll send your ${offer.short} here, and save your answers as you go.`,
    });
  }
  list.push({
    id: "phone",
    kind: "text",
    title: first ? `And your WhatsApp number, ${first}?` : "And your WhatsApp number?",
    help: "Include your country code. Your advisor may message you with a quick question.",
  });
  list.push({
    id: "country",
    kind: "text",
    title: "Where are you based?",
    help: countryGuessed ? "We guessed from your time zone — change it if we're wrong." : "The country you live in now.",
  });
  list.push({
    id: "review",
    kind: "review",
    title: first ? `Ready for your ${offer.short}, ${first}?` : `Ready for your ${offer.short}?`,
    help: "Check your answers — tap Edit to change anything.",
  });
  return list;
}

function readSource(): LeadSource {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    referrer: document.referrer || undefined,
    landingPage: window.location.pathname + window.location.search,
  };
}

export function LeadFlow({
  open,
  prefilledEmail,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  prefilledEmail: string | null;
  onClose: () => void;
  onSubmitted: (email: string) => void;
}) {
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [error, setError] = useState<string | null>(null);
  const [emailLocked, setEmailLocked] = useState(false);
  const [countryGuessed, setCountryGuessed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const advancing = useRef(false);

  const questions = useMemo(
    () => buildQuestions(answers, emailLocked, countryGuessed),
    [answers, emailLocked, countryGuessed],
  );
  const step = Math.min(index, questions.length - 1);
  const current = questions[step];
  const offer = OFFERS[answers.intent ?? "owner"];
  const progress = done ? 100 : (step / (questions.length - 1)) * 100;

  // Open / close: pixel-grid reveal, then the panel.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      timeline.current = gsap
        .timeline({ paused: true })
        .set(root.current, { autoAlpha: 1 })
        .fromTo(q(".flow-cell"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: { amount: 0.4, from: "random" } })
        .fromTo(q(".flow-panel"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 })
        .from(q(".flow-pixels .px"), { scale: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: { amount: 0.5, from: "random" } }, "<");
    },
    { scope: root },
  );

  useEffect(() => {
    const tl = timeline.current;
    if (!tl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    tl.timeScale(reduce ? 20 : open ? 1 : 1.6);
    if (!open) {
      tl.eventCallback("onComplete", null);
      tl.reverse();
      return;
    }

    // Behave as a true modal: lock scroll, make the page behind inert, and restore focus on close.
    const opener = document.activeElement as HTMLElement | null;
    const background = [...document.body.children].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && !el.contains(root.current),
    );
    document.documentElement.style.overflow = "hidden";
    background.forEach((el) => (el.inert = true));
    tl.eventCallback("onComplete", () => focusQuestion(root.current));
    tl.play();

    return () => {
      document.documentElement.style.overflow = "";
      background.forEach((el) => (el.inert = false));
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  // Save unfinished attempts (email + answers so far) so an advisor can follow up with visitors who drop off.
  // Saves are debounced, sent immediately when the visitor closes the form or leaves the page, and skipped when
  // nothing changed. Every save and the final submission share one id so a CRM can update a single record.
  const attempt = useRef<string | null>(null);
  const latest = useRef({ answers, lastStep: current.id as string, done });
  const lastSaved = useRef("");
  const countryConfirmed = useRef(false);
  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    latest.current = { answers, lastStep: current.id, done };
  });

  function attemptId() {
    attempt.current ??= crypto.randomUUID();
    return attempt.current;
  }

  function savePartial() {
    window.clearTimeout(saveTimer.current);
    const { answers: a, lastStep, done: finished } = latest.current;
    if (finished || contactFieldError.email(a.email)) return;
    const payload = JSON.stringify({
      id: attemptId(),
      intent: a.intent,
      details: a.details,
      emirate: a.emirate,
      community: a.community,
      interests: a.interests,
      name: a.name,
      email: a.email,
      // Leave out the pre-filled dialling code and guessed country until the visitor has confirmed them.
      phone: contactFieldError.phone(a.phone) ? undefined : a.phone,
      country: countryConfirmed.current ? a.country : undefined,
      lastStep,
      source: readSource(),
    });
    if (payload === lastSaved.current) return;
    lastSaved.current = payload;
    void fetch("/api/leads/partial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }

  function scheduleSave(delay: number) {
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(savePartial, delay);
  }

  function close() {
    savePartial();
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    const onHide = () => {
      if (document.visibilityState === "hidden") savePartial();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", savePartial);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", savePartial);
    };
    // savePartial only reads refs, so the listeners never go stale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => window.clearTimeout(saveTimer.current), []);

  // On open: take the email from the hero, guess the country, and start over if a lead was already sent.
  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- syncing with values captured outside the flow */
    if (done) {
      attempt.current = null;
      setDone(false);
      setAnswers((a) => ({ ...EMPTY, name: a.name, email: a.email, phone: a.phone, country: a.country }));
      setIndex(0);
    }
    if (prefilledEmail && !contactFieldError.email(prefilledEmail)) {
      setAnswers((a) => ({ ...a, email: prefilledEmail }));
      setEmailLocked(true);
      scheduleSave(600);
    }
    const guess = answers.country ? null : guessCountry();
    if (guess) {
      setCountryGuessed(true);
      setAnswers((a) => (a.country ? a : { ...a, country: guess.country, phone: a.phone || `${guess.dial} ` }));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // `done` and `answers` are deliberately read only when the flow opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prefilledEmail]);

  // Animate each new question in, then focus it.
  useGSAP(
    () => {
      if (!open) return;
      advancing.current = false;
      const el = root.current?.querySelector(".flow-question");
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        gsap.fromTo(el, { y: direction * 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" });
      }
      // While the overlay is still fading in, the timeline's onComplete handles focus instead.
      if (!timeline.current?.isActive()) window.setTimeout(() => focusQuestion(root.current), 60);
    },
    { dependencies: [step, done, open], scope: root },
  );


  function go(next: number, dir: 1 | -1) {
    setError(null);
    setServerError(null);
    setDirection(dir);
    setIndex(next);
    track("lead_flow_step", { step: questions[next]?.id });
    if (dir === 1) {
      if (current.id === "country") countryConfirmed.current = true;
      scheduleSave(4000);
    }
  }

  function valueOf(id: ChoiceId) {
    if (id === "intent") return answers.intent;
    if (id === "emirate") return answers.emirate;
    return answers.details[id] ?? null;
  }

  function validate(q: Question): string | null {
    if (q.kind === "choice") return valueOf(q.id) ? null : "Please choose an option.";
    if (q.kind === "text") return contactFieldError[q.id](answers[q.id]) ?? null;
    if (q.kind === "multi") return answers.interests.length ? null : "Choose at least one.";
    return null;
  }

  function next() {
    const message = validate(current);
    if (message) {
      setError(message);
      return;
    }
    if (current.kind === "review") {
      void submit();
      return;
    }
    go(step + 1, 1);
  }

  function prev() {
    if (step > 0) go(step - 1, -1);
  }

  function toggleInterest(value: Interest) {
    setError(null);
    setAnswers((a) => ({
      ...a,
      interests: a.interests.includes(value) ? a.interests.filter((v) => v !== value) : [...a.interests, value],
    }));
  }

  function choose(q: Extract<Question, { kind: "choice" }>, value: string) {
    setError(null);
    setAnswers((a) => {
      if (q.id === "intent") {
        const intent = value as Intent;
        return intent === a.intent ? a : { ...a, intent, details: {}, community: ASKS_COMMUNITY[intent] ? a.community : "" };
      }
      if (q.id === "emirate") {
        const emirate = value as Emirate;
        // Drop a suggested community that belongs to a different emirate.
        const foreign = Object.entries(COMMUNITIES).some(
          ([key, list]) => key !== emirate && list.includes(a.community),
        );
        return { ...a, emirate, community: foreign ? "" : a.community };
      }
      return { ...a, details: { ...a.details, [q.id]: value } };
    });
    if (q.id === "intent") track("lead_form_start", { intent: value });
    if (advancing.current) return;
    advancing.current = true;
    window.setTimeout(() => go(step + 1, 1), 280);
  }

  function setText(id: keyof Contact | "community", value: string) {
    if (id === "country") countryConfirmed.current = true;
    setError(null);
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  function editAt(id: Question["id"]) {
    if (id === "email" && emailLocked) {
      setEmailLocked(false);
      go(questions.findIndex((q) => q.id === "name") + 1, -1);
      return;
    }
    go(Math.max(0, questions.findIndex((q) => q.id === id)), -1);
  }

  async function submit() {
    if (!answers.intent || !answers.emirate) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: attemptId(),
          intent: answers.intent,
          details: answers.details,
          emirate: answers.emirate,
          community: answers.community,
          interests: answers.interests,
          name: answers.name,
          email: answers.email,
          phone: answers.phone,
          country: answers.country,
          website: honeypot.current?.value ?? "",
          source: readSource(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: LeadErrors };
      if (!res.ok) {
        const firstField = data.fields ? (Object.keys(data.fields)[0] as keyof LeadErrors | undefined) : undefined;
        const at = firstField ? questions.findIndex((q) => q.id === firstField) : -1;
        if (firstField && at >= 0) {
          go(at, -1);
          setError(data.fields?.[firstField] ?? null);
          return;
        }
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      track("generate_lead", { intent: answers.intent, emirate: answers.emirate, ...answers.details });
      trackMeta("Lead", { content_category: answers.intent });
      window.clearTimeout(saveTimer.current);
      setDirection(1);
      setDone(true);
      onSubmitted(answers.email);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function onKeyDown(event: globalThis.KeyboardEvent) {
    if (!open || event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (done) return;
    // On multi-select screens Enter continues (Space still toggles the focused option).
    if (event.key === "Enter" && current.kind === "multi" && target.closest("[data-option]")) {
      event.preventDefault();
      next();
      return;
    }
    if (event.key === "Enter" && target.tagName !== "BUTTON" && target.tagName !== "A") {
      event.preventDefault();
      next();
      return;
    }
    const letter = !typing && /^[a-z]$/i.test(event.key) && !event.metaKey && !event.ctrlKey;
    if (letter && (current.kind === "choice" || current.kind === "multi")) {
      const option = current.options[event.key.toUpperCase().charCodeAt(0) - 65];
      if (!option) return;
      event.preventDefault();
      if (current.kind === "choice") choose(current, option.value);
      else toggleInterest(option.value as Interest);
    }
  }

  // Keyboard shortcuts work wherever focus is while the flow is open.
  const keyHandler = useRef<(event: globalThis.KeyboardEvent) => void>(() => {});
  useEffect(() => {
    keyHandler.current = onKeyDown;
  });
  useEffect(() => {
    if (!open) return;
    const listener = (event: globalThis.KeyboardEvent) => keyHandler.current(event);
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [open]);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="flow-title"
      className="invisible fixed inset-0 z-[70] opacity-0"
    >
      <div aria-hidden className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <span key={i} className="flow-cell block bg-sage" style={{ height: `${100 / ROWS}vh` }} />
        ))}
      </div>

      <div className="flow-panel absolute inset-0 flex flex-col overflow-y-auto bg-sage text-charcoal">
        <PixelArt
          pixels={cornerPixels}
          width={480}
          height={320}
          className="flow-pixels pointer-events-none absolute top-0 right-0 h-[180px] w-[270px] sm:h-[320px] sm:w-[480px]"
        />

        <div className="sticky top-0 z-10 h-1 w-full bg-charcoal/10">
          <div className="h-full bg-charcoal transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <header className="wrap relative flex h-20 shrink-0 items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={close}
            className="group flex items-center gap-4 text-sm font-medium tracking-[0.06em]"
          >
            <span className="hidden sm:inline">CLOSE</span>
            <span className="relative grid h-9 w-[72px] place-items-center rounded-[3px] bg-charcoal">
              <span className="absolute h-px w-6 rotate-45 bg-white transition-transform duration-300 group-hover:rotate-[135deg]" />
              <span className="absolute h-px w-6 -rotate-45 bg-white transition-transform duration-300 group-hover:rotate-45" />
            </span>
            <span className="sr-only sm:hidden">Close form</span>
          </button>
        </header>

        <main className="wrap relative flex flex-1 items-center py-10 sm:py-16">
          <div key={done ? "done" : current.id} className="flow-question w-full max-w-2xl" aria-live="polite">
            {done ? (
              <Done
                name={firstName(answers.name)}
                email={answers.email}
                offerShort={offer.short}
                next={offer.next}
                onClose={close}
              />
            ) : (
              <>
                <p className="flex items-center gap-1.5 text-sm font-medium text-olive-800">
                  <span className="tabular-nums">{step + 1}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </p>
                <h2
                  id="flow-title"
                  className="mt-3 text-[1.9rem] leading-[1.12] font-medium tracking-[-0.025em] text-balance sm:text-[2.7rem]"
                >
                  {current.title}
                </h2>
                {current.help && <p className="mt-3 text-lg text-charcoal/60">{current.help}</p>}

                <div className="mt-9">
                  {current.kind === "choice" && (
                    <Choices
                      question={current}
                      value={valueOf(current.id)}
                      onChoose={(v) => choose(current, v)}
                    />
                  )}

                  {current.kind === "multi" && (
                    <MultiChoices
                      question={current}
                      values={answers.interests}
                      onToggle={(v) => toggleInterest(v as Interest)}
                    />
                  )}

                  {current.kind === "text" && (
                    <>
                      <input
                        data-autofocus
                        id={`flow-${current.id}`}
                        aria-labelledby="flow-title"
                        aria-invalid={Boolean(error)}
                        value={answers[current.id]}
                        onChange={(e) => setText(current.id as keyof Contact, e.target.value)}
                        list={current.id === "country" ? "flow-countries" : undefined}
                        {...TEXT_INPUTS[current.id]}
                        className="w-full border-b-2 border-charcoal/25 bg-transparent pb-3 text-2xl transition-colors outline-none placeholder:text-charcoal/25 focus:border-charcoal sm:text-[2rem]"
                      />
                      {current.id === "country" && (
                        <datalist id="flow-countries">
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c} />
                          ))}
                        </datalist>
                      )}
                    </>
                  )}

                  {current.kind === "community" && (
                    <Community
                      emirate={answers.emirate}
                      value={answers.community}
                      onChange={(v) => setText("community", v)}
                      onPick={(v) => {
                        setText("community", v);
                        if (!advancing.current) {
                          advancing.current = true;
                          window.setTimeout(() => go(step + 1, 1), 220);
                        }
                      }}
                    />
                  )}

                  {current.kind === "review" && (
                    <Review answers={answers} onEdit={editAt} />
                  )}
                </div>

                {(error || serverError) && (
                  <p role="alert" className="mt-5 inline-flex rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error ?? serverError}
                  </p>
                )}

                {current.kind === "review" ? (
                  <div className="mt-9">
                    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label>
                        Website
                        <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={next}
                      disabled={submitting}
                      className="group inline-flex h-14 items-center gap-3 rounded-md bg-charcoal px-7 text-[15px] font-medium text-white transition hover:bg-charcoal-700 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          {offer.cta} <CtaArrow className="text-olive-300" />
                        </>
                      )}
                    </button>
                    <p className="mt-3 max-w-md text-xs text-slate">
                      We only use your details to prepare your {offer.short} and contact you about it.
                    </p>
                  </div>
                ) : current.kind !== "choice" ? (
                  <div className="mt-9 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={next}
                      className="inline-flex h-12 items-center gap-2 rounded-md bg-charcoal px-5 text-[15px] font-medium text-white transition hover:bg-charcoal-700"
                    >
                      OK <Check className="h-4 w-4" />
                    </button>
                    {current.kind === "community" && (
                      <button
                        type="button"
                        onClick={() => {
                          setText("community", "");
                          go(step + 1, 1);
                        }}
                        className="h-12 px-2 text-[15px] text-charcoal/60 underline-offset-4 hover:text-charcoal hover:underline"
                      >
                        Skip
                      </button>
                    )}
                    <span className="hidden text-xs text-slate sm:inline">
                      press <strong className="font-semibold text-charcoal">Enter ↵</strong>
                    </span>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </main>

        {!done && (
          <footer className="wrap relative flex shrink-0 items-center justify-between pb-6">
            <p className="text-xs text-slate tabular-nums">
              {step + 1} of {questions.length}
            </p>
            <div className="flex gap-1">
              <NavButton label="Previous question" onClick={prev} disabled={step === 0}>
                <ChevronUp className="h-5 w-5" />
              </NavButton>
              <NavButton
                label="Next question"
                onClick={next}
                disabled={
                  current.kind === "review" ||
                  (current.kind === "choice" && !valueOf(current.id)) ||
                  (current.kind === "multi" && answers.interests.length === 0)
                }
              >
                <ChevronDown className="h-5 w-5" />
              </NavButton>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

function Choices({
  question,
  value,
  onChoose,
}: {
  question: Extract<Question, { kind: "choice" }>;
  value: string | null;
  onChoose: (value: string) => void;
}) {
  const selectedIndex = question.options.findIndex((o) => o.value === value);
  const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const wide = question.options.length > 4;
  return (
    <>
      <div
        role="group"
        aria-labelledby="flow-title"
        className={cn("grid gap-2", wide ? "max-w-xl sm:grid-cols-2" : "max-w-md")}
      >
        {question.options.map((option, i) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              data-autofocus={i === focusIndex ? "" : undefined}
              aria-pressed={selected}
              onClick={() => onChoose(option.value)}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-3 text-left text-[17px] transition-colors duration-200",
                selected
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-charcoal/20 bg-white/40 hover:border-charcoal/40 hover:bg-white/70",
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-[4px] border text-xs font-semibold",
                  selected ? "border-white/30 bg-white/10" : "border-charcoal/25 bg-white",
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 leading-tight">
                {option.label}
                {option.hint && <span className="mt-0.5 block text-sm opacity-60">{option.hint}</span>}
              </span>
              {selected && <Check className="h-4 w-4 shrink-0" />}
            </button>
          );
        })}
      </div>
      <p className="mt-4 hidden text-xs text-slate sm:block">
        Press{" "}
        <kbd className="rounded-[3px] border border-charcoal/20 bg-white px-1.5 py-0.5 font-sans font-semibold">A</kbd>
        –
        <kbd className="rounded-[3px] border border-charcoal/20 bg-white px-1.5 py-0.5 font-sans font-semibold">
          {String.fromCharCode(64 + question.options.length)}
        </kbd>{" "}
        to choose
      </p>
    </>
  );
}

function MultiChoices({
  question,
  values,
  onToggle,
}: {
  question: Extract<Question, { kind: "multi" }>;
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <>
      <div role="group" aria-labelledby="flow-title" className="grid max-w-xl gap-2 sm:grid-cols-2">
        {question.options.map((option, i) => {
          const selected = values.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              data-autofocus={i === 0 ? "" : undefined}
              data-option=""
              aria-pressed={selected}
              onClick={() => onToggle(option.value)}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-3 text-left text-[17px] transition-colors duration-200",
                selected
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-charcoal/20 bg-white/40 hover:border-charcoal/40 hover:bg-white/70",
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-[4px] border text-xs font-semibold",
                  selected ? "border-white/30 bg-white/10" : "border-charcoal/25 bg-white",
                )}
              >
                {selected ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 leading-tight">{option.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 hidden text-xs text-slate sm:block">
        Press letters or Space to select, then <strong className="font-semibold text-charcoal">Enter ↵</strong>
      </p>
    </>
  );
}

function Community({
  emirate,
  value,
  onChange,
  onPick,
}: {
  emirate: Emirate | null;
  value: string;
  onChange: (value: string) => void;
  onPick: (value: string) => void;
}) {
  const all = emirate ? COMMUNITIES[emirate] : Object.values(COMMUNITIES).flat();
  const query = value.trim().toLowerCase();
  const suggestions = (query ? all.filter((c) => c.toLowerCase().includes(query)) : all)
    .filter((c) => c.toLowerCase() !== query)
    .slice(0, 8);

  return (
    <>
      <div className="relative">
        <MapPin className="pointer-events-none absolute top-2 left-0 h-6 w-6 text-charcoal/40 sm:top-2.5 sm:h-7 sm:w-7" />
        <input
          data-autofocus
          id="flow-community"
          aria-labelledby="flow-title"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Dubai Marina"
          autoComplete="off"
          maxLength={120}
          className="w-full border-b-2 border-charcoal/25 bg-transparent pb-3 pl-10 text-2xl transition-colors outline-none placeholder:text-charcoal/25 focus:border-charcoal sm:pl-12 sm:text-[2rem]"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium tracking-[0.12em] text-slate uppercase">
            {query ? "Suggestions" : "Popular"}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onPick(s)}
                className="rounded-md border border-charcoal/15 bg-white/50 px-3 py-1.5 text-sm transition-colors hover:border-charcoal/40 hover:bg-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Review({ answers, onEdit }: { answers: Answers; onEdit: (id: Question["id"]) => void }) {
  if (!answers.intent) return null;
  const rows: { id: Question["id"]; label: string; value: string }[] = [
    { id: "intent", label: "Looking to", value: labelFor(INTENTS, answers.intent) },
    ...DETAIL_QUESTIONS[answers.intent].map((q) => ({
      id: q.field,
      label: DETAIL_LABELS[q.field],
      value: labelFor(q.options, answers.details[q.field]),
    })),
    {
      id: "emirate",
      label: "Location",
      value: [answers.community.trim(), labelFor(EMIRATES, answers.emirate)].filter(Boolean).join(", "),
    },
    {
      id: "interests",
      label: "Help with",
      value: answers.interests.map((v) => labelFor(INTERESTS, v)).join(", "),
    },
    { id: "name", label: "Name", value: answers.name },
    { id: "email", label: "Email", value: answers.email },
    { id: "phone", label: "WhatsApp", value: answers.phone },
    { id: "country", label: "Based in", value: answers.country },
  ];
  return (
    <dl className="max-w-xl divide-y divide-charcoal/10 border-y border-charcoal/10">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-4 py-3">
          <dt className="w-24 shrink-0 text-sm text-slate">{row.label}</dt>
          <dd className="min-w-0 flex-1 truncate font-medium">{row.value}</dd>
          <button
            type="button"
            onClick={() => onEdit(row.id)}
            className="text-sm text-olive-800 underline-offset-4 hover:underline"
          >
            Edit<span className="sr-only"> {row.label}</span>
          </button>
        </div>
      ))}
    </dl>
  );
}

function Done({
  name,
  email,
  offerShort,
  next,
  onClose,
}: {
  name: string;
  email: string;
  offerShort: string;
  next: string[];
  onClose: () => void;
}) {
  return (
    <>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-emerald-600">
        <Check className="h-7 w-7" strokeWidth={2.5} />
      </span>
      <h2
        id="flow-title"
        tabIndex={-1}
        className="mt-6 text-[1.9rem] leading-[1.12] font-medium tracking-[-0.025em] outline-none sm:text-[2.7rem]"
      >
        You&apos;re all set{name ? `, ${name}` : ""}.
      </h2>
      <p className="mt-3 max-w-lg text-lg text-charcoal/65">
        Your {offerShort} is being prepared and will reach <strong className="text-charcoal">{email}</strong> within{" "}
        {site.reportTurnaround}. Book a short call to walk through it — founding owners get their dashboard set up on
        the same call.
      </p>
      <ol className="mt-8 max-w-lg space-y-3 rounded-2xl bg-white/60 p-5 text-sm">
        {next.map((item, i) => (
          <li key={item} className="flex items-start gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-charcoal text-[11px] font-semibold text-white">
              {i + 1}
            </span>
            <span className="pt-0.5 text-charcoal/80">{item}</span>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          data-autofocus
          href={bookingLink(`Hi Baytouna, I just requested my free ${offerShort} and would like to book a call.`)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("book_call_click", { location: "flow_success" })}
          className="group inline-flex h-12 items-center gap-2.5 rounded-md bg-charcoal px-5 text-sm font-medium text-white transition hover:bg-charcoal-700"
        >
          <CalendarClock className="h-4 w-4 text-olive-300" /> Book your call
        </a>
        {site.bookingUrl && (
          <a
            href={whatsappLink(`Hi Baytouna, I just requested my free ${offerShort}.`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "flow_success" })}
            className="inline-flex h-12 items-center gap-2 rounded-md border border-charcoal/20 px-5 text-sm font-medium transition hover:border-charcoal/50"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp us
          </a>
        )}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-12 items-center rounded-md border border-charcoal/20 px-5 text-sm font-medium transition hover:border-charcoal/50"
        >
          Back to the site
        </button>
      </div>
    </>
  );
}

function NavButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-10 w-10 place-items-center rounded-[3px] bg-charcoal text-white transition hover:bg-charcoal-700 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
