import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { LeadFlowProvider } from "@/components/lead-flow/LeadFlowProvider";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { Nav } from "@/components/Nav";
import { StickyCta } from "@/components/StickyCta";

/** Same chrome as the homepage, so blog CTAs open the same lead form. */
export default function BlogLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <LeadFlowProvider>
      <Nav />
      <MotionRoot>
        <main>{children}</main>
        <Footer />
      </MotionRoot>
      <StickyCta />
    </LeadFlowProvider>
  );
}
