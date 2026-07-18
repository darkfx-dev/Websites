# The Quality Baker — website

Premium single-page site for The Quality Baker (Bhestan, Surat) — "Cacao Noir" design system with a WhatsApp-based ordering flow (expand a product, customise, send; multiple items batch into one message via the floating pill).
Next.js App Router · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP ScrollTrigger · Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Edit the menu & prices (the 5-minute job)

Everything on the menu — categories, items, notes, eggless tags, and **prices** —
lives in one file: [`data/menu.ts`](data/menu.ts) — products with sizes, flavours, and eggless tags. Edit the array, save, done.
All prices in there are illustrative placeholders until the shop confirms real ones.

Business facts (phone, address, hours, rating) live in [`lib/site.ts`](lib/site.ts).
Review quotes live in [`data/reviews.ts`](data/reviews.ts) — verbatim from Google; don't invent new ones.

## Gallery placeholders

The network policy of the build environment blocks stock-photo CDNs, so the
gallery ships as hand-drawn caramel line illustrations (`components/PastryArt.tsx`)
honestly labelled as placeholders. When the owner's photos arrive, swap each
tile in `components/sections/Gallery.tsx` for a `next/image` of the real cake
(local files in `public/`, explicit width/height).

## The animation tier system

`lib/motion.tsx` detects device capability once on the client and exposes a tier:

| Tier     | Trigger                                 | What runs                                                                                   |
| -------- | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| `full`   | capable device, fast connection         | Lenis smooth scroll, GSAP pinned Craft sequence, horizontal review drift, staggered reveals |
| `lite`   | ≤4 cores, ≤4GB RAM, 2g/3g, or Save-Data | opacity-only fades; native scrolling untouched                                              |
| `static` | `prefers-reduced-motion: reduce`        | no scroll-driven movement; hero collapses to a gentle CSS fade                              |

GSAP and Lenis are dynamically imported only on the `full` tier, so they never
touch the initial bundle. The server always renders fully visible content —
tiers only ever *add* motion. The hero entrance is pure CSS (`globals.css`),
so it runs before hydration and off the main thread.

Glow effects are pre-baked blurred layers animated by opacity only — never
animated `box-shadow` values.
