"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { clamp, damp } from "@/lib/utils";
import type { PerformanceTier } from "@/hooks/use-performance-mode";

/**
 * "System Core" — the hero's 3D object.
 *
 * The concept is the journey the portfolio describes: an unresolved problem
 * is drawn in, structured by a system, and resolved into an outcome. That is
 * expressed as three concentric orbiting layers around a refractive core,
 * held inside thin architectural rails.
 *
 * Everything is driven by one `progress` value (0 at the top of the hero, 1
 * once the About section is reached) rather than by its own timeline, so the
 * object stays synchronised with the page instead of animating independently.
 */

type SceneProps = {
  /** 0 → 1 scroll progress across the hero. */
  progressRef: React.MutableRefObject<number>;
  tier: PerformanceTier;
  finePointer: boolean;
};

/** Layer definitions: radius, tilt, colour, and how many signal points. */
const LAYERS = [
  { radius: 1.62, tilt: 0.0, color: "#8b97ff", points: 3, label: "problem" },
  { radius: 2.12, tilt: 0.62, color: "#c9d1ff", points: 4, label: "system" },
  { radius: 2.66, tilt: -0.44, color: "#8fd6a4", points: 3, label: "outcome" },
] as const;

function Core({ progressRef, tier, finePointer }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const coreMesh = useRef<THREE.Mesh>(null);
  const layerRefs = useRef<(THREE.Group | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const { camera, gl } = useThree();

  // Geometries and materials are created once and shared, then disposed by
  // R3F when the tree unmounts.
  const coreGeometry = useMemo(
    () => new THREE.IcosahedronGeometry(1, tier === "full" ? 3 : 2),
    [tier]
  );

  const ringGeometry = useMemo(
    () => new THREE.TorusGeometry(1, 0.0055, 8, tier === "full" ? 180 : 96),
    [tier]
  );

  const pointGeometry = useMemo(() => new THREE.SphereGeometry(0.032, 12, 12), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const p = clamp(progressRef.current, 0, 1);
    const t = state.clock.elapsedTime;

    // Pointer parallax, damped and clamped so it reads as a gentle camera
    // lean rather than the object chasing the cursor.
    if (finePointer) {
      pointer.current.x = damp(pointer.current.x, state.pointer.x, 3.2, dt);
      pointer.current.y = damp(pointer.current.y, state.pointer.y, 3.2, dt);
    }

    if (group.current) {
      const g = group.current;
      // Continuous slow rotation, plus a quarter turn earned by scrolling.
      g.rotation.y = t * 0.085 + p * Math.PI * 0.5;
      // Tips forward slightly as the layers separate.
      g.rotation.x = -0.18 + pointer.current.y * 0.07 + p * 0.24;
      g.rotation.z = pointer.current.x * 0.045;
      // Settles downward and shrinks a touch on the way to About.
      g.position.y = -p * 0.55;
      const s = 1 - p * 0.12;
      g.scale.setScalar(s);
    }

    // The camera moves slightly closer, and the whole composition drifts up
    // out of frame as the next section takes over.
    camera.position.z = 7.4 - p * 0.85;
    camera.position.x = pointer.current.x * 0.28;
    camera.position.y = 0.65 + pointer.current.y * 0.2 + p * 0.3;
    camera.lookAt(0, -p * 0.35, 0);

    // Layers separate along their own axes and slow their spin as they align.
    layerRefs.current.forEach((layer, i) => {
      if (!layer) return;
      const def = LAYERS[i];
      if (!def) return;
      const dir = i % 2 === 0 ? 1 : -1;
      layer.rotation.z = def.tilt + dir * t * (0.16 - i * 0.035) * (1 - p * 0.7);
      // Push outward, so the rings resolve into flat planes near the end.
      layer.scale.setScalar(1 + p * (0.1 + i * 0.07));
    });

    if (coreMesh.current) {
      coreMesh.current.rotation.x = t * 0.14;
      coreMesh.current.rotation.y = -t * 0.1;
    }

    gl.render(state.scene, camera);
  }, 1);

  return (
    <group ref={group} dispose={null}>
      {/* Refractive core. `transmission` gives real glass without an
          environment-heavy setup; on modest devices it degrades to a
          cheaper physical material with no transmission pass. */}
      <mesh ref={coreMesh} geometry={coreGeometry}>
        {tier === "full" ? (
          <meshPhysicalMaterial
            transmission={0.92}
            thickness={1.6}
            roughness={0.14}
            metalness={0}
            ior={1.42}
            clearcoat={1}
            clearcoatRoughness={0.18}
            color="#cdd6ff"
            attenuationColor="#6d7cff"
            attenuationDistance={2.4}
          />
        ) : (
          <meshStandardMaterial
            color="#9aa6e8"
            roughness={0.28}
            metalness={0.3}
            transparent
            opacity={0.72}
          />
        )}
      </mesh>

      {/* Inner glow shell — reads as the core being lit from within. */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#6d7cff"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {LAYERS.map((layer, i) => (
        <group
          key={layer.label}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          rotation={[Math.PI / 2, 0, layer.tilt]}
        >
          <mesh geometry={ringGeometry} scale={layer.radius}>
            <meshBasicMaterial
              color={layer.color}
              transparent
              opacity={0.42}
              depthWrite={false}
            />
          </mesh>

          {/* Signal points riding each rail. */}
          {Array.from({ length: layer.points }).map((_, j) => {
            const angle = (j / layer.points) * Math.PI * 2;
            return (
              <mesh
                key={j}
                geometry={pointGeometry}
                position={[
                  Math.cos(angle) * layer.radius,
                  Math.sin(angle) * layer.radius,
                  0,
                ]}
              >
                <meshBasicMaterial color={layer.color} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

/** Lighting rig: cool key from upper right, neutral fill, narrow rim. */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#8f9bc4" />
      <directionalLight position={[4, 5, 3]} intensity={2.1} color="#dfe6ff" />
      <directionalLight position={[-4, -2, -2]} intensity={0.8} color="#ffd9b0" />
      <pointLight position={[0, 0, 2.6]} intensity={6} color="#6d7cff" distance={9} />
    </>
  );
}

export default function SystemCore({
  progressRef,
  tier,
  finePointer,
  dpr,
}: SceneProps & { dpr: [number, number] }) {
  return (
    <Canvas
      // `frameloop="always"` is unnecessary here: the parent unmounts the
      // canvas when the hero leaves the viewport, so there is no hidden
      // render loop to pause.
      dpr={dpr}
      gl={{
        antialias: tier === "full",
        alpha: true,
        powerPreference: "high-performance",
        // Keeps glass edges defined instead of blowing out to white.
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ fov: 34, position: [0, 0.65, 7.4], near: 0.1, far: 40 }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Lights />
      <Core progressRef={progressRef} tier={tier} finePointer={finePointer} />
    </Canvas>
  );
}
