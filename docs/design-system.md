# Guided Ascent — Design System

The visual identity for the St. Thomas School, Surat website. The name refers
to the site's signature motif: a thin red path rising through the four
academic stages, from Standard 1 to Standard 12.

## Provenance

- The **UI/UX Pro Max** skill was run for an education design system. Its
  useful recommendations were adopted: minimal single-column conversion
  pattern, one primary CTA per screen, high-contrast buttons, mobile-first
  checklists. Its style suggestion (Claymorphism with a teal/amber palette)
  conflicted with the approved white/red/gray direction and the school's
  serious tone, and was **rejected** — as the brief instructs.
- Anthropic's **frontend-design** skill guided the editorial composition,
  restraint rules and copy voice.
- **21st.dev MCP** was queried successfully for stepper/header patterns.
  Component code retrieval on 21st.dev is a paid operation, so results were
  used as pattern inspiration only; all components here are custom.

## Colour tokens

Defined once in `src/styles/global.css`:

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FFFFFF` | Page background |
| `--surface` | `#F6F6F7` | Alternate section background |
| `--border` | `#DEDFE3` | Rules, borders, grid lines |
| `--ink-muted` | `#5E626B` | Secondary text (4.5:1+ on paper) |
| `--ink` | `#1D1F23` | Body text, dark surfaces |
| `--red` | `#B21F2D` | Actions, emphasis, the ascent line |
| `--red-deep` | `#7E1520` | Hover states, WhatsApp dock button |
| `--red-tint` | `#FBEAEC` | Selected states, soft highlights |

Red is for **action and emphasis only** — never a full-page flood. The dock
halo cycles white → silver-gray → pale red only.

## Typography

Self-hosted via Fontsource (OFL licences, no external font CDN):

- **Manrope Variable** (`--font-sans`) — navigation, body, forms, labels.
- **Source Serif 4 Variable** (`--font-serif`) — display headings (h1–h3),
  stage numbers, the brand line.

Body is 16px/1.6. Headings use `clamp()` scales; body copy is capped at
`--measure: 62ch`. No all-caps body text; uppercase is limited to eyebrows
and small labels with wide tracking.

## Composition rules

- Editorial left-aligned grid, max width `72rem`, generous block spacing
  (`clamp(3rem, 8vw, 6rem)` per section).
- The eyebrow (short red rule + uppercase label) marks every section.
- Numbered markers appear **only** where content is genuinely sequential
  (academic stages, enquiry steps).
- Cards exist only to clarify relationships (streams, contact choices);
  corners and shadows are minimal.
- The logo area stays text-based until the school supplies an official logo.

## Motion ownership

| Layer | Owns | Never touches |
|---|---|---|
| **Motion for React** | Menu drawer, FAQ accordion, form step transitions | Scroll-linked animation |
| **GSAP + ScrollTrigger** | Section reveals, ascent-line drawing | Component state |
| **CSS** | Dock halo, hover/focus states | — |

Rules enforced in code:

- GSAP loads lazily after idle, only if `[data-reveal]` exists and the user
  has not requested reduced motion; `gsap.matchMedia` guards every timeline
  and triggers are killed on teardown.
- Motion transitions are ≤ 260 ms, interruptible, and read
  `useReducedMotion()`.
- The dock halo pauses under `prefers-reduced-motion`, when the tab is
  hidden, and when Data Saver is on.
- No element has the same CSS property animated by both libraries.

## The 3D hero

`Hero3DGate` loads the React Three Fiber scene only when **all** pass:
no reduced-motion preference, viewport ≥ 700px, no Data Saver, no 2g/3g
connection, ≥ 4 GB device memory (when reported), ≥ 4 cores, and working
WebGL. Everyone else keeps the static SVG — which is the same composition
(grid, page plane, rising path, four markers) and is treated as a first-class
visual. The scene uses basic materials only: no shadows, no post-processing,
no textures, DPR capped at 1.75, `low-power` GPU preference, and rendering
pauses off-screen and in background tabs.

## Accessibility floor

WCAG 2.2 AA targets: semantic landmarks, skip link, visible focus
(`:focus-visible` 3px red outline), 48px touch targets, labelled fields with
inline `role="alert"` errors and `aria-describedby` wiring, focus moved to
the step heading on step changes, focus-trapped drawer with Escape support,
decorative canvas `aria-hidden`, and descriptive link names ("Get directions
to STEMS (opens Google Maps)").
