import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * Guided Ascent — a deliberately small scene built from simple geometry:
 * a soft gray page plane, fine grid lines, and a red path climbing through
 * four stage markers. No models, no textures, no shadows, no post-processing.
 * Rendering pauses when the hero is off-screen or the tab is hidden.
 */

const ASCENT_POINTS: [number, number, number][] = [
  [-1.8, -1.1, 0],
  [-0.6, -0.55, 0.1],
  [0.5, 0.15, 0.05],
  [1.7, 1.05, 0],
];

function curvePoints(): THREE.Vector3[] {
  const curve = new THREE.CatmullRomCurve3(
    ASCENT_POINTS.map((p) => new THREE.Vector3(...p))
  );
  return curve.getPoints(60);
}

function AscentGroup() {
  const group = useRef<THREE.Group>(null);
  const points = useRef(curvePoints());

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.18) * 0.16 + pointer.x * 0.08;
    group.current.rotation.x = Math.cos(t * 0.14) * 0.05 + pointer.y * -0.04;
  });

  return (
    <group ref={group}>
      {/* page / ribbon plane */}
      <mesh position={[0, -1.35, -0.4]} rotation={[-1.25, 0, 0.06]}>
        <planeGeometry args={[4.6, 2.2, 1, 1]} />
        <meshBasicMaterial color="#F6F6F7" side={THREE.DoubleSide} />
      </mesh>

      {/* fine grid */}
      <gridHelper
        args={[5.4, 12, "#DEDFE3", "#DEDFE3"]}
        position={[0, -1.32, -0.4]}
        rotation={[0.32, 0, 0]}
      />

      {/* rising path */}
      <Line points={points.current} color="#B21F2D" lineWidth={2.5} />

      {/* stage markers */}
      {ASCENT_POINTS.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i === 3 ? 0.09 : 0.06, 16, 16]} />
          <meshBasicMaterial color={i === 3 ? "#B21F2D" : "#7E1520"} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Pause rendering when off-screen or tab hidden; flag wrapper for the SVG swap.
  useEffect(() => {
    const holder = wrapRef.current?.closest("[data-hero-visual]");
    holder?.setAttribute("data-3d-active", "");

    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && !document.hidden),
      { threshold: 0.05 }
    );
    io.observe(el);
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      holder?.removeAttribute("data-3d-active");
    };
  }, []);

  return (
    <div className="hero-3d" ref={wrapRef} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0.2, 4.4], fov: 42 }}
      >
        <AscentGroup />
      </Canvas>
    </div>
  );
}
