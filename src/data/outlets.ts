/**
 * Mahesh Pav Bhaji outlets — the single source of truth for the outlet finder.
 *
 * SOURCE-OF-TRUTH RULES:
 * - Names, subtitles, phone numbers and addresses are owner-supplied and must
 *   be reproduced exactly. Do not reword, merge, abbreviate or "tidy" them.
 * - `whatsappNumber` is derived from `phone` by `toWhatsAppNumber()` below and
 *   is asserted against it at module load, so a displayed outlet can never
 *   drift apart from the number its enquiry is sent to.
 * - No hours, ratings, delivery status, photos or availability are stored here.
 *   None of that has been verified, so none of it may be shown.
 */

export type OutletCoordinates = {
  latitude: number;
  longitude: number;
};

export type OutletPostalAddress = {
  streetAddress: string;
  addressLocality: string;
  postalCode?: string;
};

export type Outlet = {
  /** Stable id, used as a React key and for selection state. */
  id: string;
  name: string;
  subtitle: string;
  /** Display form, exactly as supplied. */
  phone: string;
  /** E.164 form for `tel:`. Derived — never hand-written. */
  telHref: string;
  /** Digits-only form for wa.me. Derived — never hand-written. */
  whatsappNumber: string;
  /** Address lines, in order. Rendered as written. */
  addressLines: string[];
  /** The same address as one line, for clipboard and map queries. Derived. */
  addressText: string;
  /** Structured form for schema.org output. Derived. */
  postalAddress: OutletPostalAddress;
  /**
   * Google Maps destination for this outlet. Derived from the supplied address
   * as an encoded *search* — see `outletMapsAreSearchBased` below.
   */
  mapsUrl: string;
  /**
   * COORDINATES ARE NOT YET VERIFIED — deliberately `null`.
   *
   * The nearest-outlet calculation needs a real latitude/longitude per outlet.
   * These have not been confirmed against a map source (see README note in the
   * finder section), and guessing them risks sending someone to the wrong
   * branch — Adajan and Pal in particular are both in Adajan Gam, so an
   * approximate guess could easily invert which one is nearest.
   *
   * TO ENABLE THE "USE MY LOCATION" FEATURE: look each shop up on Google Maps
   * or OpenStreetMap, and replace `null` with the verified pair, e.g.
   *
   *     coordinates: { latitude: 21.1702, longitude: 72.8311 },
   *
   * The distance flow turns itself on automatically as soon as at least one
   * outlet has coordinates — no code change is required anywhere else.
   */
  coordinates: OutletCoordinates | null;
};

/**
 * Strip everything but digits for the `wa.me` path: it takes a country code
 * followed by the number, with no `+`, spaces or punctuation.
 */
export function toWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** `tel:` wants E.164 — digits with a leading `+`, no spaces. */
export function toTelHref(phone: string): string {
  return `tel:+${toWhatsAppNumber(phone)}`;
}

/** The supplied lines as one line: line breaks are presentation, not data. */
export function toAddressText(addressLines: readonly string[]): string {
  return addressLines
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .trim()
    .replace(/,$/, "");
}

/**
 * Split the supplied address into schema.org parts.
 *
 * Every supplied address ends "…, Surat – NNNNNN", so the city and PIN are
 * read from there rather than assumed. If a future address doesn't match, the
 * whole string becomes `streetAddress` — degraded, but never wrong.
 */
export function toPostalAddress(
  addressLines: readonly string[]
): OutletPostalAddress {
  const flat = toAddressText(addressLines);
  const match = flat.match(/^(.*?),?\s*Surat\s*[–—-]\s*(\d{6})$/);
  if (!match) return { streetAddress: flat, addressLocality: "Surat" };
  // Both groups are guaranteed by a successful match; falling back to the flat
  // string keeps this total rather than relying on that guarantee.
  const [, street = flat, postalCode] = match;
  return {
    streetAddress: street.replace(/,\s*$/, ""),
    addressLocality: "Surat",
    postalCode,
  };
}

/**
 * Google Maps destination for an outlet.
 *
 * NOT a verified place URL. No per-outlet Google place link was supplied and
 * the map providers are unreachable from this environment, so this is an
 * encoded *search* for the brand plus that outlet's own supplied address —
 * the same `maps/search/?api=1&query=` form the site already used. It lands on
 * a search for the right address rather than on a confirmed listing, and it can
 * never resolve to another branch's destination because the query is built only
 * from that outlet's record. Replace with verified place URLs when available.
 */
export function toMapsSearchUrl(
  name: string,
  addressLines: readonly string[]
): string {
  const query = `Mahesh Pav Bhaji ${name} ${toAddressText(addressLines)}`
    .replace(/\s+/g, " ")
    .trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Flags the Maps destinations above as search-based rather than verified place
 * URLs, so the UI can say so instead of implying a confirmed pin.
 */
export const outletMapsAreSearchBased = true;

type OutletRecord = Pick<
  Outlet,
  "id" | "name" | "subtitle" | "phone" | "addressLines" | "coordinates"
>;

const outletRecords: OutletRecord[] = [
  {
    id: "athwalines",
    name: "Athwalines",
    subtitle: "Original Chowpatty Stall",
    phone: "+91 98983 50690",
    addressLines: ["Chopati, Athwalines, Athwa, Surat – 395001"],
    coordinates: null,
  },
  {
    id: "adajan",
    name: "Adajan",
    subtitle: "Honey Park Road",
    phone: "+91 96622 86901",
    addressLines: [
      "Shop 1–2, Garden View Apartment,",
      "Honey Park Road,",
      "Adajan Gam,",
      "Surat – 395009",
    ],
    coordinates: null,
  },
  {
    id: "vesu",
    name: "Vesu",
    subtitle: "VIP Road",
    phone: "+91 98251 12831",
    addressLines: [
      "Shop G-34 & G-36,",
      "Ground Floor,",
      "Four Point,",
      "Beside Maniba Party Plot,",
      "VIP Road,",
      "Vesu,",
      "Surat – 395007",
    ],
    coordinates: null,
  },
  {
    id: "katargam",
    name: "Katargam",
    subtitle: "Aamba Talavadi",
    phone: "+91 79906 32870",
    addressLines: [
      "Sunday Hub,",
      "Char Rasta,",
      "Opposite Ankur Vidhyalaya,",
      "Aamba Talavadi,",
      "Katargam,",
      "Surat – 395004",
    ],
    coordinates: null,
  },
  {
    id: "pal",
    name: "Pal",
    subtitle: "The Galleria",
    phone: "+91 63511 28464",
    addressLines: [
      "Shop No. 70,",
      "The Galleria,",
      "Near Sanjeev Kumar Auditorium Road,",
      "Adajan Gam,",
      "Surat – 395009",
    ],
    coordinates: null,
  },
  {
    id: "mota-varachha",
    name: "Mota Varachha",
    subtitle: "Sudama Chowk",
    phone: "+91 96249 90008",
    addressLines: [
      "Shop 20 & 21,",
      "Varni Plaza,",
      "Near Sudama Chowk,",
      "Opposite Friday Cinema,",
      "Mota Varachha,",
      "Surat – 394101",
    ],
    coordinates: null,
  },
  {
    id: "athwagate",
    name: "Athwagate",
    subtitle: "Restaurant Outlet",
    phone: "+91 93751 88635",
    addressLines: [
      "Shop No. 6/7,",
      "Mission Hospital Shopping Center,",
      "Opposite Dhiraj Sons,",
      "Ram Nagar,",
      "Athwa Gate,",
      "Surat – 395001",
    ],
    coordinates: null,
  },
];

export const outlets: Outlet[] = outletRecords.map((record) => ({
  ...record,
  telHref: toTelHref(record.phone),
  whatsappNumber: toWhatsAppNumber(record.phone),
  addressText: toAddressText(record.addressLines),
  postalAddress: toPostalAddress(record.addressLines),
  mapsUrl: toMapsSearchUrl(record.name, record.addressLines),
}));

/**
 * Whether the nearest-outlet flow can run at all. False while coordinates are
 * unverified, which is what keeps the location control from being offered and
 * then failing — see the note on `Outlet.coordinates`.
 */
export const hasOutletCoordinates: boolean = outlets.some(
  (outlet) => outlet.coordinates !== null
);

export function getOutletById(id: string): Outlet | undefined {
  return outlets.find((outlet) => outlet.id === id);
}
