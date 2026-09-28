"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { TowerScene } from "@/components/hero/TowerScene";
import { LeadForm } from "@/components/LeadForm";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, LightBars, buttonClass } from "@/components/ui";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
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

const assurances = ["Free rental income estimate", "Handover to first rent", "Managed 100% remotely"];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const q = gsap.utils.selector(root);
          gsap.set(q("[data-hero]"), { autoAlpha: 1 });
          if (ctx.conditions?.reduce) return;

          const foliage = q(".tower-foliage .px");
          const palm = q(".palm .px");
          const corner = q(".hero-corner .px");
          const heroBars = q(".hero-bars [data-bar]");

          const split = SplitText.create(q(".hero-title"), { type: "lines", mask: "lines" });

          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.from(heroBars, { scaleX: 0, duration: 1.8, stagger: 0.09 }, 0)
            .from(split.lines, { yPercent: 115, duration: 1.3, stagger: 0.12 }, 0.15)
            .from(q("[data-hero='fade']"), { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.55)
            .from(q(".tower-ground"), { scaleX: 0, transformOrigin: "50% 50%", duration: 1.4 }, 0.1)
            .from(q(".tower-body"), { scaleY: 0, transformOrigin: "50% 100%", duration: 1.9, ease: "expo.inOut" }, 0.2)
            .from(
              foliage,
              { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2.5)", stagger: { amount: 1.5 } },
              0.7,
            )
            .from(q("[data-hero='card']"), { x: 60, autoAlpha: 0, duration: 1.4 }, 0.5)
            .from(
              palm,
              { scale: 0, transformOrigin: "50% 50%", duration: 0.4, ease: "back.out(3)", stagger: { amount: 1.1, from: "end" } },
              1.1,
            )
            .from(corner, { autoAlpha: 0, duration: 0.6, stagger: { amount: 1.2, from: "random" } }, 0.4)
            .from(q("[data-hero='pill']"), { y: 30, autoAlpha: 0, duration: 1.1 }, 1.2);

          // Light bars keep drifting once they have landed.
          heroBars.forEach((bar) => {
            gsap.to(bar, {
              x: gsap.utils.random(-40, 50),
              duration: gsap.utils.random(5, 8),
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: 2,
            });
          });

          // Gentle parallax as the hero scrolls away.
          const scroll = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
          gsap.to(q(".hero-tower"), { yPercent: 12, ease: "none", scrollTrigger: scroll });
          gsap.to(q(".hero-bars"), { xPercent: -12, ease: "none", scrollTrigger: scroll });
          gsap.to(q(".hero-copy"), { yPercent: -14, ease: "none", scrollTrigger: scroll });

          return () => split.revert();
        },
      );

      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative isolate overflow-hidden bg-sage">
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
          <h1 data-hero className="hero-title headline text-[clamp(2.7rem,4.9vw,4.6rem)] text-charcoal lg:max-w-[11ch]">
            Your UAE property partner, <span className="block text-olive-800">from A to Z</span>
          </h1>

          <p data-hero="fade" className="mt-7 max-w-md text-lg leading-relaxed text-pretty text-charcoal/75">
            Getting your keys or already own in the UAE? Propora turns your property into hands-free income — from
            handover and furnishing to tenants, guests and everything after.
          </p>

          <div data-hero="fade" className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#get-report" className={buttonClass("dark", "lg")}>
              Get your free estimate <CtaArrow />
            </a>
            <a href="#calculator" className={buttonClass("outline", "lg", "lg:hidden")}>
              Run the numbers
            </a>
          </div>

          <ul data-hero="fade" className="mt-8 flex flex-col gap-2.5 text-sm text-charcoal/75 sm:flex-row sm:flex-wrap sm:gap-x-6">
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
            href="#calculator"
            data-hero="pill"
            className="group mt-auto hidden w-[300px] items-center justify-between gap-6 rounded-lg bg-charcoal px-6 py-4 text-white transition-colors hover:bg-charcoal-700 lg:flex"
          >
            <span className="text-[17px] leading-snug">
              See what your property
              <br />
              could earn
            </span>
            <CtaArrow className="h-6 w-6" />
          </a>
        </div>

        {/* Tower — in flow on mobile, centred behind the copy and card on desktop */}
        <div
          data-hero
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
    </section>
  );
}
