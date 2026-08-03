import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * The Orbital Core: the listener's position, drawn as a translucent solid.
 *
 * Lit entirely by a fresnel term in the shader rather than by real lights.
 * A rim that brightens at glancing angles is what makes a translucent object
 * read as glass, and computing it per-fragment from the view vector costs
 * nothing next to a light rig — which for a single object would be paying
 * for a general solution to a specific problem.
 */

const CORE_VERT = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const CORE_FRAG = /* glsl */ `
  uniform vec3 uRim;
  uniform vec3 uInner;
  uniform float uIntensity;

  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    float facing = abs(dot(normalize(vNormalW), normalize(vViewDir)));
    float rim = pow(1.0 - facing, 2.4);
    vec3 color = mix(uInner, uRim, rim);
    float alpha = (0.09 + rim * 0.85) * uIntensity;
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

const GLOW_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLOW_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(smoothstep(1.0, 0.0, d), 2.4) * uIntensity;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

export type CoreHandle = { emissive: number };

export function Core({
  target,
  animate,
}: {
  target: CoreHandle;
  /** False on the reduced tier: one gentle pulse only, no drift. */
  animate: boolean;
}) {
  const body = useRef<THREE.ShaderMaterial>(null);
  const glow = useRef<THREE.ShaderMaterial>(null);
  const shell = useRef<THREE.Group>(null);

  const bodyUniforms = useMemo(
    () => ({
      uRim: { value: new THREE.Color("#ffa53d") },
      uInner: { value: new THREE.Color("#2a2438") },
      uIntensity: { value: 0 },
    }),
    []
  );

  const glowUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#ffa53d") },
      uIntensity: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // A slow breath, never a throb — this sits behind text that people read.
    const pulse = 1 + Math.sin(t * 0.9) * 0.035;

    if (body.current) {
      body.current.uniforms.uIntensity!.value = THREE.MathUtils.damp(
        body.current.uniforms.uIntensity!.value,
        target.emissive * pulse,
        2.6,
        delta
      );
    }
    if (glow.current) {
      glow.current.uniforms.uIntensity!.value = THREE.MathUtils.damp(
        glow.current.uniforms.uIntensity!.value,
        target.emissive * 0.34 * pulse,
        2.6,
        delta
      );
    }
    if (shell.current && animate) {
      shell.current.rotation.y += delta * 0.09;
      shell.current.rotation.x = Math.sin(t * 0.2) * 0.12;
    }
  });

  const core = (
    <group ref={shell}>
      {/* Body. Low-poly on purpose: the facets are the read. */}
      <mesh>
        <icosahedronGeometry args={[1, 2]} />
        <shaderMaterial
          ref={body}
          uniforms={bodyUniforms}
          vertexShader={CORE_VERT}
          fragmentShader={CORE_FRAG}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Armature: the structure, one subdivision coarser than the body. */}
      <mesh scale={1.035}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#ffa53d"
          wireframe
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>
    </group>
  );

  return (
    <group>
      {/* Bloom without a post-processing pass: one additive billboard behind
          the core. A full bloom pipeline would be another dependency and a
          second full-screen render for an effect this sells on its own. */}
      <Billboard>
        <mesh position={[0, 0, -0.6]}>
          <planeGeometry args={[7.5, 7.5]} />
          <shaderMaterial
            ref={glow}
            uniforms={glowUniforms}
            vertexShader={GLOW_VERT}
            fragmentShader={GLOW_FRAG}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Billboard>

      {animate ? (
        <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.5}>
          {core}
        </Float>
      ) : (
        core
      )}
    </group>
  );
}
