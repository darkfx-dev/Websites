import { Header } from "./components/Header";
import { MeterRail } from "./components/MeterRail";
import { SceneLayer } from "./three/SceneLayer";
import { Hero } from "./sections/Hero";
import { Product } from "./sections/Product";
import { Workflow } from "./sections/Workflow";
import { Pricing } from "./sections/Pricing";
import { FinalCta, Footer } from "./sections/Close";

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Fixed, inert, and behind everything. Removing it costs the page
          nothing but atmosphere — every word is in the DOM above it. */}
      <SceneLayer />
      <MeterRail />

      <Header />

      <main id="main" className="content">
        <Hero />
        <Product />
        <Workflow />
        <Pricing />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
