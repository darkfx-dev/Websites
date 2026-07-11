---
name: awesome-gsap
description: "Reference library of production-quality GSAP (GreenSock Animation Platform) animation patterns implemented three ways: vanilla HTML/CSS/JS (CDN, no build step), React (TypeScript + hooks), and Vue 3 (Composition API). Use this skill when the user asks to implement a specific GSAP pattern by name — basic tweens, timeline sequences, ScrollTrigger scroll animations, text/character animations, shape morphing, SVG path drawing, loading animations, card reveals, hover interactions, parallax effects, or mouse-follow effects — and wants working, copy-adaptable code rather than a from-scratch implementation. Also trigger on 'GSAP examples', 'GSAP starter', 'animate this the way [pattern] does it', or when porting a GSAP animation between vanilla JS, React, and Vue."
---

# Awesome GSAP — Cross-Framework Animation Pattern Library

A curated set of GSAP animation patterns, each implemented three times — vanilla JS (CDN, no build tools), React (TypeScript, hooks-based), and Vue 3 (Composition API) — sourced from [zhengdechang/awesome-gsap](https://github.com/zhengdechang/awesome-gsap). Use these as working references to adapt, not as a library to import.

## When to use this skill

The user wants a *specific, named* animation pattern implemented, or wants the same pattern ported across frameworks. If the request is open-ended ("make this page feel more alive"), prefer general GSAP knowledge (or the `gsap-scrolltrigger` skill if scroll-driven) and only reach into `references/` for a concrete pattern once one is chosen.

## Available patterns

Each pattern below exists in `references/vanilla/<pattern>/`, `references/react/<PatternName>/index.tsx`, and (where marked ✅) `references/vue/<PatternName>.vue`.

| Pattern | Vanilla | React | Vue | What it demonstrates |
|---|---|---|---|---|
| Basic Animations | ✅ | ✅ | ✅ | Simple tweens — scale, rotate, move, `yoyo`/`repeat` |
| Timeline Sequences | ✅ | ✅ | ✅ | Chained `.timeline()` calls, relative position offsets (`"-=0.3"`) |
| ScrollTrigger | ✅ | ✅ | ✅ | `scrollTrigger: { trigger, start, end, scrub, toggleActions }` |
| Text Animations | ✅ | ✅ | ✅ | Per-character split + stagger reveal, color-wave effects |
| Shape Morphing | ✅ | ✅ | — | SVG/CSS shape transitions |
| SVG Path | ✅ | ✅ | — | Path drawing (`strokeDasharray`/`strokeDashoffset`) |
| Loading Animations | ✅ | ✅ | — | Spinners, progress reveals |
| Card Reveals | ✅ | ✅ | ✅ | Staggered entrance animations for card grids |
| Hover Interactions | ✅ | ✅ | ✅ | Mouse-enter/leave tween triggers |
| Parallax Effects | ✅ | ✅ | ✅ | Multi-layer scroll-linked depth movement |
| Mouse Follow | ✅ | ✅ | ✅ | Cursor-tracking elements with lag/easing |
| Advanced/Interactive/Scroll Animations, Scroll Progress | — | ✅ | — | React-only bonus patterns; see `references/react/` |

## How to use these references

1. **Read the matching file(s) before writing code** — don't guess GSAP syntax from memory when a working example exists.
2. **Vanilla pattern files are self-registering modules** (`window.<Name>Module = { init() {...} }`) designed to be loaded into a shared page shell — when generating a *single self-contained HTML file*, inline the relevant `.js`/`.css` content directly into `<script>`/`<style>` tags rather than reproducing the module-loader scaffolding (`html/js/module-loader.js` from the source repo isn't included here — it's page-chrome, not an animation pattern).
3. **React patterns** use a shared `useGSAP.ts` hook file (`references/react/useGSAP.ts`) providing `useGSAPAnimation`, `useGSAPTimeline`, `useBasicAnimations`, `useTextAnimation`, `useTimelineSequence` — all wrap animations in `gsap.context()` for automatic cleanup on unmount. Reuse this pattern for new React GSAP components instead of calling `gsap.to()` directly in `useEffect` without a context/cleanup.
4. **Vue patterns** use the Composition API (`<script setup>`) with `onMounted`/`onUnmounted` for setup/teardown — mirror that lifecycle pairing for any new Vue GSAP component.
5. **CDN versions** (matches the source repo): GSAP core + ScrollTrigger. Check `package.json`-equivalent CDN `<script>` tags already present in this repo's other GSAP work before assuming a version — don't silently mix GSAP major versions across a page.

## Anti-patterns to avoid

- Don't animate on every scroll-frame without `scrub`/`throttle` — reuse the `scrollTrigger` config shapes shown in the ScrollTrigger reference files rather than hand-rolling scroll listeners.
- Don't forget cleanup: vanilla modules expose a `destroy()`/kill pattern where present; React uses `gsap.context().revert()`; Vue uses `onUnmounted`. Missing cleanup leaks ScrollTrigger instances on SPA route changes.
- Don't reproduce the source repo's demo-gallery chrome (code viewer modals, module loader, navigation) — only the animation logic in each pattern file is relevant.
