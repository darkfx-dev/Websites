import type { MetadataRoute } from "next";

import { siteUrl } from "@/data/business";

/** Single-page site, so there is exactly one entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
