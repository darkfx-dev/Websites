/* One normalized scroll source (0..1 over the whole page) shared by the R3F
   camera loop (reads `scroll.v` imperatively each frame) and the DOM overlays
   (read the framer MotionValue via useTransform). Keeps the two systems in
   lockstep without fighting. */
import { scenes } from "../content/experience";

export const SCENE_COUNT = scenes.length;

/** Mutable progress the WebGL frame loop reads (avoids React re-renders). */
export const scroll = { v: 0 };

/** Curve parameter (0..1) where scene i sits: scene 0 at top, last at bottom. */
export function stationT(i: number): number {
  return i / (SCENE_COUNT - 1);
}

/** Overlay fade ranges for scene i: [out, in, in, out] over global progress. */
export function overlayRange(i: number): [number, number, number, number] {
  const c = stationT(i);
  const half = 1 / (SCENE_COUNT - 1); // spacing between stations
  const inW = half * 0.42; // fully-visible half-width
  const outW = half * 0.72; // fade edge
  return [c - outW, c - inW, c + inW, c + outW];
}
