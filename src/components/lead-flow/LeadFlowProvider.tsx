"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LeadFlow } from "@/components/lead-flow/LeadFlow";
import { track } from "@/lib/utils";

type LeadFlowContextValue = {
  /** Opens the full-screen form, optionally with the email already captured. */
  openFlow: (email?: string) => void;
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
  const [prefilledEmail, setPrefilledEmail] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const openFlow = useCallback((email?: string) => {
    if (email) setPrefilledEmail(email);
    setOpen(true);
    track("lead_flow_open", { from: email ? "hero_email" : "cta" });
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
      <LeadFlow
        open={open}
        prefilledEmail={prefilledEmail}
        onClose={() => setOpen(false)}
        onSubmitted={(email) => setSubmittedEmail(email)}
      />
    </LeadFlowContext.Provider>
  );
}
