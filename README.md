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

## Ad landing pages

Two focused pages for paid traffic, each with one offer, no site menu, and the form's first step in the first screen:

| Page | Offer | For |
|---|---|---|
| `/handover` | Handover Pack: 12 checks, timeline, defects dates, first-week plan | Off-plan buyers getting keys |
| `/snapshot` | Rent & running-cost snapshot: rent range, yearly costs, net yield, key dates | Owners, especially abroad |

- **Form:** building first, then email (the partial save fires here), then the shared lead flow in its short version: one question, first name, optional WhatsApp, confirm. Offers live in `LANDING_OFFERS` in `src/lib/leads.ts`.
- **In the sheet:** the Summary starts with the offer ("Handover Pack · …", "Rent snapshot · …") and Landing page shows which URL they came from.
- **Ads:** point each ad at its own page and tag it, e.g. `https://www.baytouna.ae/handover?utm_source=meta&utm_campaign=handover-uk&utm_content=ad1`.
- The WhatsApp number is optional everywhere.

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

## Lead inbox: Google Sheet

`scripts/google-sheets-lead-inbox.gs` turns a Google Sheet into the lead inbox: one row per attempt ("Started — not
finished" rows become "Submitted" when the visitor finishes), an email to hello@baytouna.ae for every submitted lead,
and "Contacted?" / "Notes" columns for the team.

1. Create a Google Sheet (e.g. "Baytouna leads") with the account that should own the leads.
2. **Extensions → Apps Script**, replace the editor contents with the script, and set `SECRET` to a long random string.
3. Pick `setup` in the function menu and click **Run**; approve the permissions (Sheets + send email). A "Leads" tab
   appears and a test email arrives.
4. **Deploy → New deployment → Web app** — *Execute as:* Me, *Who has access:* Anyone. Copy the web app URL.
5. In Vercel, set `LEAD_WEBHOOK_URL` to `<web app URL>?token=<SECRET>` (Production), then redeploy.
6. Submit a test lead on the live site and check the sheet and inbox. Delete the test row afterwards.

If you edit the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
A wrong or missing token makes the site show "couldn't submit, please retry" rather than losing leads silently.

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

**Google Ads tag** (`AW-18511825797`, in `src/config/site.ts`) shares the same Google tag as GA4 and the same
consent; Accept grants Google's ad consent signals, Decline revokes them and clears `_gcl` cookies. For conversions,
either import GA4's `generate_lead` into Google Ads or add an Ads conversion label.

**Meta Pixel** (`4093844800921406`, also in `src/config/site.ts`) follows the same consent: it loads only after
**Accept**, sends `PageView`, `Lead` (after a successful form submission) and `Contact` (any WhatsApp link click),
and is revoked with its `_fbp` cookie removed if the visitor declines. There is deliberately no `<noscript>` fallback,
since it would track visitors before they could consent.

Conversion events (`lead_flow_open`, `lead_flow_step`, `lead_form_start`, `generate_lead`, `calculator_used`, `calculator_strategy`, `book_call_click`, `whatsapp_click`) are pushed to `window.dataLayer` / `gtag` when Google Tag Manager or GA4 is installed.

See `.env.example` for all environment variables.

## Before launch

- Add a `bookingUrl` (Calendly / Cal.com) in `src/config/site.ts` if you want calls booked on a calendar instead of
  WhatsApp.
- Confirm the market facts, services, fee descriptions, FAQ answers and estimate contents in `src/content/landing.ts`.
- Check the calculator presets match your real long-term and holiday-home numbers.
- Make sure you hold the licences each service needs (RERA for brokerage and leasing, DET for holiday homes).
- Add a privacy policy page and link it from the form and footer.
- Sign the licensed partners before mentioning them by name, and add real testimonials once you have them.
