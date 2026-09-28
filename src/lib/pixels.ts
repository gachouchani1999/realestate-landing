// Deterministic pixel-art generators. Seeded so server and client render identical markup.

export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Pixel = {
  x: number;
  y: number;
  size: number;
  fill: string;
  opacity: number;
  /** Seconds; present on the pixels that keep twinkling after the entrance. */
  twinkle?: { delay: number; duration: number };
  /** 0–1, used to order the entrance animation. */
  order: number;
};

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Scatter that thins out with distance from an anchor corner — the "dissolving" edge motif. */
export function cornerScatter({
  width,
  height,
  cell,
  corner,
  colors,
  seed,
  density = 1,
}: {
  width: number;
  height: number;
  cell: number;
  corner: "tl" | "tr" | "bl" | "br";
  colors: string[];
  seed: number;
  density?: number;
}): Pixel[] {
  const rand = seeded(seed);
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const out: Pixel[] = [];
  for (let cx = 0; cx < cols; cx++) {
    for (let cy = 0; cy < rows; cy++) {
      const fx = corner === "tr" || corner === "br" ? 1 - cx / cols : cx / cols;
      const fy = corner === "bl" || corner === "br" ? 1 - cy / rows : cy / rows;
      const d = Math.hypot(fx, fy) / Math.SQRT2;
      const p = Math.max(0, 0.9 - d * 1.35) * density;
      if (rand() > p) continue;
      const twinkles = rand() < 0.3;
      out.push({
        x: cx * cell,
        y: cy * cell,
        size: cell,
        fill: colors[Math.floor(rand() * colors.length)],
        opacity: r2(0.35 + rand() * 0.65),
        twinkle: twinkles ? { delay: r2(rand() * 6), duration: r2(3 + rand() * 4) } : undefined,
        order: d,
      });
    }
  }
  return out;
}

/** A pixel-art Palm Jumeirah: trunk, fronds and the protective crescent. */
export function palmPixels(seed = 7): Pixel[] {
  const rand = seeded(seed);
  const cell = 6;
  const cells = new Map<string, { fill: string; order: number }>();
  const put = (x: number, y: number, fill: string) => {
    const gx = Math.round(x);
    const gy = Math.round(y);
    if (gx < 0 || gy < 0 || gx > 31 || gy > 31) return;
    const order = Math.hypot(gx - 15.5, gy - 29) / 30;
    cells.set(`${gx},${gy}`, { fill, order });
  };

  // Mainland coast
  for (let x = 0; x < 32; x++) {
    put(x, 31, "#c3c5a1");
    if (rand() < 0.5) put(x, 30, "#c3c5a1");
  }
  // Trunk
  for (let y = 7; y <= 30; y++) {
    put(15, y, "#7d8052");
    put(16, y, "#7d8052");
  }
  // Fronds — longest in the middle, curving slightly upward
  const lengths = [5, 7, 9, 10, 10, 9, 8, 6];
  lengths.forEach((len, i) => {
    const y0 = 8 + i * 2;
    for (let t = 1; t <= len; t++) {
      const lift = t * 0.12;
      put(15 - t, y0 - lift, "#a4a678");
      put(16 + t, y0 - lift, "#a4a678");
    }
  });
  // Crescent with two breaks
  for (let a = -18; a <= 198; a += 2.2) {
    if ((a > 30 && a < 38) || (a > 142 && a < 150)) continue;
    const rad = (a * Math.PI) / 180;
    put(15.5 + 14.2 * Math.cos(rad), 15 - 13.4 * Math.sin(rad), "#5b5e36");
  }

  return [...cells.entries()].map(([key, v]) => {
    const [x, y] = key.split(",").map(Number);
    const twinkles = rand() < 0.12;
    return {
      x: x * cell,
      y: y * cell,
      size: cell - 1,
      fill: v.fill,
      opacity: 1,
      twinkle: twinkles ? { delay: r2(rand() * 5), duration: r2(3 + rand() * 3) } : undefined,
      order: v.order,
    };
  });
}

const FOLIAGE = ["#3c4830", "#4f5b3a", "#646f45", "#7b8452", "#949b65", "#aeb37f", "#c5c89c"];

/** Pixel canopies that wrap the tower — the "tree" in the hero, rebuilt as a mosaic. */
export function foliagePixels(seed = 3): Pixel[] {
  const rand = seeded(seed);
  const cell = 12;
  const blobs = [
    // left canopy
    { x: 212, y: 250, r: 70 },
    { x: 188, y: 360, r: 92 },
    { x: 210, y: 485, r: 100 },
    { x: 182, y: 610, r: 92 },
    { x: 214, y: 720, r: 78 },
    // right canopy
    { x: 392, y: 225, r: 72 },
    { x: 414, y: 340, r: 94 },
    { x: 392, y: 470, r: 104 },
    { x: 420, y: 600, r: 90 },
    { x: 386, y: 712, r: 80 },
    // shrubs at the base
    { x: 170, y: 905, r: 46 },
    { x: 238, y: 915, r: 34 },
    { x: 432, y: 905, r: 48 },
    { x: 362, y: 918, r: 32 },
  ];
  const out: Pixel[] = [];
  for (let gx = 0; gx < 600 / cell; gx++) {
    for (let gy = 0; gy < 980 / cell; gy++) {
      const px = gx * cell + cell / 2;
      const py = gy * cell + cell / 2;
      let best = Infinity;
      let owner = blobs[0];
      for (const b of blobs) {
        const d = Math.hypot(px - b.x, py - b.y) / b.r;
        if (d < best) {
          best = d;
          owner = b;
        }
      }
      const edgeNoise = rand();
      const inside = best < 0.72 || (best < 1.08 && edgeNoise > (best - 0.72) / 0.36);
      const stray = !inside && best < 1.45 && rand() < 0.06;
      if (!inside && !stray) continue;

      // Light falls from the upper right.
      const light = 0.5 + ((owner.y - py) / owner.r) * 0.22 + ((px - owner.x) / owner.r) * 0.2 + (rand() - 0.5) * 0.5;
      const tone = FOLIAGE[Math.max(0, Math.min(FOLIAGE.length - 1, Math.round(light * (FOLIAGE.length - 1))))];
      const twinkles = rand() < (stray ? 0.5 : 0.07);
      out.push({
        x: gx * cell,
        y: gy * cell,
        size: stray ? cell - 3 : cell - 1,
        fill: tone,
        opacity: stray ? r2(0.4 + rand() * 0.4) : 1,
        twinkle: twinkles ? { delay: r2(rand() * 6), duration: r2(2.5 + rand() * 4) } : undefined,
        // Grow from the ground up, with a little jitter.
        order: 1 - py / 980 + rand() * 0.08,
      });
    }
  }
  return out.sort((a, b) => a.order - b.order);
}
