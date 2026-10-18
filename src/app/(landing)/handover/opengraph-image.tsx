import { ImageResponse } from "next/og";
import { ogCard, ogSize } from "@/lib/og-card";

export const alt = "Free Handover Pack for Dubai off-plan buyers";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    ogCard({ eyebrow: "Free handover pack", title: "Getting your Dubai keys soon?", footer: "12 checks before you sign · your timeline · first-week plan" }),
    size,
  );
}
