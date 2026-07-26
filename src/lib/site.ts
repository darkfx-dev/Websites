/**
 * Absolute site origin, used for canonical URLs, Open Graph tags, robots.txt
 * and the sitemap.
 *
 * The default is the deployed address supplied by the owner. Override it with
 * `NEXT_PUBLIC_SITE_URL` when the site moves to its own domain — that is the
 * only change needed for every absolute URL on the site to follow.
 */
const DEFAULT_SITE_URL = "https://maheshpavbhaji.netlify.app";

/**
 * Parse and validate an origin.
 *
 * A malformed `NEXT_PUBLIC_SITE_URL` used to flow straight into canonical and
 * sitemap URLs, where a bad value is close to invisible in review but tells
 * search engines the wrong thing. Anything that isn't a valid absolute
 * http(s) URL is rejected here and the known-good default is used instead.
 */
function parseSiteUrl(raw: string | undefined): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url;
  } catch {
    return null;
  }
}

/** Absolute origin with no trailing slash, e.g. `https://example.com`. */
export function getSiteUrl(): string {
  const url = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? new URL(DEFAULT_SITE_URL);
  return url.origin;
}

/** Same value as a `URL`, which is the shape Next's `metadataBase` expects. */
export function getSiteUrlObject(): URL {
  return new URL(getSiteUrl());
}
