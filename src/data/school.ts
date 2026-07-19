/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SCHOOL DATA — the only file a future editor should need to touch.
 *
 *  Every name, number, link and address shown anywhere on the website comes
 *  from here. Values marked "supplied by client" must not be changed without
 *  approval from an authorised school representative. Items that are still
 *  unconfirmed are listed in CONTENT_REVIEW.md at the project root.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const school = {
  /** Formal working display name (naming decision pending final school approval — see CONTENT_REVIEW.md). */
  formalName: "St. Thomas English Medium Higher Secondary School",
  /** Compact mark used where space is limited (mobile header, etc.). */
  abbreviation: "STEMS",
  /** Secondary / search phrase. */
  shortName: "St. Thomas School, Surat",
  city: "Surat",

  /** Display phone number, exactly as supplied by the client. */
  phoneDisplay: "74359 75575",
  /** Click-to-call value. */
  phoneHref: "tel:+917435975575",
  /** WhatsApp number in wa.me format: country code + number, digits only, no "+". */
  whatsappNumber: "917435975575",
  /** WhatsApp base URL (append ?text=<encoded message> for a prepared message). */
  whatsappBase: "https://wa.me/917435975575",

  /** Instagram profile URL, exactly as supplied. */
  instagramUrl:
    "https://www.instagram.com/st_thomas_school_surat?igsh=MW5zaDN5cDl2aHZybg==",

  /** Postal address, exactly as supplied by the client. */
  addressDisplay:
    "St. Thomas English Medium Higher Secondary School,Surat, Sai Dwar Society, 6, New City Light Rd, opp. St. Thomas School, Bharthana, Surat, Gujarat 395007",

  /** Universal Google Maps directions link (no API key required). */
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=St.%20Thomas%20English%20Medium%20Higher%20Secondary%20School%2CSurat%2C%20Sai%20Dwar%20Society%2C%206%2C%20New%20City%20Light%20Rd%2C%20opp.%20St.%20Thomas%20School%2C%20Bharthana%2C%20Surat%2C%20Gujarat%20395007",

  academics: {
    medium: "English Medium",
    board: "Gujarat State Education Board (GSEB)",
    boardShort: "GSEB",
    standards: "Standard 1 to Standard 12",
    higherSecondaryStreams: ["Science", "Commerce"] as const,
  },
} as const;

/** Top-level navigation. Order matters. */
export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "Contact", href: "/contact" },
] as const;

/** The four academic stages shown on Home and Academics. Structural facts only. */
export const academicStages = [
  {
    range: "Standard 1–5",
    title: "Primary",
    note: "The foundation years, taught in English medium under the GSEB curriculum.",
  },
  {
    range: "Standard 6–8",
    title: "Upper Primary",
    note: "Continuing the GSEB pathway with a broadening set of subjects.",
  },
  {
    range: "Standard 9–10",
    title: "Secondary",
    note: "Preparation for the GSEB Standard 10 board examination.",
  },
  {
    range: "Standard 11–12",
    title: "Higher Secondary",
    note: "Two streams are offered at this level: Science and Commerce.",
    streams: ["Science", "Commerce"],
  },
] as const;

/** Feature flags a non-technical owner may want toggled later. */
export const features = {
  /** Lazily load the 3D hero on capable devices. The static visual always ships. */
  enable3DHero: true,
  /** Show the floating WhatsApp / Call / Directions dock. */
  enableActionDock: true,
} as const;
