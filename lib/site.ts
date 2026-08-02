/**
 * Production origin, e.g. "https://example.com".
 *
 * No domain has been supplied for this project, so nothing is invented here.
 * Until `NEXT_PUBLIC_SITE_URL` is set, canonical URLs, Open Graph URLs, the
 * sitemap entry and the structured-data `url` are omitted rather than
 * pointed at a made-up address. This is a tracked launch blocker.
 */
function readSiteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

export const siteUrl = readSiteUrl();

/** True once a real production domain is configured. */
export const hasSiteUrl = siteUrl !== null;
