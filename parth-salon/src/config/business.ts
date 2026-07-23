/* ============================================================================
   PARTH SALON — SINGLE SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   This is the ONLY file the owner needs to edit for day-to-day changes.
   Every component, link, metadata tag, and structured-data block reads from
   here. See OWNER-GUIDE.md for step-by-step mobile editing instructions.

   TODO — verification items before the site is considered fully published:
     • Verify the exact Google Maps sharing link  → set `mapsUrl`
     • Verify the spelling of "Avlon Comercial Hub" in `address`
     • Add ONE verified rating + review count + source, then set showRating:true
     • Add the current service list and prices to `services`
     • Confirm public-holiday hours
   ============================================================================ */

export interface OpeningHours {
  opens: string; // 24h "HH:MM"
  closes: string; // 24h "HH:MM"
}

export interface Service {
  name: string;
  description?: string;
  category?: string;
  price?: string; // e.g. "₹250" or "From ₹250" — a note is fine
  duration?: string; // e.g. "30 min"
  featured?: boolean;
  order?: number;
}

export interface GalleryImage {
  /** base path without width/extension, e.g. "/images/parth-salon-interior" */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const business = {
  name: "Parth Salon",
  shortName: "Parth",
  category: "Salon",
  establishedYear: 2003,

  // --- Contact -------------------------------------------------------------
  phoneDisplay: "+91 98983 78275",
  phoneE164: "+919898378275",
  phoneInternational: "919898378275", // WhatsApp digits: no "+", no leading 0
  telephoneUrl: "tel:+919898378275",

  // General WhatsApp enquiry (used by header/hero/floating actions)
  whatsappUrl:
    "https://wa.me/919898378275?text=Hello%20Parth%20Salon%2C%20I%20would%20like%20to%20book%20an%20appointment.%20Please%20share%20your%20available%20services%2C%20prices%2C%20and%20time%20slots.",

  // --- Location ------------------------------------------------------------
  // TODO: verify the spelling of "Avlon Comercial Hub".
  address:
    "Parth Salon, Avlon Comercial Hub, 144/145, opp. Ankur School, Aamba Talavadi, Priya Park Society, Katargam, Surat, Gujarat 395004",
  // Address broken into display lines (keeps the location card tidy).
  addressLines: [
    "Parth Salon",
    "Avlon Comercial Hub, 144/145",
    "Opp. Ankur School, Aamba Talavadi",
    "Priya Park Society, Katargam",
    "Surat, Gujarat 395004",
  ],
  // TODO: replace with the exact Google Maps sharing link when confirmed.
  // While null, Directions uses an encoded address search (no API key needed).
  mapsUrl: null as string | null,
  timezone: "Asia/Kolkata",

  // --- Weekly hours (24h, in the timezone above) ---------------------------
  openingHours: {
    monday: { opens: "09:30", closes: "21:30" },
    tuesday: { opens: "09:30", closes: "22:30" },
    wednesday: { opens: "09:30", closes: "22:30" },
    thursday: { opens: "09:30", closes: "22:30" },
    friday: { opens: "09:30", closes: "22:30" },
    saturday: { opens: "09:30", closes: "22:30" },
    sunday: { opens: "09:30", closes: "22:30" },
  } as Record<string, OpeningHours>,

  holidayHoursNotice:
    "Hours may vary on public holidays. Call or message the salon to confirm.",

  // --- Rating (hidden until verified) --------------------------------------
  // Do NOT enable showRating until you have ONE exact rating, ONE exact review
  // count, and a documented source. A range (e.g. 4.5–4.6) must never show.
  rating: null as number | null,
  reviewCount: null as number | null,
  ratingSource: null as string | null,
  showRating: false,

  // --- Services (empty until confirmed) ------------------------------------
  // Leave empty to show the "ask on WhatsApp" prompt. Add confirmed services
  // and the full pricing layout renders automatically.
  services: [] as Service[],

  // --- Social links (none supplied) ----------------------------------------
  socialLinks: {} as Record<string, string>,

  // --- Visuals -------------------------------------------------------------
  visuals: {
    interiorImage: "/images/parth-salon-interior",
    // Confirmed by the owner as a genuine photograph of Parth Salon.
    interiorImageAuthenticityConfirmed: true,
    interiorImageWidth: 1526,
    interiorImageHeight: 1031,
  },

  // Gallery renders only when this array has entries. The confirmed interior
  // photograph is included as a genuine gallery image.
  galleryImages: [
    {
      src: "/images/parth-salon-interior",
      alt: "Interior of Parth Salon: forest-green leather styling chairs beneath arched mirrors in a softly-lit grey plaster room.",
      width: 1526,
      height: 1031,
    },
  ] as GalleryImage[],
} as const;

export type Business = typeof business;
