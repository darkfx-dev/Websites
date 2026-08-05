import { outlet } from "@/data/outlet";

/** `tel:` URI for the public business number. */
export const telHref = `tel:${outlet.contact.phoneE164}` as const;

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
