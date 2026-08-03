/**
 * THE ONLY FILE YOU NEED TO EDIT.
 *
 * Every word, number, link and image on the site is read from here. No
 * component hard-codes a business fact.
 *
 * ── Placeholders ─────────────────────────────────────────────────────────
 * Anything wrapped in [square brackets] is unfilled. The site detects them
 * and refuses to present them as real:
 *   - placeholder text renders visibly marked;
 *   - a placeholder WhatsApp number disables the booking buttons and says so,
 *     instead of opening a broken wa.me link;
 *   - empty sections remove themselves rather than rendering empty.
 *
 * Run `npm run check:content` to list what is still outstanding.
 */

export function isPlaceholder(value: string | undefined | null): boolean {
  if (!value) return true;
  const t = value.trim();
  return t.length === 0 || (t.startsWith("[") && t.endsWith("]"));
}

export function real(value: string | undefined | null): string | null {
  return isPlaceholder(value) ? null : (value as string).trim();
}

// ─────────────────────────────────────────────────────────────────────────
// BUSINESS
// ─────────────────────────────────────────────────────────────────────────

export const business = {
  name: "Divyansh Furniture",
  /** Shown under the wordmark and in the footer. */
  tagline: "Furniture made to be lived with",

  /**
   * Supplied by the owner. Only these two figures are stated anywhere on the
   * site — no other number is claimed, because no other number was given.
   */
  rating: "4.9",
  reviewCount: "1,800+",
  /** e.g. "on Google" — leave as a placeholder to omit the platform entirely. */
  reviewSource: "[Review platform, e.g. on Google]",

  /**
   * Digits only, with country code and no +, spaces or dashes.
   * India example: 919876543210
   * Until this is a real number every booking button is disabled and says so.
   */
  whatsappNumber: "[WhatsApp number with country code, digits only]",

  phone: "[Phone number]",
  email: "[Email address]",

  address: {
    line1: "[Street address]",
    line2: "[Area, City]",
    postalCode: "[PIN code]",
    /** Paste the share link from Google Maps. */
    mapsUrl: "[Google Maps link]",
  },

  hours: "[Opening hours, e.g. Mon–Sat, 10am – 8pm]",

  instagram: "[Instagram URL]",
  facebook: "[Facebook URL]",

  /** Your deployed address. Until it is real the site serves noindex. */
  siteUrl: "[https://your-domain.com]",
} as const;

// ─────────────────────────────────────────────────────────────────────────
// NAVIGATION — ids must match the section elements on the page
// ─────────────────────────────────────────────────────────────────────────

export const navLinks = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "packages", label: "Packages" },
  { id: "visit", label: "Visit" },
  { id: "faq", label: "FAQ" },
] as const;

// ─────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────

export const hero = {
  eyebrow: "Bespoke furniture & interiors",
  /** Split across two lines; the second line is set in the accent italic. */
  headlineTop: "Pieces you keep",
  headlineAccent: "for a lifetime",
  subheading:
    "Solid-wood furniture built to order — sofas, beds, wardrobes and dining sets, finished by hand and delivered to your home.",
  primaryCta: "Book a consultation",
  secondaryCta: "See our work",
} as const;

// ─────────────────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────────────────

export const about = {
  eyebrow: "About",
  title: "Built in our workshop, not bought in a box",
  body: [
    "Divyansh Furniture makes furniture to order. You tell us the room, the wood and the budget; we build the piece and deliver it finished.",
    "Everything is made by our own carpenters, so a change to a dimension or a finish is a conversation rather than a catalogue lookup.",
  ],
  /** Each needs a real, verifiable answer before it goes live. */
  facts: [
    { label: "Established", value: "[Year established]" },
    { label: "Workshop", value: "[Workshop location]" },
    { label: "Warranty", value: "[Warranty period]" },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────────────────────

export type Service = { icon: string; title: string; body: string };

export const services: Service[] = [
  {
    icon: "sofa",
    title: "Living room",
    body: "Sofas, coffee tables, TV units and shelving, sized to the wall you actually have.",
  },
  {
    icon: "bed",
    title: "Bedroom",
    body: "Beds with storage, wardrobes and dressers, built around the room's real dimensions.",
  },
  {
    icon: "utensils",
    title: "Dining",
    body: "Dining tables, chairs and crockery units in solid wood, seating four to twelve.",
  },
  {
    icon: "ruler",
    title: "Modular kitchens",
    body: "Full kitchen carcasses, shutters and hardware, measured and installed by our team.",
  },
  {
    icon: "hammer",
    title: "Custom joinery",
    body: "Study tables, pooja units, partitions and anything else that has to fit one exact space.",
  },
  {
    icon: "truck",
    title: "Delivery & installation",
    body: "We deliver and install ourselves, so nothing arrives flat-packed for you to solve.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// GALLERY
//
// `src` accepts any image URL or a file you drop in /public. Leave it as a
// placeholder and the slot renders a drawn illustration instead of an empty
// box — see README for how to swap in photographs.
// ─────────────────────────────────────────────────────────────────────────

export type GalleryItem = { art: string; caption: string; src: string };

export const gallery: GalleryItem[] = [
  { art: "sofa", caption: "Three-seater in teak", src: "[Image URL or /public path]" },
  { art: "bed", caption: "Storage bed, sheesham", src: "[Image URL or /public path]" },
  { art: "table", caption: "Six-seat dining table", src: "[Image URL or /public path]" },
  { art: "wardrobe", caption: "Fitted wardrobe", src: "[Image URL or /public path]" },
  { art: "chair", caption: "Lounge chair, cane back", src: "[Image URL or /public path]" },
  { art: "shelf", caption: "Open shelving unit", src: "[Image URL or /public path]" },
];

// ─────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
//
// Only add reviews you actually received. Inventing one is the fastest way
// to lose the credibility the 4.9 rating earned — and the easiest thing for
// a visitor to check. Empty this array and the section disappears.
// ─────────────────────────────────────────────────────────────────────────

export type Testimonial = { quote: string; name: string; detail: string };

export const testimonials: Testimonial[] = [
  { quote: "[Paste a real review here]", name: "[Reviewer name]", detail: "[What they bought]" },
  { quote: "[Paste a real review here]", name: "[Reviewer name]", detail: "[What they bought]" },
  { quote: "[Paste a real review here]", name: "[Reviewer name]", detail: "[What they bought]" },
];

// ─────────────────────────────────────────────────────────────────────────
// PACKAGES
// ─────────────────────────────────────────────────────────────────────────

export type Package = {
  name: string;
  forWho: string;
  price: string;
  features: string[];
  featured: boolean;
};

export const packages: Package[] = [
  {
    name: "Single piece",
    forWho: "One room, one item",
    price: "[Placeholder price]",
    features: [
      "Design consultation at our showroom",
      "Solid-wood build to your dimensions",
      "Choice of finish and upholstery",
      "Delivery and installation",
    ],
    featured: false,
  },
  {
    name: "Full room",
    forWho: "A complete room, furnished",
    price: "[Placeholder price]",
    features: [
      "Everything in Single piece",
      "Site measurement at your home",
      "Coordinated finishes across the room",
      "Layout drawings before we build",
      "[Placeholder] — timeline not yet confirmed",
    ],
    featured: true,
  },
  {
    name: "Whole home",
    forWho: "Every room, one project",
    price: "[Placeholder price]",
    features: [
      "Everything in Full room",
      "Modular kitchen included",
      "Single point of contact throughout",
      "Staged delivery room by room",
    ],
    featured: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────
// WHY US
// ─────────────────────────────────────────────────────────────────────────

export type Amenity = { title: string; body: string };

export const amenities: Amenity[] = [
  { title: "Solid wood, named", body: "We tell you the species — teak, sheesham, mango — not just \"hardwood\"." },
  { title: "Measured on site", body: "For fitted work we measure your room ourselves before anything is cut." },
  { title: "Fixed quote", body: "The price is agreed before work starts and does not move afterwards." },
  { title: "Our own carpenters", body: "Nothing is subcontracted, so the person who builds it answers for it." },
  { title: "Finish samples", body: "See and hold the finish on the actual wood before you choose it." },
  { title: "After-sales service", body: "Tightening, polishing and repairs handled by the team that built the piece." },
];

// ─────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "How long does an order take?",
    a: "[Placeholder] — typical lead time not yet confirmed. Ask us on WhatsApp and we will give you a date for your specific piece.",
  },
  {
    q: "Can I choose the wood?",
    a: "Yes. We work in teak, sheesham and mango wood, and we will show you samples of each with the finish applied before you decide.",
  },
  {
    q: "Do you deliver outside the city?",
    a: "[Placeholder] — delivery area and charges not yet confirmed.",
  },
  {
    q: "Do you take custom dimensions?",
    a: "That is most of what we do. Send us the measurements of the space and we will build to them.",
  },
  {
    q: "Is there a warranty?",
    a: "[Placeholder] — warranty terms not yet confirmed. They will be written into your quote.",
  },
  {
    q: "How do I start?",
    a: "Message us on WhatsApp with the room and roughly what you need. We will reply with next steps and, if it is a fitted job, arrange a site visit.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// SEO
// ─────────────────────────────────────────────────────────────────────────

export const seo = {
  title: "Divyansh Furniture — bespoke solid-wood furniture",
  description:
    "Made-to-order solid-wood furniture: sofas, beds, wardrobes, dining sets and modular kitchens, built in our own workshop and installed by our team.",
} as const;
