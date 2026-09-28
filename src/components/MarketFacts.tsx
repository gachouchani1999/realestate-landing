import { marketFacts } from "@/content/landing";
import { cn } from "@/lib/utils";

export function MarketFacts() {
  return (
    <section aria-label="UAE market at a glance" className="bg-sage-100">
      <dl className="wrap grid grid-cols-2 lg:grid-cols-4">
        {marketFacts.map((fact, i) => (
          <div
            key={fact.label}
            className={cn(
              "flex flex-col-reverse justify-end gap-3 py-10 sm:py-14",
              i % 2 === 1 && "border-l border-charcoal/10 pl-5 sm:pl-8",
              i % 2 === 0 && "pr-5",
              i >= 2 && "border-t border-charcoal/10 lg:border-t-0",
              i === 2 && "lg:border-l lg:pl-8",
              i > 0 && i !== 2 && "lg:pl-8",
            )}
          >
            <dt data-reveal className="max-w-[15rem] text-sm leading-snug text-slate">
              {fact.label}
            </dt>
            <dd data-split className="headline text-[clamp(2.6rem,4.6vw,4.2rem)] text-charcoal">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
