import { GlowButton } from "@/components/GlowButton";
import { PastryArt } from "@/components/PastryArt";
import { site } from "@/lib/site";

const headlineWords = ["Baked", "slowly.", "Decorated", "like", "it", "matters."];

/**
 * Full-viewport hero. The entrance choreography is pure CSS (see
 * `.hero-word` / `.hero-fade` in globals.css): it starts before hydration,
 * runs on the compositor, and collapses to a gentle fade under
 * prefers-reduced-motion.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-espresso text-cream"
    >
      {/* Oven-warmth backdrop: two static radial washes, opacity-breathing */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="glow-breathe absolute -bottom-1/3 left-1/2 h-[85vh] w-[140vw] -translate-x-1/2 rounded-[100%]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgb(212 160 84 / 0.32), rgb(139 78 59 / 0.12) 55%, transparent 75%)",
          }}
        />
        <div
          className="absolute right-[-20%] top-[-30%] h-[60vh] w-[60vw] rounded-[100%] opacity-50"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgb(139 78 59 / 0.25), transparent 70%)",
          }}
        />
      </div>

      {/* Faint line-art cake filling the right side on wide screens.
          Opacity lives on the SVG, not the animated wrapper — the hero-fade
          keyframe fills forward to opacity:1 and would override it. */}
      <div
        aria-hidden
        className="hero-fade pointer-events-none absolute right-[-4%] top-1/2 hidden w-[44vw] max-w-[620px] -translate-y-1/2 lg:block"
        style={{ "--d": "0.6s" } as React.CSSProperties}
      >
        <PastryArt variant="tiered" className="w-full opacity-[0.38]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-32 sm:px-8">
        <p
          className="hero-fade mb-6 font-display text-lg italic text-caramel"
          style={{ "--d": "0.15s" } as React.CSSProperties}
        >
          Bhestan&rsquo;s little cake shop
        </p>

        <h1 className="font-display text-[clamp(2.6rem,9vw,5.75rem)] font-medium leading-[1.04] tracking-[-0.02em]">
          {headlineWords.map((word, i) => (
            <span
              key={i}
              className="hero-word"
              style={{ "--d": `${0.25 + i * 0.07}s` } as React.CSSProperties}
            >
              {word}
              {i < headlineWords.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <p
          className="hero-fade mt-7 max-w-[46ch] text-lg leading-relaxed text-cream/80"
          style={{ "--d": "0.85s" } as React.CSSProperties}
        >
          Custom cakes and fresh pastries from {site.addressShort}. Designed by
          hand, baked the same day, handed over with a smile.
        </p>

        <div
          className="hero-fade mt-10 flex flex-wrap items-center gap-4"
          style={{ "--d": "1s" } as React.CSSProperties}
        >
          <GlowButton href="#menu">See our cakes</GlowButton>
          <GlowButton href={site.whatsappHref} variant="ghost">
            Order on WhatsApp
          </GlowButton>
        </div>

        <p
          className="hero-fade mt-12 text-sm text-cream/60"
          style={{ "--d": "1.15s" } as React.CSSProperties}
        >
          <span className="font-semibold text-caramel">{site.rating}★</span>
          {" · "}
          {site.reviewCount} happy customers on Google
        </p>
      </div>
    </section>
  );
}
