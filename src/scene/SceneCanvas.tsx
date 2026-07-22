import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Sculpture } from "./Sculpture";
import type { Quality } from "../hooks/useQuality";

/* One WebGL canvas for the whole page. Quality tiers:
   - full: 14 shards, dpr up to 1.5, pointer tilt
   - lite: 9 shards, dpr 1, no pointer tilt (touch / small / weak devices)
   Environment reflections come from three's built-in RoomEnvironment —
   generated locally, no network fetch, no extra dependencies. */
export default function SceneCanvas({
  quality,
  paused,
  xOffset,
  yOffset,
}: {
  quality: Quality;
  paused: boolean;
  xOffset: number;
  yOffset: number;
}) {
  const full = quality.tier === "full";
  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={full ? [1, 1.5] : 1}
      camera={{ fov: 42, position: [0, 0, 7] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl, scene }) => {
        const pmrem = new THREE.PMREMGenerator(gl);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        pmrem.dispose();
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />
      <pointLight position={[-4, -2, -3]} intensity={12} color="#5668ff" />
      <Sculpture
        shardCount={full ? 14 : 9}
        xOffset={xOffset}
        yOffset={yOffset}
        pointerEnabled={full}
      />
    </Canvas>
  );
}
