/**
 * Single source of truth for every business fact on the site.
 *
 * Two rules govern this file:
 *
 * 1. Nothing here may be invented. No owner, founding year, awards, FSSAI
 *    number, email, social profile, payment method, seating, parking,
 *    accessibility, Jain availability, delivery or catering claim exists,
 *    because none has been verified.
 *
 * 2. `address`, `geo` and `placeId` are consumed by exactly two places — the
 *    final Location & Contact section and the non-visible JSON-LD. They must
 *    never be imported by a component that renders earlier in the page.
 */

/**
 * Production domain, not yet supplied. Everything URL-shaped (canonical,
 * sitemap, robots, Open Graph, `metadataBase`, JSON-LD `url`) reads from this
 * one constant, so pointing the site at its real domain is a one-line change.
 * Until then this is a placeholder and is reported as a launch blocker.
 */
export const siteUrl = "https://example.invalid";

export const business = {
  name: "Surat Khaman House",
  alternateName: "સુરત ખમણ હાઉસ",
  /** Revealed only in the final Location & Contact section. */
  outletDisplayName: "Surat Khaman House — Adajan Patiya",
  category: "Vegetarian Surti breakfast, fast food and farsan outlet",

  telephone: {
    display: "+91 99246 66000",
    uri: "tel:+919924666000",
  },

  whatsapp: {
    number: "919924666000",
    /**
     * The approved message, stored decoded. `lib/links.ts` is the only place
     * allowed to encode it, so the wire format cannot drift between call
     * sites.
     */
    message:
      "Hello Surat Khaman House, I would like to inquire about today's menu, prices and availability.",
  },

  rating: {
    value: "4.4",
    /** Rendered verbatim wherever the rating is shown. Never a review count. */
    line: "4.4 Google rating — last checked 3 August 2026",
  },

  /**
   * Public listings disagree on precise hours, so the site publishes this
   * sentence and nothing more — no exact times, no "open now", no computed
   * open/closed state, and no `openingHoursSpecification` in structured data.
   */
  hoursFallback: "Open daily—call to confirm today's hours.",

  /**
   * Must be visible wherever prices are. The board snapshot is not confirmed
   * current, so these are never labelled today's/current/latest/guaranteed.
   */
  priceDisclaimer:
    "Reference prices from the latest available menu-board snapshot. Prices and availability may change—please confirm with the outlet.",

  /** Final section and JSON-LD only. */
  location: {
    streetAddress:
      "Shop No. 1/3, Kalpana Society–2, Adajan Road, opposite Sevadarshan Hospital, near Ratnaraj Apartment, Krishna Nagar Society, Choksi Wadi",
    locality: "Adajan, Surat",
    region: "Gujarat",
    postalCode: "395009",
    country: "IN",
    full: "Shop No. 1/3, Kalpana Society–2, Adajan Road, opposite Sevadarshan Hospital, near Ratnaraj Apartment, Krishna Nagar Society, Choksi Wadi, Adajan, Surat, Gujarat 395009",
    latitude: 21.19722,
    longitude: 72.8054,
    placeId: "ChIJtYD54X9O4DsRir0umBF6TOQ",
  },
} as const;

/**
 * What the site is allowed to claim. Each flag that is false corresponds to
 * something genuinely unverified — flipping one on requires new evidence, not
 * just a code change.
 */
export const featureFlags = {
  BUSINESS_HOURS_VERIFIED: false,
  MENU_PRICES_VERIFIED: false,
  SHOW_REFERENCE_PRICES_WITH_DISCLAIMER: true,
  APPROVED_PHOTOS_AVAILABLE: false,
  TESTIMONIAL_PERMISSION_AVAILABLE: false,
  ENABLE_MAP_EMBED: false,
  ENABLE_ANALYTICS: false,
} as const;

/**
 * Aggregated themes drawn from public review sentiment. These are labels, not
 * quotations, and are never attributed to a named person.
 */
export const reviewThemes = [
  "Locho",
  "Vagharela khaman",
  "Sev khamani",
  "Cheese idada",
  "Samosas",
  "Breakfast",
  "Affordability",
] as const;

/** Header and mobile-sheet navigation. Deliberately has no location entry. */
export const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#reviews", label: "Reviews" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
] as const;
