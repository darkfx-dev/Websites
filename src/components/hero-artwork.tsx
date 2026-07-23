import * as React from "react";

/**
 * Original, code-native hero composition: an abstract tawa (griddle) with a
 * plated bhaji, rising steam and warm spice tones. Purely decorative — hidden
 * from assistive tech. No photography, no cartoon illustration.
 */
export function HeroArtwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 520"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="tawa" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#3a2f26" />
          <stop offset="55%" stopColor="#241d17" />
          <stop offset="100%" stopColor="#0d0c0a" />
        </radialGradient>
        <radialGradient id="bhaji" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#e2582f" />
          <stop offset="60%" stopColor="#b9382d" />
          <stop offset="100%" stopColor="#8f2a22" />
        </radialGradient>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2a93b" />
          <stop offset="100%" stopColor="#d98a24" />
        </linearGradient>
        <linearGradient id="steam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fff8eb" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff8eb" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Warm glow */}
      <circle cx="260" cy="248" r="240" fill="#f2a93b" opacity="0.08" />

      {/* Rising steam */}
      <g stroke="url(#steam)" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M212 150 C 196 118, 236 104, 220 70" opacity="0.8" />
        <path d="M262 140 C 246 104, 288 88, 270 52" opacity="0.9" />
        <path d="M312 150 C 296 120, 336 104, 320 72" opacity="0.7" />
      </g>

      {/* Tawa / griddle */}
      <circle cx="260" cy="266" r="196" fill="url(#tawa)" />
      <circle
        cx="260"
        cy="266"
        r="196"
        fill="none"
        stroke="#000000"
        strokeOpacity="0.35"
        strokeWidth="10"
      />
      <circle
        cx="260"
        cy="266"
        r="176"
        fill="none"
        stroke="url(#ring)"
        strokeWidth="3"
        strokeOpacity="0.5"
      />

      {/* Plated bhaji */}
      <circle cx="260" cy="262" r="120" fill="#0f0d0b" />
      <circle cx="260" cy="262" r="110" fill="url(#bhaji)" />
      {/* Butter pat */}
      <rect
        x="238"
        y="228"
        width="44"
        height="30"
        rx="6"
        fill="#f7d778"
        opacity="0.95"
      />
      <rect
        x="238"
        y="228"
        width="44"
        height="10"
        rx="5"
        fill="#fff3c4"
        opacity="0.9"
      />
      {/* Coriander garnish specks */}
      <g fill="#2f6849">
        <circle cx="214" cy="286" r="5" />
        <circle cx="300" cy="248" r="5" />
        <circle cx="286" cy="300" r="4" />
        <circle cx="232" cy="252" r="4" />
        <circle cx="268" cy="308" r="4" />
      </g>

      {/* Pav (bread) discs, top-left */}
      <g>
        <circle cx="120" cy="150" r="46" fill="#c98a4a" />
        <circle cx="120" cy="150" r="46" fill="none" stroke="#8a5a2c" strokeWidth="3" />
        <circle cx="120" cy="146" r="34" fill="#e0b072" />
      </g>

      {/* Lemon wedge, bottom-right */}
      <g transform="translate(392 360) rotate(18)">
        <path d="M0 0 A 46 46 0 0 1 46 46 L 0 46 Z" fill="#f2c94c" />
        <path
          d="M0 0 A 46 46 0 0 1 46 46 L 0 46 Z"
          fill="none"
          stroke="#d9a72a"
          strokeWidth="3"
        />
        <line x1="8" y1="40" x2="38" y2="10" stroke="#fff3c4" strokeWidth="2" />
        <line x1="20" y1="44" x2="42" y2="22" stroke="#fff3c4" strokeWidth="2" />
      </g>

      {/* Chopped onion cubes, top-right */}
      <g fill="#f7eedc" opacity="0.92">
        <rect x="378" y="150" width="16" height="16" rx="3" />
        <rect x="400" y="166" width="14" height="14" rx="3" />
        <rect x="366" y="172" width="13" height="13" rx="3" />
      </g>
    </svg>
  );
}
