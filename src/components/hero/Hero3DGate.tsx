import { lazy, Suspense, useEffect, useState } from "react";

const HeroScene = lazy(() => import("./HeroScene"));

/**
 * Decides whether the device earns the 3D hero. Everyone else keeps the
 * static SVG — which is styled as a first-class visual, not a downgrade.
 * The gate errs on the side of NOT loading the WebGL bundle.
 */
function deviceIsCapable(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 700) return false; // small screens keep the SVG

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|\b)(slow-2g|2g|3g)\b/.test(nav.connection.effectiveType)) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
  } catch {
    return false;
  }
  return true;
}

export default function Hero3DGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (deviceIsCapable()) setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <HeroScene />
    </Suspense>
  );
}
