/* Minimal inline SVG icons (24px, stroke, currentColor) — no icon
   library dependency, no emoji-as-icons. */
import type { JSX } from "react";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export type IconName = "frame" | "code" | "cube" | "gauge";

export function Icon({ name }: { name: IconName }): JSX.Element {
  switch (name) {
    case "frame":
      return (
        <svg {...base} aria-hidden="true">
          <path d="M4 8h16M4 16h16M8 4v16M16 4v16" />
        </svg>
      );
    case "code":
      return (
        <svg {...base} aria-hidden="true">
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13 4l-2 16" />
        </svg>
      );
    case "cube":
      return (
        <svg {...base} aria-hidden="true">
          <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" />
          <path d="m3.3 7.3 8.7 4.7 8.7-4.7M12 12v10" />
        </svg>
      );
    case "gauge":
      return (
        <svg {...base} aria-hidden="true">
          <path d="M12 15 15.5 8.5" />
          <path d="M20.5 15.5a9 9 0 1 0-17 0" />
        </svg>
      );
  }
}

export function ChevronDown() {
  return (
    <svg {...base} width={20} height={20} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* Small static echo of the 3D sculpture, used near the final CTA */
export function GemMark({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <polygon points="28,6 48,19 42,46 14,46 8,19" fill="#3a404d" />
      <polygon points="28,6 48,19 28,30" fill="#565e6f" />
      <polygon points="28,6 8,19 28,30" fill="#6a7284" />
      <polygon points="28,30 42,46 36,39" fill="#5668ff" />
      <polygon points="8,19 14,46 28,30" fill="#2e3440" />
      <polygon points="48,19 42,46 28,30" fill="#262b35" />
    </svg>
  );
}
