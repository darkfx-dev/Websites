"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import { HeroSceneFallback } from "./hero-scene-fallback";
import { clamp } from "@/lib/utils";

/**
 * Loaded on demand and never server-rendered: WebGL cannot run on the server,
 * and keeping three/@react-three out of the initial bundle is the single
 * biggest performance decision on this page.
 */
const SystemCore = dynamic(() => import("@/components/three/system-core"), {
  ssr: false,
  loading: () => <HeroSceneFallback />,
});

/**
 * Owns the decision of whether the 3D hero runs, and feeds it scroll
 * progress.
 *
 * Progress is written into a ref by a scroll listener and read inside the
 * render loop, so scrolling never triggers a React re-render — the scene
 * reads the latest value on the frame it actually draws.
 *
 * The canvas is unmounted entirely once the hero is off screen. That is
 * stronger than pausing: it releases the WebGL context and its GPU memory
 * for the rest of the visit.
 */
export function HeroScene() {
  const { tier, finePointer, dpr, ready } = usePerformanceMode();
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [inView, setInView] = useState(true);
  const [failed, setFailed] = useState(false);

  // Scroll progress across the hero, throttled to one write per frame.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = host.getBoundingClientRect();
      const travel = rect.height || window.innerHeight;
      progressRef.current = clamp(-rect.top / travel, 0, 1);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Mount the canvas only while the hero is near the viewport.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) setInView(entry.isIntersecting);
      },
      { rootMargin: "220px 0px" }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  // A WebGL context can be lost at any time (driver reset, tab eviction).
  // Falling back keeps the hero looking finished rather than blank.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onLost = (e: Event) => {
      e.preventDefault();
      setFailed(true);
    };
    host.addEventListener("webglcontextlost", onLost, true);
    return () => host.removeEventListener("webglcontextlost", onLost, true);
  }, []);

  const show3D = ready && tier !== "static" && inView && !failed;

  return (
    <div ref={hostRef} className="absolute inset-0" aria-hidden="true">
      {show3D ? (
        <SystemCore
          progressRef={progressRef}
          tier={tier}
          finePointer={finePointer}
          dpr={dpr}
        />
      ) : (
        <HeroSceneFallback />
      )}
    </div>
  );
}
