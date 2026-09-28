import { Comparison } from "@/components/Comparison";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/hero/Hero";
import { Journey } from "@/components/Journey";
import { LeadFlowProvider } from "@/components/lead-flow/LeadFlowProvider";
import { MarketFacts } from "@/components/MarketFacts";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { Nav } from "@/components/Nav";
import { Platform } from "@/components/Platform";
import { ReportSection } from "@/components/ReportSection";
import { RoiCalculator } from "@/components/RoiCalculator";
import { Services } from "@/components/Services";
import { StickyCta } from "@/components/StickyCta";
import { site } from "@/config/site";
import { faqs } from "@/content/landing";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      name: site.name,
      url: site.url,
      email: site.email,
      slogan: site.tagline,
      description: site.description,
      areaServed: { "@type": "Country", name: "United Arab Emirates" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LeadFlowProvider>
        <Nav />
        <MotionRoot>
          <main>
            <Hero />
            <MarketFacts />
            <Comparison />
            <Services />
            <Journey />
            <Platform />
            <RoiCalculator />
            <ReportSection />
            <Faq />
            <FinalCta />
          </main>
          <Footer />
        </MotionRoot>
        <StickyCta />
      </LeadFlowProvider>
    </>
  );
}
