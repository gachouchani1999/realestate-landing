"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { FlowPreset } from "@/components/lead-flow/LeadFlow";
import { track } from "@/lib/utils";

// The full-screen form is a big chunk of code nobody needs for the first paint, so it loads once the page is idle.
const LeadFlow = dynamic(() => import("@/components/lead-flow/LeadFlow").then((m) => m.LeadFlow), { ssr: false });

type LeadFlowContextValue = {
  /**
   * Opens the full-screen form, optionally with the email already captured. A landing page also passes what it
   * collected inline (building, emirate) and its offer, which switches the flow to its short version.
   */
  openFlow: (email?: string, preset?: FlowPreset) => void;
  /** Set once a lead has been submitted in this visit. */
  submittedEmail: string | null;
};

const LeadFlowContext = createContext<LeadFlowContextValue | null>(null);

export function useLeadFlow() {
  const ctx = useContext(LeadFlowContext);
  if (!ctx) throw new Error("useLeadFlow must be used inside <LeadFlowProvider>");
  return ctx;
}

export function LeadFlowProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState<string | null>(null);
  const [preset, setPreset] = useState<FlowPreset | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const openFlow = useCallback((email?: string, nextPreset?: FlowPreset) => {
    if (email) setPrefilledEmail(email);
    setPreset(nextPreset ?? null);
    setLoaded(true);
    setOpen(true);
    track("lead_flow_open", { from: nextPreset ? `landing_${nextPreset.offer}` : email ? "hero_email" : "cta" });
  }, []);

  useEffect(() => {
    const load = () => setLoaded(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    // Safari has no requestIdleCallback.
    const id = setTimeout(load, 1500);
    return () => clearTimeout(id);
  }, []);

  // Every "#get-report" call to action on the page opens the flow instead of scrolling.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href="#get-report"]');
      if (!link) return;
      event.preventDefault();
      openFlow();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openFlow]);

  const value = useMemo(() => ({ openFlow, submittedEmail }), [openFlow, submittedEmail]);

  return (
    <LeadFlowContext.Provider value={value}>
      {children}
      {loaded && (
        <LeadFlow
          open={open}
          prefilledEmail={prefilledEmail}
          preset={preset}
          onClose={() => setOpen(false)}
          onSubmitted={(email) => setSubmittedEmail(email)}
        />
      )}
    </LeadFlowContext.Provider>
  );
}
