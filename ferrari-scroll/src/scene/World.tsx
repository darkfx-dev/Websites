import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CarModel } from "./CarModel";
import { scroll } from "../lib/progress";

/* The connected world the camera flies through. Five zones laid along -Z; one
   continuous CatmullRom camera path glides forward through all of them (no
   cuts). Scroll drives the path parameter; a small damped pointer parallax is
   layered on top for capable desktops. */

const Z = 26; // spacing between zones
const zoneZ = (i: number) => -i * Z;

// Camera + look-at waypoints, one per station. CatmullRom smooths between them
// into a single forward flight that weaves outside→through each zone.
const CAM = [
  new THREE.Vector3(5, 3.2, 8),
  new THREE.Vector3(0, 1.5, zoneZ(1) + 12),
  new THREE.Vector3(2.4, 1.3, zoneZ(2) + 12),
  new THREE.Vector3(-2.0, 1.2, zoneZ(3) + 12),
  new THREE.Vector3(5.5, 2.5, zoneZ(4) + 8),
];
const LOOK = [
  new THREE.Vector3(0, 0.6, 0),
  new THREE.Vector3(0, 1.2, zoneZ(1)),
  new THREE.Vector3(0, 1.0, zoneZ(2)),
  new THREE.Vector3(0, 1.0, zoneZ(3)),
  new THREE.Vector3(0, 0.7, zoneZ(4)),
];

function Platform({ z }: { z: number }) {
  return (
    <mesh position={[0, -0.02, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <cylinderGeometry args={[7, 7, 0.04, 64]} />
      <meshStandardMaterial color="#141414" metalness={0.4} roughness={0.6} />
    </mesh>
  );
}

/* Zone 0 — Reveal: car on a matte platform ringed by thin light columns. */
function ZoneReveal() {
  const cols = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  return (
    <group position={[0, 0, zoneZ(0)]}>
      <Platform z={0} />
      <CarModel position={[0, 0, 0]} rotation={[0, -0.5, 0]} />
      <pointLight position={[3, 2, 3]} intensity={12} color="#d40000" distance={16} />
      <pointLight position={[-4, 3, -2]} intensity={8} color="#f2efe8" distance={18} />
      {cols.map((i) => {
        const a = (i / cols.length) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 6.5, 2.4, Math.sin(a) * 6.5]}>
            <boxGeometry args={[0.06, 5, 0.06]} />
            <meshStandardMaterial color="#a7aaad" emissive="#3a3a3a" metalness={0.8} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

/* Zone 1 — Aerodynamics: tunnel rings + white airflow ribbons. */
function ZoneAero() {
  const ribbons = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const y = 0.4 + (i % 3) * 0.7;
      const off = (i - 3) * 0.9;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(off, y, 10),
        new THREE.Vector3(off * 0.4, y + 0.3, 2),
        new THREE.Vector3(-off * 0.4, y - 0.2, -6),
        new THREE.Vector3(-off, y + 0.1, -12),
      ]);
      return new THREE.TubeGeometry(curve, 40, 0.015, 6, false);
    });
  }, []);
  const rings = useMemo(() => Array.from({ length: 5 }, (_, i) => i), []);
  return (
    <group position={[0, 0, zoneZ(1)]}>
      {rings.map((i) => (
        <mesh key={i} position={[0, 1.4, 6 - i * 3]} rotation={[0, 0, 0]}>
          <torusGeometry args={[3.4, 0.03, 8, 48]} />
          <meshStandardMaterial color="#a7aaad" metalness={0.85} roughness={0.35} />
        </mesh>
      ))}
      {ribbons.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial color="#f2efe8" emissive="#6a6a64" roughness={0.4} />
        </mesh>
      ))}
      <pointLight position={[0, 2, 4]} intensity={10} color="#f2efe8" distance={20} />
      <pointLight position={[2, 1, -4]} intensity={5} color="#d40000" distance={14} />
    </group>
  );
}

/* Zone 2 — Engineering: suspended abstract powertrain, red internal glow. */
function ZoneEngine({ spin }: { spin: React.RefObject<THREE.Group | null> }) {
  return (
    <group position={[0, 1.2, zoneZ(2)]}>
      <group ref={spin}>
        <mesh castShadow>
          <torusKnotGeometry args={[0.9, 0.28, 128, 20, 2, 3]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.95} roughness={0.25} />
        </mesh>
        <mesh position={[1.4, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 1.6, 24]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[-1.4, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 1.6, 24]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
      <pointLight position={[0, 0, 0]} intensity={9} color="#d40000" distance={8} />
      <pointLight position={[0, 3, 4]} intensity={5} color="#f2efe8" distance={16} />
    </group>
  );
}

/* Zone 3 — Cockpit atelier: material panels + a steering form. */
function ZoneCockpit() {
  const panels = [
    { c: "#7a0000", x: -2.6, rot: 0.3 },
    { c: "#0c0c0c", x: -1.3, rot: 0.15 },
    { c: "#a7aaad", x: 1.3, rot: -0.15 },
    { c: "#141414", x: 2.6, rot: -0.3 },
  ];
  return (
    <group position={[0, 1.1, zoneZ(3)]}>
      {panels.map((p, i) => (
        <mesh key={i} position={[p.x, 0, -1]} rotation={[0, p.rot, 0]}>
          <boxGeometry args={[1.0, 1.6, 0.06]} />
          <meshStandardMaterial color={p.c} metalness={p.c === "#a7aaad" ? 0.9 : 0.3} roughness={0.5} />
        </mesh>
      ))}
      {/* steering form */}
      <group position={[0, 0, 1]} rotation={[Math.PI / 2.4, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.55, 0.06, 12, 40]} />
          <meshStandardMaterial color="#0c0c0c" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh>
          <boxGeometry args={[1.0, 0.08, 0.05]} />
          <meshStandardMaterial color="#d40000" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
      <pointLight position={[0, 2, 3]} intensity={7} color="#ffd400" distance={12} />
      <pointLight position={[-2, 1, -2]} intensity={4} color="#f2efe8" distance={14} />
    </group>
  );
}

/* Zone 4 — Red Horizon: car in 3/4, warm dawn band. */
function ZoneHorizon() {
  return (
    <group position={[0, 0, zoneZ(4)]}>
      <Platform z={0} />
      <CarModel position={[0, 0, 0]} rotation={[0, -2.4, 0]} />
      {/* dawn horizon band */}
      <mesh position={[0, 4, -18]}>
        <planeGeometry args={[80, 14]} />
        <meshStandardMaterial color="#7a0000" emissive="#7a0000" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.3, -14]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 30]} />
        <meshStandardMaterial color="#0c0c0c" metalness={0.5} roughness={0.5} />
      </mesh>
      <pointLight position={[6, 3, 6]} intensity={12} color="#f2efe8" distance={26} />
      <pointLight position={[-2, 1.5, -6]} intensity={7} color="#d40000" distance={20} />
    </group>
  );
}

function CameraRig({ pointerEnabled }: { pointerEnabled: boolean }) {
  const camCurve = useMemo(() => new THREE.CatmullRomCurve3(CAM, false, "catmullrom", 0.4), []);
  const lookCurve = useMemo(() => new THREE.CatmullRomCurve3(LOOK, false, "catmullrom", 0.4), []);
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const ptr = useRef({ x: 0, y: 0 });
  const t = useRef(0);

  useFrame((state, dt) => {
    // Ease the path param toward scroll so fast flicks stay smooth.
    t.current = THREE.MathUtils.damp(t.current, scroll.v, 6, dt);
    const u = Math.min(1, Math.max(0, t.current));
    camCurve.getPoint(u, pos.current);
    lookCurve.getPoint(u, look.current);

    if (pointerEnabled) {
      ptr.current.x = THREE.MathUtils.damp(ptr.current.x, state.pointer.x, 4, dt);
      ptr.current.y = THREE.MathUtils.damp(ptr.current.y, state.pointer.y, 4, dt);
    }
    state.camera.position.set(
      pos.current.x + ptr.current.x * 0.6,
      pos.current.y - ptr.current.y * 0.4,
      pos.current.z,
    );
    state.camera.lookAt(look.current);
  });
  return null;
}

export function World({ tier }: { tier: "full" | "lite" }) {
  const spin = useRef<THREE.Group>(null);
  const { scene } = useThree();
  useMemo(() => {
    scene.fog = new THREE.FogExp2("#070707", 0.019);
    scene.background = new THREE.Color("#070707");
  }, [scene]);

  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.25;
  });

  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight position={[6, 10, 6]} intensity={0.8} color="#f2efe8" />
      <ZoneReveal />
      <ZoneAero />
      <ZoneEngine spin={spin} />
      <ZoneCockpit />
      <ZoneHorizon />
      <CameraRig pointerEnabled={tier === "full"} />
    </>
  );
}
