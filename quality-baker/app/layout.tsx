import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import MotionRoot from "@/components/MotionRoot";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/lib/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Quality Baker — Custom Cakes & Pastries in Bhestan, Surat",
  description:
    "Custom design cakes, birthday cakes and fresh pastries in Bhestan, Surat. 4.9★ on Google. Open 10 AM – 11 PM, all 7 days. Call +91 94278 75256.",
  openGraph: {
    title: "The Quality Baker",
    description:
      "Custom cakes & fresh pastries in Bhestan, Surat. 4.9★ on Google.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0d0b",
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
    <html lang="en" className={`${fraunces.variable} ${figtree.variable}`}>
      <body>
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
