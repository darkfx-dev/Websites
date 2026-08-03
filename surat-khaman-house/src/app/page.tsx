import { About } from "@/components/about";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { InquiryCta } from "@/components/inquiry-cta";
import { LocationContact } from "@/components/location-contact";
import { MenuExplorer } from "@/components/menu-explorer";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { QuickFacts } from "@/components/quick-facts";
import { ReviewEvidence } from "@/components/review-evidence";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, SkipLink } from "@/components/site-header";

/**
 * Section order is load-bearing, not cosmetic: the site introduces the
 * business, its menu, its prices and its contact actions first, and reveals
 * the outlet's location only in the final substantial section before the
 * footer.
 *
 * The bottom padding on `<main>` reserves room for the fixed mobile action
 * bar so it cannot cover the end of the page.
 */
export default function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />

      <main id="main" className="pb-24 md:pb-0">
        <div id="top" />
        <Hero />
        <QuickFacts />
        <MenuExplorer />
        <ReviewEvidence />
        <About />
        <Faq />
        <InquiryCta />
        <LocationContact />
      </main>

      <SiteFooter />
      <MobileActionBar />
    </>
  );
}
