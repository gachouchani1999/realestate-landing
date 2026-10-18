"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Cookie } from "lucide-react";
import { LANDING_OFFERS } from "@/lib/leads";
import { cn } from "@/lib/utils";
import { onOpenCookieSettings, openCookieSettings, setConsent, useConsent } from "@/lib/consent";

const landingPaths: string[] = Object.values(LANDING_OFFERS).map((o) => o.path);

/** Analytics consent banner. Accept and decline carry equal weight; the footer link reopens it. */
export function CookieBanner() {
  const consent = useConsent();
  const pathname = usePathname();
  // Landing pages have no sticky call-to-action bar to sit above.
  const onLanding = landingPaths.includes(pathname);
  const [reopened, setReopened] = useState(false);

  useEffect(() => onOpenCookieSettings(() => setReopened(true)), []);

  // Meta's automatic click tracking would otherwise report the Decline click itself. This window-level capture
  // listener runs before Meta's, so its consent is withdrawn before it sees the click.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest?.("[data-consent-decline]")) window.fbq?.("consent", "revoke");
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  if (consent === "server" || (consent !== "unset" && !reopened)) return null;

  function choose(value: "granted" | "denied") {
    setConsent(value);
    setReopened(false);
  }

  return (
    // Compact on phones (a slim bar that doesn't cover the page), a card on larger screens.
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className={cn(
        "fixed inset-x-2 z-[55] flex animate-step-in items-center gap-3 rounded-2xl bg-white p-3 text-charcoal shadow-[0_24px_70px_-20px_rgb(27_40_33/0.45)] ring-1 ring-charcoal/10",
        "sm:inset-x-auto sm:bottom-5 sm:left-5 sm:block sm:max-w-sm sm:rounded-[20px] sm:p-5",
        onLanding ? "bottom-2" : "bottom-24",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg bg-mist sm:grid">
          <Cookie className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
        <p className="text-xs leading-snug text-charcoal/80 sm:text-sm sm:leading-relaxed">
          <span className="sm:hidden">Google &amp; Meta cookies help measure our ads. We never sell data.</span>
          <span className="hidden sm:inline">
            We&apos;d like to use cookies from Google and Meta to see how people find Baytouna and to measure and
            personalise our ads. We never sell your data.
          </span>
        </p>
      </div>
      <div className="flex shrink-0 gap-1.5 sm:mt-4 sm:grid sm:grid-cols-2 sm:gap-2">
        <button
          type="button"
          data-consent-decline
          onClick={() => choose("denied")}
          className="h-9 rounded-md border border-charcoal/20 px-3 text-[13px] font-medium transition-colors hover:border-charcoal/50 sm:h-11 sm:text-sm"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="h-9 rounded-md bg-charcoal px-3 text-[13px] font-medium text-white transition-colors hover:bg-charcoal-700 sm:h-11 sm:text-sm"
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
