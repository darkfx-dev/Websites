/* ============================================================
   ALL editable website content lives in this one file.
   Change text, links, and email here — no other file needed.
   ============================================================ */

export const site = {
  brand: "DarkFX",
  tagline: "Independent web studio",
  // The email every contact button points to — change it here once.
  email: "ritwikgupta1200@gmail.com",
  github: "https://github.com/darkfx-dev",

  meta: {
    title: "DarkFX — Independent Web Studio",
    description:
      "Design, motion, and engineering under one roof. DarkFX builds fast, accessible, distinctive websites with React, TypeScript, and WebGL.",
  },

  nav: [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Process", href: "#process" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    eyebrow: "DarkFX — Independent web studio",
    heading: "Websites that feel designed, not assembled.",
    lede: "Design, motion, and engineering under one roof — fast, accessible sites with a point of view, built end to end by one focused studio.",
    primaryCta: { label: "Start a conversation", kind: "email" as const },
    secondaryCta: { label: "See capabilities", href: "#capabilities" },
    // A truthful context line — no invented clients or metrics.
    contextLine: "React · TypeScript · WebGL · Motion design",
  },

  capabilities: {
    eyebrow: "Capabilities",
    heading: "Everything a site needs, from one pair of hands.",
    lede: "No hand-offs between disciplines — the person designing the page is the person building it.",
    items: [
      {
        icon: "frame" as const,
        title: "Design direction",
        body: "Layout, typography, and color systems decided on purpose — so the site reads clearly and feels like a brand, not a template.",
      },
      {
        icon: "code" as const,
        title: "Frontend engineering",
        body: "Modern React and TypeScript with clean component structure — code a future developer can pick up without archaeology.",
      },
      {
        icon: "cube" as const,
        title: "Motion & 3D",
        body: "Scroll-linked storytelling and interactive WebGL used where they carry meaning — never as decoration that slows the page down.",
      },
      {
        icon: "gauge" as const,
        title: "Performance & accessibility",
        body: "Keyboard navigation, reduced-motion support, and mobile-first budgets treated as requirements, not afterthoughts.",
      },
    ],
  },

  story: {
    // The scroll-driven 3D narrative: 4 states, A → D.
    states: [
      {
        title: "One coherent thing",
        body: "A good product page is a single idea, not a pile of sections.",
      },
      {
        title: "Made of real parts",
        body: "Underneath: design direction, engineering, motion — each pulling in the same direction.",
      },
      {
        title: "Detail by detail",
        body: "Every facet gets deliberate attention — contrast, timing, touch targets, load cost.",
      },
      {
        title: "Assembled to ship",
        body: "Then it all comes back together as something you can actually launch.",
      },
    ],
  },

  process: {
    eyebrow: "Process",
    heading: "How a project runs.",
    lede: "Simple and honest — scoped in writing, built in the open.",
    steps: [
      {
        title: "Brief & scope",
        body: "You describe what you need and why. We agree on what's in, what's out, and what done looks like.",
      },
      {
        title: "Design direction",
        body: "A visual direction grounded in your actual content — reviewed early, before heavy build time is spent.",
      },
      {
        title: "Build & iterate",
        body: "The real site goes up on a preview link early. You watch it evolve and steer while changes are still cheap.",
      },
      {
        title: "Launch & handoff",
        body: "Deployed to your hosting, with plain-language notes on how to edit content yourself.",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Common questions.",
    items: [
      {
        q: "What do you build?",
        a: "Marketing sites, landing pages, portfolios, and interactive web experiences — the public face of a product or practice. Primarily React and TypeScript, with WebGL and motion where it earns its place.",
      },
      {
        q: "How does a project start?",
        a: "With an email. Describe what you're trying to achieve, roughly what content exists, and any deadline. You'll get an honest reply about whether it's a fit and what a sensible scope looks like.",
      },
      {
        q: "How long does a site take?",
        a: "It depends entirely on scope, which is why scope gets agreed in writing first. A focused landing page is a different project from a multi-page site — the timeline is part of the brief, not a promise made before it.",
      },
      {
        q: "Do I need to know anything technical?",
        a: "No. Content lives in one clearly documented place, previews are shared as plain links, and handoff includes instructions written for non-developers.",
      },
      {
        q: "What about hosting costs?",
        a: "Sites are built to deploy on free static hosting tiers (GitHub Pages, Netlify, Vercel and similar) — no required subscriptions, databases, or paid services.",
      },
    ],
  },

  finalCta: {
    heading: "Have something worth building?",
    body: "One email starts it — what you're making, who it's for, and when you need it.",
    ctaLabel: "Email the studio",
    note: "No forms, no calls to book — just write.",
  },

  footer: {
    line: "Independent web studio — design, motion, and engineering.",
  },
} as const;

export const emailHref = `mailto:${site.email}?subject=${encodeURIComponent(
  "Project inquiry — " + site.brand,
)}`;
