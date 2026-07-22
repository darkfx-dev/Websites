import { lazy, Suspense, useEffect, useState, type RefObject } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { scrollBus } from "./scrollBus";
import { Poster } from "./Poster";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { useQuality } from "../hooks/useQuality";

/* The 3D chunk (three.js + R3F) is code-split — the page is fully usable
   before it arrives, with the static poster in its place. */
const SceneCanvas = lazy(() => import("./SceneCanvas"));

function useObjectOffset() {
  const [off, setOff] = useState<{ x: number; y: number }>(() =>
    typeof window !== "undefined" && window.innerWidth < 900
      ? { x: 0, y: -1.85 }
      : { x: 1.7, y: 0.1 },
  );
  useEffect(() => {
    const onResize = () =>
      setOff(window.innerWidth < 900 ? { x: 0, y: -1.85 } : { x: 1.7, y: 0.1 });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return off;
}

export function VisualLayer({ storyRef }: { storyRef: RefObject<HTMLElement | null> }) {
  const quality = useQuality();
  const off = useObjectOffset();
  const [paused, setPaused] = useState(false);

  /* Story progress 0→1 drives the sculpture's A→D states */
  const { scrollYProgress: story } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(story, "change", (v) => {
    scrollBus.story = v;
  });

  /* Fade the whole canvas out after the story section passes,
     then stop rendering entirely */
  const { scrollYProgress: exit } = useScroll({
    target: storyRef,
    offset: ["end 0.85", "end 0.35"],
  });
  const opacity = useTransform(exit, [0, 1], [1, 0]);
  useMotionValueEvent(opacity, "change", (v) => {
    scrollBus.fade = v;
    setPaused(v < 0.02);
  });

  /* Pointer tracking — fine pointers only; raw values are damped in-scene */
  useEffect(() => {
    if (quality.tier !== "full") return;
    const onMove = (e: PointerEvent) => {
      scrollBus.px = (e.clientX / window.innerWidth - 0.5) * 2;
      scrollBus.py = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onLeave = () => {
      scrollBus.px = 0;
      scrollBus.py = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [quality.tier]);

  if (quality.tier === "static") {
    return (
      <div className="visual-layer" aria-hidden="true">
        <Poster />
      </div>
    );
  }

  return (
    <motion.div className="visual-layer" aria-hidden="true" style={{ opacity }}>
      <SceneErrorBoundary fallback={<Poster />}>
        <Suspense fallback={<Poster />}>
          <SceneCanvas quality={quality} paused={paused} xOffset={off.x} yOffset={off.y} />
        </Suspense>
      </SceneErrorBoundary>
    </motion.div>
  );
}
