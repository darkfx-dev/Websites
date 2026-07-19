/** Business facts. Everything on the site that mentions the shop reads from here. */
export const site = {
  name: "Modi Bakers",
  tagline: "Custom cakes & fresh pastries, made to order",
  // No confirmed street address supplied — the location is a Google Maps link
  // only. Where address text is required, we point people to the map instead.
  locationLabel: "View our location on Google Maps",
  phoneDisplay: "+91 94263 92062",
  phoneHref: "tel:+919426392062",
  whatsappNumber: "919426392062",
  hours: "10:00 AM – 11:00 PM",
  hoursNote: "Open all 7 days",
  rating: "4.3",
  reviewCount: 373,
  // One confirmed Google Maps link, used by every map / directions action.
  mapsHref: "https://maps.app.goo.gl/V5Xg6RXVBRQczYw56?g_st=ac",
  mapsDirectionsHref: "https://maps.app.goo.gl/V5Xg6RXVBRQczYw56?g_st=ac",
} as const;

/** Build a wa.me deep link with a pre-filled (URL-encoded) message. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** General "tell me more" inquiry used by the floating button, hero, footer. */
export const defaultWhatsappHref = whatsappHref(
  "Hi Modi Bakers, I would like to know more about your bakery products, cakes, prices, custom orders, and availability."
);
