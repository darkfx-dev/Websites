# F Z Gym & Fitness — Website

A premium, dark-themed, animated marketing website for **F Z Gym & Fitness**, a
gym and fitness centre in Rustampura, Surat. Built with Next.js, TypeScript,
Tailwind CSS, React Three Fiber, and Framer Motion.

## ✨ Features

- Interactive 3D hero (rotating metallic dumbbell) with neon rim lighting,
  floating particles, mouse parallax, and scroll-linked movement
- Lightweight **non-WebGL fallback** + full **reduced-motion** support
- Sticky transparent navigation with mobile menu
- Membership pricing cards with per-plan WhatsApp inquiries
- Genuine 4.9★ / 505-review social proof linking to Google Maps
- Facilities, gallery (replaceable placeholders), and contact sections
- Floating neon Google Maps / Instagram / WhatsApp buttons (safe-area aware)
- SEO metadata, generated Open Graph image, `robots`/`sitemap`, and
  LocalBusiness JSON-LD (confirmed facts only)
- Accessible: semantic HTML, keyboard navigation, focus rings, strong contrast
- Custom neon "FZ" favicon

## 🧩 Editing content

**Everything editable lives in one file:** [`src/config/siteConfig.ts`](./src/config/siteConfig.ts)

- **Prices** — the `plans` array holds membership prices. The values shipped are
  **indicative sample placeholders**. Replace each `price` with the confirmed
  rate, or set `price: null` to show "Contact for latest price" instead.
- **Opening hours** — the `hours` array is a placeholder; replace with real
  hours or set `showHours: false` to hide the block. (Unconfirmed hours are
  intentionally excluded from SEO structured data.)
- **Facilities**, **gallery**, **navigation**, **contact details**, and
  **links** are all editable in the same file.
- Set `seo.siteUrl` to your deployed domain before launch.

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

## 🛠️ Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run start      # run the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript (tsc --noEmit)
npm run format     # Prettier
```

## ☁️ Deploy

Optimised for [Vercel](https://vercel.com):

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

Any Node host works too: run `npm run build` then `npm run start`.

## 📌 Authentic assets still needed

- Confirmed membership prices, personal-training and day-pass rates
- Confirmed opening hours
- Real logo file (if any) and authentic photos of the gym for the gallery

Until provided, the site uses clearly-labelled placeholders and never presents
unconfirmed figures as verified facts.
