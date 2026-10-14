import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/FinalCta";
import { PixelArt } from "@/components/pixels/PixelArt";
import { CtaArrow, buttonClass } from "@/components/ui";
import { site } from "@/config/site";
import { formatDate, getPost, posts } from "@/content/blog";
import { cornerScatter } from "@/lib/pixels";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  const title = `${post.title} | ${site.name}`;
  return {
    title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: site.name,
      title,
      description: post.description,
      locale: "en_AE",
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      section: post.category,
    },
    twitter: { card: "summary_large_image", title, description: post.description },
  };
}

const cornerPixels = cornerScatter({
  width: 520,
  height: 360,
  cell: 26,
  corner: "tr",
  colors: ["#e6eae8", "#dde3e0", "#b5c0bb", "#c3c5a1"],
  seed: 9,
});

export default async function ArticlePage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const { Body } = post;

  const url = `${site.url}/blog/${post.slug}`;
  const organization = { "@type": "Organization", name: site.name, url: site.url };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        url,
        mainEntityOfPage: url,
        image: `${url}/opengraph-image`,
        articleSection: post.category,
        keywords: post.keywords.join(", "),
        inLanguage: "en",
        author: organization,
        publisher: { ...organization, logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` } },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <article>
        <header className="relative isolate overflow-hidden bg-sage pt-32 pb-16 sm:pt-40 sm:pb-20">
          <PixelArt
            pixels={cornerPixels}
            width={520}
            height={360}
            className="pointer-events-none absolute top-0 right-0 -z-10 h-[170px] w-[246px] opacity-70 sm:h-[360px] sm:w-[520px] sm:opacity-100"
          />
          <div className="wrap">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate">
                <li>
                  <Link href="/" className="transition-colors hover:text-charcoal">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-charcoal">
                    Blog
                  </Link>
                </li>
              </ol>
            </nav>
            <p className="mt-8 inline-flex rounded-md bg-white px-2.5 py-1 text-xs font-medium tracking-[0.08em] uppercase">
              {post.category}
            </p>
            <h1 className="headline mt-6 max-w-5xl animate-step-in text-[clamp(2.5rem,5.4vw,4.8rem)] text-balance">
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-pretty text-charcoal/75">{post.description}</p>
            <p className="mt-8 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate">
              <span>By the Baytouna team</span>
              <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
              <span>{post.readingMinutes} min read</span>
            </p>
          </div>
        </header>

        <div className="bg-white py-14 sm:py-24">
          <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">
            <div className="min-w-0">
              {/* Contents on mobile */}
              <details className="group mb-10 rounded-[20px] bg-mist p-5 lg:hidden">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium">
                  On this page
                  <span className="text-slate transition-transform group-open:rotate-45">+</span>
                </summary>
                <TocList toc={post.toc} />
              </details>

              <div className="article max-w-[46rem]">
                <Body />
              </div>

              <p className="mt-16 max-w-[46rem] border-t border-charcoal/10 pt-8">
                <Link href="/blog" className="text-sm font-medium text-charcoal underline-offset-4 hover:underline">
                  ← All guides
                </Link>
              </p>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-4">
                <nav aria-label="On this page" className="rounded-[24px] bg-mist p-6">
                  <p className="text-[13px] font-medium tracking-[0.14em] text-slate uppercase">On this page</p>
                  <TocList toc={post.toc} />
                </nav>
                <div className="rounded-[24px] bg-forest p-6 text-white">
                  <p className="text-lg leading-snug font-medium">Get a free report on your property</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Costs, key dates, rental outlook and value trend — within {site.reportTurnaround}.
                  </p>
                  <a href="#get-report" className={buttonClass("light", "md", "mt-5 w-full justify-between")}>
                    Get my free report <CtaArrow />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <FinalCta />
    </>
  );
}

function TocList({ toc }: { toc: { id: string; label: string }[] }) {
  return (
    <ol className="mt-4 space-y-2.5 text-sm">
      {toc.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="text-charcoal/70 transition-colors hover:text-charcoal">
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}
