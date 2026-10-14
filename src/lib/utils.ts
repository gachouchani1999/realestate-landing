export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Sends a conversion event to GTM / GA4 when either is installed; a no-op otherwise. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...params });
  window.gtag?.("event", event, params);
}

/** Sends a standard event to the Meta Pixel when it has loaded (i.e. after cookie consent); a no-op otherwise. */
export function trackMeta(event: "Lead" | "Contact", params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", event, params);
}
