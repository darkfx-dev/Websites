# Modi Bakers

## Register
brand

## Platform
web

## What this is
Single-page marketing site for Modi Bakers, a small premium bakery. No confirmed street address is published — the location is a Google Maps link only. 4.3★ across 373 Google reviews (owner-confirmed aggregate). The site's job: make a visitor trust the shop enough to call or WhatsApp an order, and make the owner proud enough to show it on their own phone.

## Target users
- Local customers browsing on mid-range Android phones, often on 4G. Mobile-first is not a slogan here; it is the primary device.
- The owner, demoing the site to customers in person.

## Brand personality
Warm, personal, handcrafted, quietly premium. A patisserie at golden hour: espresso dark, cream, caramel glow. Never corporate, never loud, never neon-tech. Reviews consistently praise *design* (cake decoration), *taste*, *speed*, and *kind behaviour* — the site's voice is grounded in those four things.

## Anti-references
- Generic template bakery sites (Wix gradients, stock-photo carousels, script fonts).
- Gym/tech "neon" energy — the requested glow is warm caramel light, not neon pink.
- Corporate bakery clichés ("indulge your senses", "symphony of flavors").

## Design system: "Cacao Noir"
- noir `#1A120B` · cream `#FDF8F0` · cocoa `#6B4226` · caramel `#B87333` · honey `#E8A860` · ink `#2B211B`
- Script accent (Caveat) reserved for three small signature moments.
- Display: Fraunces (variable, optical sizing). Body: Figtree.
- Motion: GSAP + ScrollTrigger for scroll-scrubbed sequences, Framer Motion for discrete component transitions, Lenis for smooth scroll. Strong ease-out curves, UI durations ≤ 300ms.

## Non-negotiable constraints
- Tiered animation system: `full` / `lite` / `static`, chosen from `prefers-reduced-motion`, `hardwareConcurrency`, and connection hints. A calmer site is always the correct degradation; a janky one never is.
- Animate only transform/opacity (pre-baked glow layers, never animated box-shadow).
- LCP < 2.5s on throttled mobile; GSAP/Lenis dynamically imported; fonts via next/font.
- All GSAP ScrollTriggers scoped and reverted on unmount.
- Menu pricing lives in `data/menu.ts` as one clearly-commented editable array (illustrative prices until the owner supplies real ones).

## Conversion & proof
- Primary actions: click-to-call (+91 94263 92062) and WhatsApp order (919426392062).
- Proof: 4.3★ / 373 reviews (owner-confirmed aggregate). No individual quotes supplied — the reviews section links to Google rather than showing invented quotes.
- Hours: 10:00–23:00, all 7 days. Location + directions via Google Maps link only (no confirmed street address).
