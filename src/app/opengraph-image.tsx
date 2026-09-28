import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A small pixel scatter for the top-right corner, echoing the site's mosaic motif.
const pixels = [
  [0, 0, "#dde3e0"], [1, 0, "#c3c5a1"], [3, 0, "#dde3e0"], [4, 0, "#a4a678"], [5, 0, "#dde3e0"],
  [2, 1, "#dde3e0"], [4, 1, "#dde3e0"], [5, 1, "#c3c5a1"], [3, 2, "#a4a678"], [5, 2, "#dde3e0"],
  [4, 3, "#dde3e0"], [5, 4, "#c3c5a1"],
] as const;

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        background: "radial-gradient(ellipse at 55% 25%, #e4e9e6, #c8d1cd 70%)",
        color: "#242926",
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
      <div style={{ display: "flex", fontSize: 34, letterSpacing: 1 }}>PROPORA</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 92, lineHeight: 0.96, maxWidth: 900 }}>YOUR UAE PROPERTY PARTNER,</div>
        <div style={{ display: "flex", fontSize: 92, lineHeight: 0.96, color: "#5b5e36" }}>FROM A TO Z</div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            alignSelf: "flex-start",
            background: "#242926",
            color: "#ffffff",
            fontFamily: "sans-serif",
            fontSize: 26,
            padding: "16px 26px",
            borderRadius: 8,
          }}
        >
          Get your free rental income estimate ↱
        </div>
      </div>
    </div>,
    size,
  );
}
