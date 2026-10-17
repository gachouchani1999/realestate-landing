import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { CookieSettingsButton } from "@/components/analytics/CookieBanner";
import { Logo } from "@/components/Logo";
import { site, whatsappLink } from "@/config/site";

const explore = [
  { href: "/#product", label: "The dashboard" },
  { href: "/#how", label: "How it works" },
  { href: "/#report", label: "Free report" },
  { href: "/#calculator", label: "Income estimate" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="overflow-hidden bg-forest-950 pt-20 text-white/60">
      <div className="wrap">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="text-white" />
            <p className="mt-3 text-sm text-white/45">
              <span lang="ar" dir="rtl" className="text-base text-white/60">
                بيتنا
              </span>{" "}
              — &ldquo;our home&rdquo;
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              {site.tagline}. The one-stop shop for UAE property owners — one team, one dashboard, and licensed
              specialists for everything your property needs.
            </p>
          </div>
          <div>
            <p className="text-[13px] font-medium tracking-[0.14em] text-white uppercase">Explore</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={link.href.startsWith("/#") ? false : undefined}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-medium tracking-[0.14em] text-white uppercase">Contact</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 text-olive" /> {site.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <MessageCircle className="h-4 w-4 text-olive" /> {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-olive" /> {site.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4 pt-8 text-xs leading-relaxed text-white/40">
          <p>
            Snagging, furnishing, leasing, property management, holiday-home letting, maintenance, sales and valuations
            are delivered by independent, licensed partners and coordinated by Baytouna. Dashboard previews show sample
            data; figures on this page are illustrative.
          </p>
          <p>
            The information on this website is for general guidance only and does not constitute financial, legal or
            tax advice. Property values can go down as well as up, and past performance is not a guide to future
            returns.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-white/50">
            <span>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </span>
            <CookieSettingsButton className="underline-offset-4 transition-colors hover:text-white hover:underline" />
          </p>
        </div>
      </div>

      <p
        aria-hidden
        data-split
        className="headline mt-10 mb-[-0.14em] text-center text-[16.5vw] leading-[0.8] tracking-[-0.03em] text-white/[0.06] select-none"
      >
        Baytouna
      </p>
      <div className="h-24 sm:h-0" />
    </footer>
  );
}
