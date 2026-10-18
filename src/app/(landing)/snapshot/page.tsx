import type { Metadata } from "next";
import { SnapshotPreview } from "@/components/landing/Previews";
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

const path = "/snapshot";
const title = "What Should Your Dubai Property Earn? Free Rent Snapshot";
const description =
  "Find out what your Dubai apartment should rent for and what it really costs to hold. A free rent and running-cost snapshot for your unit, from official Dubai Land Department data, within 48 hours.";

export const metadata: Metadata = {
  title: `${title} | ${site.name}`,
  description,
  keywords: [
    "Dubai rental yield",
    "how much rent Dubai apartment",
    "Dubai service charges",
    "RERA rental index",
    "net rental yield Dubai",
    "Dubai landlord abroad",
  ],
  alternates: { canonical: path },
  openGraph: { type: "website", url: path, siteName: site.name, title, description, locale: "en_AE" },
  twitter: { card: "summary_large_image", title, description },
};

const form: LandingFormCopy = {
  buildingLabel: "Which building or community?",
  buildingPlaceholder: "e.g. Marina Gate, JVC",
  emailLabel: "Where should we send your snapshot?",
  submitLabel: "Send my free snapshot",
};

const inside = [
  {
    title: "Rent for similar units",
    body: "The range that comparable units in your building actually rent for, from registered tenancy contracts and the official rental index.",
  },
  {
    title: "What it costs to hold",
    body: "Service charge from the official index, cooling and utilities, management and insurance — as a yearly total.",
  },
  {
    title: "Your real net yield",
    body: "After costs, not the brochure's gross figure. Most owners abroad have never seen this number for their unit.",
  },
  {
    title: "Long-term or holiday home?",
    body: "A rough side-by-side for your unit, so you know whether switching is worth a closer look.",
  },
  {
    title: "Dates that matter",
    body: "Tenancy renewal and notice deadlines, service-charge due dates and permit renewals.",
  },
];

const mistakes = [
  {
    title: "Judging yield on gross rent",
    body: "Service charges, cooling and management come out before anything reaches you. The gap between gross and net yield is often bigger than owners expect.",
  },
  {
    title: "Pricing from listings",
    body: "Asking rents on portals aren't what units let for. Registered contracts show what tenants in your building actually pay.",
  },
  {
    title: "Missing the renewal window",
    body: "In Dubai, rent increases are tied to the official rental index and need written notice well before renewal — 90 days. Miss it and you wait another year.",
  },
];

const steps = [
  { title: "Tell us your building", body: "Two quick screens: your building and your email. About a minute." },
  {
    title: "We pull the numbers",
    body: `A person, not a bot, prepares your snapshot from official data. In your inbox within ${site.reportTurnaround}.`,
  },
  {
    title: "Decide what to change",
    body: "Keep it as is, adjust the rent at renewal, or book a short call if you'd like our licensed partners to handle it.",
  },
];

const faqs = [
  {
    q: "Is this an official valuation?",
    a: "No. It's an informational snapshot built from public data, to help you decide what to do. Official rental valuations are a paid service from the Dubai Land Department, needed for things like disputes.",
  },
  {
    q: "Is it really free?",
    a: "Yes. There's no fee and no obligation. If the numbers show something you'd like fixed, you can ask us — but you don't have to.",
  },
  {
    q: "Are you estate agents?",
    a: "No. We don't sell property or take commission. Baytouna is an owner dashboard: licensed partners handle leasing, management and maintenance, and we coordinate and track it for you.",
  },
  {
    q: "Where does the data come from?",
    a: "For Dubai: registered tenancy contracts and the official rental and service-charge indexes published by the Dubai Land Department and RERA, plus typical cooling and management costs for your community.",
  },
  {
    q: "My property isn't in Dubai.",
    a: "Tell us the building anyway. Abu Dhabi and the Northern Emirates publish less data, but we'll cover what we can and tell you what's missing.",
  },
  {
    q: "Do I have to change my property manager?",
    a: "No. Many owners use the snapshot to have a better conversation with the manager they already have.",
  },
];

export default function SnapshotPage() {
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
              name: "Rent & running-cost snapshot",
              description:
                "A free snapshot for UAE property owners: the rent range for similar units, yearly running costs, net yield and key dates, from official data.",
            },
            faqs,
          }),
        }}
      />
      <LandingHeader />
      <main>
        <LandingHero
          offer="rent-snapshot"
          eyebrow="Free for owners living abroad"
          title="What should your Dubai property be earning?"
          sub={
            <>
              Get a free <strong className="font-medium text-charcoal">rent and running-cost snapshot</strong> for your
              unit, built from official Dubai Land Department data.
              {/* The header already says 48 hours; on phones this line would push the form down. */}
              <span className="hidden sm:inline"> In your inbox within {site.reportTurnaround}.</span>
            </>
          }
          form={form}
          assurances={["Official DLD data", `Ready within ${site.reportTurnaround}`, "No sales call unless you ask"]}
        />

        <WhatYouGet
          eyebrow="What's in your snapshot"
          title={
            <>
              Five numbers, <span className="accent">for your unit.</span>
            </>
          }
          sub="One page that tells you whether your property is doing what it should — and what it's costing you to own."
          items={inside}
          preview={<SnapshotPreview />}
        />

        <section className="bg-mist py-20 sm:py-28" aria-labelledby="mistakes">
          <div className="wrap">
            <SectionHeading
              eyebrow="Why it matters"
              title={
                <span id="mistakes">
                  Three things owners abroad <span className="accent">get wrong</span>
                </span>
              }
              sub="None of them are obvious from overseas. All three show up in your snapshot."
            />
            <ol className="mt-12 grid gap-3 md:grid-cols-3">
              {mistakes.map((m, i) => (
                <li key={m.title} className="rounded-[20px] bg-white p-7">
                  <span className="font-display text-2xl leading-none text-olive-800">0{i + 1}</span>
                  <h3 className="mt-5 text-lg font-medium">{m.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{m.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <BackToForm>Get the snapshot for my unit</BackToForm>
            </div>
          </div>
        </section>

        <AboutUs />
        <HowItWorks steps={steps} />
        <LandingFaq faqs={faqs} />
        <FinalForm
          offer="rent-snapshot"
          title="See what your property should earn"
          sub={`Tell us your building and where to send it. It's free, and ready within ${site.reportTurnaround}.`}
          form={form}
        />
      </main>
      <LandingFooter current="rent-snapshot" />
    </>
  );
}
