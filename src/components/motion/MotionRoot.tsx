"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Page-wide scroll motion, driven by data attributes so sections stay server components:
 * - `data-split`   headline lines slide up out of a mask
 * - `data-reveal`  fades and lifts into view, batched with a stagger
 * - `data-pixels`  an SVG whose `.px` rects pop in randomly when scrolled into view
 * - `data-bars`    a LightBars wrapper whose bars sweep in and drift with scroll
 *
 * Everything is visible without JavaScript, which can take seconds to start on a phone. When this runs it only
 * hides what is still below the screen, so a visitor who scrolled (or reloaded mid-page) never sees blank sections
 * and nothing they are looking at disappears.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const belowScreen = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const splits = q("[data-split]").filter(belowScreen);
        const reveals = q("[data-reveal]").filter(belowScreen);

        splits.forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.2,
                ease: "expo.out",
                stagger: 0.1,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
        });

        gsap.set(reveals, { autoAlpha: 0, y: 36 });
        ScrollTrigger.batch(reveals, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
        });

        q("[data-pixels]").filter(belowScreen).forEach((svg) => {
          gsap.from(svg.querySelectorAll(".px"), {
            scale: 0,
            transformOrigin: "50% 50%",
            duration: 0.45,
            ease: "back.out(2.5)",
            stagger: { amount: 1, from: "random" },
            scrollTrigger: { trigger: svg, start: "top 85%", once: true },
          });
        });

        q("[data-bars]").forEach((wrapper) => {
          if (belowScreen(wrapper)) {
            gsap.from(wrapper.querySelectorAll("[data-bar]"), {
              scaleX: 0,
              duration: 1.6,
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: { trigger: wrapper, start: "top 85%", once: true },
            });
          }
          gsap.to(wrapper, {
            xPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: wrapper, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
