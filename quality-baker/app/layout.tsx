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
  title: "The Quality Baker — Custom Cakes & Pastries in Bhestan, Surat",
  description:
    "Custom design cakes, birthday cakes and fresh pastries in Bhestan, Surat. 4.9★ on Google. Open 10 AM – 11 PM, all 7 days. Order on WhatsApp: +91 94278 75256.",
  // Set to the real domain at deploy time
  metadataBase: new URL("https://thequalitybaker.example"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Quality Baker",
    description:
      "Custom cakes & fresh pastries in Bhestan, Surat. 4.9★ on Google.",
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
  telephone: "+91 94278 75256",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop No. 10, Sai Ram Residency, Bhestan",
    addressLocality: "Surat",
    addressRegion: "Gujarat",
    postalCode: "395023",
    addressCountry: "IN",
  },
  openingHours: "Mo-Su 10:00-23:00",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "95",
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
