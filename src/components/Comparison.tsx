import { Check, X } from "lucide-react";
import { PixelArt } from "@/components/pixels/PixelArt";
import { SectionHeading } from "@/components/ui";
import { comparison } from "@/content/landing";
import { cornerScatter } from "@/lib/pixels";

const panelPixels = cornerScatter({
  width: 240,
  height: 160,
  cell: 16,
  corner: "tr",
  colors: ["#304236", "#3d5243", "#7d8052", "#a4a678"],
  seed: 9,
});

export function Comparison() {
  const rows = comparison.length + 1;

  return (
    <section className="bg-mist py-24 sm:py-36">
      <div className="wrap">
        <SectionHeading
          eyebrow="Why Baytouna"
          title={
            <>
              Owning from abroad shouldn&apos;t feel like <span className="accent">a second job</span>
            </>
          }
          sub="Most overseas owners juggle developers, agents, furnishers and property managers — each with their own agenda. Baytouna replaces them with one accountable team."
        />

        {/* Desktop: side-by-side */}
        <div
          data-reveal
          className="relative mt-20 hidden grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)_minmax(0,1fr)] lg:grid"
          style={{ gridTemplateRows: `repeat(${rows}, auto)` }}
        >
          <div
            aria-hidden
            className="relative overflow-hidden rounded-[36px] bg-forest"
            style={{ gridColumn: 3, gridRow: `1 / ${rows + 1}` }}
          >
            <PixelArt
              reveal
              pixels={panelPixels}
              width={240}
              height={160}
              className="absolute top-0 right-0 h-[160px] w-[240px]"
            />
          </div>

          <div className="px-8 pt-10 pb-6" style={{ gridColumn: 2, gridRow: 1 }}>
            <span className="text-[13px] font-medium tracking-[0.14em] text-slate uppercase">Going it alone</span>
          </div>
          <div className="relative flex items-center gap-2.5 px-10 pt-10 pb-6" style={{ gridColumn: 3, gridRow: 1 }}>
            <span className="h-2 w-2 bg-olive-300" />
            <span className="text-[13px] font-medium tracking-[0.14em] text-white uppercase">With Baytouna</span>
          </div>

          {comparison.map((row, i) => (
            <div key={row.topic} className="contents">
              <div
                className="headline border-t border-charcoal/10 py-8 pr-6 text-[2rem] text-charcoal"
                style={{ gridColumn: 1, gridRow: i + 2 }}
              >
                {row.topic}
              </div>
              <div
                className="flex items-start gap-3 border-t border-charcoal/10 px-8 py-8 text-[15px] leading-relaxed text-slate"
                style={{ gridColumn: 2, gridRow: i + 2 }}
              >
                <X className="mt-1 h-4 w-4 shrink-0 text-slate/60" strokeWidth={2} />
                {row.alone}
              </div>
              <div
                className="relative mx-10 flex items-start gap-3 border-t border-white/10 py-8 text-[15px] leading-relaxed text-white/90"
                style={{ gridColumn: 3, gridRow: i + 2 }}
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-olive text-charcoal">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {row.withUs}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile & tablet: stacked cards */}
        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:hidden">
          {comparison.map((row) => (
            <li key={row.topic} data-reveal className="overflow-hidden rounded-[28px] bg-white">
              <p className="headline px-6 pt-6 text-2xl">{row.topic}</p>
              <p className="flex items-start gap-3 px-6 pt-3 pb-6 text-sm leading-relaxed text-slate">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-slate/60" /> {row.alone}
              </p>
              <p className="flex items-start gap-3 bg-forest px-6 py-6 text-sm leading-relaxed text-white">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center bg-olive text-charcoal">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                {row.withUs}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
