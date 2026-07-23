/* ============================================================================
   Parth Salon — service catalogue (data-driven).

   Every item is CLIENT-SUPPLIED, not owner-confirmed, so all are `enabled:
   false` and carry no price/duration. Nothing here is shown publicly until:
     1. business.servicesPublicationApproved === true, AND
     2. the individual item is verificationStatus:"confirmed" AND enabled:true.
   Until then the site shows the honest "contact for the current menu" prompt.

   To publish: confirm the real menu with the salon, set each real item to
   verificationStatus:"confirmed" + enabled:true (add priceDisplay only if the
   price is confirmed), then set business.servicesPublicationApproved = true.
   ============================================================================ */
import { business } from "../config/business";

export type VerificationStatus = "confirmed" | "client-supplied" | "pending";

export interface ServiceCategory {
  id: string;
  label: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  requiresConsultation: boolean;
  priceDisplay: string | null; // null until a price is confirmed — never invented
  durationDisplay: string | null;
  verificationStatus: VerificationStatus;
  enabled: boolean;
  featured: boolean;
  enquiryPrompt: string; // used to prefill the WhatsApp enquiry
}

export const serviceCategories: ServiceCategory[] = [
  { id: "hair-care", label: "Hair care" },
  { id: "treatments", label: "Specialised treatments" },
  { id: "mens-grooming", label: "Men's grooming" },
  { id: "skin-face", label: "Skin & face" },
  { id: "threading-waxing", label: "Threading & waxing" },
  { id: "body-wellness", label: "Body & wellness" },
  { id: "occasion", label: "Occasion" },
];

function candidate(
  categoryId: string,
  id: string,
  name: string,
  shortDescription: string,
  requiresConsultation = false,
): ServiceItem {
  return {
    id,
    categoryId,
    name,
    shortDescription,
    requiresConsultation,
    priceDisplay: null,
    durationDisplay: null,
    verificationStatus: "client-supplied",
    enabled: false,
    featured: false,
    enquiryPrompt: `I'd like to ask about ${name.toLowerCase()}.`,
  };
}

export const serviceCatalogue: ServiceItem[] = [
  candidate("hair-care", "haircuts", "Haircuts", "Cut and finish for all hair types."),
  candidate("hair-care", "hair-styling", "Hair styling", "Styling for daily wear or an occasion."),
  candidate("hair-care", "hair-coloring", "Hair colouring", "Colour services.", true),
  candidate("hair-care", "highlights", "Highlights", "Highlight and lowlight work.", true),
  candidate("treatments", "hair-spa", "Hair spa", "Conditioning hair-spa treatment."),
  candidate("treatments", "straightening", "Straightening", "Straightening treatment.", true),
  candidate("treatments", "smoothening", "Smoothening", "Smoothening treatment.", true),
  candidate("treatments", "keratin", "Keratin treatment", "Keratin treatment.", true),
  candidate("treatments", "hair-patch", "Hair-patch services", "Hair-patch services.", true),
  candidate("mens-grooming", "beard-grooming", "Beard grooming", "Beard trim and grooming."),
  candidate("mens-grooming", "shaving", "Shaving", "Shave and finish."),
  candidate("mens-grooming", "beard-styling", "Beard styling", "Beard shaping and styling."),
  candidate("skin-face", "facials", "Facials", "Facial treatments.", true),
  candidate("skin-face", "clean-ups", "Clean-ups", "Face clean-up."),
  candidate("skin-face", "de-tanning", "De-tanning", "De-tan treatment."),
  candidate("threading-waxing", "eyebrow-threading", "Eyebrow threading", "Eyebrow shaping."),
  candidate("threading-waxing", "forehead-threading", "Forehead threading", "Forehead threading."),
  candidate("threading-waxing", "chin-threading", "Chin threading", "Chin threading."),
  candidate("threading-waxing", "waxing", "Full-body waxing", "Waxing services.", true),
  candidate("body-wellness", "body-massage", "Body massage", "Relaxation body massage.", true),
  candidate("body-wellness", "manicure", "Manicure", "Manicure."),
  candidate("body-wellness", "pedicure", "Pedicure", "Pedicure."),
  candidate("occasion", "bridal-makeup", "Bridal-makeup packages", "Bridal makeup.", true),
  candidate("occasion", "party-makeup", "Party makeup", "Party and event makeup.", true),
];

/** Only items that are approved for publication AND individually confirmed. */
export function publishedServices(): ServiceItem[] {
  if (!business.servicesPublicationApproved) return [];
  return serviceCatalogue.filter(
    (s) => s.enabled && s.verificationStatus === "confirmed",
  );
}

export function hasPublishedServices(): boolean {
  return publishedServices().length > 0;
}

/** Look up a publishable service by id (used by enquiry prefill / deep links). */
export function findPublishedService(id: string | null): ServiceItem | null {
  if (!id) return null;
  return publishedServices().find((s) => s.id === id) ?? null;
}
