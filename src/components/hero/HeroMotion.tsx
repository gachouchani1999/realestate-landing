"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Extras for the hero once JavaScript has loaded: the light bars drift and the scene parallaxes on scroll.
 * The entrance itself is plain CSS (see "Hero entrance" in globals.css) so it never waits for this.
 */
export function HeroMotion() {
  useGSAP(() => {
    const root = document.getElementById("top");
    if (!root) return;
    const q = gsap.utils.selector(root);

    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      // Starts after the CSS entrance has finished with the bars.
      q(".hero-bars [data-bar]").forEach((bar) => {
        gsap.to(bar, {
          x: gsap.utils.random(-40, 50),
          duration: gsap.utils.random(5, 8),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 2.5,
        });
      });

      const scroll = { trigger: root, start: "top top", end: "bottom top", scrub: true };
      gsap.to(q(".hero-tower"), { yPercent: 12, ease: "none", scrollTrigger: scroll });
      gsap.to(q(".hero-bars"), { xPercent: -12, ease: "none", scrollTrigger: scroll });
      gsap.to(q(".hero-copy"), { yPercent: -14, ease: "none", scrollTrigger: scroll });
    });

    ScrollTrigger.refresh();
  });

  return null;
}
