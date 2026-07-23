/* ============================================================================
   THE RED LINE — single source of truth for all editable content.
   Copy, scene beats, nav, CTAs, legal status, and metadata live here only.
   The 3D world and every overlay read from this file.

   This is an UNOFFICIAL original design concept. It uses a fictional red
   performance-car concept — no Ferrari marks, assets, or claims. Do not add
   invented specifications, prices, or performance figures.
   ============================================================================ */

export interface Scene {
  id: string;
  label: string; // header / progress nav label
  eyebrow: string;
  title: string;
  body: string;
  /** accent hex used for this scene's overlay rule + progress dot */
  accent: string;
}

export const brand = {
  wordmark: "THE RED LINE",
  tagline: "Motion given form",
} as const;

export const meta = {
  title: "THE RED LINE — an unofficial automotive design concept",
  description:
    "A cinematic, scroll-driven study of Italian performance, sculpture and emotion. An unofficial interactive design concept — not affiliated with Ferrari.",
  themeColor: "#070707",
  ogImage: "/og.svg",
} as const;

export const legal = {
  disclaimer:
    "Unofficial interactive design concept. Not affiliated with or endorsed by Ferrari. The vehicle shown is an original fictional concept.",
} as const;

/* The five connected beats the camera flies through, in order. */
export const scenes: Scene[] = [
  {
    id: "reveal",
    label: "Experience",
    eyebrow: "A study in velocity",
    title: "Motion, given form.",
    body: "A cinematic exploration of Italian performance, proportion and emotion.",
    accent: "#d40000",
  },
  {
    id: "aerodynamics",
    label: "Design",
    eyebrow: "Sculpted by air",
    title: "Every surface has purpose.",
    body: "Airflow becomes an invisible material shaping balance, cooling and control.",
    accent: "#a7aaad",
  },
  {
    id: "engineering",
    label: "Engineering",
    eyebrow: "Power, concentrated",
    title: "Precision beneath emotion.",
    body: "Material, heat and motion arranged with uncompromising intent.",
    accent: "#d40000",
  },
  {
    id: "cockpit",
    label: "Craft",
    eyebrow: "Designed around instinct",
    title: "Control becomes connection.",
    body: "Every touchpoint is composed around focus, tactility and the driver.",
    accent: "#ffd400",
  },
  {
    id: "horizon",
    label: "The Red Line",
    eyebrow: "The red line",
    title: "Beyond motion.",
    body: "An unofficial interactive study of speed, sculpture and human emotion.",
    accent: "#d40000",
  },
];

/* CTAs only on the final beat. Both resolve to real in-page actions. */
export const finalCta = {
  primary: { label: "Restart the journey", action: "restart" as const },
  secondary: { label: "Explore the craft", href: "#cockpit" },
} as const;

export const nav = scenes.map((s) => ({ label: s.label, href: `#${s.id}` }));
