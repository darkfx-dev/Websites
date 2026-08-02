import { outlet } from "@/data/outlet";
import { siteUrl } from "@/lib/site";

/**
 * Schema.org `Restaurant` node for this one outlet.
 *
 * Deliberately omitted while unverified, per the source-of-truth rules:
 * `openingHoursSpecification` (listings conflict), `priceRange` and any menu
 * pricing (unconfirmed), `aggregateRating` and `review` (no compliant review
 * count), `image` and `logo` (no rights-cleared photography), `founder` /
 * `owner` (unknown), `paymentAccepted`, `acceptsReservations`,
 * `hasDeliveryMethod`, `potentialAction` order actions and `sameAs` social
 * profiles (all unverified or non-existent).
 *
 * Every value below also appears in the visible page content.
 */
export function restaurantJsonLd(): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: outlet.name,
    alternateName: outlet.gujaratiName,
    description: outlet.copy.about,
    address: {
      "@type": "PostalAddress",
      streetAddress: outlet.address.streetAddress,
      addressLocality: outlet.address.locality,
      addressRegion: outlet.address.region,
      postalCode: outlet.address.postalCode,
      addressCountry: outlet.address.country,
    },
    telephone: outlet.contact.phoneE164,
    geo: {
      "@type": "GeoCoordinates",
      latitude: outlet.map.latitude,
      longitude: outlet.map.longitude,
    },
    hasMap: outlet.map.directionsUrl,
    servesCuisine: ["Gujarati", "Surti", "Vegetarian breakfast and farsan"],
  };

  // Only claim a canonical URL once a real production domain exists.
  if (siteUrl) node.url = siteUrl;

  return node;
}
