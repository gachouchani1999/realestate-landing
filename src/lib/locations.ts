// Location helpers for the lead flow. Client-side only data; nothing here calls an external service.
import type { Emirate } from "@/lib/leads";

/** Popular communities per emirate, offered as suggestions (free text is always allowed). */
export const COMMUNITIES: Record<Emirate, string[]> = {
  dubai: [
    "Dubai Marina",
    "Downtown Dubai",
    "Business Bay",
    "Jumeirah Village Circle (JVC)",
    "Palm Jumeirah",
    "Dubai Hills Estate",
    "Jumeirah Lake Towers (JLT)",
    "Jumeirah Beach Residence (JBR)",
    "Dubai Creek Harbour",
    "Emaar Beachfront",
    "MBR City / Meydan",
    "Sobha Hartland",
    "Arjan",
    "Al Furjan",
    "Damac Hills",
    "Town Square",
    "Dubai South",
    "Dubai Silicon Oasis",
    "Motor City",
    "City Walk",
  ],
  "abu-dhabi": [
    "Saadiyat Island",
    "Yas Island",
    "Al Reem Island",
    "Al Raha Beach",
    "Al Maryah Island",
    "Masdar City",
    "Al Reef",
  ],
  sharjah: ["Aljada", "Al Zahia", "Maryam Island", "Al Mamsha", "Sharjah Waterfront City"],
  "ras-al-khaimah": ["Al Marjan Island", "Mina Al Arab", "Al Hamra Village"],
  ajman: ["Al Zorah", "Emirates City", "Ajman Downtown"],
  other: [],
};

export const COUNTRIES = [
  "United Kingdom", "India", "Saudi Arabia", "United States", "Germany", "France", "Russia", "China",
  "Pakistan", "Canada", "Italy", "Lebanon", "Egypt", "Netherlands", "Switzerland", "Australia",
  "Kuwait", "Qatar", "Bahrain", "Oman", "Nigeria", "South Africa", "Kazakhstan", "Singapore",
  "Hong Kong", "Ireland", "Spain", "Belgium", "Sweden", "Turkey", "Jordan", "United Arab Emirates",
];

// Time zone → country and dialling code, for the most common visitor locations.
const TIME_ZONES: Record<string, [country: string, dial: string]> = {
  "Europe/London": ["United Kingdom", "+44"],
  "Asia/Kolkata": ["India", "+91"],
  "Asia/Calcutta": ["India", "+91"],
  "Asia/Riyadh": ["Saudi Arabia", "+966"],
  "America/New_York": ["United States", "+1"],
  "America/Chicago": ["United States", "+1"],
  "America/Denver": ["United States", "+1"],
  "America/Los_Angeles": ["United States", "+1"],
  "America/Phoenix": ["United States", "+1"],
  "America/Toronto": ["Canada", "+1"],
  "America/Vancouver": ["Canada", "+1"],
  "Europe/Berlin": ["Germany", "+49"],
  "Europe/Paris": ["France", "+33"],
  "Europe/Moscow": ["Russia", "+7"],
  "Asia/Shanghai": ["China", "+86"],
  "Asia/Karachi": ["Pakistan", "+92"],
  "Europe/Rome": ["Italy", "+39"],
  "Asia/Beirut": ["Lebanon", "+961"],
  "Africa/Cairo": ["Egypt", "+20"],
  "Europe/Amsterdam": ["Netherlands", "+31"],
  "Europe/Zurich": ["Switzerland", "+41"],
  "Australia/Sydney": ["Australia", "+61"],
  "Australia/Melbourne": ["Australia", "+61"],
  "Australia/Perth": ["Australia", "+61"],
  "Asia/Kuwait": ["Kuwait", "+965"],
  "Asia/Qatar": ["Qatar", "+974"],
  "Asia/Bahrain": ["Bahrain", "+973"],
  "Asia/Muscat": ["Oman", "+968"],
  "Africa/Lagos": ["Nigeria", "+234"],
  "Africa/Johannesburg": ["South Africa", "+27"],
  "Asia/Almaty": ["Kazakhstan", "+7"],
  "Asia/Singapore": ["Singapore", "+65"],
  "Asia/Hong_Kong": ["Hong Kong", "+852"],
  "Europe/Dublin": ["Ireland", "+353"],
  "Europe/Madrid": ["Spain", "+34"],
  "Europe/Brussels": ["Belgium", "+32"],
  "Europe/Stockholm": ["Sweden", "+46"],
  "Europe/Istanbul": ["Turkey", "+90"],
  "Asia/Amman": ["Jordan", "+962"],
  "Asia/Dubai": ["United Arab Emirates", "+971"],
};

/** Best guess at the visitor's country from their browser time zone. Never leaves the device. */
export function guessCountry(): { country: string; dial: string } | null {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = TIME_ZONES[zone];
    return match ? { country: match[0], dial: match[1] } : null;
  } catch {
    return null;
  }
}
