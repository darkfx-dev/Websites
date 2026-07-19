import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import MotionRoot from "@/components/MotionRoot";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modi Bakers — Custom Cakes & Fresh Pastries",
  description:
    "Custom design cakes, birthday cakes and fresh pastries from Modi Bakers. 4.3★ on Google. Open 10 AM – 11 PM, all 7 days. Order on WhatsApp: +91 94263 92062.",
  // Set to the real domain at deploy time
  metadataBase: new URL("https://modibakers.example"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Modi Bakers",
    description: "Custom cakes & fresh pastries. 4.3★ on Google.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: site.name,
  telephone: "+91 94263 92062",
  // No confirmed street address supplied — point to the Google Maps place
  // instead of publishing an invented PostalAddress.
  hasMap: site.mapsHref,
  openingHours: "Mo-Su 10:00-23:00",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: site.rating,
    reviewCount: String(site.reviewCount),
  },
  servesCuisine: "Bakery",
  priceRange: "₹₹",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionRoot>
          <SmoothScroll />
          {children}
        </MotionRoot>
      </body>
    </html>
  );
}
