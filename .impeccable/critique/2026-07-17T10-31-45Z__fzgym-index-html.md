---
target: fzgym/index.html
total_score: 29
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T10-31-45Z
slug: fzgym-index-html
---
# Design Critique — F Z Gym & Fitness (fzgym/index.html)

Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Plan selection silently rewrites the WhatsApp FAB message |
| 2 | Match System / Real World | 4 | WhatsApp-first, ₹ pricing — fits how a Surat gym converts |
| 3 | User Control and Freedom | 2 | No plan deselect; no mobile nav on a 7-section page |
| 4 | Consistency and Standards | 3 | Swapped Annual CTA stops naming its destination; CTA verbs drift |
| 5 | Error Prevention | 3 | <a> nested inside role="button" tier invites mistaps |
| 6 | Recognition Rather Than Recall | 4 | Everything visible; prefilled WA messages |
| 7 | Flexibility and Efficiency | 2 | Under 640px nav links display:none with no replacement |
| 8 | Aesthetic and Minimalist Design | 3 | Selected-Annual state shows two "winner" cards side by side |
| 9 | Error Recovery | 2 | CDN failure blanks nearly all text (verified); image fallbacks exemplary |
| 10 | Help and Documentation | 3 | Sunday hours deflect to "message us" |
| Total | | 29/40 | Good |

## Anti-Patterns Verdict
LLM: passes — art-directed, not generated; reservations: three consecutive identical 3-col card grids in back half; placeholder trainer initial-boxes. Detector: 3 findings — 2 bounce-easing (intentional back.out per spec, accepted), 1 dark-glow on nav underline hover (borderline, consistent with neon language). Runtime overlay: zero anti-patterns.

## Priority Issues
- [P1] Script failure blanks the page: .h-in/.rise/hero rows CSS-hidden, only GSAP un-hides. Fix: gate hidden states behind .js class or set from JS.
- [P1] Mobile FAB stack occludes pricing CTAs at 390px (Instagram FAB on enquire buttons). Fix: dock/hide Map+Insta while #plans in view on small screens.
- [P2] Selection end-state: two winners (Quarterly volt badge fully lit next to selected Annual), 0.8 dim imperceptible, swapped CTA drops "WhatsApp". Fix: deepen dim (~0.55), keep destination in label.
- [P2] No navigation under 640px. Fix: minimal hamburger with the four anchors.
- [P3] Tier aria-label hides price from SR; testimonial stars unlabeled.

## Persona Red Flags
Jordan: "Join Now" gives no WhatsApp hint; selection fireworks with no explanation. Riley: clicking selected card is dead; no-network skeleton. Casey: Instagram FAB on top of the button being pressed; no menu; mobile plan order shows ₹3,400 first.

## Minor Observations
4.9/500+ repeated six times; footer 220px clearance only needed on mobile; sheen can read as smear mid-celebration at 1440px; bounce easing intentional per spec.

## Questions
1. Duotone/grain plan B for honest phone photos in the hero?
2. Should the prefilled WA message be previewed visibly before tapping?
3. Should clicking the selected card deselect? (User answered: yes, toggle off.)
