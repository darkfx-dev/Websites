/**
 * Live illustrative cake preview for the order studio.
 *
 * Deliberately a layered SVG rather than WebGL: on the mid-range phones this
 * site is demoed on, a procedural 3D cake would cost ~500KB of JS and read
 * as toy-like — the spec's own fallback clause applies. The SVG re-renders
 * instantly from the visitor's selections and is labelled as an
 * approximation, never a product guarantee.
 */

type PreviewProps = {
  shape: string;
  weight: string;
  finish: string;
  colourHex: string;
  inscription: string;
};

function tierCount(shape: string, weight: string): number {
  if (shape === "Tiered") return 3;
  if (weight === "2 kg" || weight === "Larger (discuss)") return 2;
  return 1;
}

export function CakePreview({
  shape,
  weight,
  finish,
  colourHex,
  inscription,
}: PreviewProps) {
  const tiers = tierCount(shape, weight);
  const icing = colourHex;
  const drip = finish === "Fondant" ? "none" : icing;
  const sharp = shape === "Square";
  const rx = sharp ? 1 : 7;

  // Tier geometry, bottom-up
  const tierSpecs = [
    { w: 120, h: 34 },
    { w: 88, h: 30 },
    { w: 60, h: 26 },
  ].slice(0, tiers);
  const baseY = 160;
  let y = baseY;
  const rects = tierSpecs.map((t) => {
    y -= t.h;
    return { x: 100 - t.w / 2, y, w: t.w, h: t.h };
  });
  const topY = rects[rects.length - 1].y;

  return (
    <figure aria-label="Illustrative cake preview" className="select-none">
      <svg viewBox="0 0 200 200" className="w-full" role="img">
        {/* soft stage light */}
        <ellipse cx="100" cy="168" rx="78" ry="10" fill="rgb(166 106 63 / 0.18)" />
        <path d="M35 164h130" stroke="#a66a3f" strokeWidth="2.5" strokeLinecap="round" />

        {shape === "Heart" ? (
          <g>
            <path
              d="M100 156C74 132 58 116 58 96a24 24 0 0 1 42-16 24 24 0 0 1 42 16c0 20-16 36-42 60z"
              fill={icing}
              stroke="#4a2e21"
              strokeWidth="2"
            />
            {drip !== "none" && (
              <path
                d="M70 92c8 6 16 6 24 0s16-6 24 0 12 4 16 2"
                fill="none"
                stroke="rgb(11 10 9 / 0.18)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
          </g>
        ) : (
          <g stroke="#4a2e21" strokeWidth="2">
            {rects.map((r, i) => (
              <g key={i}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={rx} fill={icing} />
                {drip !== "none" && (
                  <path
                    d={`M${r.x + 6} ${r.y + 9}c${r.w / 8} 5 ${r.w / 4} 5 ${r.w / 2.6} 0s${r.w / 4} -5 ${r.w / 2.6} 0`}
                    fill="none"
                    stroke="rgb(11 10 9 / 0.16)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}
              </g>
            ))}
            {/* candle */}
            <path d={`M100 ${topY} v-12`} strokeLinecap="round" />
            <circle cx="100" cy={topY - 17} r="4" fill="#f3e4c8" stroke="none" />
          </g>
        )}
      </svg>
      {inscription.trim() && (
        <p className="-mt-2 truncate text-center font-display text-lg italic text-vanilla">
          &ldquo;{inscription.trim()}&rdquo;
        </p>
      )}
      <figcaption className="mt-3 text-center text-xs leading-relaxed text-taupe">
        Illustrative preview only — the real design is sketched with you on
        WhatsApp.
      </figcaption>
    </figure>
  );
}
