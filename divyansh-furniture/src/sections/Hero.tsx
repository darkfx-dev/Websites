import { ArrowDown } from "lucide-react";
import { business, hero } from "@/data/site";
import { BookButton } from "@/components/ui/BookButton";
import { Corner, Rating } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";
import { FurnitureArt } from "@/components/ui/FurnitureArt";
import { messages } from "@/lib/whatsapp";

/**
 * The hero.
 *
 * Left column of copy, the piece itself on the right — the composition a
 * furniture catalogue uses, and the reason the depth background never has to
 * sit behind running text on desktop. Below `lg` it stacks and the copy gets
 * its own contrast floor from the scrim.
 *
 * A server component: only the booking button needs the browser.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32"
      aria-labelledby="hero-title"
    >
      <div className="page grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* ── Copy ─────────────────────────────────────────────────────── */}
        <div className="relative max-w-2xl">
          {/* Guarantees contrast where the copy overlaps the background on
              small screens, where the layout stacks. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[var(--gutter)] -inset-y-10 -z-10 rounded-lg lg:hidden"
            style={{
              background:
                "radial-gradient(120% 100% at 25% 50%, rgba(23,18,16,0.94) 32%, rgba(23,18,16,0.6) 64%, rgba(23,18,16,0) 100%)",
            }}
          />

          <Reveal>
            <p className="label">{hero.eyebrow}</p>
          </Reveal>

          <Reveal delay={90}>
            <h1 id="hero-title" className="mt-6 text-h1">
              {hero.headlineTop}
              <br />
              <span className="italic text-brass">{hero.headlineAccent}</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-7 max-w-xl text-lead leading-relaxed text-silk-dim">
              {hero.subheading}
            </p>
          </Reveal>

          <Reveal delay={270}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <BookButton message={messages.general} variant="primary">
                {hero.primaryCta}
              </BookButton>
              <a href="#gallery" className="btn btn-ghost">
                {hero.secondaryCta}
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          {/* The one glass surface in the hero, carrying the one pair of
              figures the owner supplied. */}
          <Reveal delay={360}>
            <div className="glass relative mt-12 inline-flex rounded-lg px-6 py-4">
              <Corner position="tl" className="m-2" />
              <Corner position="br" className="m-2" />
              <Rating
                value={business.rating}
                count={business.reviewCount}
                source={business.reviewSource}
              />
            </div>
          </Reveal>
        </div>

        {/* ── The piece ────────────────────────────────────────────────── */}
        <Reveal delay={220} className="relative hidden lg:block">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem]">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-lg"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(200,162,101,0.1), rgba(200,162,101,0) 74%)",
              }}
            />
            <div className="absolute inset-0 grid place-items-center p-10">
              <FurnitureArt kind="chair" />
            </div>
            <Corner position="tl" />
            <Corner position="br" />
          </div>
        </Reveal>
      </div>

      {/* Decorative, and hidden from assistive tech — the nav already
          provides real navigation. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <span className="text-label tracking-[0.28em] text-silk-faint">
          SCROLL
        </span>
      </div>
    </section>
  );
}
