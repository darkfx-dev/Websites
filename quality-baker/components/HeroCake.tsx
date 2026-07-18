/**
 * Signature animation #1: the cake that draws itself.
 *
 * Every stroked path carries pathLength="1" so the CSS in globals.css can
 * animate stroke-dashoffset 1 → 0 (`.cake-draw .stroke`), staggered via
 * `--d`. The cream icing shapes fade in once the line work lands. Pure CSS:
 * runs before hydration, off the main thread, and reduced-motion shows the
 * finished drawing instead.
 */
export function HeroCake({ className }: { className?: string }) {
  const d = (s: number) => ({ "--d": `${s}s` } as React.CSSProperties);
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-hidden="true"
      className={`cake-draw ${className ?? ""}`}
      fill="none"
      stroke="#b87333"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Cake board */}
      <path className="stroke" pathLength={1} d="M40 158h120" strokeWidth="2.5" style={d(0)} />
      {/* Bottom tier */}
      <path
        className="stroke"
        pathLength={1}
        d="M52 158v-24c0-3 2-6 6-6h84c4 0 6 3 6 6v24"
        style={d(0.2)}
      />
      {/* Middle tier */}
      <path
        className="stroke"
        pathLength={1}
        d="M70 128v-22c0-3 2-6 6-6h48c4 0 6 3 6 6v22"
        style={d(0.5)}
      />
      {/* Top tier */}
      <path
        className="stroke"
        pathLength={1}
        d="M84 100V82c0-3 2-6 6-6h20c4 0 6 3 6 6v18"
        style={d(0.8)}
      />
      {/* Candle + cherry */}
      <path className="stroke" pathLength={1} d="M100 76v-14" style={d(1.1)} />
      <circle className="icing" cx="100" cy="56" r="5" fill="rgb(232 168 96 / 0.8)" stroke="none" style={d(1.4)} />
      {/* Icing drips: cream fills that appear after the outline completes */}
      <g className="icing" fill="none" stroke="#fdf8f0" strokeOpacity="0.85" style={d(1.5)}>
        <path d="M52 142c9 6 18 6 27 0s18-6 27 0 18 6 27 0 9-4 15-4" />
      </g>
      <g className="icing" fill="none" stroke="#fdf8f0" strokeOpacity="0.7" style={d(1.7)}>
        <path d="M70 114c7 5 14 5 21 0s14-5 21 0 12 4 18 2" />
        <path d="M84 90c5 4 10 4 16 0s11-4 16 0" />
      </g>
    </svg>
  );
}
