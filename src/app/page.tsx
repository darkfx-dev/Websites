import { LoadingScreen } from "@/components/loading-screen";
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { Section3D } from "@/components/motion/section-3d";
import { SmoothAnchorScroll } from "@/components/motion/smooth-anchor-scroll";
import { ClickRipple } from "@/components/motion/click-ripple";
import { DishCarousel3D } from "@/components/motion/dish-carousel-3d";
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
      <SmoothAnchorScroll />
      <ClickRipple />
      <SkipLink />
      <SiteHeader />
      <main id="main">
        {/*
         * Section3D adds the scroll-linked depth hand-off between sections
         * (desktop + motion-OK only; see the component for the safety notes).
         * Two sections deliberately opt out: the hero, which runs its own
         * entrance choreography, and MenuScrollStory, whose ScrollTrigger pin
         * must not sit inside a transformed ancestor. MenuExplorer also opts
         * out — tilting a container while the user is filtering and typing in
         * it would fight the interaction rather than support it.
         */}
        <HeroSection />
        <TrustStrip />
        <DishCarousel3D />
        <Section3D>
          <MenuHighlights />
        </Section3D>
        <MenuScrollStory />
        <MenuExplorer />
        <Section3D>
          <ServiceHighlights />
        </Section3D>
        <Section3D>
          <ReputationSection />
        </Section3D>
        <Section3D>
          <LocationSection />
        </Section3D>
        <Section3D>
          <ContactSection />
        </Section3D>
        <Section3D>
          <InstagramSection />
        </Section3D>
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
