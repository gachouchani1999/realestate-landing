"use client";

import { useEffect } from "react";
import Script from "next/script";
import { site } from "@/config/site";
import { useConsent } from "@/lib/consent";
import { trackMeta } from "@/lib/utils";

/**
 * Meta Pixel. Loads only in production builds and only after the visitor accepts cookies, then tracks PageView,
 * `Contact` on any WhatsApp link click (here) and `Lead` after a successful form submission (in the lead flow).
 */
export function MetaPixel() {
  const consent = useConsent();
  const id = site.metaPixelId;
  const enabled = Boolean(id) && process.env.NODE_ENV === "production" && consent === "granted";

  useEffect(() => {
    if (!enabled) return;
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest?.('a[href*="wa.me/"]')) trackMeta("Contact");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');`}
    </Script>
  );
}
