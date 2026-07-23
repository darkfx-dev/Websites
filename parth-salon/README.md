# Parth Salon — Website

A premium, mobile-first, conversion-focused website for **Parth Salon**, a
salon in Katargam, Surat, established in 2003. Built to be edited from a phone
and hosted for free.

**Primary actions:** Book on WhatsApp · Call · Get Directions — reachable within
seconds on every screen, including a sticky mobile action bar.

> **Editing the site?** See **[OWNER-GUIDE.md](./OWNER-GUIDE.md)** — a plain,
> phone-friendly walkthrough. Everything editable lives in one file:
> `src/config/business.ts`.

---

## Tech stack

- **React 19 + TypeScript + Vite** (static build, deploys anywhere free)
- **Tailwind CSS v4** — design tokens for the forest-green / ivory / silver system
- **Framer Motion** — one centralized, calm motion system driven by shared
  tokens (`src/motion/tokens.ts`: duration / distance / easing / spring),
  `LazyMotion` + `domAnimation`, an adaptive-motion hook (`useAdaptiveMotion`)
  that gates parallax to capable pointers, and full reduced-motion support
- **Self-hosted fonts** (Cormorant Garamond + Manrope via `@fontsource`) — no
  Google Fonts network dependency
- **lucide-react** + inline SVG icons — no emoji, no icon-font
- **sharp** — build-time AVIF/WebP responsive image generation

No database, no CMS, no API keys, no paid services.

### Components adapted from 21st.dev

- **Gallery + lightbox** (`src/components/Gallery.tsx`) — the grid + animated
  lightbox pattern is adapted from the 21st.dev "Gallery Grid with Lightbox"
  component. It was reworked onto the Parth Salon design system, its shadcn
  `Badge`/`Button`/`Card` dependencies removed, rebuilt on the `m` LazyMotion
  primitives and `ResponsiveMedia`, and the lightbox hardened for
  accessibility: focus trap, Escape to close, ←/→ navigation, body scroll-lock,
  and focus returned to the triggering tile on close. It renders only when real
  `galleryImages` exist. The three images are genuine views of the confirmed
  interior photograph (a wide shot plus two real detail crops).

## Local development

```bash
cd parth-salon
npm install
npm run dev        # local dev server
npm run build      # optimizes images, type-checks, then production build
npm run preview    # preview the production build
npm run lint       # oxlint
npm run optimize-images   # regenerate AVIF/WebP (also runs before build)
```

Requires Node.js 20+.

## Free deployment

This site is a **subfolder** (`parth-salon`) of the repository. When connecting
a host, point it at that subfolder:

### Netlify (free)
1. netlify.com → **Add new site → Import an existing project** → pick this repo.
2. Set **Base directory** to `parth-salon`.
   (Build command `npm run build` and publish directory `dist` are already in
   `parth-salon/netlify.toml`.)
3. Deploy. Every push to the repo redeploys automatically.

### Vercel (free)
1. vercel.com → **Add New → Project** → import this repo.
2. Set **Root Directory** to `parth-salon`.
3. Framework preset **Vite** (build `npm run build`, output `dist`). Deploy.

### Cloudflare Pages (free)
1. Pages → **Create → Connect to Git** → pick this repo.
2. **Root directory** `parth-salon`, build command `npm run build`, output `dist`.

After deploying, add your real domain in the host's dashboard and set the
`<link rel="canonical">` in `index.html` to that domain.

## Project structure

```
parth-salon/
├── src/
│   ├── config/business.ts     ← SINGLE source of truth (owner edits here)
│   ├── content/                gated data models: services, testimonials, team
│   │                           (private-until-confirmed catalogue)
│   ├── lib/                    hours (Asia/Kolkata) incl. statusLabel +
│   │                           checkTimeWithinHours, whatsapp (enquiry +
│   │                           consultation), validation, structured data
│   ├── motion/                 tokens.ts (timing scale), variants.ts,
│   │                           useAdaptiveMotion.ts
│   ├── data/nav.ts             section links
│   ├── components/             Header, Hero, TrustStrip, HeritageStory, Gallery,
│   │                           ServicesInquiry, BusinessHours, EnquiryBuilder
│   │                           (3-step WhatsApp consultation), LocationSection,
│   │                           FinalCTA, FloatingActions, MobileActionBar,
│   │                           Footer, + primitives
│   ├── index.css               design tokens + base styles
│   └── App.tsx
├── public/images/              interior photo + generated AVIF/WebP/OG variants
├── scripts/                    image optimizer + logic tests
├── OWNER-GUIDE.md              phone-friendly editing guide
└── netlify.toml
```

## Accessibility & performance

- **WCAG 2.2 AA:** 0 axe-core violations (desktop **and** mobile), one H1,
  logical headings, keyboard-operable menu/form, visible focus, 44px+ targets,
  skip link, screen-reader form errors, reduced-motion support.
- **Honesty by design:** no invented services, prices, ratings, reviews, or
  claims. The rating stays hidden until a verified value is entered; services
  show an enquiry prompt until real ones are added.
- **Performance:** images ship as AVIF/WebP (the 2.3 MB source becomes ~21 KB at
  mobile width), fonts self-hosted and subset by unicode-range, JS ≈ 102 KB
  gzip, no layout-shifting media (width/height set).

## Tests & checks actually run

- `npm run build` — image optimization + `tsc` + Vite build: **passing**
- `npm run lint` (oxlint): **clean**; `tsc --noEmit`: **clean**
- `npm test` (`scripts/logic.test.mjs`) — **37/37** logic checks: hours schedule
  & half-open open/closed boundaries, `statusLabel` (open / opens-today /
  opens-tomorrow), `checkTimeWithinHours` enquiry-time hint, phone/date
  validation, the 3-step consultation validation + `STEP_FIELDS`, the exact
  consultation WhatsApp message (safe defaults + no-booking disclaimer + single
  encode), the services publication gate, and directions fallback.
- Playwright interaction + accessibility audit — **16/16**: the full 3-step
  enquiry flow (step-1 validation blocks with an error summary → advance →
  WhatsApp hand-off builds the correct `wa.me` link with no booking claim),
  the hero tagline + live open-now status, the honest unpublished-services
  prompt, mobile menu open/Escape, no horizontal overflow at 320/375/768/1440,
  reduced-motion flow, and axe (**0 serious/critical violations**) at 1440px,
  375px, and under reduced motion.

## Remaining verification before go-live

These are content facts only Parth Salon can confirm (all flagged in
`business.ts`):

1. Exact **Google Maps** sharing link → set `mapsUrl`.
2. Spelling of **"Avlon Comercial Hub"** in the address.
3. One verified **rating + review count + source** → then `showRating: true`.
4. Current **service list and prices** → confirm items in
   `src/content/services.ts`, then flip `servicesPublicationApproved: true`.
5. **Public-holiday** hours (a notice is already shown).
6. **Testimonials / team** → stay hidden until an entry in
   `src/content/testimonials.ts` / `team.ts` is verified and `enabled: true`.

The interior photograph has been confirmed by the owner as genuine and is used
as the main "Inside Parth Salon" visual. The **Instagram** handle
(`@parth_salon_`) is a plain profile link — no scraping, no follower counts.

---

## Part 2 — cinematic motion, service discovery & WhatsApp conversion

Part 2 is an enhancement layer over the original build. Conflicts were resolved
in this priority order: **factual accuracy → accessibility/mobile → performance/
conversion → optional visual flourish** (a working free fallback always wins).

- **Centralized motion system** — one `motion/tokens.ts` scale (duration,
  distance, easing, spring) that `variants.ts` and every component read from, so
  the whole site shares one rhythm. `useAdaptiveMotion` gates optional parallax
  to fine-pointer, motion-OK devices; reduced motion always wins.
- **Distinctive hero** — the arch motif echoing the interior, the owner-selected
  tagline *"Designed for comfort, dedicated to style."*, and a live open-now
  status (`statusLabel`, computed in Asia/Kolkata).
- **Reading-progress line** — a 2px header underline bound directly to
  `scrollYProgress` (a cheap MotionValue → `scaleX`, no keyframes).
- **Data-driven service explorer** — the full menu lives in
  `content/services.ts` but is **publication-gated**: nothing shows until the
  owner confirms items *and* flips the master switch, so no unverified price or
  service can ever appear. Published cards deep-link to WhatsApp with each
  item's own enquiry prompt.
- **3-step WhatsApp consultation builder** (`EnquiryBuilder`) — enquiry →
  timing & details → your details, composing the exact prefilled WhatsApp
  message (encoded once). It never claims a booking is confirmed, keeps state
  for the session only (with "Clear form"), warns — without blocking — when a
  chosen time is outside opening hours, and is fully accessible: per-step error
  summary, focus moved to the first invalid field, `aria-describedby` errors,
  announced step changes, ≤16px non-color-alone step transitions, and state
  preserved on Back.
- **Honest by default** — testimonials, team, and the star rating remain hidden
  until verified; Instagram is a link, not a scrape.
