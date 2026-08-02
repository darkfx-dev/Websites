# Surat Khaman House — Adajan Patiya

Production website for one outlet: **Shop No. 1/3, Kalpana Society–2, Adajan
Road, opposite Sevadarshan Hospital, Adajan, Surat, Gujarat 395009**.

It exists to do five things well: show what the outlet serves, let someone
start a WhatsApp inquiry, put the right phone number one tap away, open the
exact shop in Google Maps, and make it obvious this is the Adajan Patiya outlet
and not another business trading under the same name.

Static Next.js App Router site. No database, no backend, no accounts, no
tracking, no cookies.

## Getting started

```bash
npm install
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (all routes prerender to static) |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit + component tests |
| `npm run audit:site` | Full QA sweep against a production build (see below) |

`npm run audit:site` needs a build first. It serves the site, then checks every
required viewport for horizontal overflow, axe violations and undersized touch
targets; measures real text contrast from rendered pixels; exercises the mobile
sheet, the FAQ and the menu filter; verifies the reduced-motion, forced-colors,
200%/400% zoom and no-JavaScript states; and greps both the served HTML and the
client bundle for facts that must never appear. Screenshots and a report land
in `.audit/`.

## Where the facts live

`data/outlet.ts` is the single source of truth — name, address, phone, WhatsApp
message, coordinates, Google Place ID, rating, hours fallback, feature flags.
No component contains a second literal phone number, address, rating or map
link. `data/menu.ts` holds the board; `data/faq.ts` the questions.

Anything unverified is behind a conservative flag and is currently **off**:

```ts
BUSINESS_HOURS_VERIFIED: false      // listings disagree
MENU_PRICES_VERIFIED: false         // board snapshot is not owner-confirmed
APPROVED_PHOTOS_AVAILABLE: false    // no rights-cleared photography
TESTIMONIAL_PERMISSION_AVAILABLE: false
ENABLE_MAP_EMBED: false
ENABLE_ANALYTICS: false
```

**Prices are not in the application at all.** The reference snapshot lives in
`docs/price-reference.md`, which nothing imports, so no figure can reach the
HTML, the structured data, the accessible text or the JavaScript bundle. The
audit asserts this on every run.

Read [`docs/launch-blockers.md`](docs/launch-blockers.md) before deploying —
the production domain, confirmed hours, confirmed prices and approved
photography are all still outstanding.

## Design

One direction, "Surti Editorial Warmth": warm ivory paper, editorial serif
display (Fraunces), Manrope for UI, Noto Sans Gujarati for the Gujarati name,
chilli red for high-intent actions, gold as an appetite accent, and a faint
static grain and lattice. No photography — none is licensed — so the art
direction is typographic rather than showing placeholders or unrelated stock
food.

Colour tokens and their measured contrast ratios are documented at the top of
`app/globals.css`. Copper was darkened from the brief's `#B66A3C` to `#A25A2E`
because the original is only 3.9:1 on canvas and could not carry the small
eyebrow labels.

## Motion

Ten patterns, no more. Framer Motion owns scroll reveals, the sticky mobile
bar, menu card presence, the FAQ panel and the rating star fill. CSS owns the
hero entrance, the hero underline, the navbar entrance and the menu card hover
lift — those four sit above the fold or on the LCP path, where content must be
painted and operable before any JavaScript runs. No element is written by both
systems.

Everything collapses to a static state under `prefers-reduced-motion`, and
`<noscript>` plus a print rule restore any content that reveals on scroll.

## Accessibility

Targets WCAG 2.2 AA. The audit reports zero axe violations at 320, 360, 390,
430, 768, 1024, 1280 and 1440 CSS pixels, plus the open mobile sheet, expanded
FAQ, filtered menu, reduced-motion, forced-colors and zoom states.

Because the gradient washes and grain overlay stop axe from resolving effective
backgrounds — it returns ~160 inconclusive contrast nodes rather than a verdict
— the audit measures contrast from the rendered pixels instead, sampling the
background behind each text run with every glyph made transparent.
