import { cn } from "@/lib/utils";

/** An arched doorway — "Baytouna" means "our home". Used where a compact mark is needed. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M6 29V14a10 10 0 0 1 20 0v15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path d="M12 29V17a4 4 0 0 1 8 0v12z" fill="var(--color-olive)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline font-display text-[22px] leading-none tracking-[0.02em]", className)}>
      BAYTOUNA
      <span className="ml-px font-sans text-[13px] font-medium tracking-normal opacity-60">.ae</span>
    </span>
  );
}
