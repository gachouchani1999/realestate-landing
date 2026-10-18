import { site } from "@/config/site";

/** Structured data for a landing page: the page, its breadcrumb, the free service it offers, and its FAQ. */
export function landingJsonLd({
  path,
  title,
  description,
  service,
  faqs,
}: {
  path: string;
  title: string;
  description: string;
  service: { name: string; description: string };
  faqs: { q: string; a: string }[];
}) {
  const url = `${site.url}${path}`;
  const organization = { "@type": "Organization", name: site.name, url: site.url, email: site.email };
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: title,
        description,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: service.name, item: url },
        ],
      },
      {
        "@type": "Service",
        name: service.name,
        description: service.description,
        url,
        provider: organization,
        areaServed: { "@type": "Country", name: "United Arab Emirates" },
        offers: { "@type": "Offer", price: "0", priceCurrency: "AED", availability: "https://schema.org/InStock" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
  return JSON.stringify(json).replace(/</g, "\\u003c");
}
