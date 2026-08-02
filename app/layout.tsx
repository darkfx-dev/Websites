import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Noto_Sans_Gujarati } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { outlet } from "@/data/outlet";
import { siteUrl } from "@/lib/site";
import "./globals.css";

/**
 * Explicit weights rather than the full variable faces: only 400 and 600 are
 * used, and the variable Gujarati face alone was 110KB — enough to make the
 * hero's Gujarati line the LCP element.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const notoGujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati"],
  weight: ["400"],
  variable: "--font-noto-gujarati",
  display: "swap",
});

export const metadata: Metadata = {
  title: outlet.seo.title,
  description: outlet.seo.description,
  applicationName: outlet.displayName,
  robots: { index: true, follow: true },
  // Telephone auto-detection would style the number inconsistently; the page
  // already exposes an explicit, labelled call action.
  formatDetection: { telephone: false },
  /**
   * No production domain has been supplied, so `metadataBase`, the canonical
   * URL and every Open Graph / Twitter field are omitted rather than pointed
   * at an invented address. See `docs/launch-blockers.md`.
   */
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#fff9ee",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${manrope.variable} ${notoGujarati.variable}`}
    >
      <body className="paper grain antialiased">
        {/*
          120 — without JavaScript, Framer Motion never runs, so the reveal
          wrappers would keep their hidden initial state. This restores the
          final state so every fact and action stays reachable.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-canvas focus:no-underline"
        >
          Skip to main content
        </a>

        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
