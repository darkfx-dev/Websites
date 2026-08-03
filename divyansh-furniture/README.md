# Divyansh Furniture

A premium single-page site for a made-to-order furniture workshop: 12 sections,
a scroll-driven 3D depth background, and WhatsApp booking throughout.

Self-contained — it shares no dependencies, config or build output with the
other apps in this repository.

```bash
cd divyansh-furniture
npm install
npm run dev            # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run check:content` | Lists every `[placeholder]` still unfilled |

---

## Start here: `src/data/site.ts`

**Everything you edit is in that one file.** No component hard-codes a phone
number, a price, a room name or a line of copy.

Run `npm run check:content` to see what is outstanding. It exits non-zero
while anything remains, so it can gate a deploy.

### Turning booking on — the one thing to do first

```ts
// src/data/site.ts
whatsappNumber: "919876543210",   // country code + number, digits only, no +
```

Every "Book" button on the site — navbar, hero, services, each package,
the visit section, the booking composer, the footer — routes through
`src/lib/whatsapp.ts` and comes alive the moment that line is real.

**Until then those buttons are deliberately disabled and say so.** They do not
render as links. Shipping a button that opens
`wa.me/[WhatsApp number...]` would hand every visitor a broken tab and give
you no signal that it was happening.

### How placeholders behave

Anything still in `[square brackets]` is treated as unfilled:

- placeholder **text** renders with a dashed brass outline and a screen-reader
  note saying it is a placeholder — including when it is one token inside a
  real sentence, like a lead time in an FAQ answer;
- placeholder **links** are not rendered as links. The Maps button, the phone
  number and the social links only become links when they hold real values;
- **empty arrays remove their section.** Empty `testimonials` and that whole
  section disappears rather than rendering blank.

This matters more here than on most sites: the page states a real 4.9 rating,
and an unmarked placeholder sitting beside a real number borrows credibility
it has not earned.

### The rating

`4.9` and `1,800+` are the two figures you supplied, and they are the only
numbers claimed anywhere on the site. Nothing else was invented — no years in
business, no project count, no delivery time. `reviewSource` is blank on
purpose: fill in `"on Google"` (or wherever) and it appears next to the
rating; leave it and the platform is simply not named.

### Testimonials

The three quotations are placeholders and are shown as placeholders, with a
line above them saying so. **Paste real reviews in, or empty the array.**
Writing plausible reviews and attributing them to invented customers is
fabricating evidence, and it would sit directly under a real rating.

### Photographs

Each gallery tile shows a photograph when `src` holds one, and a line drawing
when it does not. To use your own:

```ts
{ art: "sofa", caption: "Three-seater in teak", src: "/gallery/sofa.jpg" },
```

Drop the file in `public/gallery/`. Remote URLs work too —
`images.unsplash.com` is already allowed in both `next.config.mjs` and the
Content Security Policy, so an Unsplash URL can be pasted straight in.

**Why drawings and not stock photos:** this environment's network policy
blocks `images.unsplash.com` (verified — the request is refused), so no stock
image could be fetched or checked. More importantly, a stock photo of somebody
else's sofa presented as this workshop's work is the one genuinely dishonest
thing a furniture gallery can do. The tiles use catalogue-style line drawings
instead, which is an ordinary idiom in furniture and reads as intentional. The
aspect ratio is fixed, so swapping in a photograph cannot shift the layout.

---

## Design

The palette comes from the materials rather than from the luxury template:

| Token | Value | What it is |
| --- | --- | --- |
| `--walnut` | `#171210` | Stained walnut end-grain. Warm, with visible brown — not neutral near-black. |
| `--brass` | `#C8A265` | **The signature.** Unlacquered brass that has dulled with handling: greyer and warmer than gold. |
| `--patina` | `#7FA893` | What brass turns into. State and focus rings only, never a button. |
| `--silk` | `#F2EAE0` | Raw silk. 15.1:1 on the ground. |

Type is **Instrument Serif** for headings and **Hanken Grotesk** for
everything else — deliberately not Playfair + Inter, which is where every
luxury template lands.

The signature detail is the **brass corner bracket**: two short strokes
meeting at a right angle, taken from cabinet hardware. It marks the rating
card, the featured package, the gallery frames and the booking panel, and it
is the only ornament on the page.

I ran the `ui-ux-pro-max` design-system generator as requested. It returned
Playfair Display, near-black and `#A16207` gold — exactly that default — so I
kept its **discipline** (contrast floors, 150–300ms micro-interactions, 44px
targets, its pre-delivery checklist) and overrode its **palette and
typefaces**. Its checklist is fully satisfied; its aesthetic picks are not,
and that was a deliberate call.

## Motion

- **Lenis** for smooth scrolling and **GSAP ScrollTrigger** for the depth
  background, both dynamically imported so a visitor who never gets them never
  downloads them.
- The background is a real 3D stage — `perspective` on the wrapper,
  `preserve-3d` on the scene — with three light planes separating in Z as you
  scroll, rather than flat layers sliding past each other.
- **Framer Motion** owns interaction state: the mobile menu and the button
  scale response. **CSS** owns colour, border and shadow. No property is
  animated from two places.
- Section entrances are CSS, gated on `html.js` — with JavaScript off the
  content is simply visible. Nothing can be trapped invisible by an animation
  that did not run.
- Lenis replaces the browser's anchor behaviour *including moving focus* to
  the destination, so keyboard users are not scrolled somewhere their focus
  did not follow.
- Under `prefers-reduced-motion` none of it loads.

## Booking, and why there is no form

The booking section is a room picker plus an optional note, both composed into
the opening WhatsApp message. It posts nowhere and stores nothing.

A form would need a server route or a third-party endpoint, and either needs
validation, rate limiting and spam handling to be responsible — a lot of
machinery for enquiries that already arrive on WhatsApp, and it would route a
stranger's message through a service they were never told about.

## Verification

Measured against the production build in Chromium. **31 of 31 checks pass:**

- No horizontal overflow and no console errors at 375, 768, 1024, 1440
- One `h1`, no skipped heading levels, correct landmarks, 10 sections
- Every placeholder on the page visibly marked; no `wa.me` link built from the
  placeholder number; no dead or empty hrefs; every in-page anchor resolves;
  `rel="noopener"` on every new-tab link
- All interactive controls ≥24×24; every visible text run meets WCAG AA
  contrast
- Skip link first in tab order; 28 controls reachable by Tab, each with a
  visible ring; FAQ opens from the keyboard
- Booking composer: one room selected at a time, note field works, disabled
  state explained
- Reduced motion: nothing faded out, Lenis not started, no errors
- JavaScript disabled: all section content present, nothing hidden

Two real bugs were found and fixed in that pass: `[Placeholder]` tokens inside
longer sentences were rendering unmarked, and `--silk-faint` measured 4.49:1
on the raised card surface (it was checked against the page ground, which is
darker).

## Not verified

- No real device testing — Chromium emulation only, no physical iOS or Android
  handset, so the WhatsApp app hand-off is untested against a real install.
- No Safari or Firefox. `backdrop-filter` has a documented fallback; the rest
  uses nothing exotic.
- No screen-reader pass. Landmarks, headings, focus order and `aria-*` wiring
  were checked programmatically; nobody listened to it.
- Lighthouse was not run.
