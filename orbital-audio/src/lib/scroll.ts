/**
 * The page's single source of scroll truth.
 *
 * One listener, one measurement per frame, two consumers with different
 * needs:
 *
 *   - the 3D scene reads `view` directly inside its render loop, so scrolling
 *     never causes a React render;
 *   - DOM chrome (the header, the meter rail) subscribes to a *quantised*
 *     value, so it renders on the order of tens of times per scroll rather
 *     than hundreds.
 *
 * Nothing else in the app may attach a scroll listener. Section entrance
 * animations are owned entirely by Framer Motion's viewport triggers, which
 * is a separate responsibility from anything here — no property is driven
 * from both places.
 */

/** Ordered top to bottom. The 3D scene has one keyframe per entry. */
export const SECTION_IDS = [
  "hero",
  "product",
  "workflow",
  "pricing",
  "cta",
  "footer",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type ScrollView = {
  /** 0 at the top of the document, 1 at the bottom. */
  progress: number;
  /**
   * Continuous position through `SECTION_IDS`: 1.4 means "40% of the way
   * through the second section". The scene interpolates between keyframes
   * with this, which is why crossing a boundary is smooth rather than a snap.
   */
  stage: number;
  /** The section currently under the middle of the viewport. */
  active: SectionId;
};

/**
 * Mutable and shared on purpose. `useFrame` reads `view.stage` on the frame
 * it actually draws, which is the most recent value by definition.
 */
export const view: ScrollView = { progress: 0, stage: 0, active: "hero" };

type Listener = (view: ScrollView) => void;
const listeners = new Set<Listener>();

/** Steps of quantisation for subscribers. 0.5% is finer than the eye. */
const STEPS = 200;
let lastQuantised = -1;
let frame = 0;
let started = false;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function measure() {
  frame = 0;

  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  view.progress = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;

  const middle = window.innerHeight / 2;
  let stage = 0;
  let active: SectionId = SECTION_IDS[0];

  for (let i = 0; i < SECTION_IDS.length; i++) {
    const id = SECTION_IDS[i];
    if (!id) continue;
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.height <= 0) continue;

    // Once the middle of the viewport is past this section's top, this is at
    // least the current section; the loop keeps going so the last match wins.
    if (rect.top <= middle) {
      stage = i + clamp((middle - rect.top) / rect.height, 0, 1);
      active = id;
    }
  }

  view.stage = stage;
  view.active = active;

  const quantised = Math.round(view.progress * STEPS);
  if (quantised !== lastQuantised) {
    lastQuantised = quantised;
    listeners.forEach((fn) => fn(view));
  }
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(measure);
}

/** Idempotent: the first subscriber starts the listener, the last stops it. */
export function subscribe(fn: Listener): () => void {
  listeners.add(fn);

  if (!started) {
    started = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    measure();
  }

  fn(view);

  return () => {
    listeners.delete(fn);
    if (listeners.size === 0) {
      started = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  };
}

/**
 * Starts measuring without subscribing to renders. The 3D scene calls this:
 * it needs `view` to be current, but it reads it in its own loop and must not
 * re-render React when the value changes.
 */
export function keepMeasuring(): () => void {
  return subscribe(() => {});
}
