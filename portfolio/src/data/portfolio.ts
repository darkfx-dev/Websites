/**
 * THE ONLY FILE YOU NEED TO EDIT TO MAKE THIS SITE YOURS.
 *
 * Every word, link, project and image on the site is read from here. No
 * component hard-codes a personal fact.
 *
 * ── How placeholders work ────────────────────────────────────────────────
 * Anything still wrapped in [square brackets] is a placeholder. The site
 * detects them and refuses to present them as real:
 *   - placeholder text renders visibly marked, never as if it were a fact;
 *   - placeholder links are NOT rendered as working links, because a dead
 *     link is worse than an absent one;
 *   - sections whose content is empty are removed from the page entirely,
 *     rather than shown empty. Absence is more credible than filler.
 *
 * Replace the bracketed values, delete what doesn't apply, and the site
 * updates itself. `npm run check:content` lists what is still outstanding.
 */

/** True when a value is still an unfilled `[placeholder]`. */
export function isPlaceholder(value: string | undefined | null): boolean {
  if (!value) return true;
  const t = value.trim();
  return t.length === 0 || (t.startsWith("[") && t.endsWith("]"));
}

/** A value safe to render as fact, or `null` if it is still a placeholder. */
export function real(value: string | undefined | null): string | null {
  return isPlaceholder(value) ? null : (value as string).trim();
}

// ─────────────────────────────────────────────────────────────────────────
// IDENTITY
// ─────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "[Your Name]",
  role: "[Your Role]",
  location: "[Your Location or Remote]",
  /** e.g. "developer tools", "fintech infrastructure", "AI products" */
  domain: "[Your Domain or Specialization]",
  /** What you are doing right now. */
  currentStatus: "[What you are doing now]",
  /** e.g. "available for freelance work" — used in the contact section. */
  availability: "[Freelance / full-time / collaborations / unavailable]",
  /** Leave as a placeholder unless you genuinely want to state a number. */
  yearsOfExperience: "[Years of experience]",
  /** Realistic reply time, e.g. "a couple of days". Optional. */
  responseTime: "[Realistic response time]",
  /** One true personal detail. Keeps the page human. */
  humanDetail: "[One genuine hobby, interest, or personal detail]",
  /** What you are actually learning at the moment. */
  currentlyLearning: "[Real current learning focus]",
} as const;

/**
 * The hero headline. Pick ONE of the four supplied directions by setting
 * `headlineVariant`; the others stay here for easy switching.
 *
 * "terminal" additionally enables the typed boot sequence.
 */
export const headlineVariant: "build" | "ship" | "terminal" | "careful" =
  "build";

export const headlines = {
  build: "I build fast, focused software.",
  ship: "I turn hard problems into shipped products.",
  terminal: "builder of things that work.",
  careful: "Software, written carefully.",
} as const;

// ─────────────────────────────────────────────────────────────────────────
// CONTACT AND LINKS
// ─────────────────────────────────────────────────────────────────────────

export type SocialLink = {
  label: string;
  /** Full URL, or `mailto:` for email. Placeholder = not rendered as a link. */
  href: string;
  /** Shown instead of the raw URL. */
  display: string;
};

export const contact = {
  email: "[email@example.com]",
  socials: [
    { label: "GitHub", href: "[GitHub URL]", display: "[GitHub URL]" },
    { label: "LinkedIn", href: "[LinkedIn URL]", display: "[LinkedIn URL]" },
    { label: "X", href: "[Optional X/Twitter URL]", display: "[Optional X/Twitter URL]" },
  ] satisfies SocialLink[],
  /** A URL or a file in /public. Leave as a placeholder to hide the link. */
  resume: "[Optional resume URL or /resume.pdf]",
} as const;

// ─────────────────────────────────────────────────────────────────────────
// HOW I WORK
// ─────────────────────────────────────────────────────────────────────────

/**
 * Rewrite these so they are true of you. They are the most-read words on the
 * page after the headline — generic ones actively cost you credibility.
 */
export const principles: { title: string; body: string }[] = [
  {
    title: "Problem first, tools second",
    body: "I start with the problem, not the technology. The stack is an implementation detail chosen after the constraints are clear.",
  },
  {
    title: "Ship early enough to learn",
    body: "I put work in front of real use as soon as it is safe to, because real use is the only reliable source of requirements.",
  },
  {
    title: "Write the decision down",
    body: "I document why something is the way it is, so the next person — often me — does not have to reverse-engineer the reasoning.",
  },
  {
    title: "Cut scope, not quality",
    body: "I would rather ship less of something that works properly than all of something that is half-right.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// SELECTED WORK
// ─────────────────────────────────────────────────────────────────────────

export type ProjectScreen = {
  /** Path under /public, e.g. "/projects/app-overview.png". */
  src: string;
  /** Describe what is ON the screen. Never "screenshot of app". */
  alt: string;
  /** Short caption naming what changed in this step of the flow. */
  caption: string;
};

export type Project = {
  slug: string;
  name: string;
  /** One line: what was wrong before this existed. */
  problem: string;
  /** What YOU did. First person, specific. */
  whatIDid: string;
  /**
   * The honest result. If there is no validated metric yet, say so plainly —
   * see the note in the README. Never invent a percentage.
   */
  outcome: string;
  stack: string[];
  liveUrl: string;
  codeUrl: string;
  /** Primary still image for the project card. */
  cover: { src: string; alt: string } | null;
  /**
   * Ordered interface states for the animated flow preview. Supply 3 real
   * screens to enable it. Fewer than 3 shows a clearly-marked media
   * requirement instead of a fabricated interface.
   */
  flow: {
    /** "input-processing-result" or "overview-detail-action". */
    kind: "input-processing-result" | "overview-detail-action";
    /** Plain-text description of the whole flow, for screen readers. */
    summary: string;
    screens: ProjectScreen[];
  } | null;
};

export const projects: Project[] = [
  {
    slug: "project-one",
    name: "[Project 1 Name]",
    problem: "[What problem did this solve? One or two sentences.]",
    whatIDid: "[What did you personally build, decide, or change?]",
    outcome: "[What actually happened? If it is early, say so honestly.]",
    stack: ["[Tool]", "[Tool]", "[Tool]"],
    liveUrl: "[Live URL]",
    codeUrl: "[Code URL]",
    cover: null,
    flow: {
      kind: "input-processing-result",
      summary:
        "[Describe, in one or two sentences, how a user moves through this interface: what they start with, what happens, and what they end up with.]",
      screens: [],
    },
  },
  {
    slug: "project-two",
    name: "[Project 2 Name]",
    problem: "[What problem did this solve?]",
    whatIDid: "[What did you personally build, decide, or change?]",
    outcome: "[What actually happened?]",
    stack: ["[Tool]", "[Tool]", "[Tool]"],
    liveUrl: "[Live URL]",
    codeUrl: "[Code URL]",
    cover: null,
    flow: {
      kind: "overview-detail-action",
      summary:
        "[Describe how a user moves from an overview, into a detail view, and then takes an action.]",
      screens: [],
    },
  },
  {
    slug: "project-three",
    name: "[Project 3 Name]",
    problem: "[What problem did this solve?]",
    whatIDid: "[What did you personally build, decide, or change?]",
    outcome: "[What actually happened?]",
    stack: ["[Tool]", "[Tool]", "[Tool]"],
    liveUrl: "[Live URL]",
    codeUrl: "[Code URL]",
    cover: null,
    flow: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Group tools by what they let you DO, not by vendor. Only list things you
 * would be comfortable being asked about in an interview.
 */
export const skillGroups: { title: string; items: string[] }[] = [
  { title: "Interface", items: ["[Tool]", "[Tool]", "[Tool]"] },
  { title: "Systems", items: ["[Tool]", "[Tool]", "[Tool]"] },
  { title: "Data", items: ["[Tool]", "[Tool]"] },
  { title: "Workflow", items: ["[Tool]", "[Tool]", "[Tool]"] },
];

// ─────────────────────────────────────────────────────────────────────────
// OPTIONAL SECTIONS — leave empty and the section disappears
// ─────────────────────────────────────────────────────────────────────────

export type Testimonial = {
  /** The exact words they used. Do not paraphrase into something stronger. */
  quote: string;
  name: string;
  title: string;
};

/** Only add quotes you actually received and have permission to publish. */
export const testimonials: Testimonial[] = [];

export type WritingEntry = {
  title: string;
  summary: string;
  /** ISO date, e.g. "2026-03-14". */
  date: string;
  url: string;
};

/** Only real, published posts. */
export const writing: WritingEntry[] = [];

// ─────────────────────────────────────────────────────────────────────────
// SITE / SEO
// ─────────────────────────────────────────────────────────────────────────

export const site = {
  /** Your deployed address. Used for canonical URLs and social previews. */
  url: "[https://your-domain.com]",
  /** ~150-160 characters, no keyword stuffing. */
  description:
    "[Your Name] builds [what you build] for [who you build it for]. Explore selected projects, tools, and writing.",
  /** One line for social cards. */
  ogStatement: "[one-line value statement]",
  locale: "en",
} as const;

/**
 * Section anchors, shared by the nav and the page so they cannot drift.
 *
 * "testimonials" and "notes" are dropped from the nav automatically when their
 * arrays above are empty — see `Navigation`.
 */
export const navSections = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "testimonials", label: "Words" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
] as const;
