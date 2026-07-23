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
  tagline: "Sunday Hub · Katargam · Surat",

  address: {
    full: "Shops 2, 3, 4 and 5, Sunday Hub, Char Rasta, opposite Ankur Vidhyalaya, Aamba Talavadi, Katargam, Surat, Gujarat 395004",
    locality: "Katargam",
    region: "Gujarat",
    city: "Surat",
    postalCode: "395004",
  },

  // E.164 for tel: links; display form for on-screen presentation.
  telephone: "+917990632870",
  displayTelephone: "+91 79906 32870",

  // WhatsApp business number (no "+"), used to compose wa.me links.
  whatsappNumber: "917990632870",

  whatsapp: {
    primary:
      "https://wa.me/917990632870?text=Hi%20Mahesh%20Pav%20Bhaji%2C%20I%20found%20your%20website%20and%20would%20like%20to%20know%20more%20about%20your%20menu%2C%20table%20availability%2C%20or%20placing%20an%20order.",
    menu: "https://wa.me/917990632870?text=Hi%20Mahesh%20Pav%20Bhaji%2C%20I%20would%20like%20to%20see%20the%20current%20menu%20and%20prices.",
    order:
      "https://wa.me/917990632870?text=Hi%20Mahesh%20Pav%20Bhaji%2C%20I%20would%20like%20to%20place%20an%20order.%20Please%20share%20the%20current%20menu%20and%20availability.",
    table:
      "https://wa.me/917990632870?text=Hi%20Mahesh%20Pav%20Bhaji%2C%20I%20would%20like%20to%20check%20table%20availability.",
  },

  googleMaps:
    "https://www.google.com/maps/search/?api=1&query=Mahesh%20Pav%20Bhaji%20Sunday%20Hub%20Katargam%20Surat",

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
  },

  // DYNAMIC — verify periodically.
  rating: 4.6,
  reviewCount: 1953,
  fiveStarReviews: 1662,

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
  /** Optional verified items — safe to populate later. */
  items?: string[];
};

export const menuCategories: MenuCategory[] = [
  { name: "MPB Special Combos", count: 5 },
  { name: "Pav Bhaji", count: 21 },
  { name: "Rice", count: 9 },
  { name: "Delightful Combos", count: 7 },
  { name: "South Indian", count: 46 },
  { name: "Chinese", count: 13 },
  { name: "Fried Rice and Noodles", count: 16 },
  { name: "Soups", count: 6 },
  { name: "Pizza", count: 5 },
  { name: "Sandwiches", count: 10 },
  { name: "Accompaniments", count: 5 },
  { name: "Snacks and Chaats", count: 10 },
  { name: "Spring Potatoes", count: 5 },
  { name: "Cold Drinks", count: 2 },
];

/**
 * Curated highlight groups for the "Signature menu highlights" section.
 * Descriptions use ONLY the verified menu range — no invented dishes or prices.
 */
export type MenuHighlight = {
  title: string;
  description: string;
};

export const menuHighlights: MenuHighlight[] = [
  {
    title: "Classic Pav Bhaji",
    description:
      "Regular, cheese, green, red, yellow, khada and fry bhaji variations.",
  },
  {
    title: "Jain & Paneer Bhaji",
    description: "Jain pav bhaji and paneer bhaji for every preference.",
  },
  {
    title: "South Indian Dosa",
    description:
      "Sada, masala, Mysore, nylon, palak, Chinese, Manchurian and Jini-roll dosa.",
  },
  {
    title: "Indo-Chinese",
    description:
      "Chinese bhel, Manchurian, paneer chilli, paneer 65 and more.",
  },
  {
    title: "Rice & Noodles",
    description:
      "Tawa, Kashmiri and jeera rice with Hakka, Schezwan and Singapuri noodles.",
  },
  {
    title: "Pizza & Sandwiches",
    description: "Vegetarian pizzas and a range of toasted sandwiches.",
  },
  {
    title: "Chaats & Snacks",
    description: "Street-style chaats, snacks and spiral spring potatoes.",
  },
  {
    title: "Combos",
    description: "MPB Special Combos and Delightful Combos to mix and match.",
  },
];

/** Factual, restrained reasons to visit — no unsupported guarantees. */
export const whyVisit: string[] = [
  "Extensive vegetarian menu",
  "Pav bhaji, South Indian and Indo-Chinese choices",
  "Open seven days a week",
  "Lunch through late-night hours",
  "Dine-in, takeaway and delivery inquiries",
  "Convenient Katargam location",
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
