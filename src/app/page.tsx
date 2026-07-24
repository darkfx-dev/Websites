import { LoadingScreen } from "@/components/loading-screen";
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { TrustStrip } from "@/components/trust-strip";
import dynamic from "next/dynamic";
import { MenuHighlights } from "@/components/menu-highlights";
import { MenuExplorer } from "@/components/menu/menu-explorer";
import { ServiceHighlights } from "@/components/service-highlights";

// Lazy-load the GSAP-powered scroll story so GSAP stays out of the initial
// bundle. SSR stays on, so its stacked content is present without JS.
const MenuScrollStory = dynamic(() =>
  import("@/components/motion/menu-scroll-story").then((m) => m.MenuScrollStory)
);
import { ReputationSection } from "@/components/reputation-section";
import { LocationSection } from "@/components/location-section";
import { ContactSection } from "@/components/contact-section";
import { InstagramSection } from "@/components/instagram-section";
import { SiteFooter } from "@/components/site-footer";
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { StructuredData } from "@/components/structured-data";

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <StructuredData />
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <TrustStrip />
        <MenuHighlights />
        <MenuScrollStory />
        <MenuExplorer />
        <ServiceHighlights />
        <ReputationSection />
        <LocationSection />
        <ContactSection />
        <InstagramSection />
      </main>
      <SiteFooter />
      {/* Persistent conversion controls */}
      <FloatingWhatsAppButton />
      <MobileActionBar />
      {/* Spacer so the fixed mobile action bar never covers the footer's end. */}
      <div className="h-[76px] lg:hidden" aria-hidden="true" />
    </>
  );
}
