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

/* --- 3-step consultation builder message ------------------------------- */
export interface ConsultationState {
  enquiryType: string;
  serviceCategory: string; // "" → "Not sure"
  service: string; // "" → "Help me choose"
  date: string; // yyyy-mm-dd or ""
  preferredTime: string; // exact "6:00 PM" | daypart | "Flexible" | ""
  hairLength: string; // "" → "Not applicable"
  replyPref: string; // "WhatsApp" | "Phone"
  name: string;
  phone: string;
  notes: string;
}

/** Compose the consultation WhatsApp message. Field values are inserted raw;
    the whole string is URL-encoded once by whatsappLink (never pre-encode
    individual fields). */
export function buildConsultationMessage(s: ConsultationState): string {
  return [
    "Hello Parth Salon, I would like to make an enquiry.",
    "",
    `Name: ${s.name}`,
    `Phone: ${s.phone}`,
    `Enquiry type: ${s.enquiryType}`,
    `Service category: ${s.serviceCategory || "Not sure"}`,
    `Service: ${s.service || "Help me choose"}`,
    `Preferred date: ${s.date || "Not specified"}`,
    `Preferred time: ${s.preferredTime || "Flexible"}`,
    `Hair length: ${s.hairLength || "Not applicable"}`,
    `Preferred reply: ${s.replyPref || "WhatsApp"}`,
    `Details: ${s.notes || "None"}`,
    "",
    "Please share availability, consultation guidance, and current pricing. I understand that this message does not confirm an appointment.",
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
