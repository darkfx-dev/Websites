import { reviews } from "@/data/reviews";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * Social proof. The aggregate rating is owner-confirmed; individual quotes
 * are only shown if real ones have been added to data/reviews.ts (empty by
 * default). We never attribute borrowed or invented quotes to the shop — if
 * there are none, we simply point people to the real Google reviews.
 */
const featured = reviews[0];
const supporting = reviews.slice(1);

export function Reviews() {
  return (
    <section aria-label="Customer reviews" className="bg-cream text-ink">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.06] tracking-[-0.015em]">
            Loved locally
          </h2>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3 text-lg text-ink/70">
            <span>
              <span className="font-semibold text-caramel">{site.rating}★</span>{" "}
              across {site.reviewCount} Google reviews.
            </span>
            <a
              href={site.mapsHref}
              target="_blank"
              rel="noopener"
              aria-label="Read Modi Bakers reviews on Google"
              className="text-cocoa underline decoration-caramel/50 underline-offset-4 transition-colors duration-150 hover:text-caramel"
            >
              Read our reviews on Google
            </a>
          </p>
        </Reveal>

        {featured && (
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
        )}
      </div>
    </section>
  );
}
