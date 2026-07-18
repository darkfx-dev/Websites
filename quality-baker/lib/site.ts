/** Business facts. Everything on the site that mentions the shop reads from here. */
export const site = {
  name: "The Quality Baker",
  tagline: "Custom cakes & fresh pastries in Bhestan, Surat",
  address: "Shop No. 10, Sai Ram Residency, Bhestan, Surat, Gujarat 395023",
  addressShort: "Sai Ram Residency, Bhestan, Surat",
  phoneDisplay: "+91 94278 75256",
  phoneHref: "tel:+919427875256",
  whatsappNumber: "919427875256",
  hours: "10:00 AM – 11:00 PM",
  hoursNote: "Open all 7 days",
  rating: "4.9",
  reviewCount: 95,
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=The+Quality+Baker+Sai+Ram+Residency+Bhestan+Surat+395023",
  mapsDirectionsHref:
    "https://www.google.com/maps/dir/?api=1&destination=Shop+No.+10,+Sai+Ram+Residency,+Bhestan,+Surat,+Gujarat+395023",
} as const;

/** Build a wa.me deep link with a pre-filled message. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const defaultWhatsappHref = whatsappHref(
  "Hi! I'd love to know more about your cakes 🍰"
);
