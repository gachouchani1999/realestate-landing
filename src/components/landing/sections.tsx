import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { CookieSettingsButton } from "@/components/analytics/CookieBanner";
import { LandingForm } from "@/components/landing/LandingForm";
import { Logo, LogoMark } from "@/components/Logo";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, SectionHeading, buttonClass } from "@/components/ui";
import { site, whatsappLink } from "@/config/site";
import { LANDING_OFFERS, type OfferKey } from "@/lib/leads";
import { cornerScatter } from "@/lib/pixels";

// Building blocks for the paid-traffic landing pages. They follow conversion-centred design: one goal per page
// (the free offer), no site menu, proof next to the form, and the form repeated at the end.

const heroPixels = cornerScatter({
  width: 520,
  height: 360,
  cell: 26,
  corner: "tr",
  colors: ["#e6eae8", "#dde3e0", "#b5c0bb", "#c3c5a1"],
  seed: 31,
});

const darkPixels = cornerScatter({
  width: 420,
  height: 280,
  cell: 28,
  corner: "br",
  colors: ["#3d5243", "#304236", "#7d8052", "#a4a678"],
  seed: 44,
});

export type LandingFormCopy = {
  buildingLabel: string;
  buildingPlaceholder: string;
  emailLabel: string;
  submitLabel: string;
};

/** Logo only: no menu, so the page has a single thing to do. */
export function LandingHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="wrap flex h-16 items-center justify-between sm:h-20">
        <Link href="/" aria-label={`${site.name} — home`}>
          <Logo />
        </Link>
        <p className="flex items-center gap-2 text-[13px] font-medium text-charcoal/70">
          <span aria-hidden className="h-2 w-2 bg-olive-600" />
          Free<span className="hidden min-[360px]:inline"> · Ready in {site.reportTurnaround}</span>
        </p>
      </div>
    </header>
  );
}

/** The first screen: the promise, the first step of the form, and three reasons to trust it. */
export function LandingHero({
  eyebrow,
  title,
  sub,
  offer,
  form,
  assurances,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  sub: ReactNode;
  offer: OfferKey;
  form: LandingFormCopy;
  assurances: string[];
  aside?: ReactNode;
}) {
  return (
    <section id="start" className="relative isolate overflow-hidden bg-sage pt-20 pb-14 sm:pt-28 sm:pb-20 lg:pb-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_60%_at_55%_25%,#e4e9e6,transparent_70%)]"
      />
      <PixelArt
        pixels={heroPixels}
        width={520}
        height={360}
        className="hero-corner pointer-events-none absolute top-0 right-0 -z-10 h-[150px] w-[216px] opacity-60 sm:h-[360px] sm:w-[520px] sm:opacity-100"
      />
      <div className="wrap grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <p className="hero-fade inline-flex rounded-md bg-white/70 px-2.5 py-1 text-xs font-medium tracking-[0.08em] uppercase">
            {eyebrow}
          </p>
          <h1 className="headline mt-4 text-[clamp(2rem,5vw,4.4rem)] text-balance text-charcoal sm:mt-6">
            <span className="hero-line">
              <span>{title}</span>
            </span>
          </h1>
          <p
            className="hero-fade mt-4 max-w-xl text-[17px] leading-relaxed text-pretty text-charcoal/75 sm:mt-6 sm:text-lg"
            style={{ "--d": "0.15s" } as CSSProperties}
          >
            {sub}
          </p>
          <ul className="mt-6 hidden flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal/75 lg:flex">
            {assurances.map((a) => (
              <Assurance key={a}>{a}</Assurance>
            ))}
          </ul>
          {aside && <div className="mt-10 hidden lg:block">{aside}</div>}
        </div>

        <div className="hero-fade min-w-0" style={{ "--d": "0.2s" } as CSSProperties}>
          <LandingForm offer={offer} {...form} />
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-charcoal/75 lg:hidden">
            {assurances.map((a) => (
              <Assurance key={a}>{a}</Assurance>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Assurance({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span className="grid h-4 w-4 shrink-0 place-items-center bg-olive text-charcoal">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      {children}
    </li>
  );
}

/** A card per thing the visitor gets, beside a sample of the deliverable. */
export function WhatYouGet({
  eyebrow,
  title,
  sub,
  items,
  preview,
}: {
  eyebrow: string;
  title: ReactNode;
  sub: string;
  items: { title: string; body: string }[];
  preview: ReactNode;
}) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-20">
        <div>
          <SectionHeading eyebrow={eyebrow} title={title} sub={sub} />
          <ol className="mt-10 space-y-6">
            {items.map((item, i) => (
              <li key={item.title} className="flex gap-5">
                <span className="font-display text-2xl leading-none text-olive-800 tabular-nums">0{i + 1}</span>
                <div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-slate">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:sticky lg:top-10">{preview}</div>
      </div>
    </section>
  );
}

/** A button back to the form at the top: the same single action, not a new one. */
export function BackToForm({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <a href="#start" className={buttonClass(tone, "lg")}>
      {children} <CtaArrow />
    </a>
  );
}

/** Who is behind the offer, stated plainly: what we are, what we are not, and how partners fit in. */
export function AboutUs() {
  return (
    <section className="relative isolate overflow-hidden bg-forest py-20 text-white sm:py-28">
      <PixelArt
        pixels={darkPixels}
        width={420}
        height={280}
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[180px] w-[270px] sm:h-[280px] sm:w-[420px]"
      />
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <SectionHeading
          tone="dark"
          eyebrow="Who's behind this"
          title={
            <>
              One team. <span className="accent">No sales pitch.</span>
            </>
          }
        />
        <div className="space-y-5 text-lg leading-relaxed text-white/75">
          <p>
            Baytouna is a Dubai-based team building one dashboard for people who own UAE property but don&apos;t live
            here. We prepare every report by hand from official data — a person looks at your building, not a bot.
          </p>
          <p>
            <strong className="font-medium text-white">We&apos;re not estate agents and we don&apos;t sell property.</strong>{" "}
            When you need something done — snagging, leasing, furnishing, maintenance — it&apos;s carried out by
            licensed partners we vet. We coordinate them and track every step for you, in one place.
          </p>
          <p>
            Questions first? Email{" "}
            <a href={`mailto:${site.email}`} className="text-white underline decoration-olive-300 underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="wrap">
        <SectionHeading eyebrow="How it works" title="Three steps. Two minutes of your time." />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-[24px] bg-white p-7">
              <span className="font-display text-4xl leading-none text-olive-800">{i + 1}</span>
              <h3 className="mt-6 text-lg font-medium">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-slate">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function LandingFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <SectionHeading eyebrow="Questions" title="Before you ask" />
        <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="mt-1 h-5 w-5 shrink-0 text-slate transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-slate">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The form again at the end, for visitors who read everything first. */
export function FinalForm({ offer, title, sub, form }: { offer: OfferKey; title: ReactNode; sub: string; form: LandingFormCopy }) {
  return (
    <section className="relative isolate overflow-hidden bg-sage py-20 sm:py-28">
      <PixelArt
        pixels={heroPixels}
        width={520}
        height={360}
        className="pointer-events-none absolute top-0 right-0 -z-10 h-[180px] w-[260px] opacity-70 sm:h-[360px] sm:w-[520px]"
      />
      <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-16">
        <div>
          <h2 className="headline text-[clamp(2.3rem,4.6vw,4.4rem)] text-charcoal">{title}</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-charcoal/75">{sub}</p>
        </div>
        <LandingForm offer={offer} {...form} />
      </div>
    </section>
  );
}

/** Small footer: a way home, the guides, the other free offer, and cookie settings. */
export function LandingFooter({ current }: { current: OfferKey }) {
  const others = (Object.keys(LANDING_OFFERS) as OfferKey[]).filter((key) => key !== current);
  return (
    <footer className="bg-forest-950 py-12 text-sm text-white/55">
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 text-white" aria-label={`${site.name} — home`}>
            <LogoMark className="h-6 w-6 text-white" />
            <Logo className="text-white" />
          </Link>
          <p className="mt-3 max-w-sm leading-relaxed">
            One team and one dashboard for UAE property owners abroad. Licensed partners do the work; we coordinate
            and track it.
          </p>
        </div>
        <nav aria-label="More from Baytouna">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/" className="hover:text-white">
                How Baytouna works
              </Link>
            </li>
            {others.map((key) => (
              <li key={key}>
                <Link href={LANDING_OFFERS[key].path} className="hover:text-white">
                  Free {LANDING_OFFERS[key].label.toLowerCase()}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/blog/manage-uae-property-remotely" className="hover:text-white">
                Owner guide
              </Link>
            </li>
            <li>
              <a
                href={whatsappLink(`Hi Baytouna, I have a question about the free ${LANDING_OFFERS[current].short}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li>
              <CookieSettingsButton className="hover:text-white" />
            </li>
          </ul>
        </nav>
      </div>
      <p className="wrap mt-8 text-xs text-white/35">
        © {new Date().getFullYear()} {site.name}. Reports are informational and based on public data; they are not
        official valuations or legal advice.
      </p>
    </footer>
  );
}
