import { ChartLine, Compass, Handshake, KeyRound, Search, ShieldCheck, Sofa, Wrench, type LucideIcon } from "lucide-react";
import { JourneyTrack } from "@/components/JourneyTrack";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, SectionHeading, buttonClass } from "@/components/ui";
import { journey, ownerEntryStage, phases } from "@/content/landing";
import { cornerScatter } from "@/lib/pixels";

const icons: Record<(typeof journey)[number]["icon"], LucideIcon> = {
  compass: Compass,
  search: Search,
  shield: ShieldCheck,
  handshake: Handshake,
  sofa: Sofa,
  key: KeyRound,
  wrench: Wrench,
  chart: ChartLine,
};

const bandPixels = cornerScatter({
  width: 360,
  height: 140,
  cell: 14,
  corner: "br",
  colors: ["#3a403c", "#4b524d", "#7d8052", "#a4a678"],
  seed: 31,
});

export function Journey() {
  return (
    <section id="journey" className="scroll-mt-16 bg-mist py-24 sm:py-36">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <SectionHeading
            eyebrow="End-to-end"
            title={
              <>
                One partner. Every step. <span className="accent">From A to Z</span>
              </>
            }
          />
          <p data-reveal className="max-w-md text-lg leading-relaxed text-slate lg:pb-3">
            Eight stages across three phases: acquire, operate, exit. Most owners join at stage 05, buyers start at
            01 — either way, it&apos;s one team from start to finish.
          </p>
        </div>

        <div className="mt-20">
          <JourneyTrack stages={journey.length} phases={phases} />
        </div>

        <ol className="mt-24 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((stage, i) => {
            const Icon = icons[stage.icon];
            return (
              <li
                key={stage.title}
                data-reveal
                className="group relative flex flex-col rounded-[28px] bg-white p-7 transition-colors duration-500 hover:bg-charcoal hover:text-white"
              >
                <div className="flex items-start justify-between">
                  <span className="headline text-5xl text-olive-800 transition-colors duration-500 group-hover:text-olive-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-mist text-charcoal transition-colors duration-500 group-hover:bg-olive">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                </div>
                {i === ownerEntryStage ? (
                  <span className="mt-8 self-start rounded-md bg-olive px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] text-charcoal uppercase">
                    Most owners start here
                  </span>
                ) : (
                  <span className="mt-8 h-[26px]" aria-hidden />
                )}
                <h3 className="mt-6 text-xl font-medium tracking-tight">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate transition-colors duration-500 group-hover:text-white/70">
                  {stage.body}
                </p>
              </li>
            );
          })}
        </ol>

        <div
          data-reveal
          className="relative mt-4 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[28px] bg-charcoal p-7 text-white sm:flex-row sm:items-center sm:p-9"
        >
          <PixelArt
            reveal
            pixels={bandPixels}
            width={360}
            height={140}
            className="pointer-events-none absolute right-0 bottom-0 h-[140px] w-[360px]"
          />
          <p className="relative max-w-xl text-xl leading-snug">
            Not sure where to start?{" "}
            <span className="text-white/60">Your free estimate maps out the next steps for your unit — at no cost.</span>
          </p>
          <a href="#get-report" className={buttonClass("light", "lg", "relative")}>
            Get my free estimate <CtaArrow />
          </a>
        </div>
      </div>
    </section>
  );
}
