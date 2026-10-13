import { Mail, MessageCircle, Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { site, whatsappLink } from "@/config/site";
import { faqs } from "@/content/landing";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-white py-24 sm:py-36">
      <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="FAQ"
            title={
              <>
                Questions, <span className="accent">answered</span>
              </>
            }
            sub="Everything global investors ask us before their first UAE purchase."
          />
          <div data-reveal className="mt-12 rounded-[28px] bg-mist p-7">
            <p className="text-lg font-medium">Still have a question?</p>
            <p className="mt-1.5 text-sm text-slate">Message us — no sales pitch, just straight answers.</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-charcoal px-5 text-sm font-medium text-white transition hover:bg-charcoal-700"
              >
                <MessageCircle className="h-4 w-4 text-olive-300" /> WhatsApp us
              </a>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-charcoal/15 px-5 text-sm font-medium transition hover:border-charcoal/40"
              >
                <Mail className="h-4 w-4" /> {site.email}
              </a>
            </div>
          </div>
        </div>

        <div data-reveal className="border-t border-charcoal/10">
          {faqs.map((faq, i) => (
            <details key={faq.q} className="group border-b border-charcoal/10" open={i === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-7 text-left text-lg font-medium tracking-tight transition-colors hover:text-olive-800 sm:text-xl">
                {faq.q}
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[3px] bg-mist text-charcoal transition-colors duration-300 group-open:bg-charcoal group-open:text-white">
                  <Plus className="h-4 w-4 transition-transform duration-300 group-open:rotate-45" />
                </span>
              </summary>
              <p className="max-w-2xl pr-14 pb-8 leading-relaxed text-slate">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
