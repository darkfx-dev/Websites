import * as React from "react";
import { business } from "@/data/business";
import { outlets } from "@/data/outlets";

/**
 * Structured data for local SEO.
 *
 * The business has seven outlets, so this describes a brand with seven branch
 * locations rather than a single restaurant — leaving one branch's address and
 * phone number as *the* business would misrepresent it.
 *
 * Only verified facts are emitted. Every branch carries the name, address and
 * telephone number supplied for it and nothing more. The opening hours and the
 * `aggregateRating` were confirmed for one listing only, so they are attached
 * to that branch alone and are NOT repeated across the others or lifted to the
 * brand — see `business.hours.verifiedForOutletId` / `business.reviews`.
 *
 * NOTE: `rating`, `reviewCount` and the hours are DYNAMIC — they mirror
 * `src/data/business.ts` and must be re-checked periodically. No production
 * URL, email, geo-coordinates, price range or delivery radius is included
 * because none has been verified — do not invent them.
 *
 * The branch `hasMap` values are Google Maps *searches* built from each
 * outlet's own supplied address, not confirmed place URLs (see
 * `outletMapsAreSearchBased`), which is why no `@id`/place identifier is
 * claimed for them.
 */
export function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: business.name,
    description: `${business.type} with ${outlets.length} outlets across ${business.city}, ${business.region}.`,
    sameAs: [business.instagram.url],
    location: outlets.map((outlet) => {
      const isRatedListing = outlet.id === business.reviews.verifiedForOutletId;
      const hasVerifiedHours =
        outlet.id === business.hours.verifiedForOutletId;

      return {
        "@type": "Restaurant",
        name: `${business.name} — ${outlet.name}`,
        branchOf: { "@type": "Organization", name: business.name },
        servesCuisine: business.cuisines,
        telephone: `+${outlet.whatsappNumber}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: outlet.postalAddress.streetAddress,
          addressLocality: outlet.postalAddress.addressLocality,
          addressRegion: business.region,
          ...(outlet.postalAddress.postalCode
            ? { postalCode: outlet.postalAddress.postalCode }
            : {}),
          addressCountry: "IN",
        },
        hasMap: outlet.mapsUrl,
        ...(hasVerifiedHours
          ? {
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ],
                  opens: business.hours.opens,
                  closes: business.hours.closes,
                },
              ],
            }
          : {}),
        ...(isRatedListing
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: business.rating,
                reviewCount: business.reviewCount,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      // Serialised server-side; contains only vetted business facts.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
