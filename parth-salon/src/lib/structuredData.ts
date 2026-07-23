/* Builds HairSalon (LocalBusiness) JSON-LD from the central config. Only
   verified facts are included — no rating, reviews, services, prices, geo
   coordinates, or social profiles until those are confirmed. */
import { business } from "../config/business.ts";

const DAY_SCHEMA: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function buildStructuredData() {
  const openingHoursSpecification = Object.entries(business.openingHours).map(
    ([day, h]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_SCHEMA[day],
      opens: h.opens,
      closes: h.closes,
    }),
  );

  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: business.name,
    telephone: business.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Avlon Comercial Hub, 144/145, opp. Ankur School, Aamba Talavadi, Priya Park Society, Katargam",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      postalCode: "395004",
      addressCountry: "IN",
    },
    openingHoursSpecification,
  };
}
