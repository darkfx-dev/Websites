# DarkFX — Studio Landing Page

A premium 3D animated landing page for the DarkFX web studio. Built with
React, TypeScript, Vite, Framer Motion, and Three.js (React Three Fiber).
Free to build, free to host — no paid services anywhere.

## ✏️ Editing content (no coding needed)

**Every word on the site lives in one file:** `src/content/site.ts`

Open it, change the text between quotes, save. That's it. Things you can
change there:

- Your **email address** (all contact buttons use it) — top of the file
- Brand name, headline, all section text, FAQ questions and answers
- Navigation labels and links

**Colors, fonts, and spacing** live in `src/styles/tokens.css` — each value
is labeled with a comment.

### Editing from a phone

1. Open this repository on **github.com** in your phone browser
2. Navigate to `src/content/site.ts`
3. Tap the **pencil icon** (Edit)
4. Change the text, then tap **Commit changes**
5. The site rebuilds and redeploys automatically (see Deployment below)

## 🚀 Free deployment

### Option A — GitHub Pages (already set up)

This repo includes `.github/workflows/deploy.yml`. To activate it once:

1. On github.com open the repo → **Settings** → **Pages**
2. Under "Build and deployment", set **Source** to **GitHub Actions**
3. Merge/push to the `main` branch — the site deploys itself to
   `https://<your-username>.github.io/<repo-name>/`

Every future edit to `main` redeploys automatically.

### Option B — Netlify or Vercel (also free)

1. Sign up free at netlify.com or vercel.com with your GitHub account
2. "Import project" → pick this repository
3. Accept the detected defaults (build command `npm run build`, output `dist`)

Both options work entirely from a phone browser.

## 🧑‍💻 Local development

```bash
npm install
npm run dev       # local dev server
npm run build     # production build (type-checks first)
npm run preview   # preview the production build
npm run lint      # lint
```

Requires Node.js 20+.

## 🗂 Project structure

```
src/
├── content/site.ts        ← ALL editable text and links
├── styles/tokens.css      ← colors, fonts, spacing (design tokens)
├── styles/global.css      ← base styles, buttons, layout primitives
├── styles/components.css  ← per-section styles
├── motion/variants.ts     ← all animation timing (Framer Motion)
├── hooks/useQuality.ts    ← device capability detection (full/lite/static)
├── scene/                 ← WebGL sculpture, scroll bridge, poster fallback
└── components/            ← page sections (Nav, Hero, Story, FAQ, …)
```

## ♿ Accessibility & performance

- WCAG 2.2 AA: zero axe-core violations, visible focus states, skip link,
  keyboard-accessible menu and FAQ, 44px+ touch targets
- `prefers-reduced-motion` renders a fully static, complete page
- The 3D scene is lazy-loaded behind a static poster, capped at 1.5x DPR,
  pauses when off-screen, and downgrades (or disables itself) on weak
  devices, Data Saver, or missing WebGL
- CLS ≈ 0.01; the page is interactive before the 3D chunk loads
