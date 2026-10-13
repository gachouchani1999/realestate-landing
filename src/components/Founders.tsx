import { CalendarClock, Mail, MapPin, MessageCircle } from "lucide-react";
import { SectionHeading, buttonClass } from "@/components/ui";
import { bookingLink, site, whatsappLink } from "@/config/site";
import { team } from "@/content/landing";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Founders() {
  return (
    <section id="team" className="scroll-mt-16 bg-mist py-24 sm:py-36">
      <div className="wrap">
        <SectionHeading
          eyebrow="Who you'll deal with"
          title={
            <>
              Real people, <span className="accent">one WhatsApp away</span>
            </>
          }
          sub="We're a new team, and proud of it: founding owners get the dashboard free and help shape what we build next."
        />

        <div className="mt-16 grid gap-3 lg:grid-cols-[1fr_1fr_0.9fr]">
          {team.map((person, i) => (
            <article key={`${person.name}-${i}`} data-reveal className="flex flex-col rounded-[32px] bg-white p-7 sm:p-9">
              {person.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- small static portraits from /public
                <img src={person.photo} alt={person.name} className="h-20 w-20 rounded-2xl object-cover" />
              ) : (
                <span className="headline grid h-20 w-20 place-items-center rounded-2xl bg-sage text-3xl text-charcoal">
                  {initials(person.name)}
                </span>
              )}
              <h3 className="mt-10 text-2xl font-medium tracking-tight">{person.name}</h3>
              <p className="mt-1 text-sm text-olive-800">{person.role}</p>
              <p className="mt-4 leading-relaxed text-slate">{person.bio}</p>
            </article>
          ))}

          <aside data-reveal className="flex flex-col rounded-[32px] bg-forest p-7 text-white sm:p-9">
            <p className="text-[13px] font-medium tracking-[0.14em] text-white/60 uppercase">Talk to us directly</p>
            <ul className="mt-6 space-y-4">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg transition-colors hover:text-olive-300"
                >
                  <MessageCircle className="h-5 w-5 text-olive-300" /> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-lg transition-colors hover:text-olive-300">
                  <Mail className="h-5 w-5 text-olive-300" /> {site.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-lg">
                <MapPin className="h-5 w-5 text-olive-300" /> {site.location}
              </li>
            </ul>
            <a
              href={bookingLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("light", "lg", "mt-10 w-full justify-between")}
            >
              Book a call <CalendarClock className="h-4 w-4" />
            </a>
            <p className="mt-auto pt-10 text-xs leading-relaxed text-white/45">
              {site.name} is operated by {site.legalName}, {site.licence}.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
