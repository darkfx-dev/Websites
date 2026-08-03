import type { Metadata } from "next";
import {
  Instrument_Serif,
  Manrope,
  Noto_Sans_Gujarati,
  Noto_Serif_Gujarati,
} from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { siteUrl } from "@/data/business";
import { buildRestaurantJsonLd } from "@/lib/structured-data";

import "./globals.css";

/**
 * All four families are self-hosted by `next/font` at build time, so the page
 * makes no request to Google at runtime and the CSP can keep `font-src` at
 * `'self'`. Weights are kept deliberately few — the brief warns against
 * excessive font weights and against hairline display type.
 */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

const gujaratiDisplay = Noto_Serif_Gujarati({
  subsets: ["gujarati"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-gujarati-display",
});

const gujaratiSans = Noto_Sans_Gujarati({
  subsets: ["gujarati"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-gujarati-sans",
});

/**
 * Location wording is permitted here: metadata is not part of the visible page
 * opening, and local SEO needs it. The address-placement rule governs rendered
 * content only.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Surat Khaman House Adajan | Locho, Khaman & Surti Farsan",
  description:
    "View the menu and contact Surat Khaman House near Sevadarshan Hospital, Adajan, for Surti locho, khaman, idada, samosas, patra and farsan.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Surat Khaman House",
    title: "Surat Khaman House Adajan | Locho, Khaman & Surti Farsan",
    description:
      "View the menu and contact Surat Khaman House near Sevadarshan Hospital, Adajan, for Surti locho, khaman, idada, samosas, patra and farsan.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${gujaratiDisplay.variable} ${gujaratiSans.variable}`}
    >
      <body className="bg-canvas font-sans text-base text-ink antialiased">
        <MotionProvider>{children}</MotionProvider>
        <script
          type="application/ld+json"
          // Serialised from a typed object literal we construct ourselves, so
          // there is no user-supplied HTML anywhere in this string.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildRestaurantJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
