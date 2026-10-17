import type { CSSProperties } from "react";
import { CalendarClock, Check } from "lucide-react";
import { HeroMotion } from "@/components/hero/HeroMotion";
import { TowerScene } from "@/components/hero/TowerScene";
import { LeadForm } from "@/components/LeadForm";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, LightBars, buttonClass } from "@/components/ui";
import { bookingLink } from "@/config/site";
import { cornerScatter } from "@/lib/pixels";

const cornerPixels = cornerScatter({
  width: 520,
  height: 360,
  cell: 26,
  corner: "tr",
  colors: ["#e6eae8", "#dde3e0", "#b5c0bb", "#c3c5a1"],
  seed: 5,
});

const bars = [
  { top: "0%", left: "6%", width: "52%", height: "15%" },
  { top: "20%", left: "0%", width: "74%", height: "14%" },
  { top: "39%", left: "34%", width: "54%", height: "13%" },
  { top: "58%", left: "0%", width: "42%", height: "14%" },
  { top: "78%", left: "14%", width: "80%", height: "16%" },
];

const assurances = ["One team for everything", "Licensed specialists", "Free property report"];

/** Entrance delay for the CSS animations in globals.css. */
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/**
 * The entrance is pure CSS so the hero is visible and animating on first paint, before any JavaScript
 * loads; HeroMotion adds the drift and scroll parallax afterwards.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-sage">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_60%_at_55%_25%,#e4e9e6,transparent_70%)]"
      />
      <PixelArt
        pixels={cornerPixels}
        width={520}
        height={360}
        className="hero-corner pointer-events-none absolute top-0 right-0 -z-10 h-[170px] w-[246px] opacity-70 sm:h-[360px] sm:w-[520px] sm:opacity-100"
      />

      <div className="wrap relative grid gap-10 pt-28 pb-16 sm:pt-32 lg:min-h-[max(100svh,820px)] lg:grid-cols-[minmax(0,1fr)_440px] lg:pt-36 lg:pb-12 xl:grid-cols-[minmax(0,1fr)_460px]">
        {/* Copy */}
        <div className="hero-copy relative z-10 flex flex-col">
          <h1 className="headline text-[clamp(2.7rem,4.9vw,4.6rem)] text-charcoal lg:max-w-[11ch]">
            <span className="hero-line">
              <span style={delay(0.15)}>Your UAE property,</span>
            </span>{" "}
            <span className="hero-line text-olive-800">
              <span style={delay(0.27)}>tracked from A to Z</span>
            </span>
          </h1>

          <p style={delay(0.35)} className="hero-fade mt-7 max-w-md text-lg leading-relaxed text-pretty text-charcoal/75">
            Your one-stop shop for UAE property. Our licensed partners handle everything — snagging, furnishing, tenants,
            maintenance and sales — and your dashboard tracks it all. One team to message.
          </p>

          <div style={delay(0.43)} className="hero-fade mt-9 flex flex-wrap items-center gap-3">
            <a href="#get-report" className={buttonClass("dark", "lg")}>
              Get your free property report <CtaArrow />
            </a>
            <a href={bookingLink()} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "lg")}>
              <CalendarClock className="h-4 w-4" /> Book a call
            </a>
          </div>

          <ul style={delay(0.51)} className="hero-fade mt-8 flex flex-col gap-2.5 text-sm text-charcoal/75 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {assurances.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="grid h-4 w-4 place-items-center bg-olive text-charcoal">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <a
            href="#product"
            style={delay(1.2)}
            className="hero-fade group mt-auto hidden w-[300px] items-center justify-between gap-6 rounded-lg bg-charcoal px-6 py-4 text-white transition-colors hover:bg-charcoal-700 lg:flex"
          >
            <span className="text-[17px] leading-snug">
              See the owner
              <br />
              dashboard
            </span>
            <CtaArrow className="h-6 w-6" />
          </a>
        </div>

        {/* Tower — in flow on mobile, centred behind the copy and card on desktop */}
        <div
          className="hero-tower pointer-events-none relative -mx-5 h-[440px] sm:h-[560px] lg:absolute lg:inset-y-0 lg:left-[50%] lg:mx-0 lg:h-auto lg:w-[640px] lg:-translate-x-1/2 xl:left-[53%]"
        >
          <LightBars bars={bars} className="hero-bars top-[67%] right-0 bottom-[3%] -left-[60vw] z-[1] lg:-left-[40vw]" />
          <TowerScene className="absolute inset-0 h-full w-full" />
        </div>

        {/* Lead form */}
        <div className="relative z-10 -mt-24 lg:mt-0 lg:self-center">
          <LeadForm />
        </div>
      </div>
      <HeroMotion />
    </section>
  );
}
