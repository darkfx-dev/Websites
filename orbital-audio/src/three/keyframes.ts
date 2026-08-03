import { SECTION_IDS } from "../lib/scroll";

/**
 * One keyframe per section, in the same order as `SECTION_IDS`.
 *
 * The scene never jumps between these. `sampleStage` blends the two keyframes
 * either side of the current continuous stage value, and the render loop then
 * damps toward that blend — so crossing a section boundary is a movement, not
 * a cut.
 */
export type Keyframe = {
  /** Camera position. The camera always looks at the origin. */
  camera: [number, number, number];
  /** Multiplier on the particle shell's radius. */
  spread: number;
  /** 0 = spherical orbit, 1 = wide flat stereo plane. */
  flatten: number;
  /** 0 = free field, 1 = organised onto the decode ring. */
  ring: number;
  /** Brightness of the core's rim and its glow. */
  emissive: number;
  /** Overall particle opacity. */
  density: number;
};

export const KEYFRAMES: Record<string, Keyframe> = {
  // Close to the core. Sound is a single point you are standing next to.
  hero: {
    camera: [0.15, 0.15, 6.1],
    spread: 1,
    flatten: 0,
    ring: 0,
    emissive: 1.05,
    density: 1,
  },
  // Pull back and orbit laterally; the shell opens into a stereo field.
  product: {
    camera: [2.9, 0.65, 9.6],
    spread: 1.85,
    flatten: 0.9,
    ring: 0,
    emissive: 0.85,
    density: 0.92,
  },
  // The field organises into the decode ring — a circle whose height is a
  // waveform, which is roughly what an ambisonic decode looks like drawn out.
  workflow: {
    camera: [0, 2.1, 8.1],
    spread: 1.35,
    flatten: 0.2,
    ring: 1,
    emissive: 1,
    density: 1,
  },
  // Settle toward the resting composition, ring half-released.
  pricing: {
    camera: [-2.1, 0.35, 7.6],
    spread: 1.25,
    flatten: 0.35,
    ring: 0.45,
    emissive: 1.15,
    density: 0.9,
  },
  // Final rest, core brightest — it sits directly behind the closing button.
  cta: {
    camera: [0, 0.05, 6.5],
    spread: 1.05,
    flatten: 0.15,
    ring: 0.2,
    emissive: 1.85,
    density: 0.95,
  },
  // Calm. Everything dims once the visitor is past the primary content.
  footer: {
    camera: [0, -0.5, 9.2],
    spread: 0.95,
    flatten: 0.1,
    ring: 0,
    emissive: 0.55,
    density: 0.5,
  },
};

const ORDER: Keyframe[] = SECTION_IDS.map(
  (id) => KEYFRAMES[id] ?? KEYFRAMES.hero!
);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Blend the two keyframes surrounding a continuous stage value. */
export function sampleStage(stage: number, out: Keyframe): Keyframe {
  const max = ORDER.length - 1;
  const clamped = Math.min(Math.max(stage, 0), max);
  const i = Math.min(Math.floor(clamped), max - 1);
  const t = clamped - i;
  const a = ORDER[i]!;
  const b = ORDER[i + 1]!;

  out.camera[0] = lerp(a.camera[0], b.camera[0], t);
  out.camera[1] = lerp(a.camera[1], b.camera[1], t);
  out.camera[2] = lerp(a.camera[2], b.camera[2], t);
  out.spread = lerp(a.spread, b.spread, t);
  out.flatten = lerp(a.flatten, b.flatten, t);
  out.ring = lerp(a.ring, b.ring, t);
  out.emissive = lerp(a.emissive, b.emissive, t);
  out.density = lerp(a.density, b.density, t);
  return out;
}

export function emptyKeyframe(): Keyframe {
  return {
    camera: [...KEYFRAMES.hero!.camera] as [number, number, number],
    spread: 1,
    flatten: 0,
    ring: 0,
    emissive: 1,
    density: 1,
  };
}
