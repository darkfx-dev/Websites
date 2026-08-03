# Mahesh Pav Bhaji — Premium Motion Redesign: Implementation Plan

## Context

The Mahesh Pav Bhaji website (Next.js 15 / React 19 / TypeScript / Tailwind / Framer Motion) already shipped as a clean, functional, content-accurate production build in a prior session. It works, but it is visually restrained and low-motion — a solid but generic editorial layout with CSS fade-up reveals and no dish-level menu browsing (only 14 category names + counts). The user has now supplied ~150 verified individual dish names and an extremely detailed 1800-line creative/technical brief demanding a distinctive, premium, motion-forward redesign with strict tooling ownership rules (GSAP for scroll-linked sequences, Framer Motion for React interaction state, CSS for simple feedback), a signature hero, exactly one desktop pinned scroll narrative, selective 3D pointer depth, and — critically — a genuinely functional menu explorer (category filter + search + dish/category-specific WhatsApp inquiries) built from the newly supplied dish data. This plan turns that brief into a repository-aware, file-aware implementation plan for the existing codebase, without inventing any business fact, price, or image not already approved.

This document follows the 20-section output format specified in the user's brief.

---

## Amendment — Explicit 3D + GSAP Scroll Emphasis (per user request)

The user has explicitly asked that the plan make **3D animations, 3D scroll animations, GSAP scroll animations, and 3D effects** first-class, prominent deliverables of the redesign (not just tasteful accents). This amendment records those as required outcomes and points to where each is specified in detail:

1. **GSAP scroll animations** — GSAP + ScrollTrigger own **all** scroll-linked motion on the site: the hero entrance choreography (Section 6), the pinned "Explore the Menu Universe" narrative with `scrub`-driven scene changes (Section 7), and scroll-driven depth transitions between sections. This is the site's primary scroll-animation engine. See Sections 4, 6, 7.
2. **3D scroll animations** — The pinned menu story is upgraded to a **genuine 3D scroll scene**: category "cards" travel through real Z-depth (`translateZ` / `rotateY` inside a `perspective` + `transform-style: preserve-3d` stage), driven by the ScrollTrigger scrub, so scrolling literally moves you *through* the menu in space rather than fading flat panels. See Section 7 (revised) and Section 8.
3. **3D effects across the website** — Layered 3D depth appears in three deliberate places (not everywhere, to avoid fatigue): the **hero** (parallax tawa/steam layers on a `preserve-3d` stage with pointer-driven camera tilt, Section 6), the **pinned scroll scene** (Section 7), and **dish cards** (pointer-tracked tilt with `rotateX/Y` + `translateZ` + pointer-relative highlight, Section 8). Buttons get a lighter 3D lift/magnetism (Section 8).
4. **3D animation technology** — Achieved with **CSS `perspective` + `transform-style: preserve-3d` + layered DOM/SVG, animated by GSAP transforms and Framer Motion springs** — no WebGL/Three.js is added, because this DOM-based 3D delivers the full "3D depth and motion" experience at a fraction of the bundle/accessibility/maintenance cost and works within the existing SVG hero art. (If, after seeing the built DOM-3D result, the owner specifically wants real-time 3D geometry/lighting, that becomes a separate, later scope decision — Section 8 records the trade-off.)

All four remain governed by the plan's non-negotiables: strict GSAP/Framer-Motion/CSS ownership boundaries (no two systems animating the same property on the same element), full `prefers-reduced-motion` static fallbacks, a non-3D stacked mobile alternative for the pinned scene, and no content ever hidden behind animation. The 3D is prominent **and** responsible.

---

## 1. Repository Findings

Confirmed via fresh read-only audit (`/home/user/Websites`, branch `claude/mcp-filesystem-server-31dbtv`, clean working tree, `npm run build` and `npm run lint` both pass).

**Stack & versions**: Next.js `15.5.21` (App Router), React `19.2.8`, TypeScript `6.0.3` (strict), Tailwind CSS `3.4.19`, `motion` (Framer Motion) `12.42.2`, `lucide-react` `1.26.0`, ESLint `9.39.5` + `eslint-config-next`. Package manager: npm (`package-lock.json`).

**Confirmed absent**: `gsap`, `three`, `@react-three/fiber`, `lenis` — not in `package.json`, lockfile, or `node_modules`. No scroll-hijacking library of any kind is currently installed.

**`src/` inventory** (29 files, ~2,113 lines):
```
src/app/{layout.tsx, page.tsx, globals.css, robots.ts, sitemap.ts, icon.tsx}
src/components/{contact-section, floating-whatsapp-button, hero-artwork, hero-section,
  icons, instagram-section, location-section, menu-category-grid, menu-highlights,
  mobile-action-bar, motion-primitives, reputation-section, section-heading,
  service-highlights, site-footer, site-header, skip-link, structured-data}.tsx
src/components/ui/button.tsx
src/data/business.ts
src/lib/{site.ts, utils.ts}
src/types/assets.d.ts
```

**`src/data/business.ts`** (177 lines): single `business` const with all verified facts (address, telephone, `whatsapp.{primary,menu,order,table}` pre-built `wa.me` URLs, `googleMaps`, `instagram`, `hours`, `rating` 4.6, `reviewCount` 1953, `fiveStarReviews` 1662, `approxMenuVariations` 160, `lastVerified` "2026-07-23"). `menuCategories: MenuCategory[]` — 14 entries, each **only** `{name, count}`. The type declares an optional `items?: string[]` that is **never populated**. `menuHighlights` (8 category-level blurbs), `whyVisit` (7 bullets), `navLinks` (5 items). **No individual dish names exist in the repo today** — this plan adds them via a new file (Section 9).

**`src/components/motion-primitives.tsx`** (134 lines): `useInView()` (IntersectionObserver-backed, falls back to instantly-true if unsupported) + `Reveal` / `RevealStagger` / `RevealItem`. These apply `.reveal` / `.reveal-group` / `.reveal-child` classes and set `--reveal-y` + `transitionDelay` inline; **all actual animation math lives in CSS**, gated behind an `html.js` class added by an inline script in `layout.tsx` before first paint. Content is visible by default; the hidden pre-animation state only exists once JS has proven it can run. **This exact pattern — visible-by-default, motion added only behind a `js`/capability gate — is the model this plan reuses for every new animation system (GSAP included).**

**`src/app/globals.css`** (123 lines): `.container-page`, `.section-y` (`clamp(72px,10vw,144px)`), `.grain::before` (inline SVG turbulence, 3.5% opacity), the reveal transition rules described above, and a complete `prefers-reduced-motion: reduce` block that force-shows all `.reveal` elements and collapses `*, *::before, *::after` transition/animation durations to `0.001ms`. `color-scheme: light` only, no dark mode.

**`tailwind.config.ts`**: color tokens (`charcoal` #15120F/`deep` #0D0C0A, `cream` #FFF8EB, `ivory` #F7EEDC, `saffron` #F2A93B, `tomato` #B9382D, `coriander` #2F6849, `brown` #765743, `warm-border` #E6D6BE); `fontFamily.display`/`sans` wired to `next/font/google` CSS vars (Fraunces/Manrope) with system fallbacks; `borderRadius` (`control`10/`button`12/`card`20/`feature`24/`media`28px); `boxShadow` (`card`/`elevated`/`glow`); `maxWidth.content` 1280px; `transitionTimingFunction` (`standard`/`enter`/`exit`/`micro`). No existing `keyframes`/`animation` tokens — nothing to conflict with.

**`src/components/site-header.tsx`** (224 lines, client): scrollspy via a dedicated `IntersectionObserver`; mobile panel uses Framer Motion `AnimatePresence` + spring transitions, fully **omitted** (not merely zeroed) when `useReducedMotion()` is true; body-scroll-lock while open; Escape-to-close; focus moves to the first focusable panel element on open and returns to the toggle button on close. **Known pre-existing gap**: no cyclic focus trap (Tab can leave the panel while it's open). This is independent of the redesign — flagged in Section 17, not silently fixed as a side effect, but folded into Stage 3 since we're touching navigation motion anyway.

**`src/components/hero-section.tsx`** (130 lines, **Server Component**) + **`hero-artwork.tsx`** (127 lines, pure static inline SVG, zero built-in motion, `aria-hidden`): dark charcoal hero with `.grain` + two blurred decorative glow `div`s, two-column grid (copy + `HeroArtwork`). Every copy block is wrapped in `<Reveal delay={…}>` with CSS-only fade+rise, staggered 0→0.38s. **Zero GSAP, zero ScrollTrigger, zero scroll-linked parallax anywhere in the repo.**

**Skills available** (`~/.claude/skills/`, global, no repo-local `.claude/skills/`): `ui-ux-pro-max` (67 styles/161 palettes/57 pairings/21 stacks incl. React/Next.js/Tailwind), `frontend-design` (opinionated aesthetic-direction guidance), `web-design-guidelines` (Vercel Web Interface Guidelines auditor, fetches live from GitHub), `seo-audit`.

**MCP**: repo's `.mcp.json` configures only `shadcn`. A `21st_dev` MCP server exists at the session/environment level but is **not wired into this project** — treated as available-but-unintegrated (Section 4).

**High-risk areas for animation work**: (a) `hero-section.tsx` is a Server Component today — adding pointer parallax must not force the whole section client-side; (b) the mobile-menu focus-trap gap noted above; (c) `RevealStagger`'s `React.cloneElement` pattern in `motion-primitives.tsx` only tolerates single-element children with a `style` prop — any new stagger usage must respect that contract; (d) no existing `matchMedia`/pointer-capability hook exists, so every new hover/tilt/parallax feature needs one built from scratch (Section 9) to avoid enabling touch-inappropriate interactions.

---

## 2. Current Design Diagnosis

| # | Finding | Severity | Where | Why it matters | Fix |
|---|---|---|---|---|---|
| 1 | No dish-level menu browsing — only category name+count | **Critical** | `src/data/business.ts` (`menuCategories`), `menu-category-grid.tsx` | Users cannot see, search, or ask about a specific dish; the site's core "menu discovery" job is only half-done | New `src/data/menu.ts` + `MenuExplorer` (Sections 9, 10) |
| 2 | Every section uses the identical fade-up-on-scroll motion | **High** | `motion-primitives.tsx` used uniformly across `hero-section.tsx`, `trust-strip.tsx`, `menu-highlights.tsx`, `menu-category-grid.tsx`, `service-highlights.tsx`, `reputation-section.tsx`, `location-section.tsx`, `contact-section.tsx`, `instagram-section.tsx` | Flattens hierarchy — nothing signals "this is the memorable moment" vs "this is routine content"; classic AI-template tell | Motion-density map (Section 5): only hero + one scroll story get signature treatment, everything else stays calm |
| 3 | Hero has no entrance choreography beyond generic staggered fade | **High** | `hero-section.tsx`, `hero-artwork.tsx` | The brief's "From the Tawa to the Table" concept needs a deliberate sequence (glow → tawa settles → steam → headline → CTAs), not six blocks fading up on the same curve | Section 6 |
| 4 | No way to browse ~150 dishes without WhatsApp | **Critical** | absent | Users must leave the site to ask "do you have X" for anything not in the 8 highlight cards | Section 9 |
| 5 | `menu-category-grid.tsx` and `menu-highlights.tsx` overlap conceptually (both are "here are the categories") | **Medium** | `src/components/menu-highlights.tsx`, `src/components/menu-category-grid.tsx` | Two adjacent sections say almost the same thing in different card shapes | `menu-highlights.tsx` stays as the curated "8 signature groups" teaser; `menu-category-grid.tsx` is **replaced** by the new `MenuExplorer` (category filter is now functional, not decorative) |
| 6 | No 3D/tactile depth anywhere | **Medium** | site-wide | Flat cards throughout; brief asks for restrained, desktop-only tactility | Section 8 |
| 7 | Mobile menu lacks a full focus trap | **Medium** (pre-existing, accessibility) | `site-header.tsx` lines ~55-70 | Tab can escape the open panel to background content | Fixed in Stage 3 (Section 15) since navigation motion is being touched anyway |
| 8 | No `prefers-reduced-motion`-aware pointer-capability gating exists | **Medium** | absent | Any new hover/tilt/parallax feature added without this risks running on touch devices | New `usePointerCapabilities` hook (Section 9), required before any Section 8 work lands |
| 9 | Repetitive card shape: every card is `rounded-card`/`rounded-feature` white surface with the same shadow | **Optional** | `menu-highlights.tsx`, `service-highlights.tsx`, `location-section.tsx` cards | Contributes to "generic AI template" read even though the palette itself is already distinctive | Vary card treatment for the featured bento tile (already does this — keep), extend variation to `DishCard` (Section 9) rather than retrofitting existing sections (out of scope: don't touch what already reads intentionally) |
| 10 | No signature scroll narrative | **High** | absent | Site is a static scroll with uniform reveals; nothing communicates the breadth of the menu (160 items, 14 categories) the way a story could | Section 7 |

**Is the current design "AI-generated-feeling"?** Partially, and specifically in the *uniformity* of motion (finding #2) and the *absence* of a memorable moment (#3, #10), not in the palette or typography choices, which are already deliberately non-default (warm charcoal/saffron/tomato/coriander, Fraunces/Manrope pairing, code-drawn SVG hero art instead of stock photography). The redesign should preserve the palette/type system entirely and spend its effort on motion hierarchy and menu functionality.

---

## 3. Proposed Creative Direction

**Keep unchanged** (already distinctive, confirmed working, zero reason to touch): the full color system in `tailwind.config.ts`, the Fraunces/Manrope pairing, the code-drawn `HeroArtwork` SVG's visual content (tawa/steam/bhaji/pav/lemon/onion — this is good, on-brief, license-free art), the `.grain` texture, the copy voice in `src/data/business.ts`.

**Add**: a clear motion hierarchy so the palette's warmth is *paced*, not uniform. Concept: **"From the Tawa to the Table"** for the hero (heat and motion originate at a single point — the tawa — and settle into calm, readable content), and **"Explore the Menu Universe"** for one desktop scroll narrative that turns the abstract "~160 dishes, 14 categories" fact into something felt, not just stated.

The user's suggested palette swap (`#171512` etc.) is **not adopted** — the existing tokens are already a coherent, considered system 1-2 hex steps off the suggestion, and swapping them would (a) contradict "reconcile with the existing brand" in the user's own brief, (b) touch every component that references `charcoal`/`saffron`/`tomato`/`coriander`, and (c) fix something that isn't broken. Recommendation: keep the current palette as the single source of truth.

**Typography**: unchanged pairing (Fraunces display / Manrope body), already locally optimized via `next/font/google` with `display: "swap"` and CSS-var fallback — this already satisfies the brief's "stable layout during font loading" requirement. No change needed.

**Shape/surface**: introduce one new surface only — the `DishCard` (Section 9) — with a slightly more tactile treatment (pointer tilt, spring-based highlight) than existing cards, to visually distinguish "this is the interactive menu product" from "this is editorial content."

**Expression across sections**: hero gets Level 3 signature motion (Section 5); the new pinned menu story gets the second and only other Level 3 treatment; the new `MenuExplorer`'s filter/search/tabs get Level 2 interactive motion (Framer Motion layout transitions); everything else (trust strip, reputation, location, contact, footer) **keeps its existing Level 1 CSS reveal exactly as-is** — no changes to `trust-strip.tsx`, `reputation-section.tsx`, `location-section.tsx`, `contact-section.tsx`, `instagram-section.tsx`, `site-footer.tsx`, `floating-whatsapp-button.tsx`, or `mobile-action-bar.tsx` beyond what Section 14 lists.

---

## 4. Tool and Technology Allocation

### New dependency decision: GSAP — **add it**, scoped narrowly

The user's brief is explicit and non-negotiable: *"GSAP and ScrollTrigger own... Pinned desktop sequences... Hero entrance choreography... Controlled desktop parallax."* This is a stated architectural requirement, not an open question. Framer Motion's `useScroll`/`useTransform`/`useSpring` (already installed, zero new bytes) *could* approximate scroll-linked opacity/transform changes, but it does not provide true `pin: true` layout pinning with `scrub` and `ScrollTrigger.matchMedia()` breakpoint-scoped timelines — which is exactly what "Explore the Menu Universe" (Section 7) needs. Given the brief's explicit ownership rule and the fact that this site needs exactly **one** pinned sequence (not several), GSAP core + `ScrollTrigger` is justified and will be added:

```json
"gsap": "^3.12.x"
```
No `@gsap/react` package needed — `gsap.context()` (React-safe scoping/cleanup) is available directly from core `gsap` since v3.11, avoiding an extra dependency.

**Bundle mitigation**: GSAP + ScrollTrigger is imported **only** inside the two new client components that need it (`src/components/motion/hero-choreography.tsx`, `src/components/motion/menu-scroll-story.tsx`), both dynamically imported via `next/dynamic` with `ssr: false`, and `menu-scroll-story.tsx` is additionally gated to desktop-only via `ScrollTrigger.matchMedia()` so its pin logic never initializes on mobile viewports. This keeps GSAP entirely out of the shared bundle and out of the mobile critical path.

### Three.js / React Three Fiber — **not adopted**

No part of this redesign requires real-time 3D geometry, lighting, or camera movement. The tawa/steam/bhaji visual concept is fully achievable — and already proven — via the existing `hero-artwork.tsx` SVG approach layered with GSAP transforms and CSS `perspective`/`transform-style: preserve-3d` for the card-tilt system (Section 8). Introducing R3F would add ~150KB+ of dependency weight, a WebGL context to manage/pause/dispose, and mobile-compatibility risk for zero visual capability this design actually needs. If a future request specifically wants a real rotating 3D dish model, that would be the trigger to revisit — not this redesign.

### `21st.dev` MCP — **not used for component sourcing**

It's available at the environment level but not configured in this project's `.mcp.json`, and the brief requires any borrowed pattern to be "substantially adapted" with verified accessibility/keyboard/license fit. Given this site's component needs (category filter buttons, search input, dish cards, tabs) are simple, well-understood UI patterns already achievable with the existing `Button`/`cn()` primitives and Tailwind tokens, pulling in unaudited external component source adds review overhead without proportional benefit. Recommendation: build `MenuCategoryTabs`, `MenuSearch`, `DishCard` directly against existing design tokens, informed by `ui-ux-pro-max` skill guidance (which **is** used — see below) rather than a component transplant.

### `ui-ux-pro-max` skill — used for validation, not generation

During Stage 2 (Section 15), consult `ui-ux-pro-max` for React/Next.js/Tailwind-stack-specific guidance on: filter/search information architecture, spacing density for a 150-item browsable list, and mobile category-navigation patterns — as a **cross-check** against this plan's decisions (Section 9's tablist-vs-toggle-group choice, Section 12's mobile category strip), not as a source of new visual direction (the palette/type system is already locked per Section 3).

### `web-design-guidelines` skill — used post-implementation

Run against every new/modified component file at the end of Stage 7 (Section 15) as an independent accessibility/interface-guideline pass, before final acceptance.

---

## 5. Motion-Density Map

| Level | Section / Component | Justification |
|---|---|---|
| **3 — Signature** | Hero (`hero-section.tsx` + new `motion/hero-choreography.tsx`) | The brief's one allowed hero choreography moment |
| **3 — Signature** | New pinned **3D** scroll story (`motion/menu-scroll-story.tsx`), desktop only — GSAP-driven Z-depth dolly through the categories | The brief's one allowed pinned narrative and the site's headline 3D-scroll moment — nothing else site-wide gets this treatment |
| **2 — Interactive** | New `MenuExplorer` (`menu/menu-explorer.tsx`, `menu-category-tabs.tsx`, `menu-search.tsx`) | Category tabs, search-result layout changes, active-state indicator — Framer Motion `layout` transitions |
| **2 — Interactive** | New `DishCard` pointer tilt (desktop, `hover:hover` + `pointer:fine` only) | Framer Motion spring-driven tilt, Section 8 |
| **2 — Interactive** | Existing mobile menu (`site-header.tsx`) | **Unchanged** — already correctly Framer-Motion-owned, already reduced-motion-aware |
| **2 — Interactive** | Existing `menu-highlights.tsx` bento cards | **Unchanged** CSS reveal stays; category-CTA button gets the new `MagneticButton` treatment only if it's flagged as one of the "no more than two" magnetic CTAs (Section 8) — otherwise stays as-is |
| **1 — Functional micro-motion** | `trust-strip.tsx`, `reputation-section.tsx`, `location-section.tsx` (incl. Copy Address), `contact-section.tsx`, `instagram-section.tsx`, `site-footer.tsx` | **Unchanged.** Existing CSS `Reveal`/`RevealStagger` is exactly Level 1 already — correct, calm, no change needed |
| **1 — Functional micro-motion** | `floating-whatsapp-button.tsx` one-shot pulse | **Unchanged** — already a single restrained animation, already reduced-motion-gated |
| **1 — Functional micro-motion** | New `MenuEmptyState` | Small `AnimatePresence` fade, Framer Motion |
| **0 — Static** | `mobile-action-bar.tsx`, footer legal line, `structured-data.tsx` output, all body copy | No motion — factual/legal/essential-fallback content |
| **0 — Static** | Everything, whenever `prefers-reduced-motion: reduce` | Full static fallback required for every Level 1-3 item above (Section 13) |

**Fatigue prevention check**: only 2 sections use scroll-triggered entrance choreography beyond a simple fade (hero, scroll story). No heading splits into characters anywhere. No card tilts except the new `DishCard` (one component type, one place). No ambient/looping animation exists except the existing one-shot WhatsApp pulse. Calm intervals: trust strip → menu highlights (calm) → menu explorer (interactive) → why-visit (calm) → reputation (calm) → location/contact/instagram/footer (calm). The pinned scroll story sits between menu-highlights and the explorer, so the page's motion intensity reads as: **calm → signature (hero) → calm → signature (scroll story) → interactive (explorer) → calm through the rest** — not indiscriminately animated throughout.

---

## 6. Hero Animation Plan

**Files**: `src/components/hero-section.tsx` (modified, stays Server Component), `src/components/hero-artwork.tsx` (**unchanged internals** — the SVG markup itself is not touched, only how it's wrapped), new `src/components/motion/hero-choreography.tsx` (new, client, dynamically imported).

**Structure**: `hero-section.tsx` keeps its current server-rendered markup (headline, copy, CTAs, trust stats) almost entirely as-is — it remains a Server Component. The **only** change is that `HeroArtwork` is no longer rendered directly; it's passed as a child into a new client wrapper:

```tsx
// hero-section.tsx (still a Server Component)
import dynamic from "next/dynamic";
const HeroChoreography = dynamic(() => import("@/components/motion/hero-choreography"), { ssr: false });
// ...
<HeroChoreography>
  <HeroArtwork className="..." />
</HeroChoreography>
```

`HeroChoreography` is a thin client component whose only job is: (1) run the GSAP entrance timeline against its own DOM subtree via `gsap.context()`, scoped with a `ref`, cleaned up on unmount; (2) attach the restrained pointer-parallax listener, gated by the new `usePointerCapabilities()` hook (`hover:hover` + `pointer:fine` + `matchMedia(min-width: 1024px)`) and `useReducedMotionPreference()`. Because `HeroArtwork`'s SVG markup itself is unchanged, `dynamic(..., {ssr:false})` only defers the *choreography wrapper*, not the visual content — with JS disabled or before hydration, the SVG still renders (server-rendered by its parent `hero-section.tsx`) in its final static pose, satisfying "no CTA delayed behind a long intro" and "essential content remains visible if animation fails."

The headline/copy/CTA blocks **keep their existing `<Reveal delay={…}>` wrappers exactly as they are today** — the signature choreography is scoped to the artwork's entrance and the ambient glow, not to re-animating text that already has a working, accessible reveal. This avoids GSAP and the existing CSS reveal system fighting over the same elements (conflict-prevention rule).

**Entrance sequence** (GSAP timeline inside `hero-choreography.tsx`, runs once on mount, ~1.1s total):
1. Ambient saffron/tomato glow divs (already exist as decorative `div`s in `hero-section.tsx`, passed through) fade in (`opacity 0→1`, 300ms).
2. Tawa disc group within the SVG scales from `0.96→1` with a slight settle (`ease: "back.out(1.2)"`, 450ms) — targeted via a `data-gsap="tawa"` attribute added to the relevant `<g>` in `hero-artwork.tsx` (the **only** edit made to that file: adding target attributes, zero visual/structural change).
3. The three static steam `<path>` elements get a `strokeDashoffset` draw-on reveal (GSAP's SVG line-drawing technique, 500ms, staggered 80ms apart) — this is the one place "SVG path animation," explicitly a GSAP-owned capability per the brief, is used.
4. Existing `<Reveal>`-wrapped copy blocks continue their current CSS stagger **unchanged**, timed to start as step 2 begins (no JS coordination needed between the two systems — they're visually sequenced by their independent delays, not property-coupled, so there's no ownership conflict).

**Pointer parallax** (desktop only): a single `mousemove` listener on the hero section's client wrapper updates two GSAP `quickTo()` tweens (X/Y, `duration: 0.6`, `ease: "power3"`) that translate the tawa/steam group up to ±8px — well under the brief's implicit "restrained" bar. Disabled entirely (listener never attached) when `usePointerCapabilities()` reports `!hoverHover || !pointerFine` or viewport `< 1024px`, and when `useReducedMotionPreference()` is true.

**Desktop / Tablet / Mobile / Reduced-motion behavior**:
- **Desktop (≥1024px, fine pointer)**: full entrance timeline + pointer parallax.
- **Tablet/Mobile (<1024px or coarse pointer)**: entrance timeline plays (scale/steam-draw are cheap, transform/opacity-only), pointer parallax listener is never attached.
- **Reduced motion**: `hero-choreography.tsx` checks `useReducedMotionPreference()` before creating the GSAP context at all — if true, it renders `children` directly with no wrapper behavior, and the SVG's `data-gsap` targets simply sit at their natural (already-final) SVG coordinates, so no separate "reduced-motion CSS override" is needed for the artwork itself (there is nothing to override — the timeline never ran). Existing `<Reveal>` copy blocks already handle their own reduced-motion CSS per `globals.css`.
- **No-JS / hydration failure**: `HeroArtwork` is server-rendered by `hero-section.tsx` regardless of whether `hero-choreography.tsx` ever hydrates, so the artwork is visible at its final pose from first paint either way.

**Assets required**: none new — reuses the existing SVG. **Asset provenance**: unchanged (100% code-drawn, license-free).

**Performance risk**: Low. GSAP core + ScrollTrigger dynamically imported, `ssr:false`, only loaded for users who reach the hero (i.e., everyone, but only once, ~28KB gzipped for gsap+ScrollTrigger combined — acceptable given it's the entire GSAP footprint for the whole site). `quickTo()` avoids re-creating tweens per mousemove event (GSAP's recommended pattern for pointer-follow, keeps this off the naive "new tween every frame" anti-pattern).

**Fallback**: if `hero-choreography.tsx` fails to load or hydrate (network failure on the dynamic chunk), `HeroArtwork` remains visible via server-rendered HTML; only the entrance motion and parallax are lost, not the content.

---

## 7. Scroll-Story Plan — "Explore the Menu Universe"

**Files**: new `src/components/motion/menu-scroll-story.tsx` (client, dynamically imported, desktop-only), reads from **existing** `business.menuCategories` (no duplication) and the **new** `src/data/menu.ts` (Section 9) for representative dish names. Placed in `src/app/page.tsx` between `<MenuHighlights />` and the new `<MenuExplorer />`.

**Concept (revised to a genuine 3D scroll scene per the amendment)**: a single pinned stage (`pin: true`, bounded scroll distance) that flies the user *through* a curated subset of the 14 categories in real Z-depth as they scroll — not flat cross-fades. The pinned container is a 3D stage: `perspective: 1200px` on the pinned wrapper and `transform-style: preserve-3d` on the moving scene inside it. Each category "panel" is a DOM layer positioned at a different `translateZ`, and the ScrollTrigger `scrub` timeline moves the whole scene forward through Z (and applies a small `rotateY`/`rotateX` camera lean) so the active category rushes toward the viewer into a readable focal plane while the next one waits deeper in space and the previous one recedes and fades. A persistent central anchor (a simplified, smaller reuse of the hero's tawa motif — literally `<HeroArtwork className="scale-50 opacity-30" />` reused as an ambient backdrop, per "reuse existing patterns" and to avoid new SVG asset work) sits at the stage's rear depth plane as a stable spatial reference the panels travel past.

**3D depth mechanics** (GSAP owns every transform here; no Framer Motion touches these elements — clean ownership): each of the 7 category panels is a `preserve-3d` child with a base `translateZ` spacing of ~600px apart; the scrub timeline animates the scene container's `translateZ` (the "camera dolly") plus a ±3° `rotateY` sway, so at any scroll position exactly one panel sits at `z ≈ 0` (the focal plane, full opacity/scale), one is arriving (`z` negative→0, scaling up + fading in), and one is departing (`z` positive, scaling down + fading out). Only `transform` (`translateZ`/`translate`/`rotateY`/`scale`) and `opacity` are animated — never layout properties — so the whole 3D dolly stays on the compositor thread at 60fps. Category name, count, and 3 representative dish names live on each panel and travel with it in depth.

**Narrative stages** (7, matching the brief exactly, each reading directly from `business.menuCategories` for name/count and `menu.ts` for 3 sample dish names per category — South Indian explicitly labeled with its honest count gap, see Section 9):
1. Pav Bhaji (21) — e.g. Regular, Cheese, Khada
2. South Indian (46 listed; showing 3 of 24 verified names) — e.g. Masala Dosa, Paneer Chilli Dosa, Jini Roll Dosa
3. Chinese (13) — e.g. Paneer 65, Veg Manchurian Gravy, Veg Lollipop
4. Fried Rice & Noodles (16) — e.g. Schezwan Fried Rice, Hakka Noodles, Hong Kong Fried Rice
5. Pizza & Sandwiches (5 + 10) — e.g. Margherita Pizza, Cheese Grilled Sandwich
6. Snacks & Chaats (10) — e.g. Papdi Chaat, French Fries
7. Combos & Drinks (5 + 7 + 2) — e.g. Meal for Two, Deadly Dosa, Buttermilk

Each stage's copy explicitly reads "e.g." / "a few favourites" language (never "the full menu" or "all our dishes") — this is a **content requirement**, not just a design nicety, per the brief's "do not imply every representative dish is displayed" rule. A persistent, always-visible (not scroll-gated) "View Full Menu" button pins to the stage's corner throughout, scrolling to `#menu-explorer` (`MenuExplorer`'s anchor) — so a user can bail out of the narrative at any point without needing to finish scrolling through it.

**GSAP implementation requirements** (all addressed explicitly, per the brief's checklist):
- `gsap.registerPlugin(ScrollTrigger)` called exactly once, at module scope inside `src/lib/gsap.ts` (new file), imported by both `hero-choreography.tsx` and `menu-scroll-story.tsx` — single controlled registration point.
- `gsap.context()` scoped to the component's root ref; `ctx.revert()` in the `useEffect` cleanup function handles full teardown (kills the timeline, the ScrollTrigger instance, and reverts any inline styles GSAP applied) — no manual `ScrollTrigger.kill()` bookkeeping needed.
- `ScrollTrigger.matchMedia()` used with exactly two conditions: `"(min-width: 1024px)"` (build the full pinned timeline) and `"(max-width: 1023px)"` (no-op — the mobile alternative, Section below, is a plain stacked `RevealStagger` component that renders instead, controlled by a CSS `hidden lg:block` / `lg:hidden` pair, not by JS branching, so there's no hydration mismatch risk).
- `invalidateOnRefresh: true` set on the ScrollTrigger instance, since the pinned container's height depends on font-loaded text metrics.
- Scoped selectors: all GSAP `.to()`/`.from()` calls target refs or `gsap.utils.selector(rootRef)`-scoped queries, never global `document.querySelector`.
- `ScrollTrigger.refresh()` called once in a `useEffect` after a `document.fonts.ready` resolve, guarding against Fraunces/Manrope late-loading shifting the pin's trigger points.
- Pin distance: `end: "+=2400"` (≈7 stage-transitions × ~340px of scroll each) — long enough to read as deliberate pacing, short enough (~2.5x viewport height) to avoid the brief's "avoid large empty scroll distances" mobile warning (moot on desktop-only, but kept modest regardless).
- Pin ending: the timeline's last stage settles to a fully-readable static state (opacity 1, no residual transform) for ~15% of the pin's scroll budget before unpinning, so release doesn't feel abrupt.
- No layout properties (`width`, `height`, `top`, `left`) are ever animated during scrub — every stage transition is `opacity`/`transform`(`x`/`y`/`scale`) only, keeping it on the compositor thread.
- Resize/orientation-change: `ScrollTrigger.matchMedia()` automatically re-evaluates its breakpoint conditions and rebuilds/tears down on resize; combined with `invalidateOnRefresh`, no manual resize listener is needed.
- Route-transition behavior: N/A — this is a single-route site (`src/app/page.tsx` is the only page); the `gsap.context().revert()` cleanup on unmount is sufficient.
- Duplicate-trigger prevention in React 19 Strict Mode (which double-invokes effects in development): `gsap.context()` is created and reverted inside the same `useEffect`, so the double-invoke in dev creates and correctly tears down two contexts in sequence — this is the documented-safe GSAP+React pattern and requires no extra guarding.

**Mobile alternative** (< 1024px, matched via the same CSS breakpoint pair as the `matchMedia` JS condition so they never disagree): the pinned 3D stage is replaced by a plain stacked sequence — 7 compact category cards in a `RevealStagger` (reusing the **existing** `motion-primitives.tsx` component, zero new motion code needed for mobile), each showing name, count, 3 sample dishes, and its own "Ask on WhatsApp" link. **No 3D, no `perspective`, no Z-depth, no pin** — native vertical scroll only, no scroll-trapping, no horizontal-only navigation. (The 3D scroll scene is a deliberate desktop-only enhancement; the mobile experience is fully equivalent in *content*, just flat.)

**Reduced-motion alternative**: `useReducedMotionPreference()` is checked before `ScrollTrigger.matchMedia()` is even invoked; if true, the component renders the same stacked `RevealStagger` markup used for mobile (regardless of viewport width) — one static code path serves both "mobile" and "reduced motion," which also minimizes the surface area to test (Section 16).

---

## 8. 3D Interaction Plan

This section, together with the hero (Section 6) and the 3D scroll scene (Section 7), delivers the amendment's "3D effects across the website." All 3D here is DOM/CSS-based (`perspective` + `transform-style: preserve-3d`), animated by Framer Motion springs (interaction state) or GSAP (scroll) — never WebGL — so it is light, accessible, and fully removable under reduced-motion/touch gating.

**Dish-card tilt** — **Framer Motion owns this** (not GSAP, not raw CSS/JS): new `src/components/motion/tilt-card.tsx`, wraps `DishCard`'s content. Uses `useMotionValue` for raw pointer X/Y, `useSpring` (stiffness/damping tuned to feel identical to the site-header mobile panel's existing spring values — `{stiffness: 240, damping: 28}` reused for consistency) to damp the tilt, and `useTransform` to map spring output to `rotateX`(max 4°)/`rotateY`(max 6°)/`translateZ`(max 14px)/`scale`(max 1.025). CSS `perspective: 1000px` set on the card's parent grid container in `menu/dish-card.tsx`'s Tailwind class (`[perspective:1000px]`), `transform-style: preserve-3d` on the card itself. A restrained radial highlight (a single absolutely-positioned `div` with a `background: radial-gradient(...)` whose position tracks the same motion values via `useTransform`) provides the pointer-relative highlight the brief asks for. Resets smoothly (spring returns to 0) on `onPointerLeave`.

**Gating** (all four conditions must pass, checked once via `usePointerCapabilities()` + `useReducedMotionPreference()`, not per-frame): `pointer: fine` AND `hover: hover` AND `!prefers-reduced-motion` AND viewport `≥ 768px` (tablet+ — the brief says "pointer-accurate desktop devices only," and a coarse-pointer tablet fails the `pointer:fine` check regardless of width, so the width check is a belt-and-suspenders floor, not the primary gate). When any condition fails, `TiltCard` renders its children with **zero** motion wrapper — not a disabled-but-present one — so touch devices pay no JS cost for it.

**3D buttons** — new `src/components/motion/magnetic-button.tsx`, a thin Framer Motion wrapper around the **existing** `src/components/ui/button.tsx` (composition, not modification — `Button`'s own file is untouched). Applied to a maximum of **two** CTAs site-wide per the brief's explicit cap: the hero's primary "Explore the Menu" button and the `MenuExplorer`'s "Request Current Menu on WhatsApp" button (the two highest-intent conversion actions). Behavior: 2-3px lift via `whileHover={{ y: -2 }}`, magnetic travel capped at 3-4px toward the pointer (computed the same `useMotionValue`+`useSpring` way as the tilt card, reusing the pattern but a separate small hook `useMagneticOffset()` in `src/hooks/`), icon child (the existing arrow SVGs already in `hero-section.tsx`/`menu`-CTA markup) gets a coupled 3-4px translate via `useTransform`. Tap scale `0.98` via `whileTap`. Every other button on the site (`Button` used directly, unwrapped) keeps its current CSS-only hover/focus states from `ui/button.tsx` — unchanged, per the brief's "do not move a button far enough to evade the pointer" and "no more than one or two" cap.

**Animated borders**: **not implemented in this pass.** The brief permits it ("no more than one or two CTAs") but does not require it, and the two CTAs already selected for `MagneticButton` treatment are sufficiently distinguished by lift+magnetism+icon-travel. Adding a third animation system (border draw) to the same two buttons risks exactly the "animation fatigue"/multiple-effects-per-element problem the brief warns against. Flagged as a Section 19 "optional, not recommended" item rather than built.

**Category controls**: real `<button>` elements (not decorative chips) — see Section 9 for the semantic decision (toggle-button group, not ARIA tabs) and full keyboard/state spec. The active-state indicator uses Framer Motion's `layoutId` shared-layout technique (a single pill background that slides between buttons as `activeCategory` changes) — this is exactly the brief's suggested "Framer Motion shared-layout indicator... if it improves clarity," which it does here (communicating "one category is active" via a moving highlight is clearer than a static color swap alone, though color/weight change is also applied so the state is never conveyed by motion/position alone).

---

## 9. Menu Experience Plan

This is the largest functional addition and the plan's highest-priority deliverable (Stage 1, before any motion work begins).

### Data model — new `src/data/menu.ts`

```ts
export type MenuItem = {
  id: string;          // slug, e.g. "pav-bhaji-regular"
  name: string;         // verified display name, e.g. "Regular Pav Bhaji"
  categorySlug: string; // matches a slug derived from business.menuCategories[].name
};

export const menuItems: MenuItem[] = [ /* ~138 verified items, see below */ ];
```

All 138 individually-named dishes from the user's brief are transcribed verbatim (no invented items) into this file, tagged with a `categorySlug` matching a new slugified key added alongside each `business.menuCategories` entry (Section 14 shows the exact `business.ts` diff — adding a `slug` field to `MenuCategory`, not duplicating the category list). Per-category name counts were cross-checked against the brief's aggregate counts during planning: **13 of 14 categories match exactly** (Pav Bhaji 21/21, Rice 9/9, Chinese 13/13, Fried Rice & Noodles 16/16, Soups 6/6, Pizza 5/5, Sandwiches 10/10, Accompaniments 5/5, Snacks & Chaats 10/10, Spring Potatoes 5/5, Cold Drinks 2/2, MPB Combos 5/5, Delightful Combos 7/7 — 116 items). **South Indian is the one honest exception**: 24 verified names supplied against an aggregate count of 46. The total (138 named + 22 unnamed South Indian gap = 160) exactly matches `business.approxMenuVariations`, which is a useful internal consistency check but does **not** license inventing the missing 22 South Indian names.

**UI treatment of the South Indian gap** (a content-honesty requirement, not just a data note): `MenuCategoryTabs` and the category header inside `MenuExplorer` display counts as `"24 of ~46 listed"` for South Indian specifically (derived at render time: `menuItems.filter(i => i.categorySlug === 'south-indian').length` vs `business.menuCategories.find(...).count`), and every other category simply shows its count as today (`"21"`, no "of ~21" qualifier, since named=aggregate there). A small inline note near the South Indian section reuses copy already established in `business.ts`'s spirit: *"More South Indian dishes are available in-store — ask us on WhatsApp for the full list."*

### `MenuExplorer` architecture — new `src/components/menu/` directory

- `menu-explorer.tsx` (client) — owns `activeCategory: string | "all"` and `searchQuery: string` state via `useState`; derives `filteredItems` via `useMemo(() => menuItems.filter(...), [activeCategory, searchQuery])`. **Replaces** `src/components/menu-category-grid.tsx` in `src/app/page.tsx` (that file is deleted — its category-count display is now the header inside `MenuExplorer`, so no duplicated "14 categories with counts" UI exists twice on the page).
- `menu-category-tabs.tsx` (client) — a `role="group"` `aria-label="Filter by category"` toolbar of toggle `<button aria-pressed={isActive}>` elements (not ARIA `tablist`/`tab`/`tabpanel`). **Semantic justification**: true ARIA tabs imply mutually exclusive, separately-rendered panels per tab; here, filtering is additive/combinable with search and all results render into one shared list, which is the WAI-ARIA "filter button group" pattern, not the tabs pattern — using `role="tablist"` here would be a semantic mismatch that actually *reduces* screen-reader clarity (a screen reader user selecting a "tab" would reasonably expect a distinct panel, not a filtered subset of a shared list). Native `<button>` elements mean full keyboard support (Tab, Enter, Space) with zero custom key-handling code required. Includes an "All" option as the default/reset state.
- `menu-search.tsx` (client) — a labeled `<input type="search">` (native semantics, native clear-on-Escape in most browsers) with an explicit visible `<label>` (not placeholder-only), plus a `MenuEmptyState`-adjacent visually-connected clear `<button>` for users who prefer a click target over Escape.
- `dish-card.tsx` (client, wrapped by `motion/tilt-card.tsx` from Section 8 only on qualifying devices) — displays dish name, category name (for "all"-filtered/search views where category isn't otherwise obvious), and one action: "Ask on WhatsApp" building a dish-specific inquiry link (see below). No price/description/photo/tag fields are rendered because `MenuItem` deliberately has none.
- `menu-empty-state.tsx` (client) — small `AnimatePresence`-driven fade (Level 1 motion) shown when `filteredItems.length === 0`, offering a "Clear filters" action and the general-inquiry WhatsApp CTA as a fallback.

**Result-count + live region**: a visually-present `"{n} dishes"` count string, paired with an `aria-live="polite"` `sr-only` region that announces count changes — updated declaratively from `filteredItems.length` (no manual DOM writes), so it's naturally debounce-free and correct even with React 19's batching.

**Framer Motion layout behavior** (explicitly avoiding the brief's warned-against anti-pattern): the results container uses Framer Motion's `layout` prop on each `DishCard` (smooth position interpolation as items enter/leave the filtered set) rather than wrapping the *entire grid* in an `AnimatePresence` fade on every keystroke — individual cards animate their own `layout` transitions (add/remove/reflow), which stays performant even during fast typing, unlike a whole-grid fade that would restart on every character.

**Search behavior**: case-insensitive (`.toLowerCase()`), leading/trailing-whitespace-trimmed, matches against `item.name` (and, since it's a cheap combined check, against the resolved category display name too, so searching "chinese" surfaces both the Chinese category's items and any dish with "Chinese" in its own name, e.g. "Chinese Dosa"). No debounce — per the brief's explicit "no unnecessary debounce," and justified here because `menuItems.length` is ~138, well within instant-filter territory for `useMemo` on every keystroke with no perceptible cost.

### WhatsApp inquiry URL builders — new `src/lib/whatsapp.ts`

Centralizes URL construction, reusing the **existing** `business.whatsappNumber` from `src/data/business.ts` (no new phone-number literal anywhere):

```ts
import { business } from "@/data/business";

export function buildDishInquiryUrl(dishName: string): string {
  const text = `Hi ${business.name}, I found ${dishName} on your website. Please share its current price and availability.`;
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function buildCategoryInquiryUrl(categoryName: string): string {
  const text = `Hi ${business.name}, I am interested in your ${categoryName} menu. Please share the current items, prices, and availability.`;
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
```

Both use `encodeURIComponent` (never manual string concatenation into a URL), matching the brief's explicit safety requirement and the existing `business.whatsapp.*` links' already-encoded style. `DishCard`'s WhatsApp action calls `buildDishInquiryUrl(item.name)`; `MenuCategoryTabs`' per-category "Ask about this category" affordance (rendered only when a single non-"all" category is active) calls `buildCategoryInquiryUrl(categoryDisplayName)`. The existing general/menu/order/table `business.whatsapp.*` URLs in `business.ts` are untouched and continue to serve the header, contact section, and mobile action bar exactly as today.

### Honest product boundary

No cart, checkout, payment, live inventory, or booking confirmation is built or implied anywhere in `MenuExplorer` — every action terminates in a WhatsApp or `tel:` link, consistent with the rest of the site.

---

## 10. Section-by-Section Upgrade Plan

| Section / File | Change | Motion Owner | Notes |
|---|---|---|---|
| `site-header.tsx` | Add cyclic focus trap to mobile panel (accessibility fix, bundled here since nav motion is already in scope) | Framer Motion (unchanged) | No visual change; `focus-trap` logic added via a small local `useEffect` (no new dependency — manual `Tab`/`Shift+Tab` cycling between first/last focusable panel elements) |
| `hero-section.tsx` / `hero-artwork.tsx` | Wrap artwork in `HeroChoreography`; add `data-gsap` attributes to 2 SVG groups | GSAP (new) + CSS reveal (unchanged, for copy) | Section 6 |
| `trust-strip.tsx` | **No change** | CSS (unchanged) | Already correct Level 1 |
| `menu-highlights.tsx` | **No change to layout/cards.** Its "Request menu" CTA (if present as a button) optionally gets `MagneticButton` — deferred to whichever of the two Section-8-capped slots is more effective after Stage 4 review; not both hero AND this one | CSS (unchanged) + optional Framer Motion | Bento grid stays exactly as shipped |
| `menu-category-grid.tsx` | **Deleted**, replaced by `MenuExplorer` in `page.tsx` | — | Section 9 |
| (new) `menu-scroll-story.tsx` | New pinned narrative | GSAP (new) | Section 7 |
| (new) `menu/` directory | New functional menu system | Framer Motion (interactive) | Section 9 |
| `service-highlights.tsx` (why-visit) | **No change** | CSS (unchanged) | Already correct Level 1 |
| `reputation-section.tsx` | **No change** | CSS (unchanged) | Already correct Level 1 |
| `location-section.tsx` | **No change** | CSS (unchanged) | Copy-address confirmation already accessible |
| `contact-section.tsx` | **No change** | CSS (unchanged) | |
| `instagram-section.tsx` | **No change** | CSS (unchanged) | |
| `site-footer.tsx` | **No change** | CSS (unchanged) | |
| `floating-whatsapp-button.tsx` | **No change** | Framer Motion (unchanged) | Already a single restrained one-shot pulse |
| `mobile-action-bar.tsx` | **No change** | CSS (unchanged) | |

The upgrade is deliberately concentrated in 3-4 files/directories (hero, one new scroll story, one new menu system) rather than touching all 18 existing components — consistent with the brief's motion-density map and this plan's Section 2 diagnosis that most existing sections are *already* correctly calm.

---

## 11. Responsive Strategy

Tested breakpoints (matching both the brief and the prior build's already-established matrix): 320, 360, 390, 430, 768, 1024, 1280, 1440px.

**Mobile-specific rules applied**:
- `usePointerCapabilities()` disables magnetic buttons and card tilt below the `pointer:fine`+`hover:hover` threshold — not by breakpoint alone, so a touch-primary Windows laptop with an attached mouse still gets the enhancement, while an iPad (which can report `hover:hover` on some browsers in certain states) is additionally gated by the `≥768px`+coarse-pointer-priority check described in Section 8.
- `menu-scroll-story.tsx`'s pinned sequence is entirely absent below 1024px (CSS `hidden lg:block` pairing the JS `matchMedia`), replaced by the stacked `RevealStagger` alternative.
- `MenuCategoryTabs` on mobile: a horizontally-scrollable strip (`overflow-x-auto`, `-webkit-overflow-scrolling: touch`) with `scroll-snap-type: x proximity` on the button group, each button `min-height: 44px` — kept keyboard-accessible (native buttons remain Tab-reachable regardless of scroll position; the active button is scrolled into view via `scrollIntoView({inline: "center", behavior: reducedMotion ? "auto" : "smooth"})` when changed by keyboard).
- Floating WhatsApp button (`floating-whatsapp-button.tsx`) and mobile action bar (`mobile-action-bar.tsx`) are **unchanged** — their existing safe-area-inset handling and non-overlap logic already satisfies this section's requirements; `DishCard`'s WhatsApp action buttons are inline within cards, never floating, so no new overlap risk is introduced.
- Long dish names (e.g. "Cheese Paneer Kashmiri Pulao," "Jhanak Jhanak Payal Dosa") tested explicitly in `DishCard` at 320px — card text wraps normally (no `truncate`/`nowrap`), card height is not forced equal (matches the brief's existing "avoid forcing equal heights" card principle already used in `menu-highlights.tsx`).
- No horizontal page overflow at 320px is a hard verification gate (Section 16) — the prior build already passed this exact check for the whole page; the new `MenuExplorer`/`MenuCategoryTabs` additions are the only new surface area needing re-verification here.

---

## 12. Accessibility and Reduced-Motion Strategy

**Reduced-motion behavior table**:

| Feature | Full-motion behavior | `prefers-reduced-motion: reduce` behavior |
|---|---|---|
| Hero entrance (`hero-choreography.tsx`) | GSAP timeline + SVG draw + parallax | No GSAP context created at all; children render in final static pose immediately |
| Hero pointer parallax | ±8px tawa/steam translate | Never attached |
| Pinned 3D scroll story | `ScrollTrigger` pin + scrub 3D Z-depth dolly across 7 stages | Same stacked `RevealStagger` markup used for mobile (Section 7) — fully static route, no pin/scrub/parallax/3D; panels render flat and stacked with zero `translateZ`/`rotateY` |
| `DishCard` tilt | Spring-driven `rotateX/Y`, `translateZ`, highlight | `TiltCard` wrapper not applied — children render flat, no transform |
| `MagneticButton` (×2) | Lift + magnetic travel + icon travel | Renders plain `Button` behavior (CSS hover only) |
| Category active-indicator (`layoutId`) | Sliding pill via Framer Motion | Instant swap, no `layout` animation (Framer Motion respects `useReducedMotion()` automatically for `layout`-animated elements when wrapped per its documented pattern) |
| Mobile menu (existing) | Spring open/close | **Unchanged** — already fully omits animation props under reduced motion (confirmed in Section 1 audit) |
| Existing CSS `Reveal` system | 600ms fade+rise | **Unchanged** — already forces `opacity:1 !important; transform:none !important` (confirmed in Section 1 audit) |

No content anywhere starts hidden and stays inaccessible under reduced motion — every Level 1-3 item above has a confirmed static/instant fallback, and the mobile/reduced-motion code paths for the scroll story are **the same code path** (Section 7), minimizing divergent untested states.

**WCAG 2.2 AA checklist** (additions on top of the prior build's already-passing baseline — contrast ratios, skip link, single `h1`, `:focus-visible` styling, `rel="noopener noreferrer"` are all pre-existing and unchanged):
- Mobile-menu cyclic focus trap (Section 10) — closes the one pre-existing gap.
- `MenuCategoryTabs` buttons: visible `:focus-visible` ring (reuses the existing global focus style from `globals.css`, no new CSS needed), `aria-pressed` state, `aria-label="Filter by category"` on the group.
- `MenuSearch`: explicit `<label htmlFor>` (visually can be `sr-only` styled but must be a real associated label, not placeholder-only), `aria-describedby` linking to the live result-count region.
- Result-count live region: `aria-live="polite"`, `aria-atomic="true"`, `sr-only` positioning — announces "24 dishes found" style text without visually duplicating the on-screen count.
- `DishCard` WhatsApp links: descriptive accessible name (`aria-label={`Ask about ${item.name} on WhatsApp`}`), not just "Ask on WhatsApp" repeated identically for every card (avoids the brief's "no duplicate invisible headings"-style genericness for link names specifically).
- Category tabs and search remain fully keyboard-operable with no mouse-only interaction (tilt/magnetic effects are enhancements layered on top of, never a replacement for, the underlying `<button>`/`<a>` semantics).
- No motion-only meaning: the category active-state is conveyed by `aria-pressed` + a persistent color/weight change, with the sliding pill as a *visual accompaniment*, not the sole signal.

---

## 13. Performance Budget

Targets (unchanged from the prior build's stated goals, still realistic for this scope): 60fps interaction, LCP < 2.5s, CLS < 0.1, INP < 200ms, Lighthouse Performance 90+/Accessibility 95+/SEO 95+.

**New-dependency cost**: `gsap` + `ScrollTrigger` ≈ 28-32KB gzipped combined, loaded only via the two dynamic imports in Section 6/7 — never in the initial/shared bundle, never on routes/viewports that don't need it (mobile never loads `menu-scroll-story.tsx`'s GSAP path since its `matchMedia` desktop branch is what pulls the plugin logic into use — the *component* still loads, but `ScrollTrigger.matchMedia()`'s mobile condition is a no-op, so the pin/scrub work itself never executes; a follow-up optimization noted in Section 19 is to additionally gate the dynamic `import()` itself behind a `window.matchMedia("(min-width: 1024px)").matches` check so mobile doesn't fetch the chunk at all).

**Rendering complexity**: `DishCard` tilt uses `useMotionValue`+`useSpring` (Framer Motion's own RAF-batched update loop, not a custom `requestAnimationFrame` loop) — only one such loop can be active per hovered card, and it's fully torn down on `onPointerLeave`/unmount. The pinned scroll story's `ScrollTrigger` scrub is driven by the browser's native scroll event (GSAP internally throttles/RAF-batches this), not a custom scroll listener.

**Cleanup audit** (verified in Stage 6, Section 15): `gsap.context().revert()` for both GSAP components; Framer Motion's `useMotionValue`/`useSpring` are automatically garbage-collected on unmount (no manual disposal API exists or is needed); the new `usePointerCapabilities()` hook's `matchMedia` listeners use the modern `addEventListener`/`removeEventListener` form (not the deprecated `addListener`) with cleanup in the `useEffect` return.

**Per-component cost estimate**:

| Component | JS cost | Rendering complexity | Mobile fallback | A11y fallback | Failure mode | Rollback |
|---|---|---|---|---|---|---|
| `hero-choreography.tsx` | +GSAP chunk (shared w/ scroll story) | Low (one timeline, one quickTo pair) | Entrance plays, parallax off | Static pose if reduced-motion | Dynamic import fails → static SVG shows | Remove wrapper, render `<HeroArtwork/>` directly |
| `menu-scroll-story.tsx` | +GSAP chunk (shared) | Medium (7-stage 3D Z-depth dolly on a `preserve-3d` stage, pin; transform/opacity-only so GPU-composited) | Flat stacked `RevealStagger`, no 3D | Same flat stacked fallback | matchMedia mismatch → falls to mobile branch safely | Delete component, keep `MenuHighlights`→`MenuExplorer` adjacency |
| `TiltCard` | 0 (Framer Motion already installed) | Low (spring per hovered card) | Not rendered (gated) | Not rendered | Gating hook returns false → plain children | Remove `TiltCard` wrapper in `dish-card.tsx` |
| `MagneticButton` (×2) | 0 (Framer Motion already installed) | Very low | Plain `Button` | Plain `Button` | Same | Remove wrapper, use `Button` directly |
| `MenuExplorer` + children | 0 new deps (React state + Framer Motion `layout`) | Low-medium (~138-item `useMemo` filter) | Fully functional (no motion dependency) | Fully functional | N/A — core feature, no fallback needed, must work | N/A (this is required functionality, not an enhancement) |

---

## 14. File-Level Change Map

### New files

| File | Responsibility | Owner/Boundary | Deps |
|---|---|---|---|
| `src/data/menu.ts` | 138 verified `MenuItem` records + `categorySlug` | Server-safe data module | none |
| `src/lib/whatsapp.ts` | `buildDishInquiryUrl`, `buildCategoryInquiryUrl` | Server-safe util | `@/data/business` |
| `src/lib/gsap.ts` | Single `gsap.registerPlugin(ScrollTrigger)` call | Client-only module (imported only by client components) | `gsap`, `gsap/ScrollTrigger` |
| `src/hooks/use-reduced-motion-preference.ts` | `matchMedia("(prefers-reduced-motion: reduce)")` hook, SSR-safe (`false` on server, hydrates true value) | Client hook | none |
| `src/hooks/use-pointer-capabilities.ts` | `{hoverHover, pointerFine, isDesktopWidth}` via `matchMedia` | Client hook | none |
| `src/hooks/use-magnetic-offset.ts` | Shared pointer-follow math for `MagneticButton`/`TiltCard` highlight | Client hook | `motion` |
| `src/components/motion/hero-choreography.tsx` | Hero GSAP entrance + parallax wrapper | Client, dynamically imported | `gsap`, `@/lib/gsap`, `@/hooks/*` |
| `src/components/motion/menu-scroll-story.tsx` | Pinned **3D** "Explore the Menu Universe" scroll scene (`perspective`+`preserve-3d` Z-depth dolly driven by ScrollTrigger scrub) | Client, dynamically imported, desktop-gated | `gsap`, `@/lib/gsap`, `@/data/business`, `@/data/menu`, `@/hooks/*` |
| `src/components/motion/tilt-card.tsx` | Pointer tilt wrapper | Client | `motion`, `@/hooks/*` |
| `src/components/motion/magnetic-button.tsx` | Magnetic CTA wrapper around `Button` | Client | `motion`, `@/components/ui/button`, `@/hooks/*` |
| `src/components/menu/menu-explorer.tsx` | Filter+search state, composes children | Client | `@/data/menu`, `@/data/business` |
| `src/components/menu/menu-category-tabs.tsx` | Category toggle-button group + `layoutId` indicator | Client | `motion` |
| `src/components/menu/menu-search.tsx` | Labeled search input + clear | Client | none |
| `src/components/menu/dish-card.tsx` | Individual dish display + WhatsApp action | Client (wraps in `TiltCard` conditionally) | `@/lib/whatsapp`, `@/components/motion/tilt-card` |
| `src/components/menu/menu-empty-state.tsx` | No-results state | Client | `motion` |

### Modified files

| File | Change | Server/Client boundary change? |
|---|---|---|
| `src/data/business.ts` | Add `slug: string` field to each `MenuCategory` entry (e.g. `"south-indian"`), used to join with `menu.ts`. No existing field removed or renamed. | No |
| `src/app/page.tsx` | Remove `<MenuCategoryGrid />`; add `<MenuScrollStory />` (between highlights and explorer) and `<MenuExplorer />` | No — `page.tsx` stays a Server Component composing client children, same pattern already used today |
| `src/components/hero-section.tsx` | Wrap `<HeroArtwork/>` in dynamically-imported `<HeroChoreography>` | Stays Server Component |
| `src/components/hero-artwork.tsx` | Add `data-gsap="tawa"` / `data-gsap="steam"` attributes to existing `<g>`/`<path>` elements — **no markup restructuring** | Stays a plain (non-"use client") file; still rendered by the server-component parent |
| `src/components/site-header.tsx` | Add cyclic focus-trap `useEffect` to the existing mobile-menu open/close logic | No (already client) |
| `package.json` | Add `"gsap": "^3.12.x"` | — |

### Deleted files

| File | Reason |
|---|---|
| `src/components/menu-category-grid.tsx` | Superseded by `src/components/menu/menu-explorer.tsx`, which is strictly more capable (functional filtering vs static display) and covers the same "category + count" information in its header |

### Explicitly unchanged

`src/app/layout.tsx`, `src/app/globals.css` (only *additive* CSS may be needed for `[perspective:1000px]` utility if not already expressible via Tailwind arbitrary values — confirmed Tailwind supports `[perspective:1000px]` as an arbitrary-value utility natively, so **no globals.css edit is needed at all**), `tailwind.config.ts`, `src/components/{trust-strip, menu-highlights (structure), service-highlights, reputation-section, location-section, contact-section, instagram-section, site-footer, floating-whatsapp-button, mobile-action-bar, motion-primitives, section-heading, skip-link, icons, structured-data}.tsx`, `src/components/ui/button.tsx`, `src/lib/{site.ts, utils.ts}`, `src/types/assets.d.ts`, `src/app/{robots.ts, sitemap.ts, icon.tsx}`.

---

## 15. Implementation Stages

### Stage 1 — Content and functionality (no motion work yet)
**Files**: `src/data/menu.ts` (new), `src/lib/whatsapp.ts` (new), `src/data/business.ts` (add `slug`), `src/components/menu/*` (new, all 5 files), `src/app/page.tsx` (swap `MenuCategoryGrid`→`MenuExplorer`), delete `menu-category-grid.tsx`.
**Completion criteria**: category filter, search, combined filter+search, clear, empty state, dish-specific and category-specific WhatsApp links all work; South Indian's honest count-gap note renders correctly; no motion beyond plain CSS transitions on hover.
**Verification**: `npm run build && npm run lint`; manual click-through of every filter/search/WhatsApp-link combination; verify generated `wa.me` URLs decode to the exact expected text for 3 sample dishes.
**Rollback boundary**: this stage is additive+one deletion; revertible via `git revert` of this stage's commit(s) with zero impact on Stage 2+ (which haven't started).

### Stage 2 — Visual system
**Files**: `src/components/menu/dish-card.tsx` (final visual polish), no token files touched (Section 3: palette/type/spacing/radii/shadow all reused as-is).
**Completion criteria**: `DishCard` visually consistent with existing card language (`rounded-card`, `shadow-card`, `warm-border`) while reading as "the interactive one."
**Verification**: visual review against `ui-ux-pro-max` skill guidance for density/spacing on a 138-item list; `web-design-guidelines` skill run against new files.

### Stage 3 — Interaction foundation
**Files**: `src/hooks/use-reduced-motion-preference.ts`, `src/hooks/use-pointer-capabilities.ts`, `src/hooks/use-magnetic-offset.ts` (all new), `src/components/site-header.tsx` (focus-trap fix).
**Completion criteria**: hooks return correct values in dev (manually toggled via browser devtools reduced-motion emulation and touch-mode emulation); mobile menu Tab cycling verified to stay within the panel while open.
**Verification**: keyboard walkthrough of mobile menu; `matchMedia` hook unit-verified via manual devtools toggling (no test framework currently in the repo — see Section 16 for the testing-infrastructure gap this implies).

### Stage 4 — GSAP signature experiences
**Files**: `package.json` (add `gsap`), `src/lib/gsap.ts` (new), `src/components/motion/hero-choreography.tsx` (new), `src/components/motion/menu-scroll-story.tsx` (new), `src/components/hero-section.tsx` (wrap artwork), `src/components/hero-artwork.tsx` (add `data-gsap` attrs), `src/app/page.tsx` (add `MenuScrollStory`).
**Completion criteria**: hero entrance plays once on load; pinned scroll story pins/scrubs correctly on desktop and is entirely replaced by the stacked mobile view below 1024px; both fully static under reduced motion; no duplicate ScrollTrigger instances in React Strict Mode dev.
**Verification**: manual scroll-through at 1280px/1440px; resize from 1280→768px mid-scroll to confirm `matchMedia` teardown; React DevTools Profiler check for repeated GSAP context creation in dev.

### Stage 5 — Controlled 3D depth
**Files**: `src/components/motion/tilt-card.tsx`, `src/components/motion/magnetic-button.tsx` (both new), `src/components/menu/dish-card.tsx` (wrap in `TiltCard`), `src/components/hero-section.tsx` + `src/components/menu/menu-explorer.tsx` (apply the 2 capped `MagneticButton` instances).
**Completion criteria**: tilt/magnetism only active on qualifying desktop pointers; zero effect (not just "disabled" but literally unmounted wrapper) on touch; no conflict with `TiltCard`'s own `layout`-based reflow when items filter in/out.
**Verification**: Chrome DevTools device-toolbar touch emulation confirms tilt never engages; real trackpad/mouse test confirms tilt/magnetism feel restrained per the brief's degree/px caps.

### Stage 6 — Optimization
**Files**: none new — profiling/cleanup pass across Stage 4-5 files.
**Completion criteria**: GSAP+ScrollTrigger confirmed absent from the shared/initial bundle via `next build`'s bundle output; all `gsap.context()`/`ScrollTrigger`/`matchMedia` listeners confirmed cleaned up (no detached-listener warnings across a mount/unmount/remount cycle); dynamic-import chunk sizes reported.
**Verification**: `npm run build` bundle-size table inspection (route-level First Load JS, comparing homepage before/after); manual mount→navigate-away→back cycle (single-route site, so this means toggling viewport across the `matchMedia` breakpoint repeatedly) watching for console warnings/memory growth in DevTools.

### Stage 7 — Final audit
**Files**: none — verification only.
**Completion criteria**: full Section 16 matrix passes; `web-design-guidelines` skill re-run against all touched files; `seo-audit` skill spot-check to confirm the new menu content doesn't need new structured data (it doesn't — `structured-data.tsx`'s `Restaurant` JSON-LD already covers `servesCuisine` at the category level and individual dish schema isn't required/expected for this site type).
**Verification**: `npm run build && npm run lint`; full responsive matrix (Section 11); full reduced-motion matrix (Section 12); production `npm run start` smoke test of every WhatsApp/tel/maps/Instagram link plus the new dish/category inquiry links.

---

## 16. Verification Matrix

**Functional**: every existing link (nav, tel, maps, Instagram, general/menu/order/table WhatsApp — all pre-verified working in the prior build, re-check only for regressions) + every new link (dish-specific WhatsApp ×138, spot-check 10 + all 14 category-specific WhatsApp links); category filter (all 14 + "All"); search (exact match, partial match, case-insensitivity, whitespace-trim, no-match empty state); combined filter+search; clear-filters; mobile-menu open/close/Escape/focus-trap (new)/browser-back.

**Animation**: GSAP context creation confirmed single-instance under React 19 Strict Mode dev double-invoke; `ScrollTrigger.matchMedia()` breakpoint switch confirmed via resize test; no GSAP+Framer-Motion property conflict (verified by code review against the ownership table in Section 5/10 — no component has both a GSAP `.to()` and a Framer Motion `animate`/`layout` targeting the same element); content visible with JS disabled (browser devtools "disable JavaScript," confirm hero artwork and all menu content/text are present, only entrance/parallax/tilt/pin motion absent); content visible before hydration (throttled network, screenshot mid-load); resize/orientation-change (rotate emulated device mid-scroll-story); hidden-tab behavior (switch tabs during pinned scroll, confirm no runaway RAF/CPU on return — GSAP's ticker auto-pauses via `visibilitychange` internally, confirmed by design not needing custom code).

**Responsive**: full matrix from Section 11 at all 8 listed widths, with specific new checks for `MenuCategoryTabs` horizontal-strip overflow, `DishCard` long-name wrapping, and `menu-scroll-story.tsx`'s complete absence (not just visual hiding — confirmed absent from the DOM/JS execution path) below 1024px.

**Performance**: `npm run build` bundle inspection (homepage First Load JS before vs. after — target: shared bundle unchanged, homepage-route bundle grows only by the `MenuExplorer`/data-module cost, GSAP absent from both since it's fully dynamic-imported); Lighthouse run against `npm run start` production build; main-thread profiling during a scroll-story pass and a rapid-search-typing burst.

**Accessibility**: full keyboard walkthrough (Tab order through nav → hero CTAs → highlights → scroll-story's "View Full Menu" escape hatch → category tabs → search → dish cards → rest of page → footer); mobile-menu focus containment (new); reduced-motion emulation via devtools for every Section 12 table row; contrast spot-check on any new text-on-surface combination introduced by `DishCard`/`MenuCategoryTabs` (expectation: zero new combinations, since they reuse existing `charcoal`-on-`cream`/`ivory`/`white` and `tomato`/`coriander` tokens already verified AA in the prior build); screen-reader pass (VoiceOver or NVDA, whichever is available in the execution environment) over the category-tabs group, search input, and result-count live region specifically, since these are the genuinely new interaction patterns.

---

## 17. Risks and Rollback Plan

| Risk | Likelihood | Impact | Mitigation | Rollback |
|---|---|---|---|---|
| GSAP + React 19 Strict Mode double-invoke causes duplicate ScrollTrigger pins in dev | Medium | Medium (dev-only annoyance, not a prod bug if `gsap.context().revert()` pattern is followed correctly) | Follow the documented create-and-revert-in-same-effect pattern exactly (Section 7); test explicitly in dev with Strict Mode (Next.js 15 has it on by default) | Fall back to `useLayoutEffect` + explicit `ScrollTrigger.getAll().forEach(t=>t.kill())` guard if the standard pattern proves insufficient |
| Pinned scroll story feels janky on mid-range hardware | Medium | High (this is the site's one showcase moment) | Transform/opacity-only animation (no layout properties), `invalidateOnRefresh`, tested against Section 13's performance budget before Stage 5 begins (per the brief's own recommended sequencing) | Reduce stage count from 7 to 4-5, or shorten pin distance, or (last resort) demote to a non-pinned `Reveal`/`RevealStagger` sequence identical to the mobile fallback — architecture already supports this swap with no data-model change |
| South Indian's honest count-gap (24 of ~46) reads as an error to users/owner rather than intentional honesty | Low-Medium | Medium (could be misread as "broken" content) | Explicit inline copy (Section 9) rather than a bare "24" number; flagged in Section 19 as worth owner confirmation before launch | Simplify to just showing "24 dishes" with no aggregate-count comparison at all if the qualifier reads as confusing in practice |
| Mobile-menu focus-trap fix introduces a regression to the currently-working Escape/focus-restore behavior | Low | Medium (accessibility regression in previously-correct code) | Additive `useEffect` only intercepts Tab/Shift+Tab at panel boundaries; existing Escape/focus-restore `useEffect` is untouched, not merged/rewritten | Revert the single new `useEffect`; existing behavior (sans full trap) returns immediately |
| `usePointerCapabilities()` misjudges a hybrid device (e.g. touch laptop with mouse attached) | Low | Low (worst case: tilt/magnetism either shows on an unexpected device or doesn't show on one that could support it — never breaks core function since the wrapped elements always render valid fallback content) | Conservative gating (all of `pointer:fine` AND `hover:hover` AND width must pass) errs toward *disabling* the enhancement rather than risking it on an inappropriate device | No rollback needed — worst case is a missed enhancement, not a bug |
| Dynamic `import()` chunk for GSAP fails to load (network) on hero or scroll-story | Low | Low (per Section 13, both components render valid static content regardless) | Static SVG (hero) / stacked `RevealStagger` markup only appears client-side after mount attempt — brief flicker risk if the *component itself* fails to mount at all rather than gracefully no-op | Wrap both dynamic imports' consuming code in a try/effect pattern that falls back to rendering `children`/static markup on import rejection (add explicit `.catch()` handling, not just relying on Next's default dynamic-import error boundary) |
| `menu.ts`'s 138 dishes accidentally omit or misspell a verified name during transcription | Low | High (content-accuracy is the brief's top-tier requirement) | Line-by-line transcription plan cross-checked against the brief's per-category counts (Section 9's count-reconciliation table) as a built-in proofreading step | Any single-dish typo is a one-line fix in `menu.ts`, no architecture impact |

---

## 18. Acceptance Checklist

Mapped directly to the brief's 35-item Phase 20 list, annotated with this plan's specific verification method (all ✅ = addressed by this plan's design, to be confirmed true only after Stage 7 execution — not claimed true now):

1. No longer generic-feeling — Sections 2, 3, 5 (targeted motion hierarchy + functional menu, existing distinctive palette preserved).
2. Coherent, Mahesh-Pav-Bhaji-specific system — Section 3 (palette/type unchanged, tawa motif reused across hero + scroll story).
3. One memorable hero signature animation — Section 6.
4. No more than one major pinned desktop narrative — Section 7 (exactly one, `menu-scroll-story.tsx`).
5. Pinned experience has a clear mobile alternative — Section 7 (stacked `RevealStagger`).
6. GSAP owns scroll-driven sequences — Sections 4, 6, 7, 10 (ownership table).
7. Framer Motion owns state-driven transitions — Sections 4, 8, 9, 10.
8. No property conflict between the two — Section 16 (explicit code-review verification step).
9. Category controls perform a real function — Section 9.
10. Search works — Section 9.
11. Clear-filter works — Section 9.
12. Result counts accurate — Section 9 (derived, not hand-maintained).
13. Dish-specific WhatsApp inquiries work — Section 9.
14. Category-specific WhatsApp inquiries work — Section 9.
15. No fabricated price/ingredient/availability/offer — Section 9 (`MenuItem` type has no such fields, by design).
16. Business facts match approved source — Section 14 (`business.ts` only gains a `slug` field, no fact changes).
17-20. WhatsApp/tel/Maps/Instagram URLs — unchanged from prior build, re-verified in Section 16.
21-22. 3D pointer interactions correct scope, touch simplified — Section 8.
23. Reduced-motion users get complete static experience — Section 12.
24. No horizontal overflow at 320px — Section 11, verified in Section 16.
25. Floating controls don't cover content — unchanged components, re-verified.
26. Content visible if animation fails — Sections 6, 7, 17 (explicit fallback design + failure-mode mitigation).
27. Timelines/triggers/listeners/observers/RAF cleaned up — Section 13, verified in Stage 6.
28-31. Build/type-check/lint succeed, no new console errors — Section 16, Stage 7.
32. No decorative-only buttons — every new button (category tabs, search clear, dish WhatsApp, magnetic CTAs) performs a real function.
33. No unapproved imagery — Section 9 confirms zero new images; hero artwork reused, not replaced.
34. Usable on mid-range Android — Section 11 (mobile alternative has zero GSAP dependency in its execution path).
35. Motion feels deliberate and restrained — Section 5 (density map), self-assessed at Stage 7, ultimately a subjective owner/user judgment call to make after seeing the built result.

---

## 19. Missing Inputs

Per the brief's "ask no more than three questions, otherwise state reasonable assumptions" instruction, the following assumptions were made rather than blocking on questions — flagged here for visibility, not left silent:

1. **South Indian's honest 24-of-46 gap**: assumed the correct treatment is transparent in-UI labeling (Section 9) rather than either (a) hiding the aggregate "~46" figure entirely or (b) omitting the South Indian category from the interactive explorer until a complete list exists. If the site owner would prefer approach (a) or (b), that's a one-file (`menu-explorer.tsx`'s header copy) change, not an architecture change.
2. **Animated CTA borders**: the brief permits ("no more than one or two CTAs") but doesn't require this. Assumed **not** building it in this pass (Section 8) to avoid stacking a third animation system onto the same two `MagneticButton` CTAs. Flagged as an easy Stage-5 add-on if explicitly wanted later.
3. **Approved photography**: still none exists (confirmed unchanged from the prior build's `CLIENT_CONTENT_NEEDED.md`, which this plan does not touch). The redesign remains fully photo-light by necessity, not by choice — if photography becomes available, `DishCard` and `hero-artwork.tsx` are exactly the two places `next/image` would be introduced, but that's out of scope for this plan.
4. **No automated test suite exists in this repo** (confirmed in Section 1's audit — only `npm run build`/`npm run lint`/`tsc` exist as checks). This plan's Section 16 verification matrix is therefore entirely manual/build-based, not automated-test-based — consistent with the prior build's own verification approach, but worth naming explicitly since the brief's Phase 19 "Testing Matrix" reads as if a test framework exists. No test framework is proposed to be added, since introducing one is a scope decision beyond "redesign the motion system" and wasn't requested.

No architecturally-material question needs to block starting Stage 1 — all four items above are either already resolved by a stated assumption or are deferred/optional add-ons that don't change the file-level plan.

---

## 20. Final Recommendation

**Three options considered:**

- **Full motion implementation** (everything in this plan, all at once, single large PR): highest risk — GSAP integration bugs, performance regressions, and accessibility gaps would all surface simultaneously, making root-causing any single issue harder, and the brief's own recommended execution strategy (content → visual → interaction foundation → GSAP → 3D → optimize → audit) explicitly argues against this.
- **Reduced-scope implementation** (menu functionality only, Section 9, skip Sections 6-8 entirely — no GSAP, no tilt, no magnetic buttons): lowest risk, fastest to ship, and **does** close the plan's single Critical-severity gap (Section 2, finding #1/#4: no dish-level menu browsing). But it leaves the brief's explicit "one memorable hero animation" and "one desktop scroll narrative" requirements entirely unmet, which were clearly stated as required deliverables, not optional stretch goals.
- **Staged implementation** (this plan's Section 15, 7 stages, functionality-first): captures the full brief's scope while sequencing risk — the Critical menu-functionality gap ships first and independently (Stage 1 alone is a complete, valuable, low-risk release), GSAP work only begins once the interaction foundation (reduced-motion/pointer-capability hooks) exists to safely gate it, and the highest-complexity piece (pinned scroll story) is explicitly built and performance-tested *before* the lowest-priority piece (card tilt) rather than in parallel.

**Recommendation: staged implementation, Section 15's 7 stages, in order, with Stage 1 treated as independently shippable.** This is justified by: (a) repository condition — the existing codebase is clean, small, and well-factored (18 components, clear data/lib separation), so incremental additions carry low integration risk at each stage; (b) performance risk — GSAP is new to this codebase, and the brief's own "measure animation cost... before building the most complex scroll experience" instruction directly supports validating the hero (Stage 4's first half) before committing to the harder pinned-story implementation; (c) business value — the menu-search/filter gap (Section 2, finding #1) is this plan's only Critical-severity item and delivers standalone user value the moment Stage 1 ships, independent of whether any subsequent motion stage is ever built; (d) development effort — concentrated in 3-4 new areas (menu system, hero wrapper, one scroll story, tilt/magnetic primitives) rather than a full-site rewrite, keeping total new-file count to ~19 files against a ~2,100-line existing codebase; (e) maintainability — strict GSAP/Framer-Motion/CSS ownership boundaries (Sections 4, 5, 10) mean future changes to any one animation system can't accidentally break another, and the existing `Reveal`/`RevealStagger` CSS system — proven, working, and correctly reduced-motion-safe — is left completely untouched everywhere it already does its job well.

**Do not implement yet, per explicit instruction.** This plan is ready for approval and, once approved, Stage 1 can begin immediately without further architectural discussion.
