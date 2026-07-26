import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile, real, site } from "@/data/portfolio";
import { indexable, siteUrl } from "@/lib/site-url";
import { ReducedMotionProvider } from "@/components/motion/reduced-motion-provider";
import { ScrollChoreography } from "@/components/motion/scroll-choreography";
import { StructuredData } from "@/components/seo/structured-data";
import "./globals.css";

/**
 * Three families, each with a job: Space Grotesk for headings, Inter for
 * reading, JetBrains Mono for anything that is meant to look like a value
 * rather than a sentence. All self-hosted by `next/font`, so there is no
 * request to a third party.
 *
 * The body face uses `optional` rather than `swap`. Measured on a throttled
 * 4G profile, swapping Inter in late re-wrapped the hero paragraph and moved
 * the whole hero block — 0.108 CLS on its own, all of it above the fold. With
 * `optional` the browser either has the font in time or keeps the
 * size-adjusted fallback for that load and caches Inter for the next one, so
 * the text never re-flows under the reader. Headings keep `swap`, because
 * Space Grotesk is doing visible work and its lines are short enough not to
 * re-wrap.
 */
const sans = Inter({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-sans",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const name = real(profile.name);
const role = real(profile.role);
const description = real(site.description);

const title = name ? `${name}${role ? ` — ${role}` : ""}` : "Portfolio";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: {
    default: title,
    template: name ? `%s — ${name}` : "%s",
  },
  ...(description ? { description } : {}),
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "profile",
    title,
    ...(description ? { description } : {}),
    ...(siteUrl ? { url: siteUrl.href } : {}),
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    ...(description ? { description } : {}),
  },
  // Off until the site has a real address; see `lib/site-url.ts`.
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Marks the document as JavaScript-capable before first paint.
          Scroll reveals only hide their content under `html.js`, so if this
          never runs — or JavaScript is off entirely — every section is simply
          visible instead of waiting for an animation that will not arrive.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
        <StructuredData />
      </head>
      <body>
        <ReducedMotionProvider>
          {children}
          <ScrollChoreography />
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
