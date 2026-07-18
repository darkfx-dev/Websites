import { reviews } from "@/data/reviews";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * Real Google reviews, verbatim, set with editorial rhythm: one featured
 * pull-quote carries the section, the rest support it at smaller sizes in
 * an offset two-column flow — deliberately not five identical cards.
 */
const featured = reviews[1]; // "…too kind behaviour" — the review that says the most
const supporting = reviews.filter((r) => r !== featured);

export function Reviews() {
  return (
    <section aria-label="Customer reviews" className="bg-cream text-ink">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.06] tracking-[-0.015em]">
            In their words
          </h2>
          <p className="mt-4 text-lg text-ink/70">
            {site.rating}★ across {site.reviewCount} Google reviews. Quoted
            exactly as written.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-[1.5fr_1fr] md:gap-16">
          {/* Featured quote — large, serif, carries the section */}
          <Reveal>
            <figure className="border-y border-cocoa/20 py-10 md:py-12">
              <blockquote className="font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-medium italic leading-[1.25] text-ink">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 text-sm text-ink/60">
                <span aria-label="Rated 5 stars" className="tracking-[0.2em] text-caramel">
                  ★★★★★
                </span>
                {featured.source}
              </figcaption>
            </figure>
          </Reveal>

          {/* Supporting quotes — smaller, quieter, offset column */}
          <div className="flex flex-col gap-9 md:pt-10">
            {supporting.map((review, i) => (
              <Reveal key={review.quote} delay={0.09 + 0.07 * i}>
                <figure className={i % 2 === 1 ? "md:pl-8" : ""}>
                  <blockquote className="font-display text-lg font-medium leading-snug text-ink/85">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-2.5 flex items-center gap-2.5 text-xs text-ink/55">
                    <span aria-label="Rated 5 stars" className="tracking-[0.18em] text-caramel">
                      ★★★★★
                    </span>
                    {review.source}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
