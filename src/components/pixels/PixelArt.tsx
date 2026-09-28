import type { CSSProperties } from "react";
import type { Pixel } from "@/lib/pixels";

/** Renders pixels as SVG rects. Rects carry the `px` class so GSAP can animate them in. */
export function PixelRects({ pixels }: { pixels: Pixel[] }) {
  return pixels.map((p, i) => (
    <rect
      key={i}
      className={p.twinkle ? "px px-twinkle" : "px"}
      x={p.x}
      y={p.y}
      width={p.size}
      height={p.size}
      fill={p.fill}
      opacity={p.opacity}
      style={
        p.twinkle
          ? ({
              "--tw-delay": `${p.twinkle.delay}s`,
              "--tw-dur": `${p.twinkle.duration}s`,
              "--tw-from": p.opacity,
              "--tw-to": Math.round(p.opacity * 20) / 100,
            } as CSSProperties)
          : undefined
      }
    />
  ));
}

export function PixelArt({
  pixels,
  width,
  height,
  className,
  preserveAspectRatio,
  reveal,
}: {
  pixels: Pixel[];
  width: number;
  height: number;
  className?: string;
  preserveAspectRatio?: string;
  /** Pop the pixels in when scrolled into view (handled by MotionRoot). */
  reveal?: boolean;
}) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      shapeRendering="crispEdges"
      data-pixels={reveal ? "" : undefined}
    >
      <PixelRects pixels={pixels} />
    </svg>
  );
}
