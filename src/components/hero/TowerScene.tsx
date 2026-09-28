import type { CSSProperties } from "react";
import { PixelRects } from "@/components/pixels/PixelArt";
import { foliagePixels, seeded } from "@/lib/pixels";

const foliage = foliagePixels(11);
const foliageBack = foliage.filter((p) => p.y < 860);
const foliageFront = foliage.filter((p) => p.y >= 860);

const FLOORS = Array.from({ length: 50 }, (_, i) => 96 + i * 16);
const windowRand = seeded(21);
const windows = FLOORS.flatMap((y) =>
  [285, 302].map((x) => {
    const lit = windowRand() < 0.28;
    return {
      x,
      y: y + 4,
      lit,
      delay: Math.round(windowRand() * 800) / 100,
      duration: Math.round((4 + windowRand() * 5) * 100) / 100,
    };
  }),
);

/**
 * A slender twin-fin tower wrapped in a pixel-mosaic canopy.
 * Static SVG; the hero animates `.tower-body`, `.px` and `.window-glow` elements.
 */
export function TowerScene({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 1000"
      preserveAspectRatio="xMidYMax meet"
      className={className}
    >
      <defs>
        <linearGradient id="tw-core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#434b46" />
          <stop offset="1" stopColor="#1f2421" />
        </linearGradient>
        <linearGradient id="tw-fin-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#aab4af" />
          <stop offset="0.55" stopColor="#e8ecea" />
          <stop offset="1" stopColor="#fbfcfb" />
        </linearGradient>
        <linearGradient id="tw-fin-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fbfcfb" />
          <stop offset="0.45" stopColor="#e3e8e5" />
          <stop offset="1" stopColor="#a3ada8" />
        </linearGradient>
        <linearGradient id="tw-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a5ad76" />
          <stop offset="1" stopColor="#7f8a55" />
        </linearGradient>
        <radialGradient id="tw-shadow">
          <stop offset="0" stopColor="#1b2821" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1b2821" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground */}
      <g className="tower-ground">
        <ellipse cx="300" cy="972" rx="296" ry="16" fill="url(#tw-ground)" />
        <ellipse cx="300" cy="966" rx="296" ry="9" fill="#b9c08f" opacity="0.7" />
        <ellipse cx="300" cy="958" rx="190" ry="18" fill="url(#tw-shadow)" />
      </g>

      {/* Canopy behind the tower */}
      <g className="tower-foliage" shapeRendering="crispEdges">
        <PixelRects pixels={foliageBack} />
      </g>

      {/* Tower */}
      <g className="tower-body">
        <line x1="300" y1="22" x2="300" y2="72" stroke="#3a423d" strokeWidth="2" />
        <rect x="280" y="70" width="40" height="880" fill="url(#tw-core)" />
        {FLOORS.map((y) => (
          <line key={y} x1="280" x2="320" y1={y} y2={y} stroke="#171b19" strokeOpacity="0.55" strokeWidth="1" />
        ))}
        {windows.map((w) => (
          <rect
            key={`${w.x}-${w.y}`}
            x={w.x}
            y={w.y}
            width="13"
            height="7"
            fill="#f1ecd0"
            opacity={w.lit ? undefined : 0.08}
            className={w.lit ? "window-glow" : undefined}
            style={
              w.lit ? ({ "--tw-delay": `${w.delay}s`, "--tw-dur": `${w.duration}s` } as CSSProperties) : undefined
            }
          />
        ))}
        <path
          d="M276 950 L276 124 C276 78 268 46 256 18 C251 58 249 92 249 134 L249 896 C249 924 255 940 262 950 Z"
          fill="url(#tw-fin-l)"
        />
        <path
          d="M324 950 L324 112 C324 64 333 30 346 4 C350 46 351 84 351 124 L351 896 C351 924 345 940 338 950 Z"
          fill="url(#tw-fin-r)"
        />
        <rect x="266" y="884" width="68" height="66" fill="#252b27" />
        {[279, 292, 305, 318].map((x) => (
          <line key={x} x1={x} x2={x} y1="890" y2="950" stroke="#ffffff" strokeOpacity="0.18" />
        ))}
        <rect x="266" y="884" width="68" height="3" fill="#dfe4e1" />
      </g>

      {/* Podium */}
      <ellipse cx="300" cy="952" rx="152" ry="11" fill="#e4e9e6" />
      <rect x="148" y="946" width="304" height="8" fill="#cfd6d2" />

      {/* Shrubs in front */}
      <g className="tower-foliage" shapeRendering="crispEdges">
        <PixelRects pixels={foliageFront} />
      </g>
    </svg>
  );
}
