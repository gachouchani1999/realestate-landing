"use client";

import Script from "next/script";
import { site } from "@/config/site";
import { useConsent } from "@/lib/consent";

/**
 * Google Analytics 4. Loads only in production builds and only after the visitor accepts analytics cookies;
 * the site's `track()` events (lead_flow_open, generate_lead, book_call_click, …) then flow to GA4.
 */
export function Analytics() {
  const consent = useConsent();
  const id = site.gaMeasurementId;
  if (!id || process.env.NODE_ENV !== "production" || consent !== "granted") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
