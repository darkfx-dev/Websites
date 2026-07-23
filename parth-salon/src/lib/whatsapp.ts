/* WhatsApp + directions link builders — all reading the central config so
   the number/address live in exactly one place. */
import { business } from "../config/business";

/** Build a wa.me link with a URL-encoded prefilled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${business.phoneInternational}?text=${encodeURIComponent(
    message,
  )}`;
}

export interface EnquiryFields {
  name: string;
  phone: string;
  inquiryType: string;
  date?: string;
  time?: string;
  message?: string;
}

/** Compose the appointment-enquiry WhatsApp message from form fields. */
export function buildEnquiryMessage(f: EnquiryFields): string {
  return [
    "Hello Parth Salon, I would like to make an enquiry.",
    "",
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Enquiry: ${f.inquiryType}`,
    `Preferred date: ${f.date || "Not specified"}`,
    `Preferred time: ${f.time || "Not specified"}`,
    `Message: ${f.message || "Not specified"}`,
    "",
    "Please confirm availability and share the relevant service and pricing information.",
  ].join("\n");
}

/**
 * Directions URL. Prefers a confirmed maps link; otherwise falls back to an
 * encoded address search that needs no API key.
 */
export function directionsUrl(): string {
  if (business.mapsUrl) return business.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    business.address,
  )}`;
}
