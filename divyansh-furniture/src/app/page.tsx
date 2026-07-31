import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DepthBackground } from "@/components/motion/DepthBackground";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Services } from "@/sections/Services";
import { Gallery } from "@/sections/Gallery";
import { Testimonials } from "@/sections/Testimonials";
import { Packages } from "@/sections/Packages";
import { Amenities } from "@/sections/Amenities";
import { Location } from "@/sections/Location";
import { BookingCta } from "@/sections/BookingCta";
import { Faq } from "@/sections/Faq";

/**
 * The page.
 *
 * A server component composing server components. Only the four parts that
 * need the browser — the navbar, the booking picker, the booking buttons and
 * the scroll reveals — are client components, so almost all of this HTML is
 * sent complete and needs no JavaScript to be readable.
 */
export default function Home() {
  return (
    <>
      <a className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:inline-flex focus-visible:min-h-[48px] focus-visible:items-center focus-visible:rounded-sm focus-visible:border focus-visible:border-hairline-strong focus-visible:bg-walnut-raised focus-visible:px-5 focus-visible:text-sm" href="#main">
        Skip to content
      </a>

      <DepthBackground />
      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <Packages />
        <Amenities />
        <Location />
        <BookingCta />
        <Faq />
      </main>

      <Footer />
    </>
  );
}
