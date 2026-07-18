import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Craft } from "@/components/sections/Craft";
import { MenuSection } from "@/components/sections/MenuSection";
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
        <Craft />
        <MenuSection />
        <Reviews />
        <Gallery />
        <Location />
      </main>
      <Footer />
    </>
  );
}
