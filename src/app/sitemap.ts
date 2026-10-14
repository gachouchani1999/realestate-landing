import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { posts } from "@/content/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = posts[0]?.dateModified;
  return [
    { url: site.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${site.url}/blog`,
      lastModified: latestPost ? new Date(latestPost) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.dateModified),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
