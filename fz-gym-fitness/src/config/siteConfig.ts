/**
 * ============================================================================
 *  F Z GYM & FITNESS — CENTRAL SITE CONFIGURATION
 * ============================================================================
 *  This is the single source of truth for all editable business content.
 *  Change values here and they update everywhere on the site.
 *
 *  ⚠️  UNCONFIRMED PLACEHOLDERS — REPLACE BEFORE LAUNCH:
 *      - Every value tagged `PLACEHOLDER` below is an INDICATIVE SAMPLE, not a
 *        confirmed figure from the business. Replace membership `price` values
 *        and the `hours` with the gym's real, confirmed numbers.
 *      - To hide a real price you don't have yet, set its `price` to null and
 *        the card will automatically show "Contact for latest price".
 *      - Unconfirmed opening hours are intentionally NOT included in the SEO
 *        structured data (see lib/structuredData.ts). Only confirmed facts are.
 * ============================================================================
 */

export const siteConfig = {
  // ── Core business identity (CONFIRMED) ──────────────────────────────────
  name: "F Z Gym & Fitness",
  shortName: "FZ Gym",
  category: "Gym and Fitness Centre",
  tagline: "Build Strength. Transform Your Life.",
  description:
    "A welcoming, results-focused fitness centre in Rustampura, Surat. Strength training, cardio, and personal coaching in a modern, motivating environment.",

  // ── Ratings (CONFIRMED from business listing) ───────────────────────────
  rating: 4.9,
  reviewCount: 505,

  // ── Contact (CONFIRMED) ─────────────────────────────────────────────────
  phoneDisplay: "+91 98799 86395",
  phoneTel: "+919879986395", // used in tel: links
  whatsappNumber: "919879986395", // used in wa.me links
  address: {
    line1: "1st Floor, Motto Mohallo, Gonawala House",
    line2: "Rustampura, Surat",
    city: "Surat",
    region: "Gujarat",
    country: "IN",
  },

  // ── External links (CONFIRMED) ──────────────────────────────────────────
  links: {
    googleMaps: "https://maps.app.goo.gl/NEcC65QHUfYHuXRY8?g_st=ac",
    instagram: "https://www.instagram.com/fz__fitness?igsh=bWVrY3loM2lrcWZr",
  },

  // ── WhatsApp prefilled inquiry (does NOT auto-send) ─────────────────────
  // General "Join Now" inquiry from the spec.
  whatsappGeneralText:
    "Hi F Z Gym & Fitness, I'm interested in joining. Please share details about your membership plans, prices, premium options, facilities, and joining process.",

  // ── Opening hours ───────────────────────────────────────────────────────
  // ⚠️ PLACEHOLDER: indicative sample hours. Replace with confirmed hours,
  //    or set `showHours: false` to hide the block entirely.
  showHours: true,
  hoursNote: "Indicative timings — please confirm current hours on WhatsApp.",
  hours: [
    { days: "Monday – Saturday", time: "5:00 AM – 11:00 PM" }, // PLACEHOLDER
    { days: "Sunday", time: "6:00 AM – 10:00 PM" }, // PLACEHOLDER
  ],

  // ── SEO ─────────────────────────────────────────────────────────────────
  seo: {
    title: "F Z Gym & Fitness — Gym in Rustampura, Surat",
    description:
      "F Z Gym & Fitness in Rustampura, Surat. Strength training, cardio, and personal coaching. Rated 4.9★ by 505 members. Call +91 98799 86395 or message on WhatsApp to join.",
    keywords: [
      "gym in Rustampura",
      "gym in Surat",
      "fitness centre Surat",
      "personal training Surat",
      "strength training Rustampura",
      "F Z Gym & Fitness",
    ],
    // Set this to your deployed domain before launch (used for OG + canonical).
    siteUrl: "https://fzgymfitness.example.com",
  },
} as const;

// ── Facilities & benefits (edit / remove freely) ──────────────────────────
// These describe the KIND of training on offer. They are presented as an
// invitation, not as verified claims about specific equipment or staff.
export type Facility = {
  title: string;
  description: string;
  icon: "dumbbell" | "heart" | "user-check" | "layout" | "calendar" | "users";
};

export const facilities: Facility[] = [
  {
    title: "Strength Training",
    description:
      "Free weights and resistance work to build real, lasting strength at any level.",
    icon: "dumbbell",
  },
  {
    title: "Cardio Training",
    description:
      "Get your heart rate up and boost endurance with focused cardio sessions.",
    icon: "heart",
  },
  {
    title: "Personal Coaching",
    description:
      "One-on-one guidance to help you train smart, stay safe, and reach your goals.",
    icon: "user-check",
  },
  {
    title: "Modern Environment",
    description:
      "A clean, motivating space designed to keep you focused and moving.",
    icon: "layout",
  },
  {
    title: "Flexible Plans",
    description:
      "Membership options that fit your routine, your goals, and your budget.",
    icon: "calendar",
  },
  {
    title: "Supportive Community",
    description:
      "Train alongside people who push you forward and celebrate your progress.",
    icon: "users",
  },
];

// ── Membership plans ──────────────────────────────────────────────────────
// ⚠️ PLACEHOLDER PRICES: the `price` values below are INDICATIVE SAMPLES only.
//    Replace each with the gym's confirmed rate, or set `price: null` to show
//    "Contact for latest price" instead of a number.
//    `mostPopular: true` is set on the 6-Month plan per owner confirmation.
export type Plan = {
  id: string;
  name: string;
  price: number | null; // in INR. null => "Contact for latest price"
  period: string;
  benefits: string[];
  mostPopular?: boolean;
};

export const plans: Plan[] = [
  {
    id: "day-pass",
    name: "Day Pass",
    price: 200, // PLACEHOLDER
    period: "per day",
    benefits: ["Full-day gym access", "Try before you commit", "No lock-in"],
  },
  {
    id: "monthly",
    name: "Monthly",
    price: 1200, // PLACEHOLDER
    period: "per month",
    benefits: [
      "Full gym access",
      "Strength & cardio zones",
      "Community support",
    ],
  },
  {
    id: "quarterly",
    name: "3-Month",
    price: 3000, // PLACEHOLDER
    period: "for 3 months",
    benefits: [
      "Everything in Monthly",
      "Better value per month",
      "Consistency-friendly",
    ],
  },
  {
    id: "half-yearly",
    name: "6-Month",
    price: 5000, // PLACEHOLDER
    period: "for 6 months",
    benefits: [
      "Everything in 3-Month",
      "Great value for regulars",
      "Stay accountable long-term",
    ],
    mostPopular: true, // confirmed by owner
  },
  {
    id: "annual",
    name: "Annual",
    price: 8500, // PLACEHOLDER
    period: "per year",
    benefits: [
      "Everything in 6-Month",
      "Best long-term value",
      "Commit to real transformation",
    ],
  },
  {
    id: "personal-training",
    name: "Personal Training",
    price: 4000, // PLACEHOLDER
    period: "per month",
    benefits: [
      "One-on-one coaching",
      "Personalised programme",
      "Form & technique guidance",
    ],
  },
];

// Global note shown near pricing so visitors are never misled by sample rates.
export const pricingNote =
  "Prices shown are indicative. Please confirm current rates and offers on WhatsApp.";

// ── Gallery placeholders ──────────────────────────────────────────────────
// These are ABSTRACT, clearly-replaceable visuals — NOT photos of the actual
// gym, its trainers, or its members. Replace `src` with authentic images when
// available and update `alt` accordingly.
export type GalleryItem = {
  id: string;
  label: string;
  alt: string;
  gradient: string; // tailwind gradient classes for the placeholder
};

export const gallery: GalleryItem[] = [
  {
    id: "g1",
    label: "Strength Zone",
    alt: "Placeholder visual representing a strength training area",
    gradient: "from-lime/30 via-surface to-base",
  },
  {
    id: "g2",
    label: "Cardio Floor",
    alt: "Placeholder visual representing a cardio training area",
    gradient: "from-cyan/30 via-surface to-base",
  },
  {
    id: "g3",
    label: "Free Weights",
    alt: "Placeholder visual representing a free-weights area",
    gradient: "from-redx/25 via-surface to-base",
  },
  {
    id: "g4",
    label: "Personal Coaching",
    alt: "Placeholder visual representing a personal coaching session",
    gradient: "from-lime/20 via-cyan/10 to-base",
  },
  {
    id: "g5",
    label: "Functional Area",
    alt: "Placeholder visual representing a functional training area",
    gradient: "from-cyan/20 via-lime/10 to-base",
  },
  {
    id: "g6",
    label: "Community",
    alt: "Placeholder visual representing the gym community",
    gradient: "from-redx/20 via-cyan/10 to-base",
  },
];

// ── Navigation links ──────────────────────────────────────────────────────
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Facilities", href: "#facilities" },
  { label: "Membership Plans", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];
