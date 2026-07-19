# Test Report

Actual commands run in the development environment (Linux container,
Node 22.22.2) on 2026-07-19, with real results. Nothing in this report is
estimated or assumed.

## Unit tests — `npm test` (Vitest 4.1.10)

**Result: 15/15 passed** (`tests/enquiry.test.ts`)

Covers:
- Stream not required for Standards 1–10; required (Science/Commerce) for 11–12
- Consent required; Indian mobile formats accepted (`98765 43210`,
  `+91 98765 43210`, `09876543210`, …); invalid mobiles rejected
- Message limit (400 chars) enforced
- WhatsApp message structure matches the specified template, including the
  "does not confirm admission" line, stream line only for 11–12, and
  "Not provided" fallbacks
- Final URL targets `wa.me/917435975575` with no `+`, spaces or formatting;
  text param round-trips exactly; URL stays under 2000 chars at max message

## Type check — `npx tsc --noEmit` (TypeScript 7.0.2)

**Result: clean** (after removing the TS7-deprecated `baseUrl` option).
Note: `.astro` files are outside `tsc`'s scope; they are compiled by the
Astro build below.

## Production build — `npm run build` (Astro 7.1.1)

**Result: success.** 7 routes generated: `/`, `/about`, `/academics`,
`/admissions`, `/contact`, `/privacy`, `/404`.

Bundle verification (gzip): three.js hero chunk 232 KB is **not referenced or
preloaded by any HTML** — it loads only after the runtime capability gate.
Critical path on Home is one small inline-module script; islands hydrate
per-directive (menu: media query, FAQ: visible, form: load on /admissions
only, 3D gate: idle).

## Browser checks — Playwright (system Chromium, headless)

**Result: all passed.** Script exercised the built site via `astro preview`:

- All 6 routes return 200; unknown route returns 404
- No horizontal overflow at 360 px on any route
- No console errors or page errors on any tested page
- Admissions flow end-to-end: Standard 12 requires and records a stream
  (review screen shows "Commerce"); Standard 5 shows **no** stream selector
- Reduced-motion emulation: 3D canvas does not mount; static SVG hero visible
- Screenshots reviewed at 360×800 and 1440×900 (home, academics, admissions
  review step)

## Link audit (built HTML, grep)

- WhatsApp: only `https://wa.me/917435975575` ✓
- Phone: only `tel:+917435975575` ✓
- Directions: exact supplied Google Maps universal URL ✓
- Instagram: exact supplied URL including `igsh` parameter ✓
- No lorem ipsum, example.com, dummy statistics or placeholder copy in any
  built page ✓ (a dummy phone number found in a form placeholder attribute
  during audit was removed)

## Known limitations (honest)

- **Lighthouse / Core Web Vitals were not measured** — no Lighthouse binary
  in this environment. Architecture targets the budgets (static HTML, ~0 KB
  critical JS beyond one small script, self-hosted subset fonts, no images),
  but scores must be measured after deployment. No numbers are claimed.
- **Playwright e2e is a QA script, not a committed test suite** — the
  browser checks above were run from a script during this build; converting
  them into a permanent `@playwright/test` suite is a reasonable follow-up.
- **Real devices not tested** — checks used headless Chromium viewports, not
  physical Android hardware; keyboard/software-keyboard interaction was not
  exercised on a real device.
- **WhatsApp number not verified** as WhatsApp-enabled (listed in
  CONTENT_REVIEW.md).
- **Screen reader testing** was structural (roles, labels, focus order via
  code review) — not run through NVDA/TalkBack.
