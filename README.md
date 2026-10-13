# Baytouna.ae — landing page

Lead-generation landing page for Baytouna.ae: "Your Partner from A to Z". Next.js 16, Tailwind CSS 4 and GSAP.

Baytouna is positioned as a **one-stop shop**: one team and one **owner dashboard**, with a network of vetted,
licensed partners handling snagging, furnishing, leasing and management, holiday homes, maintenance, sales and
valuations. Visitors get a **free property report** for their unit, then **book a call** to walk through it; founding
owners get the dashboard set up for free. The site always says partners do the work and Baytouna coordinates it —
regulated work is never claimed as in-house.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build && pnpm start
```

## Where things live

| What | Where |
| --- | --- |
| Contact details, WhatsApp, booking link (`bookingUrl`) | `src/config/site.ts` |
| Page copy (pillars, comparison, dashboard features, stages, how it works, report, FAQ…) | `src/content/landing.ts` |
| Lead form paths, questions, report offers per intent | `src/lib/leads.ts` (`INTENTS`, `DETAIL_QUESTIONS`, `EMIRATES`, `INTERESTS`, `OFFERS`) |
| Hero email capture | `src/components/LeadForm.tsx` |
| Full-screen, one-question-at-a-time form | `src/components/lead-flow/LeadFlow.tsx` (opened via `LeadFlowProvider`) |
| Community suggestions, country guess from time zone | `src/lib/locations.ts` |
| Calculator presets (long-term vs holiday home) | `src/components/RoiCalculator.tsx` (`PRESETS`) |
| Lead API (submission / unfinished attempts) | `src/app/api/leads/route.ts`, `src/app/api/leads/partial/route.ts` |
| Webhook delivery, rate limits | `src/lib/lead-delivery.ts` |
| Hero (pixel tower, entrance animation) | `src/components/hero/` |
| Scroll animations (`data-split`, `data-reveal`, `data-pixels`, `data-bars`) | `src/components/motion/MotionRoot.tsx` |
| Pixel-art generators | `src/lib/pixels.ts` |
| Design tokens (colours, fonts) | `src/app/globals.css` |

## Lead flow

Visitors enter their email in the hero card and continue in a full-screen form: one question per screen, with
keyboard shortcuts (letters to choose, Enter to continue, Esc to close). Every other `href="#get-report"` link on the
page opens the same form directly and asks for the email inside it. The questions branch by intent and include the
emirate and community (with suggestions); country and WhatsApp dialling code are pre-filled from the browser's time
zone — nothing is looked up externally.

## Unfinished attempts (drop-offs)

Once the flow has a valid email, it also saves the visitor's progress in the background so an advisor can follow up
with people who don't finish:

- **When:** when the flow opens with an email, after a pause of a few seconds on any question, and immediately when
  the visitor closes the form, switches tab or leaves the page. Identical saves are skipped.
- **What:** email, answers so far, the question they stopped on (`lastStep`) and UTM source. The pre-filled
  dialling code and guessed country are only included once the visitor has confirmed them.
- **Where:** `POST /api/leads/partial` → `PARTIAL_LEAD_WEBHOOK_URL` (or `LEAD_WEBHOOK_URL`) with
  `"event": "lead.partial"`; in development, `.data/partial-leads.jsonl`.
- **Matching:** each attempt has one `id`. The final submission (`"event": "lead.submitted"`) reuses it, so your
  CRM or sheet can update one record, and anything still `lead.partial` after a while is a drop-off to follow up.

Visitors are told their answers are saved as they go (hero card and email question). Mention it in your privacy
policy too.

## Leads

Every submission is validated, logged, and then:

- **`LEAD_WEBHOOK_URL` set** → POSTed as JSON to that URL (Zapier / Make catch hook, n8n, HubSpot, a Google Sheets Apps Script…). If the webhook fails, the visitor sees an error and can retry.
- **Not set, in development** → appended to `.data/leads.jsonl` (git-ignored).
- **Not set, in production** → only written to the server logs. Set the webhook before launch.

Each lead includes the visitor's intent (getting keys / own one / own several / planning to buy), their answers,
what they want to track (`interests`), emirate, community, contact
details, UTM parameters, and a one-line `summary` (e.g. "I'm getting my keys · 2 bedrooms · Within 3 months ·
Dubai Marina") that is handy for email alerts, sheets and CRMs. A hidden honeypot field and a light per-IP rate limit filter basic spam.

**Analytics & cookies.** Google Analytics 4 (`G-V387M4WQX6`, set in `src/config/site.ts`) loads only in production
builds and only after the visitor clicks **Accept** on the cookie banner; declining (now or later via "Cookie
settings" in the footer) keeps it off and clears `_ga` cookies. Code: `src/components/analytics/`, `src/lib/consent.ts`.
In GA4, mark `generate_lead` and `book_call_click` as key events.

Conversion events (`lead_flow_open`, `lead_flow_step`, `lead_form_start`, `generate_lead`, `calculator_used`, `calculator_strategy`, `book_call_click`, `whatsapp_click`) are pushed to `window.dataLayer` / `gtag` when Google Tag Manager or GA4 is installed.

See `.env.example` for all environment variables.

## Before launch

- Replace the placeholder WhatsApp number and phone in `src/config/site.ts`, and
  add a `bookingUrl` (Calendly / Cal.com) if you want calls booked on a calendar instead of WhatsApp.
- Confirm the market facts, services, fee descriptions, FAQ answers and estimate contents in `src/content/landing.ts`.
- Check the calculator presets match your real long-term and holiday-home numbers.
- Make sure you hold the licences each service needs (RERA for brokerage and leasing, DET for holiday homes).
- Add a privacy policy page and link it from the form and footer.
- Sign the licensed partners before mentioning them by name, and add real testimonials once you have them.
