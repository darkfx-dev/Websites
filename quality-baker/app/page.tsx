import { Header } from "@/components/Header";
import { Fabs } from "@/components/Fabs";
import { DripDivider } from "@/components/DripDivider";
import { Hero } from "@/components/sections/Hero";
import { Craft } from "@/components/sections/Craft";
import { OrderSection } from "@/components/sections/OrderSection";
import { Bespoke } from "@/components/sections/Bespoke";
import { StudioSection } from "@/components/sections/StudioSection";
import { Values } from "@/components/sections/Values";
import { Reviews } from "@/components/sections/Reviews";
import { Gallery } from "@/components/sections/Gallery";
import { Faq } from "@/components/sections/Faq";
import { Location } from "@/components/sections/Location";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <DripDivider from="noir" />
        <Craft />
        <DripDivider from="cream" />
        <OrderSection />
        <Bespoke />
        <StudioSection />
        <Values />
        <Reviews />
        <Gallery />
        <DripDivider from="noir" />
        <Faq />
        <Location />
      </main>
      <Footer />
      <Fabs />
    </>
  );
}
