"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { Suspense, useRef } from "react";
import * as THREE from "three";

/** A stylised metallic dumbbell built from primitives (no external assets). */
function Dumbbell({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || reduce) return;
    // Gentle continuous rotation
    g.rotation.y += delta * 0.35;
    // Subtle mouse-following parallax tilt
    const targetX = state.pointer.y * 0.35;
    const targetZ = -state.pointer.x * 0.2;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, targetZ, 0.05);
  });

  const metal = (color: string, metalness = 0.9, roughness = 0.25) => (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
    />
  );

  return (
    <group ref={group} rotation={[0.2, 0.4, 0]} scale={1.05}>
      {/* Handle bar (lies along X) */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 2.6, 32]} />
        {metal("#D6DCE3", 0.95, 0.2)}
      </mesh>

      {/* Weight plates + end caps, mirrored on both sides */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.15, 0, 0]}>
          {/* Inner collar */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.28, 0.18, 32]} />
            {metal("#AEB6BF", 0.9, 0.3)}
          </mesh>
          {/* Large plate */}
          <mesh
            position={[side * 0.28, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.72, 0.72, 0.22, 48]} />
            {metal("#20262E", 0.85, 0.35)}
          </mesh>
          {/* Neon-edged mid plate */}
          <mesh
            position={[side * 0.5, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.58, 0.58, 0.16, 48]} />
            {metal("#2A323C", 0.85, 0.35)}
          </mesh>
          {/* End cap */}
          <mesh position={[side * 0.66, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.14, 32]} />
            {metal("#D6DCE3", 0.95, 0.2)}
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Scene3D() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="relative aspect-square w-full max-w-md">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.6]}
        frameloop={reduce ? "demand" : "always"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          {/* Ambient + neon rim lights */}
          <ambientLight intensity={0.35} />
          <pointLight
            position={[-4, 2, 3]}
            intensity={45}
            color="#B7FF00"
            distance={20}
          />
          <pointLight
            position={[4, -2, 3]}
            intensity={45}
            color="#00E5FF"
            distance={20}
          />
          <pointLight position={[0, 3, -4]} intensity={20} color="#FF3045" />

          {/* Reflections built from Lightformers — no network/HDR fetch */}
          <Environment resolution={128}>
            <Lightformer
              intensity={3}
              color="#B7FF00"
              position={[-3, 2, 2]}
              scale={5}
            />
            <Lightformer
              intensity={3}
              color="#00E5FF"
              position={[3, -1, 2]}
              scale={5}
            />
            <Lightformer
              intensity={1.5}
              color="#ffffff"
              position={[0, 4, -3]}
              scale={6}
            />
          </Environment>

          <Float
            speed={reduce ? 0 : 1.4}
            rotationIntensity={reduce ? 0 : 0.35}
            floatIntensity={reduce ? 0 : 0.8}
          >
            <Dumbbell reduce={reduce} />
          </Float>

          <Sparkles
            count={40}
            scale={9}
            size={2.5}
            speed={reduce ? 0 : 0.4}
            opacity={0.7}
            color="#B7FF00"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
