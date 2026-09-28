"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Phase = { name: string; from: number; to: number };

/** The A → Z line: it draws itself as you scroll, lighting each stage marker it passes. */
export function JourneyTrack({ stages, phases }: { stages: number; phases: Phase[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const dots = q(".stage-dot");
      const light = (progress: number) =>
        dots.forEach((dot, i) => dot.classList.toggle("is-on", progress >= i / (stages - 1) - 0.001));

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".track-fill"), { scaleX: 1 });
        light(1);
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q(".track-fill"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 80%",
              end: "top 25%",
              scrub: 0.6,
              onUpdate: (self) => light(self.progress),
            },
          },
        );
        gsap.from(q(".track-letter"), {
          yPercent: 110,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.15,
          scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="flex items-center gap-4 sm:gap-8">
      <span className="overflow-hidden">
        <span className="track-letter headline block text-[clamp(4rem,9vw,8rem)] leading-[0.85]">A</span>
      </span>
      <div className="relative h-px flex-1 bg-charcoal/15">
        <div className="track-fill absolute inset-0 origin-left bg-charcoal" />
        <div className="absolute inset-x-0 top-5">
          {phases.map((phase) => {
            const left = (phase.from / (stages - 1)) * 100;
            const right = (phase.to / (stages - 1)) * 100;
            const single = phase.from === phase.to;
            return (
              <div
                key={phase.name}
                className="absolute top-0"
                style={single ? { right: 0 } : { left: `${left}%`, width: `${right - left}%` }}
              >
                {!single && <span className="block h-2 border-x border-b border-charcoal/20" />}
                <span
                  className={`mt-2 block text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-slate uppercase ${
                    single ? "text-right" : "text-center"
                  }`}
                >
                  {phase.name}
                </span>
              </div>
            );
          })}
        </div>
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
          {Array.from({ length: stages }, (_, i) => (
            <span
              key={i}
              className="stage-dot h-2.5 w-2.5 bg-sage-300 transition-[background-color,transform] duration-500 [&.is-on]:scale-150 [&.is-on]:bg-olive-600"
            />
          ))}
        </div>
      </div>
      <span className="overflow-hidden">
        <span className="track-letter headline block text-[clamp(4rem,9vw,8rem)] leading-[0.85]">Z</span>
      </span>
    </div>
  );
}
