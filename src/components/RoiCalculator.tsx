"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { TriangleAlert } from "lucide-react";
import { CtaArrow, SectionHeading, buttonClass } from "@/components/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, track } from "@/lib/utils";

const AED_PER_USD = 3.6725; // the dirham is pegged to the US dollar

type Currency = "AED" | "USD";
type Strategy = "long-term" | "holiday-home";

type Inputs = {
  price: number;
  grossYield: number;
  occupancy: number;
  serviceCharge: number;
  management: number;
  growth: number;
  years: number;
};

// Typical starting points for each letting strategy; every value stays adjustable.
const PRESETS: Record<Strategy, Pick<Inputs, "grossYield" | "occupancy" | "serviceCharge" | "management">> = {
  "long-term": { grossYield: 6.5, occupancy: 95, serviceCharge: 18_000, management: 7 },
  "holiday-home": { grossYield: 12, occupancy: 75, serviceCharge: 30_000, management: 20 },
};

const STRATEGIES: { value: Strategy; label: string; hint: string }[] = [
  { value: "long-term", label: "Long-term", hint: "Steady, low-effort income from one tenant." },
  { value: "holiday-home", label: "Holiday home", hint: "Higher potential, seasonal, higher running costs." },
];

const DEFAULTS: Inputs = { price: 1_500_000, growth: 5, years: 5, ...PRESETS["long-term"] };

type YearRow = { year: number; rent: number; growth: number };

function project(i: Inputs) {
  const collectedRent = i.price * (i.grossYield / 100) * (i.occupancy / 100);
  const netIncome = collectedRent - i.serviceCharge - collectedRent * (i.management / 100);
  const rows: YearRow[] = Array.from({ length: i.years }, (_, k) => ({
    year: k + 1,
    rent: netIncome * (k + 1),
    growth: i.price * ((1 + i.growth / 100) ** (k + 1) - 1),
  }));
  const last = rows[rows.length - 1];
  return {
    netIncome,
    netYield: netIncome / i.price,
    futureValue: i.price + last.growth,
    totalReturn: Math.max(0, last.rent) + last.growth,
    rows,
  };
}

function money(aed: number, currency: Currency, compact = false) {
  const value = Math.abs(currency === "USD" ? aed / AED_PER_USD : aed);
  const n = new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact && value >= 1e6 ? 2 : compact && value >= 1e4 ? 0 : compact ? 1 : 0,
  }).format(compact ? value : Math.round(value / 100) * 100);
  const sign = aed < 0 ? "−" : "";
  return currency === "USD" ? `${sign}$${n}` : `${sign}AED ${n}`;
}

function percent(v: number, digits = 1) {
  return `${v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(digits)}%`;
}

export function RoiCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [strategy, setStrategy] = useState<Strategy>("long-term");
  const [currency, setCurrency] = useState<Currency>("AED");
  const touched = useRef(false);
  const result = useMemo(() => project(inputs), [inputs]);

  function set<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    if (!touched.current) {
      touched.current = true;
      track("calculator_used");
    }
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function chooseStrategy(next: Strategy) {
    setStrategy(next);
    setInputs((prev) => ({ ...prev, ...PRESETS[next] }));
    track("calculator_strategy", { strategy: next });
  }

  return (
    <section id="calculator" className="relative isolate scroll-mt-16 overflow-hidden bg-sage py-24 sm:py-36">
      <div className="wrap">
        <SectionHeading
          eyebrow="Earnings calculator"
          title={
            <>
              What could your property <span className="accent">earn?</span>
            </>
          }
          sub="Compare long-term and holiday-home income for a UAE unit — then get a real estimate for yours."
        />

        <div data-reveal className="mt-16 grid gap-3 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[32px] bg-white p-6 sm:p-9">
            <p className="text-[13px] font-medium tracking-[0.14em] text-slate uppercase">Letting strategy</p>
            <div role="group" aria-label="Letting strategy" className="mt-3 grid grid-cols-2 gap-1 rounded-lg bg-mist p-1">
              {STRATEGIES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  aria-pressed={strategy === s.value}
                  onClick={() => chooseStrategy(s.value)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    strategy === s.value ? "bg-charcoal text-white" : "text-slate hover:text-charcoal",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-slate">{STRATEGIES.find((s) => s.value === strategy)?.hint}</p>

            <p className="mt-9 text-[13px] font-medium tracking-[0.14em] text-slate uppercase">Your assumptions</p>
            <div className="mt-7 space-y-7">
              <Slider
                id="price"
                label="Property value"
                min={500_000}
                max={10_000_000}
                step={50_000}
                value={inputs.price}
                onChange={(v) => set("price", v)}
                format={(v) => money(v, currency, true)}
              />
              <Slider
                id="yield"
                label={strategy === "long-term" ? "Gross rental yield" : "Booking income at full occupancy"}
                min={3}
                max={15}
                step={0.1}
                value={inputs.grossYield}
                onChange={(v) => set("grossYield", v)}
                format={(v) => `${v.toFixed(1)}%`}
              />
              <Slider
                id="occupancy"
                label="Occupancy"
                min={50}
                max={100}
                step={1}
                value={inputs.occupancy}
                onChange={(v) => set("occupancy", v)}
                format={(v) => `${v}%`}
              />
              <Slider
                id="service"
                label="Running costs / year"
                min={0}
                max={60_000}
                step={1_000}
                value={inputs.serviceCharge}
                onChange={(v) => set("serviceCharge", v)}
                format={(v) => money(v, currency)}
              />
              <Slider
                id="management"
                label="Management fee"
                min={0}
                max={30}
                step={1}
                value={inputs.management}
                onChange={(v) => set("management", v)}
                format={(v) => `${v}% of income`}
              />
              <Slider
                id="growth"
                label="Capital growth per year"
                min={0}
                max={10}
                step={0.5}
                value={inputs.growth}
                onChange={(v) => set("growth", v)}
                format={(v) => `${v.toFixed(1)}%`}
              />
              <Slider
                id="years"
                label="Holding period"
                min={1}
                max={10}
                step={1}
                value={inputs.years}
                onChange={(v) => set("years", v)}
                format={(v) => `${v} ${v === 1 ? "year" : "years"}`}
              />
            </div>
            <p className="mt-8 border-t border-line pt-5 text-xs leading-relaxed text-slate">
              Illustrative only — not financial advice. Holiday-home income varies with season, community and running
              costs. Assumes flat rents and steady appreciation; excludes purchase costs and mortgage payments.
            </p>
          </div>

          <div className="flex flex-col rounded-[32px] bg-forest-800 p-6 text-white sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/60">Estimated net income per year</p>
                <p className="mt-2 text-5xl font-medium tracking-[-0.03em] tabular-nums sm:text-6xl" aria-live="polite">
                  <AnimatedMoney value={result.netIncome} currency={currency} />
                </p>
                <p className="mt-2 text-sm text-white/60">
                  <span className="font-medium text-white">{money(result.totalReturn, currency, true)}</span> over{" "}
                  {inputs.years} {inputs.years === 1 ? "year" : "years"}, including capital growth
                </p>
              </div>
              <div
                role="group"
                aria-label="Currency"
                className="flex rounded-full border border-white/10 bg-white/[0.04] p-1 text-xs font-medium"
              >
                {(["AED", "USD"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={currency === c}
                    onClick={() => setCurrency(c)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 transition-colors",
                      currency === c ? "bg-white text-charcoal" : "text-white/60 hover:text-white",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3">
              {[
                { label: "Net monthly income", value: money(result.netIncome / 12, currency) },
                { label: "Net yield", value: percent(result.netYield) },
                { label: `Value in year ${inputs.years}`, value: money(result.futureValue, currency, true) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between gap-3 bg-forest-800 px-4 py-3.5 sm:flex-col sm:justify-start sm:gap-1 sm:py-4"
                >
                  <dt className="text-xs text-white/55">{stat.label}</dt>
                  <dd className="text-lg font-semibold tracking-tight">{stat.value}</dd>
                </div>
              ))}
            </dl>

            {result.netIncome < 0 && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-400/10 px-3.5 py-2.5 text-xs text-amber-200">
                <TriangleAlert className="mt-px h-4 w-4 shrink-0" />
                At these settings, costs exceed rent — rental income shows as zero in the chart.
              </p>
            )}

            <div className="mt-8 flex-1">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium">Cumulative return by year</p>
                <ul className="flex items-center gap-4 text-xs text-white/65">
                  <li className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-series-rent" /> Net rental income
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-series-growth" /> Capital growth
                  </li>
                </ul>
              </div>
              <ReturnChart rows={result.rows} currency={currency} />
            </div>

            <a href="#get-report" className={buttonClass("light", "lg", "mt-7 w-full justify-between")}>
              Get a real estimate for my unit <CtaArrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Tweens the headline figure between values instead of snapping. GSAP owns the text after mount. */
function AnimatedMoney({ value, currency }: { value: number; currency: Currency }) {
  const ref = useRef<HTMLSpanElement>(null);
  const state = useRef({ v: value });
  const [initial] = useState(() => money(value, currency));

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Tweening the same object with overwrite kills any tween still in flight.
      gsap.to(state.current, {
        v: value,
        duration: reduce ? 0 : 0.7,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => {
          if (ref.current) ref.current.textContent = money(state.current.v, currency);
        },
      });
    },
    { dependencies: [value, currency] },
  );

  return (
    <span ref={ref} suppressHydrationWarning>
      {initial}
    </span>
  );
}

function Slider({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={`calc-${id}`} className="text-sm text-slate">
          {label}
        </label>
        <output htmlFor={`calc-${id}`} className="text-sm font-medium text-charcoal tabular-nums">
          {format(value)}
        </output>
      </div>
      <input
        id={`calc-${id}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3.5"
        style={{ "--fill": `${fill}%` } as CSSProperties}
      />
    </div>
  );
}

function niceScale(max: number, count = 4) {
  const raw = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  const top = Math.ceil(max / step) * step;
  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step) };
}

function roundedTop(x: number, top: number, w: number, bottom: number, r: number) {
  const rr = Math.min(r, bottom - top, w / 2);
  return `M${x},${bottom} V${top + rr} A${rr},${rr} 0 0 1 ${x + rr},${top} H${x + w - rr} A${rr},${rr} 0 0 1 ${x + w},${top + rr} V${bottom} Z`;
}

const CHART_H = 300;
const PAD = { top: 22, right: 4, bottom: 26, left: 44 };
const GAP = 2;

function ReturnChart({ rows, currency }: { rows: YearRow[]; currency: Currency }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const unit = (aed: number) => (currency === "USD" ? aed / AED_PER_USD : aed);
  const bars = rows.map((r) => ({ ...r, rentV: unit(Math.max(0, r.rent)), growthV: unit(r.growth) }));
  const { top, ticks } = niceScale(Math.max(...bars.map((b) => b.rentV + b.growthV), 1));

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = CHART_H - PAD.top - PAD.bottom;
  const slot = plotW / bars.length;
  const barW = Math.min(24, slot * 0.56);
  const y = (v: number) => PAD.top + plotH - (v / top) * plotH;
  const baseline = y(0);
  const tick = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
  const showEveryOther = slot < 30;
  const activeBar = active !== null ? bars[active] : null;
  const lastIdx = bars.length - 1;

  return (
    <div ref={wrapRef} className="relative" onMouseLeave={() => setActive(null)}>
      <svg viewBox={`0 0 ${width} ${CHART_H}`} className="block w-full overflow-visible" aria-hidden>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke={t === 0 ? "rgb(255 255 255 / 0.22)" : "rgb(255 255 255 / 0.07)"}
              strokeWidth="1"
            />
            <text
              x={PAD.left - 10}
              y={y(t) + 4}
              textAnchor="end"
              fontSize="11"
              fill="rgb(255 255 255 / 0.45)"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {tick.format(t)}
            </text>
          </g>
        ))}

        {bars.map((b, i) => {
          const cx = PAD.left + slot * (i + 0.5);
          const x = cx - barW / 2;
          const rentTop = y(b.rentV);
          const totalTop = y(b.rentV + b.growthV);
          const hasRent = baseline - rentTop >= 1;
          const hasGrowth = rentTop - totalTop >= 1;
          const dimmed = active !== null && active !== i;
          return (
            <g key={b.year} style={{ opacity: dimmed ? 0.4 : 1, transition: "opacity 150ms" }}>
              {hasRent &&
                (hasGrowth ? (
                  <rect x={x} y={rentTop} width={barW} height={baseline - rentTop} fill="var(--color-series-rent)" />
                ) : (
                  <path d={roundedTop(x, rentTop, barW, baseline, 4)} fill="var(--color-series-rent)" />
                ))}
              {hasGrowth && (
                <path
                  d={roundedTop(x, totalTop, barW, hasRent ? rentTop - GAP : baseline, 4)}
                  fill="var(--color-series-growth)"
                />
              )}
              {(!showEveryOther || i % 2 === 0 || i === lastIdx) && (
                <text x={cx} y={CHART_H - 6} textAnchor="middle" fontSize="11" fill="rgb(255 255 255 / 0.45)">
                  Y{b.year}
                </text>
              )}
              {i === lastIdx && active === null && (
                <text x={cx} y={totalTop - 8} textAnchor="middle" fontSize="11" fontWeight="600" fill="rgb(255 255 255 / 0.85)">
                  {tick.format(b.rentV + b.growthV)}
                </text>
              )}
              <rect
                x={PAD.left + slot * i}
                y={PAD.top}
                width={slot}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive((a) => (a === i ? null : i))}
              />
            </g>
          );
        })}
      </svg>

      {activeBar && active !== null && (
        <div
          className="pointer-events-none absolute z-10 w-52 -translate-x-1/2 -translate-y-full rounded-xl border border-white/10 bg-forest px-3.5 py-3 text-xs shadow-2xl"
          style={{
            left: Math.min(Math.max(PAD.left + slot * (active + 0.5), 104), width - 104),
            top: y(activeBar.rentV + activeBar.growthV) - 10,
          }}
        >
          <p className="font-semibold">End of year {activeBar.year}</p>
          <dl className="mt-2 space-y-1.5 text-white/70">
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-[2px] bg-series-rent" /> Net rent
              </dt>
              <dd className="text-white tabular-nums">{money(Math.max(0, activeBar.rent), currency, true)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-[2px] bg-series-growth" /> Capital growth
              </dt>
              <dd className="text-white tabular-nums">{money(activeBar.growth, currency, true)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-1.5">
              <dt>Total</dt>
              <dd className="font-semibold text-white tabular-nums">
                {money(Math.max(0, activeBar.rent) + activeBar.growth, currency, true)}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <table className="sr-only">
        <caption>Cumulative return by year, in {currency}</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Net rental income</th>
            <th scope="col">Capital growth</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.year}>
              <th scope="row">{r.year}</th>
              <td>{money(r.rent, currency)}</td>
              <td>{money(r.growth, currency)}</td>
              <td>{money(r.rent + r.growth, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
