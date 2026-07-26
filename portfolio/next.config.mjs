/**
 * Security headers and build configuration.
 *
 * A note on `'unsafe-inline'` in `script-src`: Next streams a per-build inline
 * bootstrap and RSC payload into the document. Those scripts cannot be hashed
 * ahead of time, and the nonce alternative forces every request to be rendered
 * dynamically — which for a static single-page portfolio means giving up CDN
 * caching, the site's main performance advantage, to harden a page that
 * renders no user-supplied HTML and has no authenticated state to steal.
 *
 * The rest of the policy is tight to compensate: no third-party script origin
 * is allowed at all, `object-src` and `frame-ancestors` are closed, and
 * `connect-src` is limited to this origin, so there is nowhere for injected
 * script to send anything even if it ran.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'" +
    (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
  // Tailwind ships a stylesheet, but React also writes inline styles.
  "style-src 'self' 'unsafe-inline'",
  // `blob:` covers canvas readback; `data:` covers the inline SVG fallbacks.
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  // three.js compiles some loaders into blob workers.
  "worker-src 'self' blob:",
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
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This project sits inside a repository that has its own lockfile one level
  // up. Without this, Next walks up and picks the parent as the workspace
  // root, and file tracing then reaches into an unrelated application.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
