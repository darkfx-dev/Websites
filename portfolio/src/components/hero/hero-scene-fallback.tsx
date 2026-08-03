/**
 * The static composition shown when the 3D scene is not appropriate:
 * reduced-motion, no WebGL, a low-power device, or the moment before the
 * scene chunk arrives.
 *
 * It is a deliberate composition rather than a spinner — the hero should
 * look finished at first paint, and for reduced-motion visitors this IS the
 * hero, permanently. Pure SVG/CSS, no JavaScript, no layout shift.
 */
export function HeroSceneFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 grid place-items-center"
    >
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full max-h-[560px] max-w-[560px]"
        role="presentation"
        focusable="false"
      >
        <defs>
          <radialGradient id="core-fill" cx="42%" cy="36%" r="68%">
            <stop offset="0%" stopColor="#e6eaff" stopOpacity="0.95" />
            <stop offset="46%" stopColor="#8b97ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2b3350" stopOpacity="0.25" />
          </radialGradient>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6d7cff" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#6d7cff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="168" fill="url(#core-glow)" />

        {/* Three rails, matching the 3D layers' radii and tilts. */}
        <g fill="none" strokeWidth="1">
          <ellipse
            cx="200" cy="200" rx="118" ry="42"
            stroke="#8b97ff" strokeOpacity="0.42"
            transform="rotate(-12 200 200)"
          />
          <ellipse
            cx="200" cy="200" rx="150" ry="54"
            stroke="#c9d1ff" strokeOpacity="0.30"
            transform="rotate(26 200 200)"
          />
          <ellipse
            cx="200" cy="200" rx="176" ry="66"
            stroke="#8fd6a4" strokeOpacity="0.24"
            transform="rotate(-38 200 200)"
          />
        </g>

        {/* Signal points on the rails. */}
        <g fill="#c9d1ff">
          <circle cx="315" cy="176" r="2.6" opacity="0.85" />
          <circle cx="96" cy="232" r="2.6" opacity="0.7" />
          <circle cx="236" cy="106" r="2.2" fill="#8fd6a4" opacity="0.8" />
          <circle cx="152" cy="298" r="2.2" fill="#8b97ff" opacity="0.75" />
        </g>

        <circle cx="200" cy="200" r="62" fill="url(#core-fill)" />
        {/* Lit rim: brighter top-left arc, matching the 3D key light. */}
        <circle
          cx="200" cy="200" r="62"
          fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1"
        />
        <path
          d="M 158 168 A 62 62 0 0 1 226 148"
          fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
