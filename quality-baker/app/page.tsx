import { Nav } from "@/components/Nav";
import { Fabs } from "@/components/Fabs";
import { DripDivider } from "@/components/DripDivider";
import { Hero } from "@/components/sections/Hero";
import { Craft } from "@/components/sections/Craft";
import { OrderSection } from "@/components/sections/OrderSection";
import { Reviews } from "@/components/sections/Reviews";
import { Gallery } from "@/components/sections/Gallery";
import { Location } from "@/components/sections/Location";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <DripDivider from="noir" />
        <Craft />
        <DripDivider from="cream" />
        <OrderSection />
        <DripDivider from="noir" />
        <Reviews />
        <Gallery />
        <Location />
      </main>
      <Footer />
      <Fabs />
    </>
  );
}
