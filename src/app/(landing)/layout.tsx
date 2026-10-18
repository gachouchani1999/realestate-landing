import type { ReactNode } from "react";
import { LeadFlowProvider } from "@/components/lead-flow/LeadFlowProvider";

/** Paid-traffic landing pages: no site menu or scroll animations, just the offer and the shared lead form. */
export default function LandingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <LeadFlowProvider>{children}</LeadFlowProvider>;
}
