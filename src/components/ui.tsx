import type { ReactNode } from "react";
import { CornerUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonBase =
  "group inline-flex items-center justify-center gap-3 rounded-md font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

const buttonSizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-6 text-[15px]",
};

const buttonVariants = {
  dark: "bg-charcoal text-white hover:bg-charcoal-700",
  light: "bg-white text-charcoal hover:bg-mist",
  outline: "border border-charcoal/20 text-charcoal hover:border-charcoal/60",
  outlineLight: "border border-white/25 text-white hover:border-white/60",
};

export type ButtonVariant = keyof typeof buttonVariants;

export function buttonClass(variant: ButtonVariant, size: keyof typeof buttonSizes = "md", className?: string) {
  return cn(buttonBase, buttonSizes[size], buttonVariants[variant], className);
}

/** The hooked arrow used on every call to action; it nudges up-right on hover. */
export function CtaArrow({ className }: { className?: string }) {
  return (
    <CornerUpRight
      aria-hidden
      className={cn(
        "h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
        className,
      )}
      strokeWidth={1.75}
    />
  );
}

export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <p
      data-reveal
      className={cn(
        "flex items-center gap-2.5 text-[13px] font-medium tracking-[0.14em] uppercase",
        tone === "dark" ? "text-white/70" : "text-slate",
      )}
    >
      <span aria-hidden className={cn("h-2 w-2", tone === "dark" ? "bg-olive-300" : "bg-olive-600")} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-4xl", align === "center" && "mx-auto flex flex-col items-center text-center", className)}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        data-split
        className={cn(
          "headline mt-6 text-[clamp(2.3rem,4.6vw,4.4rem)]",
          tone === "dark" ? "text-white [&_.accent]:text-olive-300" : "text-charcoal [&_.accent]:text-olive-800",
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          data-reveal
          className={cn(
            "mt-6 max-w-xl text-lg leading-relaxed text-pretty",
            align === "center" && "mx-auto",
            tone === "dark" ? "text-white/65" : "text-slate",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/** Frosted light streaks — the horizontal-bar motif. Position the wrapper; the bars fill it. */
export function LightBars({
  bars,
  className,
  tone = "light",
}: {
  bars: { top: string; left: string; width: string; height: string }[];
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)}>
      {bars.map((b, i) => (
        <span
          key={i}
          data-bar
          className={cn(
            "absolute block origin-left",
            tone === "light"
              ? "bg-linear-to-r from-white/95 via-white/55 to-white/0"
              : "bg-linear-to-r from-white/0 via-white/[0.07] to-white/0",
          )}
          style={{ top: b.top, left: b.left, width: b.width, height: b.height }}
        />
      ))}
    </div>
  );
}
