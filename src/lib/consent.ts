"use client";

import { useSyncExternalStore } from "react";

// Cookie consent (analytics + advertising), remembered per browser. Without a stored choice the banner shows and
// none of Google Analytics, Google Ads or the Meta Pixel loads.
const KEY = "baytouna-consent";
export type Consent = "granted" | "denied" | "unset";

const listeners = new Set<() => void>();

function read(): Consent {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : "unset";
  } catch {
    return "unset";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Current choice; `"server"` during server rendering, before the browser's choice is known. */
export function useConsent(): Consent | "server" {
  return useSyncExternalStore(subscribe, read, () => "server");
}

export function setConsent(value: Exclude<Consent, "unset">) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked (private mode etc.): the choice holds for this page view only.
  }
  if (value === "denied") {
    // Withdrawing consent: stop Google Analytics, Google Ads and the Meta Pixel, and remove their cookies.
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.fbq?.("consent", "revoke");
    for (const name of document.cookie.split(";").map((c) => c.split("=")[0]?.trim())) {
      if (!name || !/^(_ga|_gcl|_fbp|_fbc)/.test(name)) continue;
      const domain = window.location.hostname.split(".").slice(-2).join(".");
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
    }
  }
  listeners.forEach((listener) => listener());
}

const OPEN_EVENT = "baytouna:cookie-settings";

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenCookieSettings(listener: () => void) {
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
