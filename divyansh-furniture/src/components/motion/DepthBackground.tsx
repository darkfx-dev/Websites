/**
 * The background: three planes of warm light at different depths, moved by
 * the GSAP ScrollTrigger in `SmoothScroll`.
 *
 * A real 3D stage — `perspective` on the wrapper, `preserve-3d` on the
 * scene — so the layers separate in Z as you scroll rather than only sliding
 * past each other. It reads as light moving through a showroom, which is the
 * one atmospheric idea a furniture page can carry without competing with the
 * furniture.
 *
 * A server component: it is pure markup with no state. Fixed, inert, and
 * behind everything, so it can never take a click or a scroll gesture meant
 * for the content above it.
 */
export function DepthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-walnut-deep"
      style={{ perspective: "1000px" }}
    >
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Far: the broad warm wash the room sits in. */}
        <div
          data-depth="1"
          className="absolute left-1/2 top-[-10%] h-[90vh] w-[130vw] -translate-x-1/2 rounded-[50%] opacity-70"
          style={{
            background:
              "radial-gradient(closest-side, rgba(200,162,101,0.13), rgba(200,162,101,0) 72%)",
          }}
        />

        {/* Middle: a low, wide pool, like light off a polished floor. */}
        <div
          data-depth="2"
          className="absolute left-[62%] top-[38%] h-[70vh] w-[85vw] -translate-x-1/2 rounded-[50%] opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, rgba(200,162,101,0.1), rgba(200,162,101,0) 70%)",
          }}
        />

        {/* Near: one cool counterpoint so the warmth has something to be
            warm against. Patina, the colour brass turns. */}
        <div
          data-depth="3"
          className="absolute left-[18%] top-[68%] h-[55vh] w-[60vw] -translate-x-1/2 rounded-[50%] opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(127,168,147,0.1), rgba(127,168,147,0) 70%)",
          }}
        />
      </div>

      {/* A single low-contrast grain, fixed so it reads as the surface the
          page sits on rather than decoration that scrolls past. */}
      <div
        className="absolute inset-0 opacity-[0.055] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
