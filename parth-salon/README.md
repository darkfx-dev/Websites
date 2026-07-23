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
- **Framer Motion** — one centralized, calm motion system (`LazyMotion` +
  `domAnimation`, honours reduced motion)
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
│   ├── lib/                    hours (Asia/Kolkata), whatsapp, validation, structured data
│   ├── motion/variants.ts      all animation timing
│   ├── data/nav.ts             section links
│   ├── components/             Header, Hero, TrustStrip, HeritageStory, Gallery,
│   │                           ServicesInquiry, BusinessHours, AppointmentForm,
│   │                           LocationSection, FinalCTA, FloatingActions,
│   │                           MobileActionBar, Footer, + primitives
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
- `npm run lint` (oxlint): **clean**
- `scripts/logic.test.mjs` — **16/16** logic checks (hours schedule, IST
  open/closed, phone/date validation, WhatsApp encoding, directions fallback)
- Playwright site audit — **30/30**: WhatsApp/tel/directions links, hours table
  & today highlight, form validation + WhatsApp hand-off, mobile menu (open/
  Escape/scroll-lock), no overflow at 320/390, reduced motion, JSON-LD, and
  axe (0 violations) on desktop and mobile.
- Playwright gallery audit — **18/18**: grid renders real images, thumbnails
  served as AVIF/WebP, lightbox opens as a modal dialog, focus trap, Escape,
  ←/→ navigation with wrap, focus restored to the opening tile, keyboard-open
  via Enter, and axe (0 violations) with the lightbox open on desktop and mobile.

## Remaining verification before go-live

These are content facts only Parth Salon can confirm (all flagged in
`business.ts`):

1. Exact **Google Maps** sharing link → set `mapsUrl`.
2. Spelling of **"Avlon Comercial Hub"** in the address.
3. One verified **rating + review count + source** → then `showRating: true`.
4. Current **service list and prices** → add to `services`.
5. **Public-holiday** hours (a notice is already shown).

The interior photograph has been confirmed by the owner as genuine and is used
as the main "Inside Parth Salon" visual.
