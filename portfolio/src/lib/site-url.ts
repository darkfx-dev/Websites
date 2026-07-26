import { real, site } from "@/data/portfolio";

/**
 * The site's own address, or `null` while it is still a placeholder.
 *
 * Everything that needs an absolute URL — canonical links, social previews,
 * the sitemap, structured data — asks here first and omits itself when the
 * answer is `null`. A canonical tag pointing at `[https://your-domain.com]`
 * is worse than no canonical tag.
 */
export const siteUrl: URL | null = (() => {
  const raw = real(site.url);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
})();

/**
 * Whether this deployment is configured enough to be worth indexing.
 *
 * While the site has no real address it is, by definition, not the published
 * version — so it asks search engines to stay away. Filling in `site.url` in
 * `portfolio.ts` turns indexing on. This is a deliberate safe default: an
 * accidental deploy of a half-filled portfolio should not become the result
 * someone finds when they search your name.
 */
export const indexable = siteUrl !== null;
