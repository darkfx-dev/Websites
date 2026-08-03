/**
 * Content-Security-Policy.
 *
 * `'unsafe-inline'` is required in `script-src` and is a deliberate, documented
 * trade-off rather than an oversight:
 *
 * - Next.js streams the RSC payload into the static HTML as inline
 *   `self.__next_f.push(...)` scripts. Their contents differ per page and per
 *   build, so they cannot be hashed ahead of time.
 * - The alternative — a per-request nonce set from middleware — forces every
 *   route to render dynamically, which forfeits full-page CDN caching and
 *   measurably worsens TTFB/LCP on what is a purely static marketing site.
 *   Priority order here puts preserving the shipped experience above a
 *   stricter directive, so the nonce route is rejected. Revisit only if the
 *   site gains authenticated or user-generated content.
 *
 * Everything else is locked down, so the policy still blocks the attacks that
 * actually apply to this site: injected third-party script/frame/object
 * sources, `<base>` hijacking, form exfiltration, and clickjacking.
 *
 * `style-src` needs `'unsafe-inline'` because GSAP and Framer Motion animate by
 * writing inline `style` attributes — removing it would break every animation.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // `data:` covers the inline SVG grain texture used as a CSS background.
  "img-src 'self' data:",
  // next/font self-hosts Fraunces and Manrope at build time — no CDN origin.
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Permissions-Policy.
 *
 * NOTE: `geolocation=(self)` is deliberate and must not be tightened to `()`.
 * The outlet finder's optional "find my nearest outlet" flow calls
 * `navigator.geolocation` from this origin. It is currently dormant because
 * outlet coordinates are unverified, and it re-enables itself automatically
 * once they are filled in — denying the permission here would silently break
 * that feature the moment it turns on.
 */
const permissionsPolicy = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=(self)",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "usb=()",
  "xr-spatial-tracking=()",
].join(", ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Two years, subdomains included, preload-list eligible.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Redundant with frame-ancestors for modern browsers; kept for older ones.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: permissionsPolicy },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  // Explicitly opt out of Google's FLoC/Topics interest cohorts.
  { key: "Permissions-Policy-Report-Only", value: "browsing-topics=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // Prefer modern formats for any future approved photography.
    formats: ["image/avif", "image/webp"],
    // The only raster asset today is the logo mark, rendered at ~44px wide at
    // up to 3x density. Trimming the generated variants avoids emitting a
    // dozen unused sizes per image without changing what is actually served.
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    // Nothing renders remote or SVG images; refuse both.
    dangerouslyAllowSVG: false,
    remotePatterns: [],
  },

  // NOTE: `experimental.optimizePackageImports` was measured for `motion` and
  // `lucide-react` and produced a 0 kB change (lucide-react is already in
  // Next's built-in optimize list). It is deliberately not enabled — an
  // experimental flag that buys nothing is upgrade risk for no return.

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Immutable, content-hashed build output.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
