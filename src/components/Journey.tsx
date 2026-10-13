import { FileText, LayoutDashboard, PhoneCall, Settings2, Sparkles, type LucideIcon } from "lucide-react";
import { JourneyTrack } from "@/components/JourneyTrack";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, SectionHeading, buttonClass } from "@/components/ui";
import { journey, phases } from "@/content/landing";
import { cornerScatter } from "@/lib/pixels";

const icons: Record<(typeof journey)[number]["icon"], LucideIcon> = {
  start: Sparkles,
  report: FileText,
  call: PhoneCall,
  setup: Settings2,
  track: LayoutDashboard,
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
    <section id="how" className="scroll-mt-16 bg-mist py-24 sm:py-36">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                Free report first. <span className="accent">Then everything, tracked</span>
              </>
            }
          />
          <p data-reveal className="max-w-md text-lg leading-relaxed text-slate lg:pb-3">
            Start with a free report on your property and a call to walk through it. Founding owners then get their
            dashboard set up for them.
          </p>
        </div>

        <div className="mt-20">
          <JourneyTrack stages={journey.length} phases={phases} />
        </div>

        <ol className="mt-24 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {journey.map((step, i) => {
            const Icon = icons[step.icon];
            return (
              <li
                key={step.title}
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
                <h3 className="mt-16 text-xl font-medium tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate transition-colors duration-500 group-hover:text-white/70">
                  {step.body}
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
            Founding owner spots are limited.{" "}
            <span className="text-white/60">Start with a free report — it takes about a minute.</span>
          </p>
          <a href="#get-report" className={buttonClass("light", "lg", "relative")}>
            Get my free report <CtaArrow />
          </a>
        </div>
      </div>
    </section>
  );
}
