"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { useLeadFlow } from "@/components/lead-flow/LeadFlowProvider";
import { CtaArrow } from "@/components/ui";
import { EMIRATES, LANDING_OFFERS, contactFieldError, type Emirate, type OfferKey } from "@/lib/leads";
import { COMMUNITIES } from "@/lib/locations";
import { cn, track } from "@/lib/utils";

/**
 * Two-step opt-in for the landing pages. Step one asks the easy, zero-risk question (which building), step two
 * the email; then the shared lead flow opens on its short version with both already filled in.
 */
export function LandingForm({
  offer,
  buildingLabel,
  buildingPlaceholder,
  emailLabel,
  submitLabel,
  className,
}: {
  offer: OfferKey;
  buildingLabel: string;
  buildingPlaceholder: string;
  emailLabel: string;
  submitLabel: string;
  className?: string;
}) {
  const { openFlow, submittedEmail } = useLeadFlow();
  const id = useId();
  const [step, setStep] = useState<1 | 2>(1);
  const [emirate, setEmirate] = useState<Emirate>("dubai");
  const [community, setCommunity] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function toEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (community.trim().length < 2) {
      setError("Type your project, building or community.");
      return;
    }
    setError(null);
    setStep(2);
    track("landing_building", { offer, emirate });
    // Focus the email field once it has rendered.
    requestAnimationFrame(() => document.getElementById(`${id}-email`)?.focus());
  }

  function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = contactFieldError.email(email);
    setError(message ?? null);
    if (message) return;
    track("landing_email", { offer, emirate });
    openFlow(email.trim(), { offer, emirate, community: community.trim() });
  }

  if (submittedEmail) {
    return (
      <div className={cn("rounded-[28px] bg-white p-6 text-charcoal shadow-[0_30px_80px_-40px_rgb(27_40_33/0.45)]", className)}>
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist text-emerald-600">
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <p className="leading-relaxed">
            <span className="font-medium">Your request is in.</span>{" "}
            <span className="text-slate">
              We&apos;ll send your {LANDING_OFFERS[offer].short} to {submittedEmail} within 48 hours.
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[28px] bg-white p-5 text-charcoal shadow-[0_30px_80px_-40px_rgb(27_40_33/0.45)] sm:p-7",
        className,
      )}
    >
      <div className="flex items-center justify-between text-xs font-medium tracking-[0.12em] text-slate uppercase">
        <span>Step {step} of 2</span>
        <span className="flex gap-1" aria-hidden>
          <span className="h-1 w-6 rounded-full bg-charcoal" />
          <span className={cn("h-1 w-6 rounded-full transition-colors", step === 2 ? "bg-charcoal" : "bg-charcoal/15")} />
        </span>
      </div>

      {step === 1 ? (
        <form onSubmit={toEmail} noValidate className="mt-4">
          <label htmlFor={`${id}-community`} className="block text-[17px] font-medium">
            {buildingLabel}
          </label>
          <div
            className={cn(
              "mt-3 flex h-14 overflow-hidden rounded-md border bg-mist/60 transition focus-within:border-charcoal focus-within:bg-white focus-within:ring-4 focus-within:ring-charcoal/5",
              error ? "border-red-400" : "border-transparent",
            )}
          >
            <label htmlFor={`${id}-emirate`} className="sr-only">
              Emirate
            </label>
            <select
              id={`${id}-emirate`}
              value={emirate}
              onChange={(e) => setEmirate(e.target.value as Emirate)}
              className="w-[6.5rem] max-w-[38%] shrink-0 cursor-pointer border-r border-charcoal/10 bg-transparent pl-3 text-[15px] outline-none"
            >
              {EMIRATES.filter((e) => e.value !== "other").map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
            <input
              id={`${id}-community`}
              value={community}
              onChange={(e) => {
                setCommunity(e.target.value);
                if (error) setError(null);
              }}
              list={`${id}-communities`}
              autoComplete="off"
              enterKeyHint="next"
              placeholder={buildingPlaceholder}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              size={1}
              className="w-0 min-w-0 flex-1 bg-transparent px-3 text-base text-ellipsis outline-none placeholder:text-charcoal/40"
            />
            <datalist id={`${id}-communities`}>
              {COMMUNITIES[emirate].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <button
            type="submit"
            className="group mt-3 inline-flex h-14 w-full items-center justify-center gap-3 rounded-md bg-charcoal px-6 text-[15px] font-medium text-white transition hover:bg-charcoal-700"
          >
            Next <CtaArrow className="text-olive-300" />
          </button>
        </form>
      ) : (
        <form onSubmit={start} noValidate className="mt-4">
          <label htmlFor={`${id}-email`} className="block text-[17px] font-medium">
            {emailLabel}
          </label>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="go"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              "mt-3 h-14 w-full rounded-md border bg-mist/60 px-4 text-base transition outline-none placeholder:text-charcoal/40 focus:border-charcoal focus:bg-white focus:ring-4 focus:ring-charcoal/5",
              error ? "border-red-400" : "border-transparent",
            )}
          />
          <button
            type="submit"
            className="group mt-3 inline-flex h-14 w-full items-center justify-center gap-3 rounded-md bg-charcoal px-6 text-[15px] font-medium text-white transition hover:bg-charcoal-700"
          >
            {submitLabel} <CtaArrow className="text-olive-300" />
          </button>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className="inline-flex min-w-0 items-center gap-1.5 text-sm text-slate hover:text-charcoal"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{community}</span>
            </button>
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-slate">
              <Lock className="h-3 w-3" /> No spam, ever
            </span>
          </div>
        </form>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
