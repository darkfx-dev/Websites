import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { keepMeasuring, view } from "../lib/scroll";
import { emptyKeyframe, KEYFRAMES, sampleStage, type Keyframe } from "./keyframes";
import { Core, type CoreHandle } from "./Core";
import { Field, type FieldHandle } from "./Field";

/**
 * Reads the shared scroll value once per frame and damps the whole scene
 * toward it.
 *
 * This is the only place scroll position touches 3D. Because it reads the
 * mutable `view` object inside `useFrame` rather than React state, scrolling
 * the page causes zero React renders in this subtree.
 */
function Rig({
  core,
  field,
  moveCamera,
}: {
  core: CoreHandle;
  field: FieldHandle;
  /** False on the reduced tier — the camera holds its opening position. */
  moveCamera: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const sample = useMemo(emptyKeyframe, []);
  const look = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((_, delta) => {
    // `delta` can spike after a tab has been in the background; clamping it
    // stops the camera lurching across the scene on the first frame back.
    const dt = Math.min(delta, 0.05);
    const k: Keyframe = moveCamera
      ? sampleStage(view.stage, sample)
      : Object.assign(sample, KEYFRAMES.hero);

    // Aiming left of the core pushes it into the right of the frame, which is
    // both the intended composition and how the hero copy gets a column the
    // particle field never crosses. Below the two-column breakpoint the
    // layout stacks, so the core returns to centre.
    look.x = THREE.MathUtils.damp(look.x, width >= 1024 ? -1.45 : 0, 3, dt);

    if (moveCamera) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, k.camera[0], 1.9, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, k.camera[1], 1.9, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, k.camera[2], 1.9, dt);
    }
    camera.lookAt(look);

    core.emissive = THREE.MathUtils.damp(core.emissive, k.emissive, 2.4, dt);
    field.spread = THREE.MathUtils.damp(field.spread, k.spread, 2.1, dt);
    field.flatten = THREE.MathUtils.damp(field.flatten, k.flatten, 2.1, dt);
    field.ring = THREE.MathUtils.damp(field.ring, k.ring, 2.1, dt);
    field.density = THREE.MathUtils.damp(field.density, k.density, 2.1, dt);
  });

  return null;
}

export function OrbitalScene({
  tier,
  dpr,
}: {
  tier: "full" | "light";
  dpr: [number, number];
}) {
  // Static device signals only get you so far — there is no way to ask a
  // browser how fast its GPU is. This watches the frame rate that actually
  // happens and steps the scene down if it cannot keep up: first the pixel
  // ratio, which is what a particle scene is usually bound by, and then the
  // particle count if that was not enough.
  const [degraded, setDegraded] = useState(false);
  const [minimal, setMinimal] = useState(false);

  const full = tier === "full" && !minimal;

  // Plain mutable objects rather than state: the Rig writes them every frame
  // and the Core and Field read them every frame, with React uninvolved.
  const core = useRef<CoreHandle>({ emissive: 0 }).current;
  const field = useRef<FieldHandle>({
    spread: 1,
    flatten: 0,
    ring: 0,
    density: 0,
  }).current;

  // The scene reads `view` but never subscribes to renders, so it has to keep
  // the measurement running itself.
  useEffect(() => keepMeasuring(), []);

  return (
    <Canvas
      dpr={degraded ? 1 : dpr}
      gl={{
        antialias: full,
        alpha: false,
        powerPreference: "high-performance",
      }}
      camera={{ fov: 42, near: 0.1, far: 40, position: [...KEYFRAMES.hero!.camera] }}
      // Nothing in the scene is interactive, so skip the raycaster entirely.
      events={undefined}
      onCreated={({ gl }) => {
        gl.setClearColor("#06090f", 1);
      }}
    >
      <PerformanceMonitor
        onDecline={() => setDegraded(true)}
        flipflops={3}
        onFallback={() => setMinimal(true)}
      />
      <Rig core={core} field={field} moveCamera={full} />
      <Core target={core} animate={full} />
      <Field count={full ? 2400 : 650} target={field} animate={full} />
    </Canvas>
  );
}

export default OrbitalScene;
