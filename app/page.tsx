import { AboutOutlet } from "@/components/about-outlet";
import { ApprovedGallery } from "@/components/approved-gallery";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CinematicHero } from "@/components/sections/cinematic-hero";
import { LocationContact } from "@/components/location-contact";
import { MenuExplorer } from "@/components/menu-explorer";
import { MobileInquiryBar } from "@/components/mobile-inquiry-bar";
import { QuickFacts } from "@/components/quick-facts";
import { ReviewEvidence } from "@/components/review-evidence";
import { restaurantJsonLd } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
      />

      <Header />

      <main id="main">
        <CinematicHero />
        <MobileInquiryBar />
        <QuickFacts />
        <MenuExplorer />
        <ReviewEvidence />
        <AboutOutlet />
        {/* Renders nothing until owner-approved, rights-cleared photos exist. */}
        <ApprovedGallery />
        <LocationContact />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
