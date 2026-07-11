---
name: scroll-trigger-js
description: "Original, self-contained GSAP ScrollTrigger technique patterns — pinning, horizontal-scroll panel tracks, scroll progress bars, staggered viewport reveals, clip-path image reveals, animated scroll-triggered counters, section scroll-snapping, and multi-layer parallax. Use this skill when the user wants a specific scroll-driven interaction technique implemented (not a full site) — e.g. 'pin this section while scrolling', 'make this scroll horizontally', 'add a scroll progress bar', 'reveal cards as they scroll into view', 'animated counter that plays on scroll', 'snap between full-height sections', or 'parallax layers'. Complements the awesome-gsap and gsap-scrolltrigger skills; use this one when the ask matches a named technique below rather than a broader page or full pattern library."
---

# ScrollTrigger Technique Patterns

Eight self-contained, single-file HTML references (CDN GSAP + ScrollTrigger, no build step) — each demonstrates one commonly-requested scroll-driven interaction technique in isolation. Written as original examples, not copied from any specific site or author; use them as a starting point to adapt into a real page, not as a library to embed as-is.

## Patterns

| File | Technique |
|---|---|
| `references/pin-section.html` | Pin a section for N viewport-heights, step through discrete states as scroll progress crosses thresholds |
| `references/horizontal-scroll.html` | Vertical scroll input drives horizontal translateX across a pinned panel track |
| `references/scroll-progress-bar.html` | Fixed top bar whose width tracks whole-page scroll progress |
| `references/staggered-card-reveal.html` | Grid of cards fades/slides in together with a stagger when the grid enters the viewport |
| `references/image-reveal-mask.html` | `clip-path: inset()` animated from a masked to a fully revealed state as it scrolls into view |
| `references/scroll-counter.html` | Numbers count up from 0 to a target once each stat enters the viewport (proxy-object tween + `onUpdate`) |
| `references/section-snap.html` | Full-height sections with ScrollTrigger's built-in `snap` config (no manual wheel-event math) |
| `references/parallax-layers.html` | Multiple layers move at different fractions of scroll distance for a depth illusion |

## How to use these references

1. **Read the matching file before writing code.** Each is short (~50-70 lines) and fully commented on the *why* of its one non-obvious trick — read the comment, not just the code, since that's where the technique's reasoning lives.
2. **These are technique demos, not page templates.** Extract the relevant `ScrollTrigger.create(...)` / `gsap.to(...)` block and its CSS, then integrate into the user's actual markup — don't ship the demo's placeholder content (`"Panel 1"`, `"Card 1"`, etc.) verbatim.
3. **Combining patterns**: these compose. E.g. a product page might use `scroll-progress-bar` + `staggered-card-reveal` + `parallax-layers` together — just register `ScrollTrigger` once and add each pattern's trigger independently; they don't interfere as long as trigger elements differ.
4. **Prefer `scrub` over `toggleActions` for anything meant to track scroll position exactly** (progress bars, parallax, pin-stepping); prefer `toggleActions: "play none none reverse"` for one-shot enter/exit reveals (card grids, counters) so the animation doesn't fight the user in the middle of a tween.
5. **Always call `gsap.registerPlugin(ScrollTrigger)` once**, before creating any trigger — every pattern file does this at the top of its `<script>` block.
6. **`invalidateOnRefresh: true`** (see `horizontal-scroll.html`) is required whenever a trigger's `end` value depends on measured DOM size (like `scrollWidth`) that can change on resize — without it, resizing the window after load leaves stale start/end values.

## Anti-patterns to avoid

- Don't hand-roll scroll math with a raw `scroll` event listener + `getBoundingClientRect()` polling — every technique here has a `ScrollTrigger` config that replaces that pattern with something frame-synced and cleanup-safe.
- Don't forget `once: true` (see `scroll-counter.html`) for animations that should only ever play a single time — without it, scrolling back up and down re-triggers the tween from the last value, not from zero.
- Don't pin more than one overlapping section at the same scroll range — pinned triggers stack visually if their `start`/`end` ranges overlap; stagger each pinned section's trigger range instead.
