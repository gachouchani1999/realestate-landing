import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { PixelArt } from "@/components/pixels/PixelArt";
import { SectionHeading } from "@/components/ui";
import { principles, services } from "@/content/landing";
import { cornerScatter } from "@/lib/pixels";
import { cn } from "@/lib/utils";

const corePixels = cornerScatter({
  width: 260,
  height: 180,
  cell: 16,
  corner: "tr",
  colors: ["#304236", "#3d5243", "#7d8052", "#a4a678"],
  seed: 71,
});

export function Services() {
  const [handover, management, transactions] = services;

  return (
    <section id="services" className="scroll-mt-16 bg-white py-24 sm:py-36">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Three ways we work <span className="accent">for you</span>
              </>
            }
          />
          <p data-reveal className="max-w-md text-lg leading-relaxed text-slate lg:pb-3">
            Most clients start with their keys. Many stay for years — and buy their next unit with us.
          </p>
        </div>

        <div className="mt-16 grid gap-3 lg:grid-cols-3">
          {/* 01 — Handover to income */}
          <ServiceCard index={1} tag={handover.tag} title={handover.title} lead={handover.lead} paid={handover.paid}>
            <Points points={handover.points} />
          </ServiceCard>

          {/* 02 — Management (the core) */}
          <ServiceCard
            index={2}
            tag={management.tag}
            title={management.title}
            lead={management.lead}
            paid={management.paid}
            dark
          >
            <div className="space-y-2.5">
              {management.options.map((option) => (
                <div key={option.name} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                  <p className="font-medium">{option.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{option.body}</p>
                  <p className="mt-3 text-sm text-olive-300">{option.paid}</p>
                </div>
              ))}
            </div>
          </ServiceCard>

          {/* 03 — Buy & sell */}
          <ServiceCard
            index={3}
            tag={transactions.tag}
            title={transactions.title}
            lead={transactions.lead}
            paid={transactions.paid}
          >
            <Points points={transactions.points} />
          </ServiceCard>
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

function ServiceCard({
  index,
  tag,
  title,
  lead,
  paid,
  dark,
  children,
}: {
  index: number;
  tag: string;
  title: string;
  lead: string;
  paid: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <article
      data-reveal
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[32px] p-7 sm:p-9",
        dark ? "bg-forest text-white" : "bg-mist text-charcoal",
      )}
    >
      {dark && (
        <PixelArt
          reveal
          pixels={corePixels}
          width={260}
          height={180}
          className="pointer-events-none absolute top-0 right-0 h-[180px] w-[260px]"
        />
      )}
      <div className="relative flex items-center justify-between">
        <span className={cn("headline text-5xl", dark ? "text-olive-300" : "text-olive-800")}>0{index}</span>
        <span
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium tracking-[0.08em] uppercase",
            dark ? "bg-olive text-charcoal" : "bg-white text-charcoal",
          )}
        >
          {tag}
        </span>
      </div>
      <h3 className="relative mt-14 text-2xl font-medium tracking-tight">{title}</h3>
      <p className={cn("relative mt-2 leading-relaxed", dark ? "text-white/65" : "text-slate")}>{lead}</p>
      <div className="relative mt-8">{children}</div>
      <div className="relative mt-auto pt-10">
        <div className={cn("border-t pt-6", dark ? "border-white/10" : "border-charcoal/10")}>
          <p className={cn("text-[11px] font-medium tracking-[0.14em] uppercase", dark ? "text-white/50" : "text-slate")}>
            How we&apos;re paid
          </p>
          <p className="mt-1.5 font-medium">{paid}</p>
        </div>
      </div>
    </article>
  );
}

function Points({ points }: { points: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-3 text-[15px] leading-snug">
          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center bg-olive text-charcoal">
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
          {point}
        </li>
      ))}
    </ul>
  );
}
