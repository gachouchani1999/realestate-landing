import type { ReactNode } from "react";
import { Check, Lightbulb } from "lucide-react";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, buttonClass } from "@/components/ui";
import { site } from "@/config/site";
import { cornerScatter } from "@/lib/pixels";

/** Building blocks for blog articles, in the site's design language. */

export function KeyTakeaways({ items }: { items: ReactNode[] }) {
  return (
    <aside aria-label="Key takeaways" className="not-article rounded-[28px] bg-sage-100 p-7 sm:p-8">
      <p className="text-[13px] font-medium tracking-[0.14em] text-slate uppercase">Key takeaways</p>
      <ul className="mt-5 space-y-3.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-[16px] leading-relaxed">
            <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center bg-olive text-charcoal">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="not-article flex gap-4 rounded-[20px] border border-charcoal/10 bg-white p-6">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mist text-olive-800">
        <Lightbulb className="h-4.5 w-4.5" strokeWidth={1.75} />
      </span>
      <div className="text-[16px] leading-relaxed">
        <p className="font-medium">{title}</p>
        <div className="mt-1 text-slate">{children}</div>
      </div>
    </aside>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="not-article grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 rounded-xl bg-mist px-4 py-3.5 text-[15px] leading-snug">
          <span className="mt-0.5 h-4 w-4 shrink-0 rounded-[3px] border-2 border-charcoal/40" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CompareTable({
  columns,
  rows,
}: {
  columns: [string, string];
  rows: { label: string; values: [string, string] }[];
}) {
  return (
    <div className="not-article overflow-x-auto rounded-[20px] border border-charcoal/10 bg-white">
      <table className="w-full min-w-[520px] text-left text-[15px]">
        <thead>
          <tr className="border-b border-charcoal/10">
            <th scope="col" className="px-5 py-4 font-medium text-slate" />
            {columns.map((c) => (
              <th key={c} scope="col" className="px-5 py-4 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-charcoal/10 last:border-0">
              <th scope="row" className="px-5 py-4 align-top font-medium text-slate">
                {row.label}
              </th>
              {row.values.map((v, i) => (
                <td key={i} className="px-5 py-4 align-top leading-relaxed">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ctaPixels = cornerScatter({
  width: 300,
  height: 160,
  cell: 16,
  corner: "tr",
  colors: ["#304236", "#3d5243", "#7d8052", "#a4a678"],
  seed: 91,
});

/** The article's call to action — opens the same lead form as the homepage. */
export function InlineCta({
  title = "Get a free report on your property",
  body = `Running costs, key dates, rental outlook and value trend for your unit — in your inbox within ${site.reportTurnaround}, then a call to walk you through it.`,
}: {
  title?: string;
  body?: string;
}) {
  return (
    <aside className="not-article relative overflow-hidden rounded-[28px] bg-forest p-7 text-white sm:p-9">
      <PixelArt
        pixels={ctaPixels}
        width={300}
        height={160}
        className="pointer-events-none absolute top-0 right-0 h-[160px] w-[300px]"
      />
      <p className="relative text-[13px] font-medium tracking-[0.14em] text-white/60 uppercase">Free for owners</p>
      <p className="headline relative mt-4 max-w-lg text-[clamp(1.8rem,3.4vw,2.6rem)]">{title}</p>
      <p className="relative mt-4 max-w-lg text-[16px] leading-relaxed text-white/70">{body}</p>
      <a href="#get-report" className={buttonClass("light", "lg", "relative mt-7")}>
        Get my free report <CtaArrow />
      </a>
    </aside>
  );
}
