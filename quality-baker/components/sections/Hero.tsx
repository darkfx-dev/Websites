import { GlowButton } from "@/components/GlowButton";
import { HeroCake } from "@/components/HeroCake";
import { defaultWhatsappHref, site } from "@/lib/site";

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
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-noir text-cream"
    >
      {/* Melted-chocolate backdrop: cocoa pooling into noir, breathing slowly.
          Used once — this wash is the hero's alone. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="glow-breathe absolute -bottom-1/3 left-1/2 h-[85vh] w-[140vw] -translate-x-1/2 rounded-[100%]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgb(184 115 51 / 0.3), rgb(107 66 38 / 0.14) 55%, transparent 75%)",
          }}
        />
        <div
          className="absolute right-[-20%] top-[-30%] h-[60vh] w-[60vw] rounded-[100%] opacity-50"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgb(107 66 38 / 0.28), transparent 70%)",
          }}
        />
      </div>

      {/* Signature moment: the cake draws itself in line-art, then the
          icing fades in (pure CSS, see .cake-draw in globals.css). */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-2%] top-1/2 hidden w-[42vw] max-w-[600px] -translate-y-1/2 lg:block"
      >
        <HeroCake className="w-full opacity-80" />
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
          <GlowButton href="#order">Order a cake</GlowButton>
          <GlowButton href={defaultWhatsappHref} variant="ghost" target="_blank" rel="noopener">
            WhatsApp us
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
