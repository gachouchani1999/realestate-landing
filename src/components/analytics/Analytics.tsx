"use client";

import Script from "next/script";
import { site } from "@/config/site";
import { useConsent } from "@/lib/consent";

/**
 * Google tag: GA4 and Google Ads share one gtag.js load. Loads only in production builds and only after the visitor
 * accepts cookies; the site's `track()` events (lead_flow_open, generate_lead, book_call_click, …) then flow to GA4,
 * and the Ads tag can measure conversions and build remarketing audiences.
 */
export function Analytics() {
  const consent = useConsent();
  const ids = [site.gaMeasurementId, site.googleAdsId].filter(Boolean);
  if (ids.length === 0 || process.env.NODE_ENV !== "production" || consent !== "granted") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`} strategy="afterInteractive" />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
gtag('js', new Date());
${ids.map((id) => `gtag('config', '${id}');`).join("\n")}`}
      </Script>
    </>
  );
}
