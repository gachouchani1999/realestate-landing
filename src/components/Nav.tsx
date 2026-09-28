"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, buttonClass } from "@/components/ui";
import { site, whatsappLink } from "@/config/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { cornerScatter } from "@/lib/pixels";
import { cn } from "@/lib/utils";

const links = [
  { href: "#services", label: "Services" },
  { href: "#journey", label: "A to Z journey" },
  { href: "#platform", label: "Owner platform" },
  { href: "#calculator", label: "Earnings calculator" },
  { href: "#faq", label: "FAQ" },
];

const COLS = 12;
const ROWS = 8;
const menuPixels = cornerScatter({
  width: 480,
  height: 320,
  cell: 24,
  corner: "br",
  colors: ["#304236", "#3d5243", "#7d8052", "#a4a678"],
  seed: 17,
  density: 0.9,
});

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(overlayRef);
      tl.current = gsap
        .timeline({ paused: true })
        .set(overlayRef.current, { autoAlpha: 1 })
        .fromTo(
          q(".menu-cell"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.01, stagger: { amount: 0.42, from: "random" } },
        )
        .fromTo(q(".menu-panel"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
        .from(q(".menu-link"), { yPercent: 115, duration: 0.8, ease: "expo.out", stagger: 0.06 }, "+=0.02")
        .from(q(".menu-aside"), { y: 24, autoAlpha: 0, duration: 0.8, ease: "expo.out" }, "<0.1")
        .from(q(".menu-pixels .px"), { scale: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: { amount: 0.5, from: "random" } }, "<");

      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
    { scope: overlayRef },
  );

  useEffect(() => {
    if (!tl.current) return;
    tl.current.timeScale(reduced.current ? 20 : open ? 1 : 1.6);
    if (open) {
      tl.current.play();
      document.documentElement.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      tl.current.reverse();
      document.documentElement.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500",
          scrolled ? "border-charcoal/10 bg-mist/80 backdrop-blur-xl" : "border-transparent",
        )}
      >
        <nav aria-label="Main" className="wrap flex h-20 items-center justify-between gap-6 text-charcoal">
          <a href="#top" aria-label="Propora UAE — back to top">
            <Logo />
          </a>
          <div className="flex items-center gap-6">
            <a
              href="#get-report"
              className="group hidden items-center gap-2 text-sm font-medium transition-colors hover:text-olive-800 sm:inline-flex"
            >
              Free estimate <CtaArrow />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex items-center gap-4 text-sm font-medium tracking-[0.06em]"
            >
              <span className="hidden sm:inline">MENU</span>
              <span className="flex h-9 w-[72px] flex-col items-center justify-center gap-[5px] rounded-[3px] bg-charcoal transition-colors group-hover:bg-charcoal-700">
                <span className="h-px w-8 bg-white transition-transform duration-300 group-hover:translate-x-1" />
                <span className="h-px w-8 bg-white transition-transform duration-300 group-hover:-translate-x-1" />
              </span>
              <span className="sr-only sm:hidden">Open menu</span>
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={overlayRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="invisible fixed inset-0 z-[60] opacity-0"
      >
        <div aria-hidden className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {Array.from({ length: COLS * ROWS }, (_, i) => (
            <span key={i} className="menu-cell block bg-forest" style={{ height: `${100 / ROWS}vh` }} />
          ))}
        </div>

        <div className="menu-panel absolute inset-0 overflow-y-auto bg-forest text-white">
          <PixelArt
            pixels={menuPixels}
            width={480}
            height={320}
            className="menu-pixels pointer-events-none absolute right-0 bottom-0 h-[240px] w-[360px] sm:h-[320px] sm:w-[480px]"
          />
          <div className="wrap flex h-20 items-center justify-between">
            <Logo />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-4 text-sm font-medium tracking-[0.06em]"
            >
              <span className="hidden sm:inline">CLOSE</span>
              <span className="relative grid h-9 w-[72px] place-items-center rounded-[3px] bg-white">
                <span className="absolute h-px w-6 rotate-45 bg-charcoal transition-transform duration-300 group-hover:rotate-[135deg]" />
                <span className="absolute h-px w-6 -rotate-45 bg-charcoal transition-transform duration-300 group-hover:rotate-45" />
              </span>
              <span className="sr-only sm:hidden">Close menu</span>
            </button>
          </div>

          <div className="wrap relative grid gap-14 pt-10 pb-20 lg:grid-cols-[1fr_380px] lg:pt-16">
            <ol className="space-y-1">
              {links.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="menu-link group flex items-baseline gap-5 py-1 transition-colors hover:text-olive-300"
                  >
                    <span className="w-8 text-sm text-white/40 tabular-nums">0{i + 1}</span>
                    <span className="headline text-[clamp(2.4rem,6vw,5rem)]">{link.label}</span>
                  </a>
                </li>
              ))}
            </ol>

            <aside className="menu-aside self-end rounded-[28px] bg-white/[0.06] p-7 ring-1 ring-white/10">
              <p className="text-xl leading-snug font-medium">
                Getting your keys or already own? Get a free rental income estimate for your unit.
              </p>
              <a
                href="#get-report"
                onClick={() => setOpen(false)}
                className={buttonClass("light", "lg", "mt-6 w-full justify-between")}
              >
                Get my free estimate <CtaArrow />
              </a>
              <div className="mt-6 space-y-3 text-sm text-white/70">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white">
                  <MessageCircle className="h-4 w-4 text-olive-300" /> {site.phoneDisplay}
                </a>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-white">
                  <Mail className="h-4 w-4 text-olive-300" /> {site.email}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
