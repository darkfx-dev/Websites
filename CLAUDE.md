# Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React (icons)

# Coding Rules

- TypeScript only — no plain JavaScript.
- Build responsive, mobile-first layouts.
- Keep components modular, reusable, and scalable.
- Optimize for SEO, accessibility, and performance.
- Use smooth, lightweight animations; avoid heavy effects.
- Write clean, maintainable, production-ready code.
- Follow modern React and Next.js best practices.
- Prefer Server Components where appropriate.
- Use semantic HTML and maintain a clear folder structure.

# MCP / Tooling Notes

- shadcn MCP server is configured in `.mcp.json` — use it to add individual
  components rather than running `shadcn init` (blocked by network policy
  in this environment: `ui.shadcn.com` is not reachable through the proxy).
- Use GitHub MCP to inspect these repos only when relevant, never clone them
  wholesale into this project: `shadcn-ui/ui`, `magicuidesign/magicui`,
  `nolly-studio/cult-ui`, `motiondivision/motion`, `tailwindlabs/tailwindcss`,
  `vercel/next.js`.
- Aceternity UI components come from https://ui.aceternity.com/ directly.
- Use Context7 for current library documentation.
- Install only the packages/components actually needed for a given task.
- Free components only — no Motion+, Magic UI Pro, Cult UI Pro, Aceternity
  Pro, or other paid tiers.
