import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { World } from "./World";

/* One WebGL canvas, fixed behind the overlays. Adaptive DPR, local room
   environment for metal reflections (no network fetch), and it stops rendering
   when the tab is hidden. */
export default function CinematicCanvas({
  tier,
  onReady,
}: {
  tier: "full" | "lite";
  onReady?: () => void;
}) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <Canvas
      frameloop={hidden ? "never" : "always"}
      dpr={tier === "full" ? [1, 1.5] : 1}
      camera={{ fov: 40, near: 0.1, far: 220, position: [5, 3.2, 8] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        const pmrem = new THREE.PMREMGenerator(gl);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
        pmrem.dispose();
        // Signal ready once the first frame has actually painted.
        if (onReady) requestAnimationFrame(() => requestAnimationFrame(onReady));
      }}
    >
      <World tier={tier} />
    </Canvas>
  );
}
