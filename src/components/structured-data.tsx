import * as React from "react";
import { business } from "@/data/business";

/**
 * Restaurant / LocalBusiness structured data for local SEO.
 *
 * NOTE: `aggregateRating` (ratingValue + reviewCount) and the opening hours are
 * DYNAMIC — they mirror `src/data/business.ts` and must be re-checked
 * periodically. No production URL, email, geo-coordinates, price range or
 * delivery radius is included because none has been verified — do not invent them.
 */
export function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    servesCuisine: business.cuisines,
    telephone: business.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Shops 2, 3, 4 and 5, Sunday Hub, Char Rasta, opposite Ankur Vidhyalaya, Aamba Talavadi, Katargam",
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: "IN",
    },
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    hasMap: business.googleMaps,
    sameAs: [business.instagram.url],
  };

  return (
    <script
      type="application/ld+json"
      // Serialised server-side; contains only vetted business facts.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
