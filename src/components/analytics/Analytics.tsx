"use client";

import Script from "next/script";
import { site } from "@/config/site";
import { useConsent } from "@/lib/consent";

/**
 * Google tag: GA4 and Google Ads share one gtag.js load, in production builds only. It runs in consent mode:
 * every visitor loads it, but until they accept cookies it stores nothing on their device and sends only cookieless
 * pings, which Google uses to count and model visits and conversions (e.g. `generate_lead`). Accepting switches it to
 * full measurement; declining keeps it cookieless (see setConsent).
 */
export function Analytics() {
  const consent = useConsent();
  const ids = [site.gaMeasurementId, site.googleAdsId].filter(Boolean);
  if (ids.length === 0 || process.env.NODE_ENV !== "production" || consent === "server") return null;

  const state = consent === "granted" ? "granted" : "denied";
  return (
    <>
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: '${state}', ad_storage: '${state}', ad_user_data: '${state}', ad_personalization: '${state}' });
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
gtag('js', new Date());
${ids.map((id) => `gtag('config', '${id}');`).join("\n")}`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`} strategy="afterInteractive" />
    </>
  );
}
