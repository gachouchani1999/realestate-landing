import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { getPost, posts } from "@/content/blog";

export const alt = `${site.name} blog`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

// A small pixel scatter for the corner, echoing the site's mosaic motif.
const pixels = [
  [0, 0, "#3d5243"], [1, 0, "#7d8052"], [3, 0, "#304236"], [4, 0, "#a4a678"], [5, 0, "#3d5243"],
  [2, 1, "#304236"], [4, 1, "#3d5243"], [5, 1, "#7d8052"], [3, 2, "#a4a678"], [5, 2, "#304236"],
  [4, 3, "#3d5243"], [5, 4, "#7d8052"],
] as const;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  const title = post?.title ?? site.name;

  return new ImageResponse(
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
          {(post?.category ?? "Blog").toUpperCase()}
        </span>
      </div>
      <div style={{ display: "flex", fontSize: 76, lineHeight: 1, maxWidth: 1000, textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.65)", fontFamily: "sans-serif" }}>
        {post ? `${post.readingMinutes} min read · baytouna.ae/blog` : "baytouna.ae/blog"}
      </div>
    </div>,
    size,
  );
}
