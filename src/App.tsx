import { useRef } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { ScrollStory } from "./components/ScrollStory";
import { Capabilities } from "./components/Capabilities";
import { Process } from "./components/Process";
import { Faq } from "./components/Faq";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";
import { VisualLayer } from "./scene/VisualLayer";

export default function App() {
  /* Shared ref: ScrollStory owns the tall section, VisualLayer reads its
     scroll progress to drive the 3D sculpture states */
  const storyRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <VisualLayer storyRef={storyRef} />
      <main id="main">
        <Hero />
        <ScrollStory ref={storyRef} />
        <Capabilities />
        <Process />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
