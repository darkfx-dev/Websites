import { MotionProvider } from "./components/MotionProvider";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { HeritageStory } from "./components/HeritageStory";
import { Gallery } from "./components/Gallery";
import { ServicesInquiry } from "./components/ServicesInquiry";
import { BusinessHours } from "./components/BusinessHours";
import { EnquiryBuilder } from "./components/EnquiryBuilder";
import { LocationSection } from "./components/LocationSection";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { FloatingActions } from "./components/FloatingActions";
import { MobileActionBar } from "./components/MobileActionBar";

export default function App() {
  return (
    <MotionProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <HeritageStory />
        <Gallery />
        <ServicesInquiry />
        <BusinessHours />
        <EnquiryBuilder />
        <LocationSection />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingActions />
      <MobileActionBar />
    </MotionProvider>
  );
}
