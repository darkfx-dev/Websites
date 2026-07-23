/* Static stylised poster — an original red wedge silhouette on carbon. Used as
   the loading fallback, the WebGL-failure fallback, and the base visual of the
   reduced-motion static experience. Purely decorative. */
export function Poster({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden bg-carbon ${className}`} aria-hidden="true">
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "radial-gradient(80% 100% at 50% 100%, rgba(122,0,0,0.45), transparent 70%)" }}
      />
      <svg viewBox="0 0 800 400" className="absolute left-1/2 top-1/2 w-[110%] max-w-[1100px] -translate-x-1/2 -translate-y-1/2" role="presentation">
        <defs>
          <linearGradient id="pbody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d40000" />
            <stop offset="1" stopColor="#7a0000" />
          </linearGradient>
        </defs>
        {/* original stylised mid-engine wedge */}
        <polygon
          points="120,250 210,235 300,175 430,168 520,190 640,205 690,250 660,262 130,262"
          fill="url(#pbody)"
        />
        <polygon points="330,178 415,172 470,196 350,200" fill="#0b0b0d" opacity="0.85" />
        <circle cx="250" cy="262" r="34" fill="#0a0a0a" />
        <circle cx="250" cy="262" r="15" fill="#a7aaad" />
        <circle cx="560" cy="262" r="34" fill="#0a0a0a" />
        <circle cx="560" cy="262" r="15" fill="#a7aaad" />
        <rect x="120" y="300" width="580" height="2" fill="#d40000" />
      </svg>
    </div>
  );
}
