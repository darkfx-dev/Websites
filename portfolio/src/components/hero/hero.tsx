import { HeroCopy } from "./hero-copy";
import { HeroScene } from "./hero-scene";

/**
 * The hero.
 *
 * On desktop the 3D scene occupies the right ~48% and the copy the left, so
 * text never sits on top of the busiest part of the render. Below `lg` the
 * scene moves behind the copy at reduced opacity and the copy gets its own
 * contrast floor from the background gradient — legibility wins over the
 * visual on small screens.
 *
 * This is a server component; only the two children that need the browser
 * are client components.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Ambient environmental glow. One soft source, not a blob per corner. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-18%] -z-10 h-[720px] w-[900px] -translate-x-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgba(109,124,255,0.20), transparent 72%)",
        }}
      />

      {/* Scene: right half on desktop, full-bleed behind copy on mobile. */}
      <div className="absolute inset-0 lg:left-[46%]">
        <div className="relative h-full w-full opacity-45 sm:opacity-60 lg:opacity-100">
          <HeroScene />
        </div>
      </div>

      {/* Guarantees hero copy contrast where it overlaps the scene on mobile. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,9,13,0.86) 12%, rgba(7,9,13,0.55) 52%, rgba(7,9,13,0.9) 100%)",
        }}
      />

      <div className="shell relative flex min-h-[100svh] items-center pb-24 pt-32">
        <h2 id="hero-heading" className="sr-only">
          Introduction
        </h2>
        <HeroCopy />
      </div>

      {/* Scroll affordance — decorative, and hidden from assistive tech since
          the nav and skip link already provide real navigation. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <span className="mono text-xs tracking-[0.2em] text-ink-faint">
          scroll
        </span>
      </div>
    </section>
  );
}
