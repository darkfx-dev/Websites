import { lazy, Suspense } from "react";
import { Poster } from "./Poster";
import { SceneErrorBoundary } from "./SceneErrorBoundary";

/* The fixed cinematic layer. The WebGL chunk (three + R3F) is code-split behind
   the static poster, so the page paints and stays interactive before it loads,
   and any WebGL failure falls back to the poster instead of crashing. */
const CinematicCanvas = lazy(() => import("../../scene/CinematicCanvas"));

export function ScrollWorldExperience({
  tier,
  onReady,
}: {
  tier: "full" | "lite";
  onReady: () => void;
}) {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <SceneErrorBoundary fallback={<Poster />}>
        <Suspense fallback={<Poster />}>
          <CinematicCanvas tier={tier} onReady={onReady} />
        </Suspense>
      </SceneErrorBoundary>
    </div>
  );
}
