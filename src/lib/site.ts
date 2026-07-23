/**
 * Absolute site URL for robots/sitemap. No production domain is hard-coded —
 * set NEXT_PUBLIC_SITE_URL in the deployment environment once the real domain
 * is known. Falls back to localhost for development.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
