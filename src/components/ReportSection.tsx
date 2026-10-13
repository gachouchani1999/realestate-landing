import { CalendarClock, Check, ListChecks } from "lucide-react";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, SectionHeading, buttonClass } from "@/components/ui";
import { bookingLink, site } from "@/config/site";
import { reportContents, reportSmallPrint } from "@/content/landing";
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
    <section id="report" className="scroll-mt-16 overflow-hidden bg-white py-24 sm:py-36">
      <div className="wrap grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <ReportMock />

        <div>
          <SectionHeading
            eyebrow="Your free property report"
            title={
              <>
                Know your property&apos;s numbers, <span className="accent">free</span>
              </>
            }
            sub={`Prepared for your unit and in your inbox within ${site.reportTurnaround} — then a short call to walk you through it.`}
          />
          <ul className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {reportContents.map((item) => (
              <li key={item.title} data-reveal className="flex gap-3.5">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-olive text-charcoal">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span>
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate">{item.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <div data-reveal className="mt-12 flex flex-wrap items-center gap-3">
            <a href="#get-report" className={buttonClass("dark", "lg")}>
              Get my free report <CtaArrow />
            </a>
            <a href={bookingLink()} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "lg")}>
              <CalendarClock className="h-4 w-4" /> Book a call
            </a>
          </div>
          <p data-reveal className="mt-6 max-w-lg text-xs leading-relaxed text-slate">
            {reportSmallPrint}
          </p>
        </div>
      </div>
    </section>
  );
}

const costs = [
  { label: "Service charges", value: "18,400" },
  { label: "DEWA & chiller (est.)", value: "7,800" },
  { label: "Insurance", value: "900" },
];

const dates = [
  { date: "12 Nov", label: "Service charge · Q4" },
  { date: "28 Feb", label: "Tenancy renewal" },
  { date: "15 Mar", label: "Insurance renewal" },
];

const outlook = [
  { label: "Long-term", from: 82, to: 92 },
  { label: "Holiday home", from: 105, to: 135 },
];
const OUTLOOK_MIN = 70;
const OUTLOOK_MAX = 145;

/** Illustrative sample report. Decorative, so hidden from assistive tech. */
function ReportMock() {
  return (
    <div data-reveal aria-hidden className="@container relative mx-auto w-full max-w-[560px]">
      <div className="relative aspect-[25/26]">
        {/* Cover */}
        <div className="absolute top-[2%] left-0 aspect-[3/4] w-[60%] -rotate-4 overflow-hidden rounded-[3cqw] bg-forest p-[5cqw] text-white shadow-[0_40px_80px_-30px_rgb(27_40_33/0.7)]">
          <PixelArt pixels={coverPixels} width={300} height={200} className="absolute top-0 right-0 h-[40cqw] w-[60cqw]" />
          <div className="relative flex h-full flex-col">
            <p className="font-display text-[3.6cqw] leading-none tracking-[0.02em]">BAYTOUNA</p>
            <p className="mt-[9cqw] text-[1.8cqw] tracking-[0.28em] text-olive-300 uppercase">Free report</p>
            <p className="headline mt-[2cqw] text-[5.4cqw]">
              Your
              <br />
              Property
              <br />
              <span className="text-olive-300">Report</span>
            </p>
            <PixelArt pixels={palm} width={192} height={192} className="mt-[3cqw] h-[16cqw] w-[16cqw]" />
            <div className="mt-auto border-t border-white/15 pt-[2.4cqw] text-[1.9cqw] text-white/55">
              Prepared exclusively for
              <span className="mt-[0.6cqw] block text-[2.8cqw] text-white">Your unit</span>
            </div>
          </div>
        </div>

        {/* Inside page */}
        <div className="absolute top-[22%] right-0 aspect-[3/4] w-[60%] rotate-3 rounded-[3cqw] bg-white p-[4.4cqw] text-charcoal shadow-[0_40px_80px_-30px_rgb(27_40_33/0.45)]">
          <div className="flex items-center justify-between">
            <p className="text-[2.7cqw] font-medium">At a glance</p>
            <span className="bg-mist px-[1.6cqw] py-[0.5cqw] text-[1.5cqw] font-semibold tracking-wider text-olive-800 uppercase">
              Sample
            </span>
          </div>
          <p className="mt-[0.8cqw] text-[1.7cqw] text-slate">Dubai Marina · 1 bed · AED per year</p>

          <p className="mt-[3cqw] text-[1.9cqw] font-medium">Running costs</p>
          <div className="mt-[1cqw] divide-y divide-line text-[1.75cqw]">
            {costs.map((c) => (
              <div key={c.label} className="flex justify-between py-[1cqw]">
                <span>{c.label}</span>
                <span className="tabular-nums">{c.value}</span>
              </div>
            ))}
            <div className="flex justify-between py-[1cqw] font-semibold">
              <span>Total</span>
              <span className="tabular-nums">27,100</span>
            </div>
          </div>

          <p className="mt-[2.6cqw] text-[1.9cqw] font-medium">Rental outlook · gross</p>
          <div className="mt-[1.4cqw] space-y-[1.4cqw]">
            {outlook.map((o) => {
              const left = ((o.from - OUTLOOK_MIN) / (OUTLOOK_MAX - OUTLOOK_MIN)) * 100;
              const width = ((o.to - o.from) / (OUTLOOK_MAX - OUTLOOK_MIN)) * 100;
              return (
                <div key={o.label} className="flex items-center gap-[1.4cqw]">
                  <span className="w-[11cqw] text-[1.5cqw] text-slate">{o.label}</span>
                  <span className="relative h-[2cqw] flex-1 rounded-[0.5cqw] bg-mist">
                    <span
                      className="absolute inset-y-0 rounded-[0.5cqw] bg-series-rent-light"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                  </span>
                  <span className="w-[10cqw] text-right text-[1.5cqw] text-slate tabular-nums">
                    {o.from}–{o.to}K
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-[2.6cqw] text-[1.9cqw] font-medium">Key dates</p>
          <div className="mt-[1cqw] space-y-[0.8cqw] text-[1.6cqw]">
            {dates.map((d) => (
              <div key={d.label} className="flex gap-[2cqw]">
                <span className="w-[8cqw] font-semibold tabular-nums">{d.date}</span>
                <span className="text-slate">{d.label}</span>
              </div>
            ))}
          </div>

          <p className="absolute right-[4.4cqw] bottom-[3cqw] text-[1.4cqw] text-slate">Page 02</p>
        </div>

        {/* Floating badges */}
        <div className="absolute top-[6%] right-[3%] flex items-center gap-[1.4cqw] rounded-[1.6cqw] bg-white py-[1.5cqw] pr-[2.8cqw] pl-[1.6cqw] text-[2.3cqw] font-medium text-charcoal shadow-[0_16px_40px_-12px_rgb(27_40_33/0.35)]">
          <ListChecks className="h-[3.6cqw] w-[3.6cqw] text-olive-800" />
          Your next-steps checklist
        </div>
        <div className="absolute bottom-[3%] left-[5%] flex animate-float items-center gap-[2cqw] rounded-[2cqw] bg-charcoal px-[3.2cqw] py-[2.6cqw] text-white shadow-[0_24px_60px_-20px_rgb(27_40_33/0.7)]">
          <CalendarClock className="h-[4.4cqw] w-[4.4cqw] text-olive-300" />
          <span>
            <span className="block text-[1.9cqw] text-white/60">Then</span>
            <span className="block text-[3.4cqw] leading-none font-medium tracking-tight">Book your call</span>
          </span>
        </div>
      </div>
    </div>
  );
}
