// Blog registry. Add a post by creating a file in this folder and listing it in `posts` (newest first).
import type { ComponentType } from "react";
import { post as manageRemotely } from "@/content/blog/manage-uae-property-remotely";

export type Post = {
  slug: string;
  title: string;
  /** Meta description and dek under the title (aim for 140–160 characters). */
  description: string;
  category: string;
  /** ISO dates (YYYY-MM-DD). */
  datePublished: string;
  dateModified: string;
  readingMinutes: number;
  keywords: string[];
  toc: { id: string; label: string }[];
  faqs: { q: string; a: string }[];
  Body: ComponentType;
};

export const posts: Post[] = [manageRemotely];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
