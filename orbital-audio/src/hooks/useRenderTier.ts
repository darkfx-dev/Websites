import { useEffect, useState } from "react";

export type RenderTier =
  /** Full scene: camera moves, full particle count. */
  | "full"
  /** Fewer particles, no camera travel, one gentle pulse. */
  | "light"
  /** No WebGL at all — the CSS fallback stands in. */
  | "still";

export type RenderMode = {
  tier: RenderTier;
  reduced: boolean;
  /** Cap for the WebGL drawing buffer. */
  dpr: [number, number];
  /** False until the device has been measured after mount. */
  ready: boolean;
};

const INITIAL: RenderMode = {
  tier: "still",
  reduced: false,
  dpr: [1, 1.5],
  ready: false,
};

/**
 * Worked out once per page load and shared, because part of the answer costs
 * a real WebGL context and three components ask the same question.
 */
let cached: RenderMode | null = null;

function measure(): RenderMode {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return { tier: "still", reduced, dpr: [1, 1], ready: true };

  // Ask whether WebGL is possible, then hand the context straight back so it
  // never counts against the browser's live-context budget.
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webgl = Boolean(gl);
    (gl as WebGLRenderingContext | null)
      ?.getExtension("WEBGL_lose_context")
      ?.loseContext();
  } catch {
    webgl = false;
  }
  if (!webgl) return { tier: "still", reduced, dpr: [1, 1], ready: true };

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 860px)").matches;

  // Core count is a weak proxy for GPU capability and an easy one to get
  // wrong in the strict direction: a four-core laptop is ordinary hardware,
  // not a low-end device, and gating it out would downgrade a large share of
  // real desktops for nothing. The runtime frame-rate guard inside the scene
  // is the actual defence — this only catches the obvious cases up front.
  const modest = memory <= 4 || cores <= 2 || coarse || narrow;

  return {
    tier: modest ? "light" : "full",
    reduced,
    dpr: modest ? [1, 1.3] : [1, 1.75],
    ready: true,
  };
}

/**
 * Deliberately pessimistic: it starts at `still` and only escalates once the
 * device has proven itself after mount, so a slow phone never renders a heavy
 * first frame while we work out what it is.
 */
export function useRenderTier(): RenderMode {
  const [mode, setMode] = useState<RenderMode>(INITIAL);

  useEffect(() => {
    if (!cached) cached = measure();
    setMode(cached);

    // Someone can turn the preference on while the page is open.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      cached = measure();
      setMode(cached);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return mode;
}
