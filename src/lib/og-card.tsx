// Shared layout for generated share images (Open Graph / Twitter cards): forest card, pixel corner, big title.

const pixels = [
  [0, 0, "#3d5243"], [1, 0, "#7d8052"], [3, 0, "#304236"], [4, 0, "#a4a678"], [5, 0, "#3d5243"],
  [2, 1, "#304236"], [4, 1, "#3d5243"], [5, 1, "#7d8052"], [3, 2, "#a4a678"], [5, 2, "#304236"],
  [4, 3, "#3d5243"], [5, 4, "#7d8052"],
] as const;

export const ogSize = { width: 1200, height: 630 };

export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        background: "#1b2821",
        color: "#ffffff",
        fontFamily: "Georgia, serif",
        position: "relative",
      }}
    >
      {pixels.map(([x, y, fill]) => (
        <div
          key={`${x}-${y}`}
          style={{ position: "absolute", top: y * 44, right: (5 - x) * 44, width: 44, height: 44, background: fill }}
        />
      ))}
      <div style={{ display: "flex", alignItems: "baseline", fontSize: 32, letterSpacing: 1 }}>
        BAYTOUNA
        <span style={{ fontSize: 20, opacity: 0.6, fontFamily: "sans-serif", letterSpacing: 0 }}>.ae</span>
        <span style={{ marginLeft: 24, fontSize: 20, color: "#c3c5a1", fontFamily: "sans-serif", letterSpacing: 3 }}>
          {eyebrow.toUpperCase()}
        </span>
      </div>
      <div style={{ display: "flex", fontSize: 80, lineHeight: 1, maxWidth: 980, textTransform: "uppercase" }}>{title}</div>
      <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif" }}>{footer}</div>
    </div>
  );
}
