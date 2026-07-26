import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/**
 * One page, one entry. Emitted empty until a real site URL exists, because a
 * sitemap needs absolute URLs and there is nothing truthful to put in one yet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];

  return [
    {
      url: siteUrl.href,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
