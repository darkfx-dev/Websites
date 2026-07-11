---
name: awesome-gsap
description: "Full mirror of the zhengdechang/awesome-gsap repo — a GSAP (GreenSock Animation Platform) example gallery implemented three ways: vanilla HTML/CSS/JS (CDN, no build step), React (Next.js + TypeScript, hooks-based), and Vue 3 (Composition API). Includes both the per-pattern module demos (basic tweens, timelines, ScrollTrigger, text/character animation, shape morphing, SVG path drawing, loading animations, card reveals, hover interactions, parallax, mouse-follow) AND the two full demo-gallery showcase pages: 'Folio' (creative portfolio site) and 'Honor' (product marketing site with 15+ coordinated sections, video/image assets). Use this skill when the user asks to implement a GSAP pattern by name, wants a full example page adapted (portfolio site, product showcase site), wants working copy-adaptable code rather than a from-scratch implementation, or wants to port a GSAP animation between vanilla JS, React, and Vue. Also trigger on 'GSAP examples', 'GSAP starter', 'awesome-gsap', 'like the Honor site', 'like the Folio site', or 'animate this the way [pattern] does it'."
---

# Awesome GSAP — Full Repo Mirror

`references/` is a complete, unmodified mirror of [zhengdechang/awesome-gsap](https://github.com/zhengdechang/awesome-gsap) (everything except `.git`) — the per-pattern module demos *and* the two full demo-gallery showcase pages. Use these as working references to read and adapt, not as a library to import as-is (the React/Vue apps have their own `package.json`/build tooling that doesn't apply to this repo).

## Layout

```
references/
├── README.md, DEPLOY_TO_VERCEL.md, index.html, package.json, vercel.json   # repo root / landing page / deploy config
├── html/                        # Vanilla JS/CSS, CDN-only, no build step
│   ├── index.html               # Module gallery shell
│   ├── debug-loading.html, test-code-viewer.html, test-modules.html
│   ├── MODULAR_STRUCTURE.md     # How the module-loader pattern works
│   ├── js/
│   │   ├── module-loader.js     # Dynamic module loading/registration
│   │   ├── main-modular.js      # Gallery page wiring
│   │   └── code-viewer-simple.js
│   ├── styles/main.css, modules.css
│   └── modules/<pattern-name>/<pattern-name>.{js,css}   # 11 self-contained pattern modules
├── react/                       # Next.js + TypeScript app
│   ├── src/app/                 # page.tsx (gallery), folio/page.tsx, honor/page.tsx
│   ├── src/components/          # one folder per pattern (BasicAnimations, ScrollTrigger, ParallaxEffects, ...)
│   │   ├── folio/                # Folio portfolio page sections (Hero, Projects, Skills, Timeline, Contact, ...)
│   │   └── Honor/                # Honor product-showcase page sections (15+ Section* components)
│   ├── src/hooks/useGSAP.ts, useCodeModal.ts
│   └── public/folio/, public/honor/   # images + .mp4 video assets used by the two showcase pages
└── vue/                          # Vue 3 (Composition API) app
    ├── src/components/           # page chrome (Navigation, Hero, Footer, CodeModal, ModuleSection)
    ├── src/modules/              # GSAP pattern modules + a few Vue-fundamentals modules (non-GSAP)
    └── src/views/, router/, stores/, composables/
```

## When to use this skill

- **A specific named GSAP pattern** ("give me a ScrollTrigger parallax like the demo") → go straight to `references/html/modules/<pattern>/`, `references/react/src/components/<Pattern>/index.tsx`, or `references/vue/src/modules/<Pattern>.vue`.
- **A full showcase-style page** ("build me a product page like Honor" / "a portfolio like Folio") → read `references/react/src/components/Honor/` (product marketing, sectioned, video-driven) or `references/react/src/components/folio/` (personal portfolio) end-to-end, plus the corresponding `references/react/public/honor/` or `public/folio/` assets, before writing new code.
- **Open-ended** ("make this feel more alive") → prefer general GSAP knowledge or the `gsap-scrolltrigger` skill, and only dip into `references/` once a concrete pattern or page style is chosen.

## Pattern coverage

| Pattern | Vanilla | React | Vue |
|---|---|---|---|
| Basic Animations | ✅ | ✅ | ✅ |
| Timeline Sequences | ✅ | ✅ | ✅ |
| ScrollTrigger | ✅ | ✅ | ✅ |
| Text Animations | ✅ | ✅ | ✅ |
| Shape Morphing | ✅ | ✅ | — |
| SVG Path | ✅ | ✅ | — |
| Loading Animations | ✅ | ✅ | — |
| Card Reveals | ✅ | ✅ | ✅ |
| Hover Interactions | ✅ | ✅ | ✅ |
| Parallax Effects | ✅ | ✅ | ✅ |
| Mouse Follow | ✅ | ✅ | ✅ |
| Advanced/Interactive/Scroll Animations, Scroll Progress | — | ✅ | — |
| Folio (full portfolio page) | — | ✅ | — |
| Honor (full product showcase page) | — | ✅ | — |

Vue also ships a few non-GSAP "Vue fundamentals" modules (`ComponentCommunication`, `FormHandling`, `ReactiveData`, `ComputedProperties`) — these are Composition API teaching demos from the original repo, not GSAP patterns; skip them unless the user is specifically asking about Vue reactivity.

## How to use these references

1. **Read the matching file(s) before writing code** — don't guess GSAP syntax from memory when a working example exists.
2. **Vanilla pattern files are self-registering modules** (`window.<Name>Module = { init() {...} }`) designed to be loaded by `html/js/module-loader.js` into the shared gallery shell (`html/index.html`). When generating a *single self-contained HTML file* for a user, inline the relevant `.js`/`.css` content directly into `<script>`/`<style>` tags rather than reproducing the module-loader/gallery scaffolding — that scaffolding is demo-gallery chrome, not something an end product needs.
3. **React patterns** use a shared `useGSAP.ts` hook (`references/react/src/hooks/useGSAP.ts`) providing `useGSAPAnimation`, `useGSAPTimeline`, `useBasicAnimations`, `useTextAnimation`, `useTimelineSequence` — all wrap animations in `gsap.context()` for automatic cleanup on unmount. Reuse this pattern for new React GSAP components instead of calling `gsap.to()` directly in `useEffect` without a context/cleanup.
4. **The Honor and Folio pages** are the best reference for composing *many* patterns into one coherent scroll experience — each section is its own component, mounted/sequenced independently, with a shared design language (see `Honor/utils.ts` for shared helpers). Use them as a structural template when a user wants a full page, not just one effect.
5. **Vue patterns** use the Composition API (`<script setup>`) with `onMounted`/`onUnmounted` for setup/teardown — mirror that lifecycle pairing for any new Vue GSAP component.
6. **CDN/package versions**: check `references/package.json`, `references/react/package.json`, and `references/vue/package.json` for the exact GSAP/ScrollTrigger versions this repo was built against before assuming a version — don't silently mix GSAP major versions across a page.
7. **Media assets** (`react/public/honor/*.mp4`, `*.png`, `*.jpg`, `react/public/folio/*`) are real binary demo assets, not placeholders — if adapting the Honor/Folio layout for a user's own content, swap these for the user's assets rather than shipping the original demo media.

## Anti-patterns to avoid

- Don't animate on every scroll-frame without `scrub`/`throttle` — reuse the `scrollTrigger` config shapes shown in the ScrollTrigger reference files rather than hand-rolling scroll listeners.
- Don't forget cleanup: vanilla modules expose a `destroy()`/kill pattern where present; React uses `gsap.context().revert()`; Vue uses `onUnmounted`. Missing cleanup leaks ScrollTrigger instances on SPA route changes.
- Don't ship the demo-gallery-only chrome (code viewer modals, module loader, gallery navigation) as part of a user-facing deliverable — only the animation logic (and, for Honor/Folio, the page-section composition) is meant to be reused.
