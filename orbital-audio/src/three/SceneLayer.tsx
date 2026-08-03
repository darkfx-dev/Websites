import { Suspense, lazy, useEffect, useState } from "react";
import { useRenderTier } from "../hooks/useRenderTier";
import { SceneFallback } from "./SceneFallback";

/**
 * three.js and the scene are ~600 kB of the bundle and are pure decoration:
 * every word on the page is readable without them. Loading them lazily is the
 * single biggest performance decision here — the fallback renders instantly
 * and the canvas replaces it once it is ready.
 */
const OrbitalScene = lazy(() => import("./OrbitalScene"));

export function SceneLayer() {
  const { tier, dpr, ready } = useRenderTier();
  const [lost, setLost] = useState(false);

  // A WebGL context can be taken away at any time — a driver reset, the tab
  // being evicted, too many live contexts. Falling back keeps the page
  // looking finished instead of going black.
  useEffect(() => {
    const onLost = (e: Event) => {
      e.preventDefault();
      setLost(true);
    };
    const host = document.querySelector(".scene-layer");
    host?.addEventListener("webglcontextlost", onLost, true);
    return () => host?.removeEventListener("webglcontextlost", onLost, true);
  }, []);

  const show3D = ready && tier !== "still" && !lost;

  return (
    <div className="scene-layer" aria-hidden="true">
      {show3D ? (
        <Suspense fallback={<SceneFallback />}>
          <OrbitalScene tier={tier === "full" ? "full" : "light"} dpr={dpr} />
        </Suspense>
      ) : (
        <SceneFallback />
      )}
    </div>
  );
}
