import { siteConfig } from "@/config/siteConfig";

/**
 * LocalBusiness structured data (JSON-LD).
 *
 * IMPORTANT: Only CONFIRMED information is included here — name, category,
 * phone, address, geo-region, and the genuine aggregate rating. Unconfirmed
 * details such as opening hours and prices are deliberately OMITTED so search
 * engines are never fed invented facts about the business.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["HealthAndBeautyBusiness", "ExerciseGym"],
    name: siteConfig.name,
    description: siteConfig.description,
    telephone: siteConfig.phoneDisplay,
    url: siteConfig.seo.siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line1,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    hasMap: siteConfig.links.googleMaps,
    sameAs: [siteConfig.links.instagram, siteConfig.links.googleMaps],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.rating,
      reviewCount: siteConfig.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}
