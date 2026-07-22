import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollBus } from "./scrollBus";

/* The visual metaphor: the studio takes raw fragments (design, motion,
   engineering) and shapes them into one coherent object. Scroll drives
   a deterministic, reversible A→D sequence:
   A assembled → B controlled separation → C focused facet → D reassembly */

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* Deterministic pseudo-random per shard index — same result every load,
   so scroll states are reproducible in both directions */
function rnd(i: number, n: number) {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface ShardDef {
  rest: THREE.Vector3;
  far: THREE.Vector3;
  size: number;
  octa: boolean;
  spin: number;
  baseRot: [number, number, number];
}

function makeShards(count: number): ShardDef[] {
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const y = 1 - t * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN * i;
    const dir = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r);
    if (dir.lengthSq() < 0.001) dir.set(0, 1, 0);
    dir.normalize();
    return {
      rest: dir.clone().multiplyScalar(1.14),
      far: dir.clone().multiplyScalar(2.1 + rnd(i, 1) * 1.1),
      size: 0.15 + rnd(i, 2) * 0.15,
      octa: rnd(i, 3) > 0.5,
      spin: (rnd(i, 4) - 0.5) * 2.4,
      baseRot: [rnd(i, 5) * Math.PI, rnd(i, 6) * Math.PI, 0],
    };
  });
}

/* Story phase curves — pure functions of scroll progress (reversible) */
const spreadFromStory = (s: number) =>
  smoothstep(0.15, 0.4, s) * (1 - smoothstep(0.65, 0.92, s));
const focusFromStory = (s: number) =>
  smoothstep(0.38, 0.5, s) * (1 - smoothstep(0.6, 0.72, s));

export function Sculpture({
  shardCount,
  xOffset,
  yOffset,
  pointerEnabled,
}: {
  shardCount: number;
  xOffset: number;
  yOffset: number;
  pointerEnabled: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shardRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ptr = useRef({ x: 0, y: 0 });

  const shards = useMemo(() => makeShards(shardCount), [shardCount]);
  const geoTetra = useMemo(() => new THREE.TetrahedronGeometry(1), []);
  const geoOcta = useMemo(() => new THREE.OctahedronGeometry(1), []);
  const matCore = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d8dbe2",
        metalness: 0.85,
        roughness: 0.32,
        flatShading: true,
      }),
    [],
  );
  const matShard = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b9bfca",
        metalness: 0.8,
        roughness: 0.38,
        flatShading: true,
      }),
    [],
  );
  const matFocus = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#7d8bff",
        emissive: new THREE.Color("#5668ff"),
        emissiveIntensity: 0,
        metalness: 0.6,
        roughness: 0.3,
        flatShading: true,
      }),
    [],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const s = scrollBus.story;

    /* Hero entrance: fragments assemble once on load */
    const heroIn = smoothstep(0.25, 1.5, t);
    const spread = Math.max(spreadFromStory(s), 1 - heroIn);
    const focus = focusFromStory(s);

    /* Damped pointer tilt, ±~4°, desktop fine pointers only */
    const targetX = pointerEnabled ? scrollBus.px : 0;
    const targetY = pointerEnabled ? scrollBus.py : 0;
    ptr.current.x = THREE.MathUtils.damp(ptr.current.x, targetX, 4, dt);
    ptr.current.y = THREE.MathUtils.damp(ptr.current.y, targetY, 4, dt);

    g.rotation.y = s * Math.PI * 0.7 + ptr.current.x * 0.07 + t * 0.02;
    g.rotation.x = ptr.current.y * -0.06;

    /* Object drifts from its hero position to center as the story begins */
    const shift = smoothstep(0, 0.18, s);
    g.position.x = THREE.MathUtils.lerp(xOffset, 0, shift);
    g.position.y =
      THREE.MathUtils.lerp(yOffset, 0, shift) + Math.sin(t * 0.5) * 0.05;

    if (core.current) {
      const cs = 1 - spread * 0.14;
      core.current.scale.setScalar(cs);
    }

    shards.forEach((sh, i) => {
      const m = shardRefs.current[i];
      if (!m) return;
      /* Slight per-shard stagger keeps separation organic but deterministic */
      const local = smoothstep(0, 1, Math.min(1, Math.max(0, spread * 1.25 - rnd(i, 7) * 0.25)));
      tmp.lerpVectors(sh.rest, sh.far, local);
      m.position.copy(tmp);
      m.rotation.set(
        sh.baseRot[0] + local * sh.spin,
        sh.baseRot[1] + local * sh.spin * 0.7,
        sh.baseRot[2],
      );
      const isFocus = i === 0;
      const scale = sh.size * (isFocus ? 1 + focus * 0.4 : 1);
      m.scale.setScalar(scale);
    });

    matFocus.emissiveIntensity = focus * 1.6;
  });

  return (
    <group ref={group}>
      <mesh ref={core} material={matCore}>
        <icosahedronGeometry args={[1, 0]} />
      </mesh>
      {shards.map((sh, i) => (
        <mesh
          key={i}
          ref={(el) => {
            shardRefs.current[i] = el;
          }}
          geometry={sh.octa ? geoOcta : geoTetra}
          material={i === 0 ? matFocus : matShard}
        />
      ))}
    </group>
  );
}
