import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCover } from "@/components/blog/ArticleCover";
import { FinalCta } from "@/components/FinalCta";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, Eyebrow } from "@/components/ui";
import { site } from "@/config/site";
import { formatDate, posts } from "@/content/blog";
import { cornerScatter } from "@/lib/pixels";

const title = `Guides for UAE property owners | ${site.name} blog`;
const description =
  "Practical guides for owning and managing UAE property from anywhere: handover, tenants, maintenance, payments and more.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: "/blog", siteName: site.name, title, description, locale: "en_AE" },
  twitter: { card: "summary_large_image", title, description },
};

const cornerPixels = cornerScatter({
  width: 520,
  height: 360,
  cell: 26,
  corner: "tr",
  colors: ["#e6eae8", "#dde3e0", "#b5c0bb", "#c3c5a1"],
  seed: 5,
});

export default function BlogIndex() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-sage pt-36 pb-20 sm:pt-44 sm:pb-24">
        <PixelArt
          pixels={cornerPixels}
          width={520}
          height={360}
          className="pointer-events-none absolute top-0 right-0 -z-10 h-[170px] w-[246px] opacity-70 sm:h-[360px] sm:w-[520px] sm:opacity-100"
        />
        <div className="wrap">
          <Eyebrow>Baytouna journal</Eyebrow>
          <h1 className="headline mt-6 max-w-4xl animate-step-in text-[clamp(2.8rem,6vw,5.4rem)] text-balance">
            Guides for owning UAE property <span className="text-olive-800">from anywhere</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/75">
            Practical, no-nonsense advice for overseas owners — from handover to renting, maintenance and selling.
          </p>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="wrap space-y-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group grid gap-8 rounded-[32px] bg-white p-4 transition-shadow duration-300 hover:shadow-[0_30px_80px_-40px_rgb(27_40_33/0.45)] sm:p-5 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14"
            >
              <ArticleCover title={post.title} category={post.category} className="aspect-[4/3]" />
              <div className="px-3 pb-4 lg:px-0 lg:pr-8 lg:pb-0">
                <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate">
                  <span className="font-medium text-olive-800">{post.category}</span>
                  <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
                  <span>{post.readingMinutes} min read</span>
                </p>
                <h2 className="mt-4 text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight font-medium tracking-[-0.02em]">
                  {post.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate">{post.description}</p>
                <span className="mt-7 inline-flex items-center gap-3 rounded-md bg-charcoal px-5 py-3 text-sm font-medium text-white transition-colors group-hover:bg-charcoal-700">
                  Read the guide <CtaArrow />
                </span>
              </div>
            </Link>
          ))}
          <p className="pt-8 text-slate">More guides on the way.</p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
