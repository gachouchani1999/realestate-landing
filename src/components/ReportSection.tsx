import { BadgeCheck, Check } from "lucide-react";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, SectionHeading, buttonClass } from "@/components/ui";
import { site } from "@/config/site";
import { estimateContents, steps } from "@/content/landing";
import { cornerScatter, palmPixels } from "@/lib/pixels";

const coverPixels = cornerScatter({
  width: 300,
  height: 200,
  cell: 12,
  corner: "tr",
  colors: ["#304236", "#3d5243", "#7d8052", "#a4a678"],
  seed: 52,
});
const palm = palmPixels(12);

export function ReportSection() {
  return (
    <section id="estimate" className="scroll-mt-16 overflow-hidden bg-mist py-24 sm:py-36">
      <div className="wrap">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <EstimateMock />

          <div>
            <SectionHeading
              eyebrow="Your free estimate"
              title={
                <>
                  Real numbers for your property, <span className="accent">free</span>
                </>
              }
              sub="Built by an advisor for your specific unit or goals — not a generic calculator."
            />
            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              {[estimateContents.owners, estimateContents.buyers].map((group) => (
                <div key={group.heading} data-reveal>
                  <p className="text-[13px] font-medium tracking-[0.14em] text-slate uppercase">{group.heading}</p>
                  <p className="mt-1.5 text-lg font-medium">{group.offer}</p>
                  <ul className="mt-5 space-y-4">
                    {group.items.map((item) => (
                      <li key={item.title} className="flex gap-3">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-olive text-charcoal">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span>
                          <span className="block font-medium">{item.title}</span>
                          <span className="mt-0.5 block text-sm leading-relaxed text-slate">{item.body}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div data-reveal className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#get-report" className={buttonClass("dark", "lg")}>
                Get my free estimate <CtaArrow />
              </a>
              <p className="text-sm text-slate">Delivered within {site.reportTurnaround} · 100% free</p>
            </div>
          </div>
        </div>

        <div className="mt-32 sm:mt-44">
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title={
              <>
                From first message to <span className="accent">first rent</span>
              </>
            }
          />
          <ol className="mt-16 grid gap-3 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} data-reveal className="flex flex-col rounded-[28px] bg-white p-8">
                <span className="headline text-[5rem] leading-[0.8] text-sage-300">0{i + 1}</span>
                <h3 className="mt-20 text-xl font-medium tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const strategies = [
  { name: "Long-term", gross: "96,000", occupancy: "96%", costs: "24,700", net: 71300 },
  { name: "Holiday home", gross: "142,000", occupancy: "76%", costs: "57,400", net: 84600 },
];
const maxNet = Math.max(...strategies.map((s) => s.net));

/** Illustrative sample estimate. Decorative, so hidden from assistive tech. */
function EstimateMock() {
  return (
    <div data-reveal aria-hidden className="@container relative mx-auto w-full max-w-[560px]">
      <div className="relative aspect-[25/26]">
        {/* Cover */}
        <div className="absolute top-[2%] left-0 aspect-[3/4] w-[60%] -rotate-4 overflow-hidden rounded-[3cqw] bg-forest p-[5cqw] text-white shadow-[0_40px_80px_-30px_rgb(27_40_33/0.7)]">
          <PixelArt pixels={coverPixels} width={300} height={200} className="absolute top-0 right-0 h-[40cqw] w-[60cqw]" />
          <div className="relative flex h-full flex-col">
            <p className="font-display text-[3.6cqw] leading-none tracking-[0.02em]">BAYTOUNA</p>
            <p className="mt-[9cqw] text-[1.8cqw] tracking-[0.28em] text-olive-300 uppercase">Owner edition</p>
            <p className="headline mt-[2cqw] text-[5.4cqw]">
              Rental
              <br />
              Income
              <br />
              <span className="text-olive-300">Estimate</span>
            </p>
            <PixelArt pixels={palm} width={192} height={192} className="mt-[3cqw] h-[16cqw] w-[16cqw]" />
            <div className="mt-auto border-t border-white/15 pt-[2.4cqw] text-[1.9cqw] text-white/55">
              Prepared exclusively for
              <span className="mt-[0.6cqw] block text-[2.8cqw] text-white">Your unit</span>
            </div>
          </div>
        </div>

        {/* Inside page */}
        <div className="absolute top-[22%] right-0 aspect-[3/4] w-[60%] rotate-3 rounded-[3cqw] bg-white p-[4.4cqw] shadow-[0_40px_80px_-30px_rgb(27_40_33/0.45)]">
          <div className="flex items-center justify-between">
            <p className="text-[2.7cqw] font-medium text-charcoal">Income by strategy</p>
            <span className="bg-mist px-[1.6cqw] py-[0.5cqw] text-[1.5cqw] font-semibold tracking-wider text-olive-800 uppercase">
              Sample
            </span>
          </div>
          <p className="mt-[0.8cqw] text-[1.7cqw] text-slate">Dubai Marina · 1 bed · per year, AED</p>

          <div className="mt-[3cqw] divide-y divide-line text-[1.75cqw]">
            <div className="grid grid-cols-[1fr_12cqw_12cqw] gap-[1.5cqw] pb-[1.2cqw] text-slate">
              <span />
              {strategies.map((s) => (
                <span key={s.name} className="text-right">
                  {s.name}
                </span>
              ))}
            </div>
            {[
              { label: "Gross income", values: strategies.map((s) => s.gross) },
              { label: "Occupancy", values: strategies.map((s) => s.occupancy) },
              { label: "Running costs", values: strategies.map((s) => s.costs) },
              { label: "Net income", values: strategies.map((s) => s.net.toLocaleString("en-US")), strong: true },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-[1fr_12cqw_12cqw] gap-[1.5cqw] py-[1.4cqw] text-charcoal">
                <span className={row.strong ? "font-semibold" : undefined}>{row.label}</span>
                {row.values.map((v, i) => (
                  <span key={i} className={`text-right tabular-nums ${row.strong ? "font-semibold" : ""}`}>
                    {v}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <p className="mt-[3.4cqw] text-[1.9cqw] font-medium text-charcoal">Net income per year</p>
          <div className="mt-[1.8cqw] space-y-[1.6cqw]">
            {strategies.map((s) => (
              <div key={s.name} className="flex items-center gap-[1.4cqw]">
                <span className="w-[12cqw] text-[1.5cqw] text-slate">{s.name}</span>
                <span
                  className="h-[2.2cqw] rounded-r-[0.5cqw] bg-series-rent-light"
                  style={{ width: `${(s.net / maxNet) * 26}cqw` }}
                />
                <span className="text-[1.5cqw] text-slate tabular-nums">{Math.round(s.net / 1000)}K</span>
              </div>
            ))}
          </div>

          <p className="absolute right-[4.4cqw] bottom-[3.4cqw] text-[1.4cqw] text-slate">Page 03</p>
        </div>

        {/* Floating badges */}
        <div className="absolute top-[6%] right-[3%] flex items-center gap-[1.4cqw] rounded-[1.6cqw] bg-white py-[1.5cqw] pr-[2.8cqw] pl-[1.6cqw] text-[2.3cqw] font-medium text-charcoal shadow-[0_16px_40px_-12px_rgb(27_40_33/0.35)]">
          <BadgeCheck className="h-[3.6cqw] w-[3.6cqw] text-olive-800" />
          Handover plan included
        </div>
        <div className="absolute bottom-[3%] left-[5%] animate-float rounded-[2cqw] bg-charcoal px-[3.2cqw] py-[2.6cqw] text-white shadow-[0_24px_60px_-20px_rgb(27_40_33/0.7)]">
          <p className="text-[1.9cqw] text-white/60">Holiday home vs long-term</p>
          <p className="mt-[0.4cqw] text-[4.6cqw] leading-none font-medium tracking-tight">
            +19<span className="text-olive-300">%</span> net
          </p>
        </div>
      </div>
    </div>
  );
}
