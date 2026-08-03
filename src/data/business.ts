/**
 * Single source of truth for all Mahesh Pav Bhaji business facts.
 *
 * IMPORTANT: `rating`, `reviewCount`, `fiveStarReviews`, `openingHours`, and the
 * menu `categories` counts are DYNAMIC and change over time. They were last
 * verified on `lastVerified` below. Re-check them periodically and update this
 * file — components read from here so a single edit updates the whole site.
 *
 * Do NOT duplicate these changing facts inside components. Do NOT invent prices,
 * dishes, offers, testimonials, awards, or delivery promises here.
 */

export const business = {
  name: "Mahesh Pav Bhaji",
  type: "Vegetarian restaurant",
  // Neutral, factual, and true of the whole business. There is deliberately no
  // universal address, telephone, WhatsApp link or Maps URL in this file: the
  // business has seven outlets, so every one of those is per-outlet data and
  // lives in `src/data/outlets.ts`.
  tagline: "Seven Outlets Across Surat",
  region: "Gujarat",
  city: "Surat",

  instagram: {
    url: "https://www.instagram.com/maheshpavbhaji/",
    handle: "@maheshpavbhaji",
  },

  hours: {
    // Human-readable; the whole week shares one schedule.
    days: "Monday–Sunday",
    display: "10:00 AM–12:00 Midnight",
    // 24h form for structured data (opens 10:00, closes 00:00 next day).
    opens: "10:00",
    closes: "00:00",
    /**
     * Which outlet these hours were verified for. Hours were only ever
     * confirmed for one listing, so they are not claimed for all seven — see
     * `hoursNote`. Do NOT invent per-outlet hours.
     */
    verifiedForOutletId: "katargam",
    note: "Hours may vary by outlet — please check with the outlet you choose.",
  },

  // DYNAMIC — verify periodically.
  rating: 4.6,
  reviewCount: 1953,
  fiveStarReviews: 1662,

  /**
   * The Google listing these rating figures came from. They were verified for
   * a single outlet's listing, so they must be attributed to it rather than
   * presented as a seven-outlet average.
   */
  reviews: {
    verifiedForOutletId: "katargam",
    note: "Google rating figures are from the Katargam (Aamba Talavadi) outlet listing and may not reflect every outlet.",
  },

  // Approx. total across the delivery menu; verify periodically.
  approxMenuVariations: 160,

  // ISO date these dynamic figures were last confirmed.
  lastVerified: "2026-07-23",
  lastVerifiedDisplay: "23 July 2026",

  cuisines: [
    "Indian Street Food",
    "South Indian",
    "Indo-Chinese",
    "Fast Food",
  ],
} as const;

/**
 * Menu categories with the count of dishes/variations in each.
 * Counts are DYNAMIC (see `lastVerified`). This is deliberately a flat,
 * extensible list: when a full verified item list is supplied later, each
 * category can gain an `items` array without redesigning the UI.
 */
export type MenuCategory = {
  name: string;
  count: number;
  /** Stable slug — joins this category to individual dishes in `menu.ts`. */
  slug: string;
  /** Optional verified items — safe to populate later. */
  items?: string[];
};

/**
 * `count` is the approximate total on the delivery menu (dynamic — see
 * `lastVerified`). The number of individually-named dishes in `menu.ts` may be
 * smaller (notably South Indian), which is surfaced honestly in the UI rather
 * than padded with invented names.
 */
export const menuCategories: MenuCategory[] = [
  { name: "MPB Special Combos", count: 5, slug: "mpb-special-combos" },
  { name: "Pav Bhaji", count: 21, slug: "pav-bhaji" },
  { name: "Rice", count: 9, slug: "rice" },
  { name: "Delightful Combos", count: 7, slug: "delightful-combos" },
  { name: "South Indian", count: 46, slug: "south-indian" },
  { name: "Chinese", count: 13, slug: "chinese" },
  { name: "Fried Rice and Noodles", count: 16, slug: "fried-rice-and-noodles" },
  { name: "Soups", count: 6, slug: "soups" },
  { name: "Pizza", count: 5, slug: "pizza" },
  { name: "Sandwiches", count: 10, slug: "sandwiches" },
  { name: "Accompaniments", count: 5, slug: "accompaniments" },
  { name: "Snacks and Chaats", count: 10, slug: "snacks-and-chaats" },
  { name: "Spring Potatoes", count: 5, slug: "spring-potatoes" },
  { name: "Cold Drinks", count: 2, slug: "cold-drinks" },
];

/**
 * Curated highlight groups for the "Signature menu highlights" section.
 * Descriptions use ONLY the verified menu range — no invented dishes or prices.
 *
 * `slugs` / `keywords` are what make a highlight *clickable*: selecting one in
 * the 3D ring filters the menu explorer down to exactly the dishes it describes.
 * They are pure pointers into existing verified data — a highlight can never
 * surface a dish that isn't already named in `menu.ts`.
 */
export type MenuHighlight = {
  title: string;
  description: string;
  /** Category slugs (from `menuCategories`) this group draws its dishes from. */
  slugs: string[];
  /**
   * Optional narrowing *within* those categories, matched case-insensitively
   * against dish names. Used where two highlight groups describe different
   * slices of the same category (e.g. classic vs. Jain/paneer pav bhaji).
   */
  keywords?: string[];
};

export const menuHighlights: MenuHighlight[] = [
  {
    title: "Classic Pav Bhaji",
    description:
      "Regular, cheese, green, red, yellow, khada and fry bhaji variations.",
    slugs: ["pav-bhaji"],
  },
  {
    title: "Jain & Paneer Bhaji",
    description: "Jain pav bhaji and paneer bhaji for every preference.",
    slugs: ["pav-bhaji"],
    keywords: ["jain", "paneer"],
  },
  {
    title: "South Indian Dosa",
    description:
      "Sada, masala, Mysore, nylon, palak, Chinese, Manchurian and Jini-roll dosa.",
    slugs: ["south-indian"],
  },
  {
    title: "Indo-Chinese",
    description:
      "Chinese bhel, Manchurian, paneer chilli, paneer 65 and more.",
    slugs: ["chinese"],
  },
  {
    title: "Rice & Noodles",
    description:
      "Tawa, Kashmiri and jeera rice with Hakka, Schezwan and Singapuri noodles.",
    slugs: ["rice", "fried-rice-and-noodles"],
  },
  {
    title: "Pizza & Sandwiches",
    description: "Vegetarian pizzas and a range of toasted sandwiches.",
    slugs: ["pizza", "sandwiches"],
  },
  {
    title: "Chaats & Snacks",
    description: "Street-style chaats, snacks and spiral spring potatoes.",
    slugs: ["snacks-and-chaats", "spring-potatoes"],
  },
  {
    title: "Combos",
    description: "MPB Special Combos and Delightful Combos to mix and match.",
    slugs: ["mpb-special-combos", "delightful-combos"],
  },
];

/** Factual, restrained reasons to visit — no unsupported guarantees. */
export const whyVisit: string[] = [
  "Extensive vegetarian menu",
  "Pav bhaji, South Indian and Indo-Chinese choices",
  "Open seven days a week",
  "Lunch through late-night hours",
  "Dine-in, takeaway and delivery inquiries",
  "Seven outlets across Surat",
  "Strong Google review volume",
];

/** Primary navigation. Gallery is intentionally omitted (no approved photos). */
export const navLinks: { label: string; href: string }[] = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#why-visit" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#contact" },
];
