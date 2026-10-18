import { ImageResponse } from "next/og";
import { ogCard, ogSize } from "@/lib/og-card";

export const alt = "Free rent and running-cost snapshot for Dubai property owners";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    ogCard({ eyebrow: "Free rent snapshot", title: "What should your Dubai property earn?", footer: "Rent range · running costs · net yield · from official DLD data" }),
    size,
  );
}
