import { business } from "@/data/business";

/**
 * Percent-encodes a WhatsApp `text` payload.
 *
 * `encodeURIComponent` deliberately leaves a handful of legal URI characters
 * unescaped, and `'` is one of them — so the approved message would go out as
 * `today's` rather than `today%27s`. WhatsApp accepts both, but the brief
 * specifies an exact encoded URL, and matching it character-for-character is
 * what lets the content check assert the approved message survived intact
 * instead of merely "looks about right". Hence the extra pass.
 */
function encodeWhatsAppText(text: string): string {
  return encodeURIComponent(text).replace(/'/g, "%27");
}

/** `tel:` URI. Works with JavaScript disabled, as every contact action must. */
export const telHref = business.telephone.uri;

/**
 * The default WhatsApp inquiry, using the approved message verbatim.
 */
export const whatsappHref = buildWhatsAppHref();

/**
 * Builds a `wa.me` link. With no argument this reproduces the approved
 * message exactly; passing a category appends a single clause so the menu
 * explorer's one inquiry action can say which part of the menu prompted it.
 *
 * The base message is never rewritten — only extended — so the approved
 * wording is always present.
 */
export function buildWhatsAppHref(category?: string): string {
  const message =
    category && category !== "All"
      ? `${business.whatsapp.message} I am looking at the ${category} section.`
      : business.whatsapp.message;

  return `https://wa.me/${business.whatsapp.number}?text=${encodeWhatsAppText(message)}`;
}

/**
 * Google Maps link for the outlet, pinned by Place ID so it cannot resolve to
 * a different branch or a same-name business.
 *
 * This must not be rendered anywhere before the final Location & Contact
 * section.
 */
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Surat Khaman House, Adajan, Surat",
)}&query_place_id=${business.location.placeId}`;
