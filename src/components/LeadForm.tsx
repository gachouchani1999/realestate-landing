"use client";

import { useState, type FormEvent } from "react";
import { Check, Lock } from "lucide-react";
import { useLeadFlow } from "@/components/lead-flow/LeadFlowProvider";
import { LogoMark } from "@/components/Logo";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow } from "@/components/ui";
import { site } from "@/config/site";
import { contactFieldError } from "@/lib/leads";
import { palmPixels } from "@/lib/pixels";
import { cn } from "@/lib/utils";

const palm = palmPixels();

const benefits = ["Long-term vs holiday-home income", "Full cost breakdown", "Handover-to-income plan"];

/** Hero card: captures the email, then hands over to the full-screen question flow. */
export function LeadForm() {
  const { openFlow, submittedEmail } = useLeadFlow();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = contactFieldError.email(email);
    setError(message ?? null);
    if (!message) openFlow(email.trim());
  }

  return (
    <div
      id="get-report"
      data-hero="card"
      className="relative scroll-mt-28 overflow-hidden rounded-[36px] bg-white p-6 text-charcoal shadow-[0_40px_100px_-40px_rgb(27_40_33/0.45)] sm:p-8"
    >
      <PixelArt
        pixels={palm}
        width={192}
        height={192}
        className="palm pointer-events-none absolute top-5 right-5 h-20 w-20 sm:top-6 sm:right-6 sm:h-36 sm:w-36"
      />

      <div className="relative flex items-center gap-3.5">
        <span className="flex -space-x-3">
          <span className="h-12 w-12 rounded-full bg-charcoal" />
          <span className="grid h-12 w-12 place-items-center rounded-full bg-sage ring-4 ring-white">
            <LogoMark className="h-6 w-6 text-charcoal" />
          </span>
        </span>
        <span className="leading-tight">
          <span className="block text-[15px] font-medium">Baytouna Advisory</span>
          <span className="block text-sm text-slate">Free · Personalised</span>
        </span>
      </div>

      <h2 className="relative mt-16 max-w-[20rem] text-[1.75rem] leading-[1.1] font-medium tracking-[-0.02em] sm:mt-20 sm:text-[2rem]">
        Get your free rental income estimate
      </h2>
      <p className="relative mt-2 text-sm text-slate">
        For your unit, in your inbox within {site.reportTurnaround}.
      </p>

      {submittedEmail ? (
        <div className="mt-7 flex items-start gap-3 rounded-2xl bg-mist p-5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-emerald-600">
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <p className="text-sm leading-relaxed">
            <span className="font-medium">Your request is in.</span>{" "}
            <span className="text-slate">We&apos;ll send it to {submittedEmail}.</span>
          </p>
        </div>
      ) : (
        <form onSubmit={start} noValidate className="mt-7">
          <label htmlFor="hero-email" className="sr-only">
            Email
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="hero-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "hero-email-error" : undefined}
              className={cn(
                "h-14 min-w-0 flex-1 rounded-md border bg-mist/60 px-4 text-base transition outline-none placeholder:text-charcoal/40 focus:border-charcoal focus:bg-white focus:ring-4 focus:ring-charcoal/5",
                error ? "border-red-400" : "border-transparent",
              )}
            />
            <button
              type="submit"
              className="group inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-md bg-charcoal px-6 text-[15px] font-medium text-white transition hover:bg-charcoal-700"
            >
              Start <CtaArrow className="text-olive-300" />
            </button>
          </div>
          {error && (
            <p id="hero-email-error" className="mt-2 text-xs text-red-600">
              {error}
            </p>
          )}
          <p className="mt-3 flex items-center gap-2 text-xs text-slate">
            <Lock className="h-3.5 w-3.5 shrink-0" /> About 60 seconds · we save your answers as you go · no spam
          </p>
        </form>
      )}

      <div className="mt-8 border-t border-charcoal/10 pt-6">
        <p className="text-[11px] font-medium tracking-[0.14em] text-slate uppercase">What you&apos;ll get</p>
        <ul className="mt-3 space-y-2.5">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-[15px]">
              <span className="grid h-4 w-4 shrink-0 place-items-center bg-olive text-charcoal">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-slate">Buying or selling instead? Start the same way — we&apos;ll tailor it.</p>
      </div>
    </div>
  );
}
