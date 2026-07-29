# Orbital Audio

A single-page marketing site for a fictional spatial-audio plugin, built
around a persistent 3D scene that reorganises itself as you scroll.

`DESIGN.md` holds the design plan — palette, type, layout and the reasoning
behind the signature elements — and was written before any component code.

```bash
cd orbital-audio
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck, then production build
npm run preview    # serve the production build
```

**Orbital Audio is not a real product.** No figure, quotation, customer or
press mention on the page is real. Anything that would be a specific claim is
marked `[Placeholder]` in the interface rather than invented — prices, trial
length, and the one latency figure a reader would reasonably want.

---

## Libraries, and why each one is here

| Library | Why |
| --- | --- |
| `react`, `react-dom` | — |
| `vite`, `@vitejs/plugin-react`, `typescript` | — |
| `three` | The scene is a real 3D composition with a moving camera; there is no 2D way to get parallax between a solid and a particle shell. |
| `@react-three/fiber` | Lets the scene be components with their own lifecycles instead of one imperative setup function, and gives a single shared render loop. |
| `@react-three/drei` | Two helpers, both load-bearing: `Float` for the core's idle drift and `Billboard` for the glow plane. `PerformanceMonitor` also drives the runtime downgrade described below. |
| `framer-motion` | Section entrances and the button's scale response. |
| `@fontsource-variable/*` ×3 | Self-hosts the three faces. The alternative is a Google Fonts link, which is a third-party request on every visit and a layout shift while it resolves. |

Nothing else. **No GSAP:** the brief allowed it only if ScrollTrigger's pinning
turned out to be necessary, and it did not — nothing here pins, and the scene's
scroll response is a value read inside a render loop rather than a timeline.

## How scroll is wired

One listener, in `src/lib/scroll.ts`, measured once per animation frame. It
produces two things from that single measurement:

- `view`, a mutable object the 3D scene reads **inside** `useFrame`. Scrolling
  therefore causes zero React renders in the scene;
- a quantised subscription (200 steps) for the header and the meter rail,
  which are the only DOM chrome that cares about scroll position.

Framer Motion owns section entrances and nothing else — those are viewport
triggers, not scroll-linked. **No property is animated from two places**, which
is the failure mode the brief called out.

The scene interpolates between one keyframe per section
(`src/three/keyframes.ts`) using a continuous `stage` value, then damps toward
it per frame. Crossing a section boundary is a movement, never a cut.

## Performance trade-offs

- **three.js is ~890 kB and is loaded lazily.** The entry bundle is 334 kB
  (106 kB gzipped) and the page is fully readable before the scene arrives.
  An earlier version of `vite.config.ts` put `three` in a named manual chunk;
  that reads like an optimisation and is the opposite of one — a named chunk
  joins the entry graph, Vite emits a `modulepreload` for it, and the deferred
  890 kB gets downloaded on first paint anyway. The config now says nothing
  about chunking on purpose, and the comment explains why.
- **The particle field is positioned entirely in a vertex shader.** Rewriting
  a few thousand positions in JavaScript every frame is the obvious way to
  write this and the reason these scenes stutter. The CPU here writes six
  uniforms per frame regardless of particle count (2400 on the full tier,
  650 on the reduced one).
- **The glow is an additive billboard, not a bloom pass.** A post-processing
  pipeline is another dependency and a second full-screen render for an effect
  that sells on its own at this scale.
- **The core is lit by a fresnel term, not by lights.** For one object, a light
  rig is paying for a general solution to a specific problem.
- **Two-stage downgrade at runtime.** Static device signals are a weak proxy —
  there is no way to ask a browser how fast its GPU is — so `PerformanceMonitor`
  watches the frame rate that actually happens: first the pixel ratio drops,
  then the particle count and camera travel. The static check up front
  (`useRenderTier`) only catches the obvious cases: no WebGL, ≤2 cores, ≤4 GB,
  a coarse pointer, or a narrow viewport.
- **No WebGL at all** when `prefers-reduced-motion` is set or WebGL is
  unavailable. A CSS composition stands in — for a reduced-motion visitor that
  *is* the scene, permanently, so it is composed rather than blank.

## Accessibility

- One `h1`; no heading level skipped; `header`/`main`/`section`/`footer`
  landmarks.
- The canvas layer is `position: fixed` + `pointer-events: none` and never
  takes a click or a scroll gesture. Verified, not assumed — see below.
- Focus is a phosphor-green ring, deliberately a different hue and shape from
  the amber hover glow, so "focused" and "hovered" can never be confused.
- The mobile menu is a disclosure, not a modal: the page behind it stays
  scrollable and focus is free to leave, so it needs no focus trap and cannot
  strand anyone. Escape closes it and returns focus to the toggle.
- `prefers-reduced-motion` is respected globally, not only in the scene.
- With the canvas removed, no information is lost — every word is in the DOM
  above it.

---

## Acceptance criteria — measured results

Run against the **production build** (`npm run preview`) in Chromium via
Playwright. 29 of 33 automated checks pass; the four failures are one library
warning counted once per viewport.

| Criterion | Result |
| --- | --- |
| `npm run build` with zero TypeScript errors | **Pass** |
| Zero console errors/warnings on load and during scroll | **Fail** — see below |
| Scene shows ≥3 distinct scroll-driven states, smoothly | **Pass** — 5 distinct changes across 6 keyframes; largest step-to-step delta is 1.1× the median, so no snap |
| Canvas never blocks a click or scroll | **Pass** — hit-test at the CTA reaches the button; wheel over the canvas scrolls the page |
| NeonButton base/hover/active/focus-visible all distinct | **Pass** — all four differ; focus ring is phosphor, not the glow; label contrast 9.66:1; target 185×58 |
| No layout shift during transitions | **Pass** — CLS 0.03 over a full scroll |
| No horizontal overflow at 375/390/768/1440 | **Pass** |
| Reduced motion materially calmer, page still usable | **Pass** — no canvas mounts, nothing left faded, scrolling and controls still work |
| Everything reachable and operable by keyboard | **Pass** — skip link first, 14 controls reached, every one shows a ring, menu operable with Enter/Escape |
| No invented statistics, testimonials or press logos | **Pass** — no numeric claim or attributed quotation; 7 visible placeholders |
| Logical heading order, exactly one `h1` | **Pass** |
| README documents libraries, trade-offs and unverified items | This file |

### The one failing criterion

```
warning: THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.
```

`three` r183 deprecated `Clock`; `@react-three/fiber` 9.6.1 still constructs one
in its store. Nothing in `src/` touches `Clock` — verified by grep. It is fixable
only by pinning `three` below r183, which is a downgrade to hide a warning, or
by waiting for R3F to move to `Timer`. Left visible rather than suppressed,
because a filtered console is worse than a noisy one.

### Deviation from the brief

The brief lists **Docs** as a header nav link. There is no docs page, so a
header link to it would be a link to nowhere. Docs appears in the footer
instead, as marked non-link text alongside the other unwritten pages. The
header carries the three links that resolve. Every in-page anchor on the site
resolves — verified.

Similarly, "Watch demo" scrolls to the section where the demo will live, which
holds a clearly marked empty slot, rather than opening a video that does not
exist. The final "Start free trial" is a button that says signup is not
connected in this build, rather than a link to itself.

## What remains unverified

- **Frame rate on real hardware.** This was tested in headless Chromium, whose
  WebGL runs on SwiftShader — a software rasteriser. It reported 15–24fps,
  which measures the CPU renderer, not a GPU, and is not evidence either way.
  The 60fps target is **unverified**. The two-stage runtime downgrade exists
  precisely because that number could not be established here.
- **No real low-end Android device.** The reduced tier was exercised by forcing
  the code path, not by running on the hardware it is for.
- **No Safari or Firefox.** Chromium only. The shaders use nothing exotic, but
  `backdrop-filter` and `writing-mode` on the meter rail are untested there.
- **No screen-reader pass.** Landmarks, headings, focus order and `aria-*`
  wiring were checked programmatically; nobody listened to it.
- **Fonts render on this machine's fallback metrics.** The self-hosted subsets
  load correctly in the build, but the type has not been reviewed on a
  high-DPI display.
