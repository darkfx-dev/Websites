/* Static fallback for the 3D scene: a faceted SVG echo of the sculpture.
   Shown when WebGL is unavailable, reduced motion is on, Data Saver is
   active, the scene errors, or while the 3D chunk is still loading. */
export function Poster() {
  return (
    <div className="poster" aria-hidden="true">
      <svg viewBox="0 0 400 400" width="400" height="400" role="presentation">
        <defs>
          <linearGradient id="fxA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4a515f" />
            <stop offset="1" stopColor="#262b35" />
          </linearGradient>
          <linearGradient id="fxB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6a7284" />
            <stop offset="1" stopColor="#3a404d" />
          </linearGradient>
          <linearGradient id="fxC" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5668ff" />
            <stop offset="1" stopColor="#39439e" />
          </linearGradient>
        </defs>
        {/* Central faceted form */}
        <polygon points="200,60 320,140 280,300 120,300 80,140" fill="url(#fxA)" />
        <polygon points="200,60 320,140 200,210" fill="url(#fxB)" opacity="0.9" />
        <polygon points="200,60 80,140 200,210" fill="#565e6f" />
        <polygon points="80,140 120,300 200,210" fill="#3a404d" />
        <polygon points="320,140 280,300 200,210" fill="#2e3440" />
        <polygon points="120,300 280,300 200,210" fill="#262b35" />
        {/* Accent facet */}
        <polygon points="200,210 280,300 240,255" fill="url(#fxC)" opacity="0.85" />
        {/* Orbiting fragments */}
        <polygon points="60,80 84,92 66,108" fill="#4a515f" />
        <polygon points="330,70 352,86 328,98" fill="#565e6f" />
        <polygon points="348,230 366,246 344,252" fill="#3a404d" />
        <polygon points="48,250 68,262 50,274" fill="#4a515f" />
      </svg>
    </div>
  );
}
