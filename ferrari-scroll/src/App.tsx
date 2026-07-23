import { useCallback, useState } from "react";
import { LazyMotion, domAnimation, MotionConfig, useScroll, useMotionValueEvent } from "framer-motion";
import { detectQuality } from "./lib/quality";
import { scroll } from "./lib/progress";
import { scenes, legal } from "./content/experience";
import { easeCine } from "./lib/motion";
import { SiteHeader } from "./components/navigation/SiteHeader";
import { ScrollWorldExperience } from "./components/cinematic/ScrollWorldExperience";
import { SceneOverlay } from "./components/cinematic/SceneOverlay";
import { SceneProgress } from "./components/cinematic/SceneProgress";
import { CinematicLoader } from "./components/cinematic/CinematicLoader";
import { StaticExperience } from "./components/fallback/StaticExperience";

export default function App() {
  const [quality] = useState(detectQuality);
  const [ready, setReady] = useState(false);

  // One normalized scroll source → the WebGL loop (imperative) + overlays.
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scroll.v = v;
  });

  const restart = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (quality.tier === "static") {
    return (
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user" transition={{ ease: easeCine }}>
          <a href="#main" className="skip-link">Skip to content</a>
          <StaticExperience />
        </MotionConfig>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: easeCine }}>
        <a href="#main" className="skip-link">Skip to content</a>
        <SiteHeader />

        {/* Fixed cinematic layer (behind everything) */}
        <ScrollWorldExperience tier={quality.tier} onReady={() => setReady(true)} />

        {/* Visual overlays — decorative; real copy is in the sections below */}
        {scenes.map((s, i) => (
          <SceneOverlay
            key={s.id}
            scene={s}
            index={i}
            isLast={i === scenes.length - 1}
            progress={scrollYProgress}
            onRestart={restart}
          />
        ))}
        <SceneProgress progress={scrollYProgress} />

        {/* Scroll spacer + semantic content (screen-reader / no-JS source of truth).
            Each section's top aligns the camera + overlay to its station. */}
        <main id="main" className="pointer-events-none relative z-20">
          {scenes.map((s, i) => {
            const Heading = i === 0 ? "h1" : "h2";
            return (
              <section key={s.id} id={s.id} className="h-screen" aria-labelledby={`${s.id}-h`}>
                <div className="sr-only">
                  <p>{s.eyebrow}</p>
                  <Heading id={`${s.id}-h`}>{s.title}</Heading>
                  <p>{s.body}</p>
                </div>
              </section>
            );
          })}
        </main>

        {/* Persistent, readable rights note */}
        <p className="pointer-events-none fixed inset-x-0 bottom-2 z-30 px-4 text-center text-[0.66rem] text-silver/80">
          {legal.disclaimer}
        </p>

        <CinematicLoader visible={!ready} />
      </MotionConfig>
    </LazyMotion>
  );
}
