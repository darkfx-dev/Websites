import { business } from "@/data/business";
import { mapsHref } from "@/lib/links";

/**
 * Restaurant JSON-LD for local SEO.
 *
 * This is the one place location data may appear outside the final section,
 * because it is non-visible metadata rather than rendered page content.
 *
 * Everything omitted here is omitted on purpose:
 *
 * - `openingHoursSpecification` — public listings disagree on precise hours,
 *   so publishing any would be asserting something unverified.
 * - `aggregateRating` — the observed 4.4 is shown as visible text, but valid
 *   `aggregateRating` markup needs a review count, and no compliant count is
 *   available. Showing the rating while omitting the markup is the honest
 *   combination, not an oversight.
 * - `review`, `image`, `sameAs`, `priceRange`, `hasMenu`, `servesCuisine`
 *   pricing, `acceptsReservations`, ordering and delivery actions, owner and
 *   founder — each would require information nobody has verified.
 * - `url` — the production domain has not been supplied yet. It is added here
 *   once a real domain replaces the placeholder in `data/business.ts`.
 */
export function buildRestaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    alternateName: business.alternateName,
    description:
      "Vegetarian Surti breakfast and farsan outlet serving locho, khaman, idada, patudi, patra, sev khamani, samosas, pattice and ghee jalebi.",
    servesCuisine: ["Gujarati", "Surti", "Vegetarian"],
    address: {
      "@type": "PostalAddress",
      streetAddress: business.location.streetAddress,
      addressLocality: business.location.locality,
      addressRegion: business.location.region,
      postalCode: business.location.postalCode,
      addressCountry: business.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.location.latitude,
      longitude: business.location.longitude,
    },
    telephone: business.telephone.display,
    hasMap: mapsHref,
  };
}
