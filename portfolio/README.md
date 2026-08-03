# Portfolio

A single-page developer portfolio: a scroll-driven 3D hero, liquid-glass
surfaces, and an animated walk-through of real project screens.

Self-contained — it does not share dependencies, config or build output with
the site at the repository root.

```bash
cd portfolio
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run check:content` | Lists every `[placeholder]` still unfilled |

## Making it yours

**Everything you need to change is in `src/data/portfolio.ts`.** No component
hard-codes a personal fact — name, role, links, projects, screenshots, skills
and SEO copy are all read from that one file.

Run `npm run check:content` to see what is outstanding. It exits non-zero
while any placeholder remains, so it can gate a deploy.

### How placeholders behave

Anything still wrapped in `[square brackets]` is treated as unfilled, and the
site refuses to present it as real:

- placeholder **text** renders with a dashed outline plus a screen-reader note
  saying it is a placeholder;
- placeholder **links** render as inert marked text, not as anchors — a link
  that goes nowhere costs a click and costs you credibility;
- **empty sections disappear**. Leave `testimonials` or `writing` empty and
  the section is not rendered and its nav item is not shown. Absence reads as
  deliberate; an empty "What people say" heading reads as unfinished.

This is not decoration. It is there so that a half-filled site cannot be
mistaken for a finished one, by you or by a visitor.

### Project screenshots

Each project can carry a three-step flow (`input → processing → result`, or
`overview → detail → action`). Put real screenshots in `public/projects/` and
list them under `flow.screens`. With fewer than three, the card renders a
clearly-marked media requirement instead — it will not generate a fake
interface to fill the space.

Write `alt` text describing what is *on* the screen, not "screenshot of app".

### Honest outcomes

`outcome` is the field people read most carefully. If a project has no
validated metric yet, say so — "launched in March, no usage data yet" is
credible; an invented "40% faster" is not, and is the kind of claim an
interviewer will ask you to substantiate.

## Publishing

Set `site.url` in `src/data/portfolio.ts` to your real address. Until you do,
the site deliberately serves `noindex` and a `Disallow: /` robots file, so an
accidental deploy of a half-filled portfolio cannot become the first result
for your name. Filling in the URL turns indexing on.

## Notes on the build

- **3D hero** — `three` / `@react-three/fiber`, dynamically imported and never
  server-rendered. It is skipped entirely on devices without WebGL, on
  low-memory devices, and for anyone who asked for reduced motion. The canvas
  is unmounted once the hero scrolls away, which releases the GPU context for
  the rest of the visit.
- **Motion** — GSAP ScrollTrigger for scroll-linked choreography, Motion for
  interaction state, Lenis for smooth scrolling on large screens with a
  precise pointer. All three are dynamically imported and none of them load
  under `prefers-reduced-motion`.
- **Reveals** are CSS, gated on `html.js`. With JavaScript off, or if a chunk
  fails, the content is simply visible — nothing can be trapped invisible by
  an animation that never ran.
- **Fonts** are self-hosted by `next/font`. The body face uses
  `font-display: optional` rather than `swap`, because a late swap re-wrapped
  the hero paragraph and moved the whole block (measured 0.108 CLS on a
  throttled 4G profile). Headings keep `swap`.
- **No contact form.** A form needs a server route or a third-party endpoint,
  and either needs validation, rate limiting and spam handling to be
  responsible. An email address covers the same ground without routing a
  stranger's message through a service they were never told about.
- **No analytics, no tracking, no third-party requests.** The Content Security
  Policy in `next.config.mjs` blocks every external origin.
