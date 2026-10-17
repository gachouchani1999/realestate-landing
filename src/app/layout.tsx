import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@/components/analytics/Analytics";
import { CookieBanner } from "@/components/analytics/CookieBanner";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { site } from "@/config/site";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

// Newsreader (SIL Open Font License) from Google Fonts, trimmed to the only weight the site uses (400)
// while keeping the optical-size axis that refines big headlines: 57KB instead of 132KB.
const newsreader = localFont({
  src: "./fonts/newsreader-latin-400-opsz.woff2",
  variable: "--font-newsreader",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const title = `${site.name} — The owner dashboard for UAE property, from A to Z`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    locale: "en_AE",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#c8d1cd",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} ${newsreader.variable} antialiased`}>
      <body>
        {children}
        <CookieBanner />
        <Analytics />
        <MetaPixel />
      </body>
    </html>
  );
}
