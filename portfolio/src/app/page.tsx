import { SkipLink } from "@/components/ui/skip-link";
import { Navigation } from "@/components/navigation/navigation";
import { Hero } from "@/components/hero/hero";
import { About } from "@/components/sections/about";
import { SelectedWork } from "@/components/sections/selected-work";
import { Skills } from "@/components/sections/skills";
import { Testimonials } from "@/components/sections/testimonials";
import { Writing } from "@/components/sections/writing";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

/** A hairline divider between sections. Decorative, so it is hidden from AT. */
function Divider() {
  return (
    <div className="shell" aria-hidden="true">
      <div className="rule" data-choreo="rule" />
    </div>
  );
}

/**
 * The page.
 *
 * A server component composing server components. Only the parts that need
 * the browser — navigation state, the 3D canvas, the scroll reveals, the flow
 * preview — are client components, so almost all of this HTML is sent
 * complete and needs no JavaScript to be readable.
 */
export default function Home() {
  return (
    <>
      <SkipLink />
      <Navigation />

      <main id="main" className="relative z-10">
        <Hero />
        <Divider />
        <About />
        <Divider />
        <SelectedWork />
        <Divider />
        <Skills />
        <Testimonials />
        <Writing />
        <Divider />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
