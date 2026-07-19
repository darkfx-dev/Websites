"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FallbackEmblem } from "./FallbackEmblem";

// Lazy-load the WebGL scene only on the client; show the emblem while loading.
const Scene3D = dynamic(() => import("./Scene3D").then((m) => m.Scene3D), {
  ssr: false,
  loading: () => <FallbackEmblem loading />,
});

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return (
      !!window.WebGLRenderingContext &&
      !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Client wrapper that decides between the interactive 3D scene and the
 * lightweight CSS fallback based on WebGL availability.
 */
export function Hero3D() {
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);

  if (webgl === null) return <FallbackEmblem loading />;
  if (!webgl) return <FallbackEmblem />;
  return <Scene3D />;
}
