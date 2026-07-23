import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { business } from "@/data/business";
import "./globals.css";

// Refined editorial serif for display headings.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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

export const metadata: Metadata = {
  title: {
    default: `${business.name} | Pav Bhaji, Dosa & Chinese Food in Katargam, Surat`,
    template: `%s | ${business.name}`,
  },
  description:
    "Visit Mahesh Pav Bhaji at Sunday Hub, Katargam, Surat. Explore pav bhaji, South Indian, Chinese, rice, pizza, sandwiches and chaats. Open daily from 10:00 AM to midnight.",
  applicationName: business.name,
  keywords: [
    "Mahesh Pav Bhaji",
    "pav bhaji Katargam",
    "pav bhaji Surat",
    "South Indian Surat",
    "dosa Katargam",
    "Chinese food Surat",
    "vegetarian restaurant Surat",
  ],
  // NOTE: `canonical` and `metadataBase` are intentionally omitted until the
  // real production domain is known — do not invent one.
  openGraph: {
    title: `${business.name} | Pav Bhaji, Dosa & Chinese Food in Katargam, Surat`,
    description:
      "Pav bhaji, South Indian, Chinese, rice, pizza, sandwiches and chaats in Katargam, Surat. Open daily from 10:00 AM to midnight.",
    siteName: business.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} | Katargam, Surat`,
    description:
      "Pav bhaji, South Indian, Chinese, rice, pizza, sandwiches and chaats. Open daily 10:00 AM–midnight.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
