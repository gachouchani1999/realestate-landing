import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { LogoMark } from "@/components/Logo";

// Samples of each free deliverable, so visitors can see what they'll get before giving an email.
// Every figure is illustrative and labelled as such.

function PreviewCard({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: string }) {
  return (
    <figure className="relative rounded-[28px] bg-mist p-3 shadow-[0_40px_100px_-50px_rgb(27_40_33/0.5)]">
      <span className="absolute -top-3 left-8 rounded-md bg-olive px-2.5 py-1 text-[11px] font-medium tracking-[0.12em] text-charcoal uppercase">
        Sample
      </span>
      <div className="rounded-[20px] bg-white p-6 sm:p-7">
        <div className="flex items-center gap-3 border-b border-charcoal/10 pb-5">
          <LogoMark className="h-7 w-7 text-charcoal" />
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-slate">{subtitle}</p>
          </div>
        </div>
        <div className="space-y-6 pt-6">{children}</div>
      </div>
      <figcaption className="px-4 pt-3 pb-1 text-xs text-slate">{footer}</figcaption>
    </figure>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium tracking-[0.14em] text-slate uppercase">{children}</p>;
}

const timeline = [
  { date: "3 Mar", label: "Completion notice received", done: true },
  { date: "20 Mar", label: "Final statement settled", done: true },
  { date: "24 Mar", label: "Independent snagging inspection", done: false },
  { date: "5 Apr", label: "Keys, access cards and handover form", done: false },
  { date: "5 Apr 2027", label: "Defects period ends (per your SPA)", done: false },
];

const checks = [
  { label: "Unit matches the SPA: area, layout, parking", done: true },
  { label: "AC, water pressure and drainage tested", done: true },
  { label: "Every defect logged in writing, with photos", done: false },
  { label: "DEWA and cooling accounts in your name", done: false },
];

export function HandoverPackPreview() {
  return (
    <PreviewCard
      title="Handover Pack"
      subtitle="1 bed · Dubai Creek Harbour"
      footer="Sample for illustration. Yours is built for your project, with your dates."
    >
      <div>
        <Label>Your timeline</Label>
        <ol className="mt-3 space-y-2.5">
          {timeline.map((t) => (
            <li key={t.label} className="flex items-center gap-3 text-sm">
              <span className={`h-2.5 w-2.5 shrink-0 ${t.done ? "bg-olive-600" : "border border-charcoal/30"}`} />
              <span className="w-20 shrink-0 text-slate tabular-nums">{t.date}</span>
              <span className={t.done ? "text-slate line-through decoration-charcoal/30" : ""}>{t.label}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <Label>Before you sign</Label>
        <ul className="mt-3 space-y-2.5">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center gap-3 text-sm">
              <span
                className={`grid h-4 w-4 shrink-0 place-items-center ${c.done ? "bg-olive text-charcoal" : "border border-charcoal/30"}`}
              >
                {c.done && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              {c.label}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-slate">+ 8 more checks, your first-week plan and who to call</p>
      </div>
    </PreviewCard>
  );
}

const costs = [
  { label: "Service charge", value: "AED 17,600" },
  { label: "Cooling (chiller)", value: "AED 5,400" },
  { label: "Management (7.5%)", value: "AED 6,900" },
  { label: "Insurance", value: "AED 600" },
];

export function SnapshotPreview() {
  return (
    <PreviewCard
      title="Rent & running-cost snapshot"
      subtitle="1 bed · Dubai Marina"
      footer="Sample figures for illustration. Yours uses the official data for your building."
    >
      <div>
        <Label>Rent for similar units</Label>
        <p className="mt-2 text-2xl font-medium tracking-[-0.02em]">
          AED 95k – 110k <span className="text-base font-normal text-slate">/ year</span>
        </p>
        <div className="relative mt-3 h-2 rounded-full bg-mist">
          <span className="absolute inset-y-0 left-[30%] w-[38%] rounded-full bg-olive" />
          <span className="absolute -top-1 left-[46%] h-4 w-0.5 bg-charcoal" title="Your current rent" />
        </div>
        <p className="mt-2 text-xs text-slate">Your rent today: AED 92,000 — about AED 10k below similar units</p>
      </div>
      <div>
        <Label>What it costs to hold each year</Label>
        <dl className="mt-3 space-y-2 text-sm">
          {costs.map((c) => (
            <div key={c.label} className="flex justify-between">
              <dt className="text-slate">{c.label}</dt>
              <dd className="tabular-nums">{c.value}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-charcoal/10 pt-2 font-medium">
            <dt>Total</dt>
            <dd className="tabular-nums">AED 30,500</dd>
          </div>
        </dl>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-mist p-4">
            <Label>Gross yield</Label>
            <p className="mt-1 text-xl font-medium">5.8%</p>
          </div>
          <div className="rounded-xl bg-forest p-4 text-white">
            <p className="text-[11px] font-medium tracking-[0.14em] text-white/60 uppercase">Net yield</p>
            <p className="mt-1 text-xl font-medium">3.8%</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate">At your current rent and an estimated value of AED 1.6M</p>
      </div>
    </PreviewCard>
  );
}
