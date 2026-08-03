# Orbital Audio — design plan

Written before any implementation code, per the brief's workflow. Every colour
and type decision in the build derives from this document.

**Subject.** A spatial-audio plugin for music producers and sound designers.
The audience already owns monitors, an interface and a DAW; they are evaluating
whether this belongs in their chain. The page's single job is to make a
*positional* idea legible — sound existing somewhere, not just louder.

**Placeholder notice.** Orbital Audio is fictional. Prices, any figure, and any
attribution are marked `[PLACEHOLDER]` in the build rather than invented.

---

## Color

Six values. Named for the thing in the studio they come from.

| Token | Hex | Role |
| --- | --- | --- |
| `--room` | `#0A0E17` | Ground. A dimmed control room, not black — there is visible blue in it. |
| `--rack` | `#121926` | Raised surfaces: pricing cards, header when solid. |
| `--lamp` | `#FFA53D` | **Signature accent.** The amber of a VU-meter lamp and an ON AIR sign. Every glow on the page is this hue. |
| `--trace` | `#6FE3C4` | Oscilloscope phosphor. Used *only* for signal and state — active meter segments, the ring at its brightest. Never for a button. |
| `--print` | `#F3EFE7` | Body and headings. Warm off-white, the colour of a printed manual, deliberately not `#FFFFFF`. |
| `--print-dim` | `#A9B2C4` | Secondary text. Cool grey biased toward the room, so it recedes into the ground rather than sitting on it. |

**Why not violet/cyan.** The brief explicitly allows the default only if
justified against it, and the 21st.dev catalog confirms how thoroughly that
combination is spoken for — nearly every 3D-hero component returned is a violet
or cyan particle cloud. Amber is the colour this specific subject's own
instruments actually glow: VU lamps, tape-deck level meters, studio signage. It
is also the harder choice, because warm neon needs care not to read as a
warning, which is why `--lamp` is the *only* warm value on the page and
everything around it stays cool and quiet.

**Two accents, not one pop.** They have different jobs and never substitute for
each other: `--lamp` means *you can act on this*; `--trace` means *the system is
doing something*. A reader can learn that rule in one scroll.

---

## Type

Three faces, self-hosted via `@fontsource-variable` (no third-party request, no
layout shift).

- **Display — Bricolage Grotesque Variable.** Engineered, slightly compressed
  letterforms with an optical-size axis. It reads like lettering silk-screened
  onto equipment rather than a UI face. Used at weight 500–600, tight tracking,
  and only for headings.
- **Body — Instrument Sans Variable.** Clean and quiet with just enough
  idiosyncrasy in the `a` and `g` to not be neutral. Deliberately not Inter,
  which is the safe answer and would flatten the display face's character.
- **Utility — Martian Mono Variable.** Wide, technical, unmistakably a readout.
  Carries meter labels, channel numbers and the step sequence — the places where
  type should look measured rather than written.

Scale: `clamp()` throughout, one ratio (≈1.33), body at 16–18px, hero display
capped so the headline never exceeds three lines at 1440px.

---

## Layout

Asymmetric, on a 12-column grid with a generous gutter. The Core is placed
**right of centre** rather than behind the text — which is both the composition
and the answer to the brief's text-safe-zone requirement: the hero copy owns a
left column that the particle field never crosses.

| Section | Layout in one sentence |
| --- | --- |
| Header | Fixed rail, wordmark left, links centre, one lamp-glow CTA right; transparent until the hero's bottom edge passes, then a solid `--rack` bar with a hairline. |
| Hero | Left column of copy against the Core sitting in the right two-fifths, with the two CTAs on a single baseline. |
| Product | Four features in a 2×2 on desktop, each a plain block with a mono label and no card chrome, so the section reads as spec sheet rather than marketing. |
| How it works | Three steps in a horizontal sequence, numbered as channels (`CH 01`), aligned to the moment the 3D field organises into a ring. |
| Pricing | Three tiers, middle one raised on `--rack` with a lamp hairline; prices are `[PLACEHOLDER PRICE]` set in the mono face so the placeholder reads as a field, not a claim. |
| Final CTA | Single centred line and one button, the only centred composition on the page, directly in front of the brightened Core. |
| Footer | Three quiet link columns and a copyright line. No social proof. |

---

## Signature

**The Orbital Core** — a translucent icosahedron representing the listener's
position, with a sparse field of point sources around it. Scroll moves the
camera through four states while the field goes from orbit, to a wide stereo
plane, to a decode ring, to a final resting composition.

**The one risk: a live meter rail.** A thin fixed strip on the right edge of
desktop viewports, built as a studio channel meter — segmented, lighting up
from the bottom as scroll progresses, its peak segment in `--trace`, labelled
with the current section in Martian Mono against a small scale. It is a scroll
indicator that is *of this subject* rather than a generic progress bar. It is
decorative and `aria-hidden`; the header nav carries the real navigation, so
nothing is duplicated and nothing is lost without it.

Everything else stays disciplined: no gradient text, no glass cards, no orbs in
the corners. The Core and the meter are the two things worth remembering, and
the page spends its boldness there.
