import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

/**
 * A sitemap needs absolute URLs. Until `NEXT_PUBLIC_SITE_URL` is set to the
 * real production domain, this emits an empty sitemap rather than publishing
 * an invented address. See `docs/launch-blockers.md`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
