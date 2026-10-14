"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { onOpenCookieSettings, openCookieSettings, setConsent, useConsent } from "@/lib/consent";

/** Analytics consent banner. Accept and decline carry equal weight; the footer link reopens it. */
export function CookieBanner() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);

  useEffect(() => onOpenCookieSettings(() => setReopened(true)), []);

  if (consent === "server" || (consent !== "unset" && !reopened)) return null;

  function choose(value: "granted" | "denied") {
    setConsent(value);
    setReopened(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-24 z-[55] animate-step-in rounded-[20px] bg-white p-5 text-charcoal shadow-[0_24px_70px_-20px_rgb(27_40_33/0.45)] ring-1 ring-charcoal/10 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-sm"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mist">
          <Cookie className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
        <p className="text-sm leading-relaxed text-charcoal/80">
          We&apos;d like to use cookies from Google Analytics and Meta to see how people find Baytouna and to measure
          our ads. We never sell your data.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="h-11 rounded-md border border-charcoal/20 text-sm font-medium transition-colors hover:border-charcoal/50"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="h-11 rounded-md bg-charcoal text-sm font-medium text-white transition-colors hover:bg-charcoal-700"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

/** Footer link that reopens the banner so visitors can change their choice at any time. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
