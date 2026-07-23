# Mahesh Pav Bhaji — Website

Production website for **Mahesh Pav Bhaji**, a vegetarian restaurant at Sunday
Hub, Katargam, Surat. Built as a fast, accessible, conversion-focused single
page that drives contact via WhatsApp and phone.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (design tokens in `tailwind.config.ts`)
- **Framer Motion** (`motion`) for the mobile menu and the WhatsApp attention cue
- **Lucide** icons (WhatsApp and Instagram glyphs are hand-drawn in
  `src/components/icons.tsx` since this Lucide version dropped brand icons)
- No database, CMS, backend, paid API or tracking. Deployable on any free
  static/SSR host.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Project structure

```
src/
  app/
    layout.tsx          # fonts, SEO metadata, <html> lang, js-class script
    page.tsx            # composes all sections
    globals.css         # tokens, grain texture, scroll-reveal + reduced-motion
    robots.ts / sitemap.ts / icon.tsx
  components/            # one file per section + shared UI
  data/
    business.ts         # ← SINGLE SOURCE OF TRUTH for all business facts
  lib/                  # cn() helper, getSiteUrl()
```

## Editing content

**All business facts live in [`src/data/business.ts`](src/data/business.ts).**
Change them there and the whole site updates — never edit facts inside
components. Fields marked *dynamic* also carry a `lastVerified` date.

### Update the Google rating / review counts

In `src/data/business.ts`:

```ts
rating: 4.6,
reviewCount: 1953,
fiveStarReviews: 1662,
lastVerified: "2026-07-23",
lastVerifiedDisplay: "23 July 2026",
```

Update the numbers **and** bump both `lastVerified*` values. These feed the
hero, trust strip, reputation section and the structured data.

### Update opening hours

```ts
hours: {
  days: "Monday–Sunday",
  display: "10:00 AM–12:00 Midnight",
  opens: "10:00",   // 24h, used by structured data
  closes: "00:00",
},
```

Keep `display` (what visitors read) and `opens`/`closes` (machine-readable for
SEO) in sync.

### Update the menu categories

Edit the `menuCategories` array (name + count). The category explorer and the
"~160 variations" figure derive from it:

```ts
export const menuCategories = [
  { name: "Pav Bhaji", count: 21 },
  // …
];
```

When a full verified item list arrives, add an `items: string[]` to any
category — the type already supports it and the section can render items without
a redesign. Edit the curated `menuHighlights` blurbs in the same file (use only
verified dishes — no invented items or prices).

### Change the WhatsApp message

WhatsApp links are built from `whatsappNumber` and the `whatsapp` URLs in
`business.ts`. Edit the `text=` portion of each link to change the prefilled
message. The contact form composes its own message in
`src/components/contact-section.tsx`.

### Replace / add photographs

See [`CLIENT_CONTENT_NEEDED.md`](CLIENT_CONTENT_NEEDED.md). Drop approved
Katargam-only images in `public/images/`, then wire them through `next/image`
and re-enable the Gallery. The site intentionally ships photo-light until then.

## Deployment notes

- Set `NEXT_PUBLIC_SITE_URL` to the real production URL once known. It feeds
  `robots.txt` and `sitemap.xml`. No production domain is hard-coded.
- A canonical URL and Open Graph image can be added to `src/app/layout.tsx`
  after the domain and any brand image are confirmed.

## Accessibility & performance

- Semantic landmarks, one `<h1>`, skip link, keyboard-accessible mobile menu
  (Escape to close, focus restored), visible focus rings, WCAG-minded contrast.
- Scroll reveals are CSS-driven and **degrade to fully-visible content** with no
  JS; `prefers-reduced-motion` disables motion. All content is readable without
  JavaScript, and every WhatsApp/phone/maps/Instagram link is a real anchor.

## ⚠️ Pre-launch

Test the WhatsApp link from a real phone. It only works if **+91 79906 32870**
is registered on WhatsApp. Do not advertise WhatsApp ordering until verified.
