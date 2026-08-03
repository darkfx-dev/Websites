import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site-url";

/**
 * While the site has no real address configured it is not the published
 * version, so crawlers are asked to stay out. Setting `site.url` in
 * `portfolio.ts` flips this to a normal allow-all.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexable || !siteUrl) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
    host: siteUrl.origin,
  };
}
