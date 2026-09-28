"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { CtaArrow } from "@/components/ui";
import { whatsappLink } from "@/config/site";
import { cn, track } from "@/lib/utils";

/** Mobile-only bar that keeps the main CTA in reach once the hero form has scrolled away. */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("get-report");
    const finalCta = document.getElementById("final-cta");
    if (!form) return;
    const update = () => {
      const pastForm = form.getBoundingClientRect().bottom < 0;
      const cta = finalCta?.getBoundingClientRect();
      const ctaInView = cta ? cta.top < window.innerHeight && cta.bottom > 0 : false;
      setVisible(pastForm && !ctaInView);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-mist/90 p-3 backdrop-blur-xl transition-transform duration-500 ease-out sm:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <div className="flex gap-2.5">
        <a
          href="#get-report"
          tabIndex={visible ? 0 : -1}
          className="group inline-flex h-12 flex-1 items-center justify-center gap-3 rounded-md bg-charcoal text-[15px] font-medium text-white"
        >
          Get my free estimate <CtaArrow />
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          onClick={() => track("whatsapp_click", { location: "sticky_bar" })}
          aria-label="Chat on WhatsApp"
          className="grid h-12 w-12 place-items-center rounded-md border border-charcoal/15 text-charcoal"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
