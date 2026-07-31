import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { business, isPlaceholder, real, seo } from "@/data/site";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

/**
 * Two faces, each with a job.
 *
 * Instrument Serif for headings: high-contrast and tightly set, it reads as
 * a catalogue rather than a wedding invitation — deliberately not Playfair,
 * which is the default every luxury template arrives at.
 *
 * Hanken Grotesk for everything else: warm, quiet, and not Inter, so the
 * serif keeps its character instead of being flattened by a neutral partner.
 *
 * Both self-hosted by `next/font`, so there is no request to Google on a
 * visitor's machine and no layout shift while they load.
 */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const siteUrl = (() => {
  const raw = real(business.siteUrl);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
})();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: seo.title,
  description: seo.description,
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    ...(siteUrl ? { url: siteUrl.href } : {}),
  },
  // Indexing stays off until the site has a real address. A half-filled
  // page becoming the first result for the business's own name is a much
  // more expensive mistake than a delayed one.
  robots: siteUrl ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#171210",
  colorScheme: "dark",
};

/**
 * LocalBusiness structured data, emitted only when the facts are real.
 *
 * The rating is included only if there is also a real address and URL to
 * attach it to — an `aggregateRating` floating free of a verifiable business
 * is the kind of markup search engines penalise, and it would be asserting
 * the number in a machine-readable form that is much harder to retract than
 * a line of visible copy.
 */
function StructuredData() {
  if (!siteUrl || isPlaceholder(business.address.line1)) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: business.name,
    description: seo.description,
    url: siteUrl.href,
    ...(real(business.phone) ? { telephone: real(business.phone) } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.line1,
      addressLocality: real(business.address.line2) ?? undefined,
      postalCode: real(business.address.postalCode) ?? undefined,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviewCount.replace(/\D/g, ""),
      bestRating: "5",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <StructuredData />
      </head>
      <body>
        {children}
        <SmoothScroll />
      </body>
    </html>
  );
}
