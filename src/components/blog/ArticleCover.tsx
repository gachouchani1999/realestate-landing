import { PixelArt } from "@/components/pixels/PixelArt";
import { cornerScatter, palmPixels } from "@/lib/pixels";
import { cn } from "@/lib/utils";

const coverPixels = cornerScatter({
  width: 360,
  height: 240,
  cell: 16,
  corner: "tr",
  colors: ["#304236", "#3d5243", "#7d8052", "#a4a678"],
  seed: 101,
});
const palm = palmPixels(21);

/** Generated cover art for a post: forest card, pixel mosaic, palm and the title. Decorative. */
export function ArticleCover({ title, category, className }: { title: string; category: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("@container relative overflow-hidden rounded-[28px] bg-forest text-white", className)}
    >
      <PixelArt pixels={coverPixels} width={360} height={240} className="absolute top-0 right-0 h-auto w-[60%]" />
      <PixelArt pixels={palm} width={192} height={192} className="absolute right-[7%] bottom-[9%] h-auto w-[24%]" />
      <div className="relative flex h-full flex-col p-[7cqw]">
        <p className="text-[2.8cqw] font-medium tracking-[0.2em] text-olive-300 uppercase">{category}</p>
        <p className="headline mt-auto max-w-[68%] text-[6.4cqw]">{title}</p>
        <p className="mt-[4cqw] font-display text-[3.4cqw] tracking-[0.02em]">
          BAYTOUNA<span className="font-sans text-[2.2cqw] opacity-60">.ae</span>
        </p>
      </div>
    </div>
  );
}
