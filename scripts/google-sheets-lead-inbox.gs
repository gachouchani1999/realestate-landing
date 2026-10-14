/**
 * Baytouna lead inbox — Google Apps Script web app.
 *
 * Receives leads from baytouna.ae (set its URL + "?token=YOUR_SECRET" as LEAD_WEBHOOK_URL in Vercel) and writes them
 * to the "Leads" sheet: one row per attempt. Unfinished attempts show as "Started — not finished" and are updated in
 * place when the visitor submits. Every newly submitted lead is emailed to NOTIFY_EMAIL.
 *
 * Setup steps are in the project README ("Lead inbox: Google Sheet").
 */

// ── Settings ─────────────────────────────────────────────────────────────────────────────────────────────────────
const SECRET = "PASTE-YOUR-SECRET-HERE"; // must match ?token=… in LEAD_WEBHOOK_URL — never commit the real one
const NOTIFY_EMAIL = "hello@baytouna.ae";
const SHEET_NAME = "Leads";

// ── Layout ───────────────────────────────────────────────────────────────────────────────────────────────────────
// The script writes the first block of columns; "Contacted?" and "Notes" belong to the team and are never touched.
const COLUMNS = [
  "Status",
  "Updated",
  "Name",
  "Email",
  "WhatsApp",
  "Country",
  "Summary",
  "Help with",
  "Stopped at",
  "Source",
  "Campaign",
  "Referrer",
  "Landing page",
  "Lead ID",
];
const TEAM_COLUMNS = ["Contacted?", "Notes"];
const ID_COLUMN = COLUMNS.indexOf("Lead ID") + 1;
const SUBMITTED = "Submitted";
const STARTED = "Started — not finished";

const INTERESTS = {
  handover: "Handover & snagging",
  furnishing: "Furnishing",
  tenant: "Finding a tenant",
  "holiday-home": "Holiday-home letting",
  maintenance: "Maintenance",
  payments: "Payments & service charges",
  documents: "Documents",
  selling: "Selling or valuation",
};

const STEPS = {
  intent: "Situation",
  propertyType: "Property type",
  handover: "Handover date",
  currentUse: "Current use",
  unitCount: "Number of units",
  portfolioUse: "How units are used",
  budget: "Budget",
  timeline: "Timeline",
  emirate: "Emirate",
  community: "Community",
  interests: "Help with",
  name: "Name",
  email: "Email",
  phone: "WhatsApp number",
  country: "Country",
  review: "Review screen (didn't press send)",
};

// ── Web app ──────────────────────────────────────────────────────────────────────────────────────────────────────
function doGet() {
  return ContentService.createTextOutput("Baytouna lead inbox is running.");
}

function doPost(e) {
  if (!e || !e.parameter || e.parameter.token !== SECRET) return json({ ok: false, error: "unauthorised" });

  let lead;
  try {
    lead = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "invalid JSON" });
  }
  if (!lead.id) return json({ ok: false, error: "missing id" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getSheet();
    const submitted = lead.event === "lead.submitted";
    const row = findRow(sheet, lead.id);
    const previousStatus = row ? sheet.getRange(row, 1).getValue() : "";

    // A late "partial" save never downgrades a lead that was already submitted.
    if (!submitted && previousStatus === SUBMITTED) return json({ ok: true, skipped: "already submitted" });

    const source = lead.source || {};
    const values = [
      submitted ? SUBMITTED : STARTED,
      new Date(),
      text(lead.name),
      text(lead.email),
      text(lead.phone),
      text(lead.country),
      text(lead.summary),
      text((lead.interests || []).map((v) => INTERESTS[v] || v).join(", ")),
      submitted ? "" : text(STEPS[lead.lastStep] || lead.lastStep),
      text(source.utmSource),
      text(source.utmCampaign),
      text(source.referrer),
      text(source.landingPage),
      text(lead.id),
    ];
    const target = row || sheet.getLastRow() + 1;
    sheet.getRange(target, 1, 1, COLUMNS.length).setValues([values]);
    if (!row) sheet.getRange(target, COLUMNS.length + 1).insertCheckboxes();

    if (submitted && previousStatus !== SUBMITTED) notify(sheet, lead, target);
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────
function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    const header = COLUMNS.concat(TEAM_COLUMNS);
    sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.getRange("B:B").setNumberFormat("dd mmm yyyy, hh:mm");
  }
  return sheet;
}

function findRow(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const ids = sheet.getRange(2, ID_COLUMN, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 2;
  }
  return null;
}

/** Store visitor input as plain text: stops "+971…" turning into a number and blocks formula injection. */
function text(value) {
  if (value === undefined || value === null || value === "") return "";
  return "'" + String(value);
}

function notify(sheet, lead, row) {
  const name = lead.name || lead.email;
  const digits = String(lead.phone || "").replace(/\D/g, "");
  const sheetLink = sheet.getParent().getUrl() + "#gid=" + sheet.getSheetId() + "&range=A" + row;
  const source = lead.source || {};
  const lines = [
    ["Summary", lead.summary],
    ["Help with", (lead.interests || []).map((v) => INTERESTS[v] || v).join(", ")],
    ["Email", lead.email],
    ["WhatsApp", lead.phone],
    ["Based in", lead.country],
    ["Source", [source.utmSource, source.utmCampaign].filter(Boolean).join(" · ") || "Direct / unknown"],
  ].filter((line) => line[1]);

  const html =
    "<p><strong>New lead from baytouna.ae</strong> — the report is promised within 48 hours.</p>" +
    "<table cellpadding='6' style='border-collapse:collapse'>" +
    lines.map((l) => "<tr><td style='color:#59635e'>" + l[0] + "</td><td>" + escapeHtml(l[1]) + "</td></tr>").join("") +
    "</table>" +
    "<p>" +
    (digits ? "<a href='https://wa.me/" + digits + "'>Reply on WhatsApp</a> · " : "") +
    "<a href='" + sheetLink + "'>Open in the sheet</a></p>";

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: "New lead: " + name + (lead.summary ? " — " + lead.summary : ""),
    htmlBody: html,
    body: lines.map((l) => l[0] + ": " + l[1]).join("\n") + "\n\n" + sheetLink,
    name: "Baytouna leads",
    replyTo: lead.email || NOTIFY_EMAIL,
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor: creates the "Leads" sheet, asks for permissions and sends a test email. */
function setup() {
  getSheet();
  MailApp.sendEmail(NOTIFY_EMAIL, "Baytouna lead inbox is connected", "New leads from baytouna.ae will be emailed here.");
}
