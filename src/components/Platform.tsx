import {
  BellRing,
  ClipboardCheck,
  FolderLock,
  Receipt,
  TrendingUp,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { PixelArt } from "@/components/pixels/PixelArt";
import { LightBars, SectionHeading } from "@/components/ui";
import { platformFeatures } from "@/content/landing";
import { cornerScatter } from "@/lib/pixels";

const icons: Record<(typeof platformFeatures)[number]["icon"], LucideIcon> = {
  handover: ClipboardCheck,
  vault: FolderLock,
  payments: Receipt,
  rent: Wallet,
  maintenance: Wrench,
  value: TrendingUp,
};

const sectionPixels = cornerScatter({
  width: 480,
  height: 300,
  cell: 24,
  corner: "tr",
  colors: ["#243329", "#304236", "#3d5243", "#7d8052"],
  seed: 44,
});

const bars = [
  { top: "0%", left: "0%", width: "70%", height: "18%" },
  { top: "26%", left: "20%", width: "80%", height: "16%" },
  { top: "52%", left: "0%", width: "55%", height: "16%" },
  { top: "78%", left: "30%", width: "70%", height: "18%" },
];

export function Platform() {
  return (
    <section id="product" className="relative isolate scroll-mt-16 overflow-hidden bg-forest py-24 text-white sm:py-36">
      <PixelArt
        reveal
        pixels={sectionPixels}
        width={480}
        height={300}
        className="pointer-events-none absolute top-0 right-0 -z-10 h-[220px] w-[352px] sm:h-[300px] sm:w-[480px]"
      />
      <div className="wrap grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <SectionHeading
            tone="dark"
            eyebrow="The owner dashboard"
            title={
              <>
                Everything about your property, <span className="accent">in one place</span>
              </>
            }
            sub="Handover, paperwork, payments, upkeep and rent — always up to date, wherever you live."
          />
          <ul className="mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {platformFeatures.map((feature) => {
              const Icon = icons[feature.icon];
              return (
                <li key={feature.title} data-reveal>
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-olive text-charcoal">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 text-lg font-medium">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{feature.body}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div data-reveal className="relative">
          <div data-bars className="absolute top-[12%] -right-[20%] bottom-[8%] -left-[30%] -z-10">
            <LightBars bars={bars} tone="dark" className="inset-0" />
          </div>
          <span className="absolute -top-3 left-6 z-10 rounded-md bg-olive px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] text-charcoal uppercase">
            Sample data
          </span>
          <DashboardMock />
          <div className="absolute -bottom-7 left-4 flex animate-float items-center gap-3 rounded-xl bg-charcoal py-3.5 pr-5 pl-3.5 text-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/10 sm:-left-8">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-olive text-charcoal">
              <BellRing className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-sm font-medium">Snag fixed · 3 photos added</span>
              <span className="block text-xs text-white/55">Dubai Hills 2BR · just now</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

const portfolio = [1.527, 1.531, 1.529, 1.54, 1.548, 1.556, 1.553, 1.571, 1.584, 1.596, 1.607, 1.62];
const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

function PortfolioChart() {
  const W = 600;
  const H = 170;
  const pad = { top: 14, right: 74, bottom: 26, left: 4 };
  const min = 1.5;
  const max = 1.64;
  const x = (i: number) => pad.left + (i / (portfolio.length - 1)) * (W - pad.left - pad.right);
  const y = (v: number) => pad.top + (1 - (v - min) / (max - min)) * (H - pad.top - pad.bottom);
  const line = portfolio.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const baseline = H - pad.bottom;
  const area = `${line} L${x(portfolio.length - 1)},${baseline} L${x(0)},${baseline} Z`;
  const last = portfolio.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      {[1.54, 1.58, 1.62].map((v) => (
        <line key={v} x1={pad.left} x2={W - pad.right} y1={y(v)} y2={y(v)} stroke="#e6ebe8" strokeWidth="1" />
      ))}
      <line x1={pad.left} x2={W - pad.right} y1={baseline} y2={baseline} stroke="#cfd7d3" strokeWidth="1" />
      <path d={area} fill="var(--color-series-rent-light)" opacity="0.1" />
      <path
        d={line}
        fill="none"
        stroke="var(--color-series-rent-light)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={x(last)} cy={y(portfolio[last])} r="6" fill="#fff" />
      <circle cx={x(last)} cy={y(portfolio[last])} r="4" fill="var(--color-series-rent-light)" />
      <text x={x(last) + 12} y={y(portfolio[last]) + 4} fontSize="13" fontWeight="600" fill="#242926">
        1.62M
      </text>
      {months.map((m, i) =>
        i % 3 === 0 || i === last ? (
          <text key={m} x={x(i)} y={H - 6} fontSize="11" fill="#7b8580" textAnchor={i === 0 ? "start" : "middle"}>
            {m}
          </text>
        ) : null,
      )}
    </svg>
  );
}

const kpis = [
  { label: "Handover", value: "4 of 6 steps", note: "2 snags open" },
  { label: "Next payment", value: "AED 9,840", note: "Service charge · 12 Nov" },
  { label: "Rent this year", value: "AED 72,000", note: "10 of 10 on time" },
  { label: "Est. value", value: "AED 1.62M", note: "▲ 6.1% in 12 months" },
];

const properties = [
  { name: "Dubai Marina · 1BR", status: "Rented", tone: "bg-emerald-50 text-emerald-700", meta: "AED 7,200 / mo" },
  { name: "Dubai Hills · 2BR", status: "Handover", tone: "bg-amber-50 text-amber-700", meta: "Step 4 of 6" },
  { name: "JVC · Studio", status: "Furnishing", tone: "bg-sky-50 text-sky-700", meta: "Install 18 Nov" },
];

const activity = [
  { title: "Snag fixed", meta: "Bathroom grout · 3 photos", time: "2h" },
  { title: "Reminder", meta: "Service charge in 14 days", time: "1d" },
  { title: "Rent received", meta: "Marina 1BR · AED 7,200", time: "3d" },
];

/** Illustrative preview of the owner dashboard. Decorative, so hidden from assistive tech. */
function DashboardMock() {
  return (
    <figure className="rounded-[30px] bg-white p-2 shadow-[0_50px_120px_-40px_rgb(0_0_0/0.6)]">
      <figcaption className="sr-only">Preview of the Baytouna owner dashboard, with sample data</figcaption>
      <div aria-hidden className="overflow-hidden rounded-[24px] border border-line/70 bg-mist/60 text-charcoal">
        <div className="flex items-center justify-between border-b border-line/70 bg-white px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <LogoMark className="h-5 w-5 text-charcoal" />
            <span className="text-sm font-semibold">Owner dashboard</span>
          </div>
          <div className="hidden items-center gap-1 rounded-lg bg-mist p-1 text-xs sm:flex">
            <span className="rounded-md bg-white px-3 py-1 font-medium shadow-sm">Overview</span>
            <span className="px-3 py-1 text-slate">Documents</span>
            <span className="px-3 py-1 text-slate">Payments</span>
          </div>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-charcoal text-[11px] font-semibold text-olive-300">
            AK
          </span>
        </div>

        <div className="space-y-3 p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-line/70 bg-white p-3">
                <p className="text-[11px] text-slate">{kpi.label}</p>
                <p className="mt-1 text-base font-semibold tracking-tight sm:text-[17px]">{kpi.value}</p>
                <p className="mt-0.5 text-[11px] text-slate">{kpi.note}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-line/70 bg-white p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-sm font-semibold">Estimated value</p>
              <p className="text-[11px] text-slate">Dubai Marina 1BR · last 12 months · AED</p>
            </div>
            <PortfolioChart />
          </div>

          <div className="grid gap-3 sm:grid-cols-[1.35fr_1fr]">
            <div className="rounded-xl border border-line/70 bg-white p-4">
              <p className="text-sm font-semibold">Your units</p>
              <ul className="mt-3 divide-y divide-line/70">
                {properties.map((p) => (
                  <li key={p.name} className="flex items-center justify-between gap-2 py-2.5 text-xs">
                    <span className="font-medium">{p.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="hidden text-slate md:inline">{p.meta}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.tone}`}>{p.status}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden rounded-xl border border-line/70 bg-white p-4 sm:block">
              <p className="text-sm font-semibold">Latest updates</p>
              <ul className="mt-3 space-y-3">
                {activity.map((a) => (
                  <li key={a.title} className="flex items-start gap-2.5 text-xs">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-olive-600" />
                    <span className="flex-1">
                      <span className="block font-medium">{a.title}</span>
                      <span className="block text-slate">{a.meta}</span>
                    </span>
                    <span className="text-slate">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
