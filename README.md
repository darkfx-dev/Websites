# St. Thomas School, Surat — Website

The website for **St. Thomas English Medium Higher Secondary School (STEMS)**,
Surat. Built to be fast on inexpensive Android phones and slow connections,
free to host, and honest about what it does.

## What the site contains

| Page | What it does |
|---|---|
| Home (`/`) | Hero, at-a-glance facts, academic pathway, how enquiry works, contact panel, FAQ |
| About (`/about`) | Approved facts about the school — nothing invented |
| Academics (`/academics`) | The Standard 1–12 GSEB pathway; Science & Commerce at Higher Secondary |
| Admissions (`/admissions`) | The Admission Enquiry Portal (see below) |
| Contact (`/contact`) | One-tap WhatsApp, call, directions, Instagram, and the full address |
| Privacy (`/privacy`) | Plain-language notice describing exactly what the site stores (nothing) |
| 404 | Friendly error page with Home / Call / WhatsApp / Directions |

## How the admission enquiry works (important)

The form **does not store or send anything to a server**. A parent:

1. Enters basic details (parent, student, standard, enquiry type).
2. Reviews everything on one screen.
3. Chooses **Continue on WhatsApp** — WhatsApp opens with a prepared message
   they review and send themselves — or **Call Admissions**.

This is a WhatsApp/phone *handoff*, not a website registration. No data is
kept in the browser, in analytics, or in any backend. If the school later
wants stored submissions, that needs a real server-side workflow plus written
school approval — see `CONTENT_REVIEW.md`.

## Editing content (no coding needed beyond one file)

Every name, phone number, link and address lives in **`src/data/school.ts`**.
Change a value there, rebuild, and every page updates. Do not edit phone
numbers or links inside components — they all read from that one file.

## Running the site

```bash
npm install     # once
npm run dev     # local preview at http://localhost:4321
npm test        # unit tests (form rules + WhatsApp link)
npm run build   # production build into dist/
npm run preview # preview the production build
```

From a phone: this repository can be opened in Claude Code on the web, which
can run these commands and show screenshots — the owner never needs a
terminal on their own device.

## Deployment (not yet done — needs authorization)

The build output (`dist/`) is plain static files and can be hosted for free
on Netlify, Cloudflare Pages, or GitHub Pages. **No deployment has been
performed.** Before going live:

1. Set the `SITE_URL` environment variable to the real domain (enables
   canonical URLs; then add a `Sitemap:` line to `public/robots.txt`).
2. Work through every item in `CONTENT_REVIEW.md` with the school.

## Technical summary

- **Astro 7** static site, TypeScript, React 19 islands only where
  interactivity is needed (menu, FAQ, admission form, 3D hero).
- **Motion for React** for interface transitions; **GSAP ScrollTrigger** for
  scroll reveals and the pathway line (loaded lazily, skipped under reduced
  motion). Ownership rule: Motion = UI state, GSAP = scroll timelines.
- **React Three Fiber** hero loads only on capable devices after idle; every
  other visitor gets the static SVG, which is a designed visual, not a
  downgrade. The three.js bundle is never part of the critical path.
- Self-hosted open-license fonts (Manrope, Source Serif 4 via Fontsource).
- No analytics, no trackers, no cookies, no paid services, no API keys.

See `docs/design-system.md` for the design tokens and rules, and
`docs/TEST_REPORT.md` for exactly which checks were run and their results.
