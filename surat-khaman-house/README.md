# Surat Khaman House

Informational website for a single Surat Khaman House outlet — a vegetarian
Surti breakfast and farsan counter. It exists to let people browse the
complete menu, see reference prices, and contact the outlet. It is **not** an
ordering application: there is no cart, checkout, payment, account,
reservation or delivery flow anywhere in it.

Built with Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind
CSS and Framer Motion.

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint
npm run check:content  # factual + address-placement checks (needs a build first)
```

## The two rules that shape this codebase

### 1. Location appears only at the end

No address, area name, landmark, map link or directions wording may appear in
**visible** page content before the final Location & Contact section. The site
introduces the business, its menu, its prices and its contact actions first,
and reveals where it is only at the bottom.

This is why:

- `data/business.ts` keeps `location` walled off, consumed only by
  `location-contact.tsx` and the JSON-LD.
- The header has no location nav item, the hero has no directions CTA, and the
  mobile sticky bar carries Call and WhatsApp only.
- The footer does **not** repeat the address.

Location data is still present in the non-visible JSON-LD and in the page
metadata, which is permitted and needed for local SEO.

`npm run check:content` enforces this: it walks the rendered DOM in document
order, stops at the location section, and asserts that none of the banned
terms appear in visible text before it. Text inside `<script>` (JSON-LD, the
RSC payload) and anything in `<head>` is correctly exempt.

### 2. Nothing is invented

Every fact comes from a supplied source of truth. Where something is not
verified, the site says so rather than guessing:

- **Prices** are transcribed from a menu-board photograph that is *not*
  confirmed current. Every item carries `priceVerified: false`, and the
  reference-price disclaimer is shown with the prices themselves. They are
  never called today's, current, latest or guaranteed prices.
- **Hours** — public listings disagree, so the site publishes
  "Open daily—call to confirm today's hours." and nothing more. There is no
  "open now" state and no `openingHoursSpecification` in structured data.
- **Rating** — the observed 4.4 is shown as text with its last-checked date
  and no review count. Because valid `aggregateRating` markup requires a
  review count, the JSON-LD deliberately omits `aggregateRating` entirely.
  Showing the rating while omitting the markup is intentional, not an
  oversight.
- **Reviews** are presented as aggregated themes, never as quotations, and the
  critical themes are shown alongside the positive ones.
- **Photography** — no rights-cleared photograph has been verified, so the
  site ships zero `<img>` elements. All artwork is inline SVG.
- There is no owner name, founding year, award, FSSAI number, email, social
  profile, payment method, seating, parking, accessibility or Jain claim,
  because none has been verified.

`data/business.ts` exposes `featureFlags` recording exactly which of these are
unverified. Flipping one on should require new evidence, not just an edit.

## Layout

```
src/
  app/          layout, page, not-found, sitemap, robots, globals.css
  components/   one file per section, plus motion/ and ui/
  data/         business.ts, menu.ts, faq.ts — the factual spine
  lib/          links.ts, motion.ts, structured-data.ts, utils.ts
scripts/
  check-content.mjs
```

`lib/links.ts` is the single source for the phone, WhatsApp and Maps URLs.
Everything that can be clicked imports from it, which is what makes
"the number is consistent everywhere" a testable claim.

### One encoding detail worth knowing

`encodeURIComponent` does not escape `'`, so the approved WhatsApp message
would otherwise go out as `today's` instead of `today%27s`. WhatsApp accepts
both, but the approved URL is specified exactly, so `encodeWhatsAppText` adds
the `%27` pass and the content check asserts the result matches that URL
character-for-character.

## Motion

Framer Motion via `LazyMotion` + `domAnimation` in `strict` mode, so every
animated element must use `m.*` and stays inside the lazily-loaded feature
set. Durations, easings and springs all come from `motionTokens` in
`lib/motion.ts`.

Seven patterns total: hero entrance, hero 3D accent, section reveal, menu
transition, menu-row hover, nav indicator and CTA feedback. The hero accent
tilts at most 3° with 5px of travel, runs only on a fine-pointer desktop
screen, and freezes when scrolled offscreen.

Under `prefers-reduced-motion` every wrapper renders a plain element with no
variants — movement is removed, functionality is not. Content is server
rendered in all cases, so nothing depends on hydration to be readable.

GSAP, Lenis, Three.js and React Three Fiber are deliberately **not**
installed: nothing here needs them.

## Testing

`npm run check:content` boots a production server and runs 106 assertions
covering the menu (29 items, every price independently transcribed from the
source brief so a typo on either side shows up), contact links, disclaimers,
the address-placement audit, structured-data omissions, the sticky bar,
menu filtering and empty state, mobile-menu keyboard behaviour, and console
errors.

## Not yet supplied

The **production domain**. `siteUrl` in `data/business.ts` is a placeholder,
and canonical, sitemap, robots, Open Graph and `metadataBase` all read from
it. The JSON-LD omits `url` until a real domain exists. Replacing that one
constant is the whole change.
