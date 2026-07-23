import { useMemo } from "react";
import * as THREE from "three";

/* An ORIGINAL fictional mid-engine performance concept — a sculptural wedge,
   not a replica of any real car. Body is an extruded side-profile with beveled
   edges; glass canopy + four wheels complete the silhouette. Deliberately
   stylised (design-object register), which is what a procedural build can do
   convincingly — no photoreal claim. */

function useCarGeometry() {
  return useMemo(() => {
    const p = new THREE.Shape();
    p.moveTo(-2.3, 0.06);
    p.lineTo(2.1, 0.06); // underbody
    p.lineTo(2.2, 0.5); // tail
    p.lineTo(1.5, 0.6); // rear deck
    p.lineTo(0.75, 0.66); // engine cover
    p.lineTo(0.35, 0.99); // roof peak (cabin sits forward — mid-engine)
    p.lineTo(-0.2, 1.0);
    p.lineTo(-0.5, 0.9); // windshield top
    p.lineTo(-1.0, 0.6); // cowl
    p.lineTo(-1.75, 0.5); // hood
    p.lineTo(-2.2, 0.44); // nose
    p.lineTo(-2.35, 0.22); // splitter
    p.closePath();

    const body = new THREE.ExtrudeGeometry(p, {
      depth: 1.7,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.12,
      bevelSegments: 3,
      steps: 1,
    });
    body.translate(0, 0, -0.85); // center on Z
    body.computeVertexNormals();

    // Glass canopy — a slim wedge over the cabin.
    const g = new THREE.Shape();
    g.moveTo(-0.5, 0.88);
    g.lineTo(-0.18, 0.99);
    g.lineTo(0.32, 0.98);
    g.lineTo(0.1, 0.7);
    g.lineTo(-0.85, 0.66);
    g.closePath();
    const glass = new THREE.ExtrudeGeometry(g, {
      depth: 1.3,
      bevelEnabled: false,
      steps: 1,
    });
    glass.translate(0, 0, -0.65);

    return { body, glass };
  }, []);
}

function Wheel({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.34, z]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.28, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* brushed-silver hub */}
      <mesh position={[0, 0.145, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.02, 24]} />
        <meshStandardMaterial color="#a7aaad" metalness={0.95} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function CarModel(props: React.ComponentProps<"group">) {
  const { body, glass } = useCarGeometry();
  const paint = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c00000",
        metalness: 0.55,
        roughness: 0.32,
      }),
    [],
  );
  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0b0b0d",
        metalness: 0.9,
        roughness: 0.15,
        transparent: true,
        opacity: 0.72,
      }),
    [],
  );

  return (
    <group {...props}>
      <mesh geometry={body} material={paint} castShadow receiveShadow />
      <mesh geometry={glass} material={glassMat} />
      {/* thin silver blade along the flank */}
      <mesh position={[0.1, 0.4, 0.86]}>
        <boxGeometry args={[3.2, 0.03, 0.02]} />
        <meshStandardMaterial color="#a7aaad" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0.1, 0.4, -0.86]}>
        <boxGeometry args={[3.2, 0.03, 0.02]} />
        <meshStandardMaterial color="#a7aaad" metalness={0.9} roughness={0.3} />
      </mesh>
      <Wheel x={-1.45} z={0.9} />
      <Wheel x={-1.45} z={-0.9} />
      <Wheel x={1.5} z={0.9} />
      <Wheel x={1.5} z={-0.9} />
    </group>
  );
}
