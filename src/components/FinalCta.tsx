import { MessageCircle } from "lucide-react";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, Eyebrow, LightBars, buttonClass } from "@/components/ui";
import { site, whatsappLink } from "@/config/site";
import { cornerScatter } from "@/lib/pixels";

const colors = ["#243329", "#304236", "#3d5243", "#7d8052", "#a4a678"];
const pixelsLeft = cornerScatter({ width: 420, height: 280, cell: 20, corner: "bl", colors, seed: 61 });
const pixelsRight = cornerScatter({ width: 420, height: 280, cell: 20, corner: "tr", colors, seed: 62 });

const bars = [
  { top: "0%", left: "0%", width: "45%", height: "22%" },
  { top: "26%", left: "12%", width: "60%", height: "20%" },
  { top: "52%", left: "0%", width: "35%", height: "20%" },
  { top: "76%", left: "25%", width: "55%", height: "22%" },
];

export function FinalCta() {
  return (
    <section id="final-cta" className="relative isolate overflow-hidden bg-forest py-28 text-white sm:py-44">
      <PixelArt
        reveal
        pixels={pixelsLeft}
        width={420}
        height={280}
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[200px] w-[300px] sm:h-[280px] sm:w-[420px]"
      />
      <PixelArt
        reveal
        pixels={pixelsRight}
        width={420}
        height={280}
        className="pointer-events-none absolute top-0 right-0 -z-10 h-[200px] w-[300px] sm:h-[280px] sm:w-[420px]"
      />
      <div data-bars className="absolute inset-y-[30%] -left-[10%] -z-10 w-[80%]">
        <LightBars bars={bars} tone="dark" className="inset-0" />
      </div>

      <div className="wrap flex flex-col items-center text-center">
        <Eyebrow tone="dark">Start today</Eyebrow>
        <h2 data-split className="headline mt-8 max-w-6xl text-[clamp(2.6rem,5.8vw,5.6rem)] text-balance">
          Your property, tracked <span className="text-olive-300">from A to Z</span>
        </h2>
        <p data-reveal className="mt-8 max-w-xl text-lg leading-relaxed text-white/65">
          One team, one dashboard, and licensed specialists for everything your property needs. Start with a free
          report on your property, then book a call to walk through it.
        </p>
        <div data-reveal className="mt-11 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <a href="#get-report" className={buttonClass("light", "lg", "w-full sm:w-auto")}>
            Get my free report <CtaArrow />
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("outlineLight", "lg", "w-full sm:w-auto")}
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
        <p data-reveal className="mt-6 text-sm text-white/45">
          Delivered within {site.reportTurnaround}
        </p>
      </div>
    </section>
  );
}
