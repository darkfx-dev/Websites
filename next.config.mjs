/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Prefer modern formats for any future approved photography.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
