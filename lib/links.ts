import { outlet } from "@/data/outlet";

/**
 * `encodeURIComponent` leaves `!'()*~` unescaped. WhatsApp deep links are
 * more predictable when those are percent-encoded too, and the approved
 * inquiry URL for this outlet encodes the apostrophe in "today's" as %27.
 */
export function encodeMessage(text: string): string {
  return encodeURIComponent(text).replace(
    /[!'()*~]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/** `tel:` URI for the public business number. */
export const telHref = `tel:${outlet.contact.phoneE164}` as const;

/**
 * WhatsApp deep link carrying the approved prefilled inquiry message.
 *
 * Passing `message` overrides the default text and is reserved for visible,
 * user-initiated category actions in the menu explorer. Every other caller
 * must use the approved default.
 */
export function whatsappHref(message: string = outlet.contact.whatsappMessage): string {
  return `https://wa.me/${outlet.contact.whatsappNumber}?text=${encodeMessage(message)}`;
}

/** Category-scoped inquiry text, still addressed to this outlet by name. */
export function categoryInquiryMessage(category: string): string {
  return `Hello Surat Khaman House, I would like to inquire about today's ${category} availability and price.`;
}

/** Exact Google Maps URL pinned to this outlet's Place ID. */
export const directionsHref = outlet.map.directionsUrl;

/** In-page anchors. Sections that are disabled must drop their link too. */
export const anchors = {
  main: "#main",
  menu: "#menu",
  about: "#about",
  location: "#location",
  faq: "#faq",
} as const;
