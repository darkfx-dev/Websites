import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The field of point sources around the core.
 *
 * All of the positional work happens in the vertex shader. The alternative —
 * rewriting a few thousand positions in JavaScript every frame — is the
 * obvious way to write this and the reason these scenes stutter; here the CPU
 * only ever writes six uniforms per frame regardless of particle count.
 */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSpread;
  uniform float uFlatten;
  uniform float uRing;
  uniform float uPixelRatio;

  attribute vec3 aSeed;   // radius, theta, phi
  attribute float aSpeed;
  attribute float aSize;

  varying float vDepth;
  varying float vSeed;

  void main() {
    float radius = aSeed.x;
    float theta  = aSeed.y + uTime * aSpeed;
    float phi    = aSeed.z;

    // 1 — Orbit: a sparse shell of sources around the listener.
    vec3 orbit = vec3(
      radius * sin(phi) * cos(theta),
      radius * cos(phi),
      radius * sin(phi) * sin(theta)
    ) * (2.4 * uSpread);

    // 2 — Stereo field: the shell flattens and widens laterally.
    vec3 plane = vec3(orbit.x * 1.9, orbit.y * 0.12, orbit.z * 1.35);

    // 3 — Decode ring: one circle, its height a waveform.
    float ringRadius = 3.15;
    vec3 ring = vec3(
      ringRadius * cos(theta),
      sin(theta * 6.0) * 0.34 + (radius - 0.8) * 0.2,
      ringRadius * sin(theta)
    );

    vec3 pos = mix(orbit, plane, uFlatten);
    pos = mix(pos, ring, uRing);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (13.0 / max(-mv.z, 0.001));

    vDepth = clamp(-mv.z / 15.0, 0.0, 1.0);
    vSeed = radius;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uLamp;
  uniform vec3 uTrace;
  uniform float uRing;
  uniform float uOpacity;

  varying float vDepth;
  varying float vSeed;

  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float r = length(d);
    if (r > 0.5) discard;

    float falloff = smoothstep(0.5, 0.0, r);

    // Sources shift from lamp amber to phosphor as the field organises —
    // amber is the product, phosphor is the system working.
    float phosphor = clamp(uRing * 0.9 + (vSeed - 0.6) * 0.35, 0.0, 1.0);
    vec3 color = mix(uLamp, uTrace, phosphor);

    float alpha = falloff * falloff * uOpacity * (1.0 - vDepth * 0.55);
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

export type FieldHandle = {
  spread: number;
  flatten: number;
  ring: number;
  density: number;
};

export function Field({
  count,
  target,
  animate,
}: {
  count: number;
  /** Read every frame; owned by the Rig, never by React state. */
  target: FieldHandle;
  /** False on the reduced tier: the field holds its resting shape. */
  animate: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const seed = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const size = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Bias radius outward so the shell reads as a surface with depth
      // rather than a solid ball.
      seed[i * 3 + 0] = 0.6 + Math.pow(Math.random(), 0.6) * 0.55;
      seed[i * 3 + 1] = Math.random() * Math.PI * 2;
      // acos of a uniform variable distributes phi evenly over the sphere.
      seed[i * 3 + 2] = Math.acos(2 * Math.random() - 1);
      speed[i] = 0.06 + Math.random() * 0.16;
      size[i] = 1.1 + Math.random() * 2.4;
    }

    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    // The vertex shader ignores `position`, so the automatic bounding sphere
    // would be a zero-radius sphere at the origin and the points would be
    // frustum-culled away. This is the box they actually occupy.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 8);
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpread: { value: 1 },
      uFlatten: { value: 0 },
      uRing: { value: 0 },
      uOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
      uLamp: { value: new THREE.Color("#ffa53d") },
      uTrace: { value: new THREE.Color("#6fe3c4") },
    }),
    []
  );

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime!.value += animate ? delta : delta * 0.25;
    u.uSpread!.value = target.spread;
    u.uFlatten!.value = target.flatten;
    u.uRing!.value = target.ring;
    // Fade in over the first moments rather than appearing all at once.
    u.uOpacity!.value = THREE.MathUtils.damp(
      u.uOpacity!.value,
      target.density * 0.85,
      3,
      delta
    );
    u.uPixelRatio!.value = state.gl.getPixelRatio();
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
