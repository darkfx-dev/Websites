/**
 * Security headers and image configuration.
 *
 * On `'unsafe-inline'` in `script-src`: Next streams a per-build inline
 * bootstrap and RSC payload into the document. Those scripts cannot be
 * hashed ahead of time, and the nonce alternative forces every request to
 * render dynamically — which for a statically-rendered marketing page means
 * giving up CDN caching, its main performance advantage, to harden a page
 * that renders no user-supplied HTML and holds no authenticated state.
 *
 * The rest of the policy is tight to compensate: no third-party script
 * origin is allowed at all, `object-src` and `frame-ancestors` are closed,
 * and `connect-src` is limited to this origin.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'" +
    (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline'",
  // `images.unsplash.com` is here so photographs can be dropped straight
  // into src/data/site.ts without touching this file. `data:` covers the
  // inline SVG grain.
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "interest-cohort=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This project sits in a repository with other apps and their own
  // lockfiles; without this, Next walks up and picks the wrong workspace
  // root for file tracing.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
