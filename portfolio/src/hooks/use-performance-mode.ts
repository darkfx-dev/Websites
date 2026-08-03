"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "full" | "reduced" | "static";

export type PerformanceMode = {
  /** How much of the 3D scene this device should be asked to render. */
  tier: PerformanceTier;
  /** Precise, hover-capable pointer — gates tilt and pointer parallax. */
  finePointer: boolean;
  /** Cap for the WebGL drawing buffer. */
  dpr: [number, number];
  /** Resolved after mount; before that, callers should assume nothing. */
  ready: boolean;
};

const INITIAL: PerformanceMode = {
  tier: "static",
  finePointer: false,
  dpr: [1, 1.5],
  ready: false,
};

/**
 * Decides how much visual work this device should be asked to do.
 *
 * Deliberately conservative: it starts at `static` and only escalates once
 * the device has proven itself after mount, so a slow phone never renders a
 * heavy first frame while we work out what it is.
 *
 * Signals used, in order of reliability:
 *   - `prefers-reduced-motion` → always `static`
 *   - absence of WebGL          → always `static`
 *   - `deviceMemory` / `hardwareConcurrency` → `reduced` on small machines
 *   - coarse pointer / narrow viewport       → `reduced`
 */
/**
 * The answer is a property of the device, not of any one component, and part
 * of working it out costs a real WebGL context. It is computed once per page
 * load and shared, so mounting three consumers does not mean three probes.
 */
let cached: PerformanceMode | null = null;

function resolve(): PerformanceMode {
  if (cached) return cached;
  cached = measure();
  return cached;
}

export function usePerformanceMode(): PerformanceMode {
  const [mode, setMode] = useState<PerformanceMode>(INITIAL);

  useEffect(() => {
    setMode(resolve());
  }, []);

  return mode;
}

function measure(): PerformanceMode {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (reduced) {
    return { tier: "static", finePointer, dpr: [1, 1], ready: true };
  }

  // A WebGL context is created once, purely to ask whether it is possible,
  // then released immediately so it never counts against the browser's
  // live-context budget.
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webgl = Boolean(gl);
    const lose = (gl as WebGLRenderingContext | null)?.getExtension(
      "WEBGL_lose_context"
    );
    lose?.loseContext();
  } catch {
    webgl = false;
  }

  if (!webgl) {
    return { tier: "static", finePointer, dpr: [1, 1], ready: true };
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const narrow = window.matchMedia("(max-width: 860px)").matches;

  const modest = memory <= 4 || cores <= 4 || narrow || !finePointer;

  return {
    tier: modest ? "reduced" : "full",
    finePointer,
    dpr: modest ? [1, 1.35] : [1, 1.9],
    ready: true,
  };
}
