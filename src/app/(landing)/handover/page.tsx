import type { Metadata } from "next";
import { HandoverPackPreview } from "@/components/landing/Previews";
import {
  AboutUs,
  BackToForm,
  FinalForm,
  HowItWorks,
  LandingFaq,
  LandingFooter,
  LandingHeader,
  LandingHero,
  WhatYouGet,
  type LandingFormCopy,
} from "@/components/landing/sections";
import { landingJsonLd } from "@/components/landing/seo";
import { SectionHeading } from "@/components/ui";
import { site } from "@/config/site";

const path = "/handover";
const title = "Dubai Handover Checklist + Free Handover Pack";
const description =
  "Getting the keys to an off-plan unit in Dubai? The 12 checks to make before you sign, your handover timeline and a first-week plan — free for your building, even if you can't fly in.";

export const metadata: Metadata = {
  title: `${title} | ${site.name}`,
  description,
  keywords: [
    "Dubai handover checklist",
    "off-plan handover Dubai",
    "snagging checklist Dubai",
    "property handover from abroad",
    "Dubai key handover",
    "defects liability period Dubai",
  ],
  alternates: { canonical: path },
  openGraph: { type: "website", url: path, siteName: site.name, title, description, locale: "en_AE" },
  twitter: { card: "summary_large_image", title, description },
};

const form: LandingFormCopy = {
  buildingLabel: "Which project or building?",
  buildingPlaceholder: "e.g. Azizi Milan, Sobha Hartland",
  emailLabel: "Where should we send your pack?",
  submitLabel: "Send my Handover Pack",
};

const inside = [
  {
    title: "Your 12-point checklist",
    body: "What to test, photograph and get in writing before you sign — printable, or for whoever inspects for you.",
  },
  {
    title: "Your handover timeline",
    body: "From the completion notice to keys: the payments, registrations and appointments, and roughly when each falls.",
  },
  {
    title: "Your defects-window dates",
    body: "When your defects period runs out, and how to report issues so the developer has to fix them.",
  },
  {
    title: "Your first-week plan",
    body: "DEWA, cooling and service-charge accounts, access cards — and what to set up if you'll rent it out.",
  },
  {
    title: "If you can't be there",
    body: "How a power of attorney works, who can collect keys for you, and how a snagging inspection runs remotely.",
  },
];

const checks = [
  ["Read the completion notice", "Note every deadline and what the developer needs from you, and by when."],
  ["Check the final statement", "Balance due, registration fees and any service charges billed in advance."],
  ["Match the unit to your SPA", "Area, layout, view, parking bay and storage — exactly as you bought it."],
  ["Book an independent snagging inspection", "Before you sign the handover form, not after you've moved in."],
  ["Test cooling, water and drainage", "AC in every room, water pressure, hot water, and every drain and outlet."],
  ["Test the electrics", "Every socket, switch and light, and a clearly labelled distribution board."],
  ["Check doors, windows and the balcony", "Gaps, seals, scratches, locks, and any sign of water getting in."],
  ["Check finishes and appliances", "Tiles, paint, joinery and anything the developer supplied."],
  ["Log every defect in writing", "With photos, and have the developer acknowledge the list before you accept."],
  ["Collect everything", "Keys, access cards, parking tags, manuals and warranties."],
  ["Put the accounts in your name", "DEWA, cooling (chiller) and service charges, so nothing gets cut off."],
  ["Diary the defects period", "Note when it ends and how to report issues — then check the unit again before it does."],
];

const steps = [
  { title: "Tell us your building", body: "Two quick screens: your project and your email. About a minute." },
  {
    title: "We prepare your pack",
    body: `A person, not a bot, builds it for your project and handover stage. In your inbox within ${site.reportTurnaround}.`,
  },
  {
    title: "Use it — or hand it to us",
    body: "Do it yourself with the pack, or book a short call and our licensed partners handle snagging and keys.",
  },
];

const faqs = [
  {
    q: "Is the Handover Pack really free?",
    a: "Yes. There's no fee and no obligation. If it's useful and you'd like help with handover later, you can ask — but you don't have to.",
  },
  {
    q: "Are you estate agents?",
    a: "No. We don't sell property or take commission on sales. Baytouna is an owner dashboard: licensed partners do the work, such as snagging inspections, and we coordinate and track it for you.",
  },
  {
    q: "I can't be in Dubai for handover. What can I do?",
    a: "Most owners abroad give a trusted person or company a power of attorney for specific tasks, like collecting keys and signing handover forms. An independent inspector can snag the unit and send you a photo report. Your pack explains each step.",
  },
  {
    q: "When should I book a snagging inspection?",
    a: "Once you have your completion notice and before you sign the handover form or accept the keys. Defects you record in writing at that point are much easier to get fixed.",
  },
  {
    q: "How long is the defects period?",
    a: "It depends on your sale and purchase agreement — many developers give around 12 months from handover. Your pack notes the date for your unit, so you can re-check before it runs out.",
  },
  {
    q: "What happens after I get the pack?",
    a: "We'll offer a short call to walk you through it. Some owners ask us to arrange snagging and key collection; others just use the checklist. Either is fine.",
  },
];

export default function HandoverPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: landingJsonLd({
            path,
            title,
            description,
            service: {
              name: "Handover Pack",
              description:
                "A free, personalised handover pack for off-plan buyers in the UAE: a 12-point checklist, the handover timeline, defects-period dates and a first-week plan.",
            },
            faqs,
          }),
        }}
      />
      <LandingHeader />
      <main>
        <LandingHero
          offer="handover-pack"
          eyebrow="Free for off-plan buyers"
          title="Getting your Dubai keys soon?"
          sub={
            <>
              Get the free <strong className="font-medium text-charcoal">Handover Pack</strong> for your building: 12
              checks before you sign, your timeline and a first-week plan. Even if you can&apos;t fly in.
            </>
          }
          form={form}
          assurances={[`Ready within ${site.reportTurnaround}`, "Free, no obligation", "No sales call unless you ask"]}
        />

        <WhatYouGet
          eyebrow="What's in your pack"
          title={
            <>
              Everything for handover, <span className="accent">for your unit.</span>
            </>
          }
          sub="Handover is where off-plan buyers win or lose the most. A defect you don't record before signing is far harder to get fixed afterwards."
          items={inside}
          preview={<HandoverPackPreview />}
        />

        <section className="bg-mist py-20 sm:py-28" aria-labelledby="checks">
          <div className="wrap">
            <SectionHeading
              eyebrow="The checklist"
              title={
                <span id="checks">
                  The 12 checks before you sign <span className="accent">for your keys</span>
                </span>
              }
              sub="Here they are, free. Your pack turns them into a checklist for your unit, with your dates — and what to do if you're not there."
            />
            <ol className="mt-12 grid gap-3 md:grid-cols-2">
              {checks.map(([heading, body], i) => (
                <li key={heading} className="flex gap-5 rounded-[20px] bg-white p-6">
                  <span className="font-display text-2xl leading-none text-olive-800 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-medium">{heading}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-slate">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <BackToForm>Get the pack for my building</BackToForm>
            </div>
          </div>
        </section>

        <AboutUs />
        <HowItWorks steps={steps} />
        <LandingFaq faqs={faqs} />
        <FinalForm
          offer="handover-pack"
          title="Get your Handover Pack"
          sub={`Tell us your building and where to send it. It's free, and ready within ${site.reportTurnaround}.`}
          form={form}
        />
      </main>
      <LandingFooter current="handover-pack" />
    </>
  );
}
