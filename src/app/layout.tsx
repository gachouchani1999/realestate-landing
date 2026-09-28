import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter_Tight, Newsreader } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
});

const title = `${site.name} — ${site.tagline} in UAE Real Estate`;

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

// Runs before first paint: hides animated elements until GSAP takes over, and
// un-hides everything if the motion layer hasn't started within 4 seconds.
const motionGuard = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('js')},4000)})()`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} ${newsreader.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGuard }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
