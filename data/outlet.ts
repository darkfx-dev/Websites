/**
 * Single source of truth for the Surat Khaman House — Adajan Patiya outlet.
 *
 * Every fact rendered anywhere on the site must come from this object.
 * No component may contain a second literal phone number, address, rating,
 * Place ID or map link.
 *
 * Nothing may be added here that is not owner-confirmed or directly
 * transcribed from the approved source-of-truth brief.
 */

/**
 * Conservative feature flags. Do not flip one without evidence and a
 * last-verified date recorded alongside it.
 */
export const featureFlags = {
  /** Online listings conflict (6:00–19:00, 6:30–18:00, 6:30–20:00). Unverified. */
  BUSINESS_HOURS_VERIFIED: false,
  /**
   * Board prices are an online-reference snapshot, not owner-confirmed.
   * While false the menu still shows the transcribed figures — they are
   * user-supplied, not invented — but always beside `PRICE_DISCLAIMER`.
   * Flip only once the owner confirms each figure against the current board.
   */
  MENU_PRICES_VERIFIED: false,
  /**
   * The public number has not been independently confirmed to accept
   * WhatsApp, so no WhatsApp action is published anywhere on the site.
   */
  WHATSAPP_VERIFIED: false,
  /** No rights-cleared photography of this outlet has been verified. */
  APPROVED_PHOTOS_AVAILABLE: false,
  /** No exact, attributable, reuse-approved customer quotes are available. */
  TESTIMONIAL_PERMISSION_AVAILABLE: false,
  /** Third-party map iframe is off: it costs performance and adds tracking. */
  ENABLE_MAP_EMBED: false,
  /** No analytics vendor is authorised for this site. */
  ENABLE_ANALYTICS: false,
} as const;

export type FeatureFlags = typeof featureFlags;

/**
 * An image may only be rendered when it carries a complete rights record.
 * Rights-administration fields are never exposed in public markup.
 */
export type ApprovedAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  focalPoint?: `${number}% ${number}%`;
  subject: "storefront" | "interior" | "food" | "menu-board" | "team";
  outlet: "adajan-patiya";
  rightsOwner: string;
  permissionReference: string;
  approvedForWebsite: true;
  lastVerified: string;
};

/**
 * Empty by design. Customer uploads on Google, Justdial, TripTap and
 * Restaurant Guru are reference material only and must not be downloaded
 * into this project. Add entries here only for owner-supplied originals
 * with written reuse permission.
 */
export const approvedAssets: readonly ApprovedAsset[] = [] as const;

export const outlet = {
  /** Public listing name, exactly as it appears on the listing. */
  name: "Surat Khaman House",
  /** Website display name, disambiguating this outlet from same-name businesses. */
  displayName: "Surat Khaman House — Adajan Patiya",
  gujaratiName: "સુરત ખમણ હાઉસ",
  locationQualifier: "Adajan Patiya outlet",
  businessType: "Vegetarian Surti breakfast and farsan outlet",

  address: {
    /** Verbatim listing address. Used for structured data and copy-to-clipboard. */
    raw: "SHOP NO.1/3, Surat Khaman House, KALPANA SOC.-2, Adajan Rd, opp. SEVADARSHAN HOSPITAL, near Ratnaraj Apartment, Krishna Nagar Society, Choksi Wadi, Adajan, Surat, Gujarat 395009",
    /** Human-readable rendering of the same address. Meaning is unchanged. */
    display:
      "Shop No. 1/3, Kalpana Society–2, Adajan Road, opposite Sevadarshan Hospital, near Ratnaraj Apartment, Krishna Nagar Society, Choksi Wadi, Adajan, Surat, Gujarat 395009",
    streetAddress:
      "Shop No. 1/3, Kalpana Society–2, Adajan Road, opposite Sevadarshan Hospital, near Ratnaraj Apartment, Krishna Nagar Society, Choksi Wadi",
    locality: "Adajan, Surat",
    region: "Gujarat",
    postalCode: "395009",
    country: "IN",
    /** Short cue for dense UI. Never replaces the full address. */
    shortCue: "Opposite Sevadarshan Hospital, Adajan Road",
  },

  contact: {
    /** The public business number. The only number allowed on this site. */
    phoneDisplay: "+91 99246 66000",
    phoneE164: "+919924666000",
    whatsappNumber: "919924666000",
    /** Approved prefilled inquiry message. Do not reword. */
    whatsappMessage:
      "Hello Surat Khaman House, I would like to inquire about today's menu and availability.",
  },

  map: {
    latitude: 21.19722,
    longitude: 72.8054,
    placeId: "ChIJtYD54X9O4DsRir0umBF6TOQ",
    /** Exact approved directions URL, pinned to the Place ID above. */
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Surat%20Khaman%20House%2C%20Adajan%2C%20Surat&query_place_id=ChIJtYD54X9O4DsRir0umBF6TOQ",
  },

  rating: {
    /** Google-derived rating observed during research. */
    value: 4.4,
    best: 5,
    source: "Google",
    lastChecked: "2 August 2026",
    /**
     * Indexed review-count snapshots conflict and change over time, so no
     * review count is stored or displayed anywhere.
     */
    reviewCount: null,
  },

  hours: {
    /** Approved public fallback while listings conflict. */
    fallback: "Open daily — call to confirm today's hours.",
  },

  copy: {
    tagline: "Surti locho, khaman and farsan in Adajan.",
    heroHeadline: "Surti breakfast and farsan, right here in Adajan.",
    /** Phrase inside the headline that receives the drawn underline. */
    heroHeadlineEmphasis: "right here in Adajan",
    heroSupport:
      "Explore vegetarian Surti favourites including locho, khaman, idada, patudi, patra, sev khamani, samosas, pattice and ghee jalebi.",
    about:
      "Surat Khaman House — Adajan Patiya is a vegetarian Surti breakfast and farsan outlet located opposite Sevadarshan Hospital in Adajan, Surat. Its menu brings together familiar local favourites, from locho and khaman to idada, patra, samosas, pattice and jalebi.",
    finalCtaHeading: "Planning a visit?",
    finalCtaSupport: "Ask about today's menu and availability.",
  },

  cta: {
    whatsapp: "Ask on WhatsApp",
    call: "Call the Outlet",
    menu: "View the Menu",
    directions: "Get Directions",
  },

  seo: {
    title: "Surat Khaman House Adajan | Locho, Khaman & Surti Farsan",
    description:
      "Visit Surat Khaman House near Sevadarshan Hospital, Adajan, for vegetarian Surti locho, khaman, idada, samosas, patra and farsan.",
  },
} as const;

export type Outlet = typeof outlet;
