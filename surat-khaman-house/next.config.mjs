/**
 * Security headers.
 *
 * On `'unsafe-inline'` in `script-src`: Next streams a per-build inline
 * bootstrap and RSC payload into the document. Those scripts cannot be
 * hashed ahead of time, and the nonce alternative forces every request to
 * render dynamically — which for a statically-rendered informational page
 * means giving up CDN caching to harden a page that renders no
 * user-supplied HTML and holds no authenticated state.
 *
 * The rest of the policy is deliberately tight: no third-party origin is
 * allowed anywhere, `object-src` and `frame-ancestors` are closed, and
 * `frame-src` is closed too because this site embeds no map iframe
 * (`ENABLE_MAP_EMBED` is false). `img-src` needs no remote host because the
 * site ships no photographs — all artwork is inline SVG.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'" +
    (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline'",
  // `data:` covers the inline SVG paper grain only.
  "img-src 'self' data:",
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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
