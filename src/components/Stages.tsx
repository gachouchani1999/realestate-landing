import { ArrowRight, Check, UserRound } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { PixelArt } from "@/components/pixels/PixelArt";
import { SectionHeading } from "@/components/ui";
import { principles, specialists, stages } from "@/content/landing";
import { cornerScatter } from "@/lib/pixels";
import { cn } from "@/lib/utils";

const featuredPixels = cornerScatter({
  width: 260,
  height: 180,
  cell: 16,
  corner: "tr",
  colors: ["#304236", "#3d5243", "#7d8052", "#a4a678"],
  seed: 71,
});

/** The one-stop shop: you → Baytouna → licensed specialists, then everything handled at every stage. */
export function Stages() {
  return (
    <section id="stages" className="scroll-mt-16 bg-white py-24 sm:py-36">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <SectionHeading
            eyebrow="One-stop shop"
            title={
              <>
                One team. <span className="accent">Everything handled.</span>
              </>
            }
          />
          <p data-reveal className="max-w-md text-lg leading-relaxed text-slate lg:pb-3">
            Behind your dashboard is a network of vetted, licensed specialists. They do the work, we coordinate it, and
            you only ever deal with us.
          </p>
        </div>

        {/* You → Baytouna → specialists */}
        <div data-reveal className="mt-16 grid items-center gap-3 lg:grid-cols-[0.8fr_auto_1fr_auto_1.5fr]">
          <div className="h-full rounded-[28px] bg-mist p-6">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-charcoal">
              <UserRound className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="mt-6 text-xl font-medium tracking-tight">You</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate">Message us, or just check your dashboard.</p>
          </div>
          <FlowArrow />
          <div className="h-full rounded-[28px] bg-forest p-6 text-white">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-olive text-charcoal">
              <LogoMark className="h-6 w-6" />
            </span>
            <p className="mt-6 text-xl font-medium tracking-tight">Baytouna</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/65">
              One team and one dashboard. We brief the right specialist and keep you updated.
            </p>
          </div>
          <FlowArrow />
          <div className="h-full rounded-[28px] bg-mist p-6">
            <p className="text-xl font-medium tracking-tight">Licensed specialists</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate">Vetted partners who do the work, start to finish.</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {specialists.map((s) => (
                <li key={s} className="rounded-md bg-white px-2.5 py-1.5 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {stages.map((stage, i) => {
            const dark = i === 1;
            return (
              <article
                key={stage.title}
                data-reveal
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-[32px] p-7 sm:p-9",
                  dark ? "bg-forest text-white" : "bg-mist text-charcoal",
                )}
              >
                {dark && (
                  <PixelArt
                    reveal
                    pixels={featuredPixels}
                    width={260}
                    height={180}
                    className="pointer-events-none absolute top-0 right-0 h-[180px] w-[260px]"
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <span className={cn("headline text-5xl", dark ? "text-olive-300" : "text-olive-800")}>0{i + 1}</span>
                  <span
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium tracking-[0.08em] uppercase",
                      dark ? "bg-olive text-charcoal" : "bg-white text-charcoal",
                    )}
                  >
                    {stage.tag}
                  </span>
                </div>
                <h3 className="relative mt-14 text-2xl font-medium tracking-tight">{stage.title}</h3>
                <p className={cn("relative mt-2 leading-relaxed", dark ? "text-white/65" : "text-slate")}>
                  {stage.lead}
                </p>
                <ul className="relative mt-8 space-y-3">
                  {stage.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[15px] leading-snug">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center bg-olive text-charcoal">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-auto pt-10">
                  <div className={cn("border-t pt-5", dark ? "border-white/10" : "border-charcoal/10")}>
                    <p
                      className={cn(
                        "text-[11px] font-medium tracking-[0.14em] uppercase",
                        dark ? "text-white/50" : "text-slate",
                      )}
                    >
                      Handled by
                    </p>
                    <p className="mt-1.5 text-sm font-medium">{stage.handledBy}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <ul className="mt-16 grid gap-10 border-t border-charcoal/10 pt-12 sm:grid-cols-3">
          {principles.map((p) => (
            <li key={p.title} data-reveal>
              <p className="flex items-center gap-2.5 text-lg font-medium">
                <span className="h-2 w-2 bg-olive-600" /> {p.title}
              </p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FlowArrow() {
  return (
    <span
      aria-hidden
      className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-charcoal/15 text-charcoal"
    >
      <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
    </span>
  );
}
