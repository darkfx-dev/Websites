import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { business } from "@/data/business";
import { outlets } from "@/data/outlets";
import { getSiteUrlObject } from "@/lib/site";
import "./globals.css";

// Refined editorial serif for display headings.
//
// Normal style only. The italic face was being downloaded and preloaded on
// every visit — roughly a third of the site's total font payload — while
// nothing on the site ever renders italic text (the single `not-italic` in the
// codebase is an <address> reset that removes the browser default). Requesting
// it back would cost the same bytes again, so add italic here only alongside
// markup that actually uses it.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-display",
  display: "swap",
});

// Highly readable geometric sans for body and interface text.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Metadata describes the business, which has seven outlets across Surat — it
// must not present any single branch as the whole business. Individual outlet
// names are kept as keywords because people search for them, but no branch is
// named as *the* location.
export const metadata: Metadata = {
  title: {
    default: `${business.name} | Pav Bhaji, Dosa & Chinese Food — ${outlets.length} Outlets in Surat`,
    template: `%s | ${business.name}`,
  },
  description: `Mahesh Pav Bhaji has ${outlets.length} outlets across Surat. Explore pav bhaji, South Indian, Chinese, rice, pizza, sandwiches and chaats, then choose the outlet nearest you to call or message on WhatsApp.`,
  applicationName: business.name,
  keywords: [
    "Mahesh Pav Bhaji",
    "pav bhaji Surat",
    "South Indian Surat",
    "Chinese food Surat",
    "vegetarian restaurant Surat",
    ...outlets.map((outlet) => `Mahesh Pav Bhaji ${outlet.name}`),
  ],
  // Resolves every relative metadata URL (Open Graph image, canonical) against
  // the deployed origin. Set NEXT_PUBLIC_SITE_URL to move the site to another
  // domain; see `src/lib/site.ts`.
  metadataBase: getSiteUrlObject(),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${business.name} | ${outlets.length} Outlets Across Surat`,
    description: `Pav bhaji, South Indian, Chinese, rice, pizza, sandwiches and chaats at ${outlets.length} Mahesh Pav Bhaji outlets across Surat.`,
    siteName: business.name,
    locale: "en_IN",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} | ${outlets.length} Outlets Across Surat`,
    description:
      "Pav bhaji, South Indian, Chinese, rice, pizza, sandwiches and chaats. Choose your nearest outlet.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Surfaces the business category to search engines without asserting
  // anything that isn't already on the page.
  category: "Restaurant",
};

export const viewport: Viewport = {
  themeColor: "#15120F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        {/*
         * Marks that JavaScript is available BEFORE first paint, so scroll
         * reveals (gated on `html.js` in CSS) start hidden only when they can
         * actually animate. With JS off, this never runs and all content
         * renders visible.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        {children}
      </body>
    </html>
  );
}
