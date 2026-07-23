import * as React from "react";
import { Star, ExternalLink } from "lucide-react";
import { business } from "@/data/business";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion-primitives";

// Render five stars, filling proportionally to the rating (out of 5).
function StarRow({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block h-6 w-6">
            <Star className="absolute inset-0 h-6 w-6 text-white/25" aria-hidden="true" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
              aria-hidden="true"
            >
              <Star className="h-6 w-6 fill-saffron text-saffron" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function ReputationSection() {
  return (
    <section
      aria-labelledby="reputation-heading"
      className="grain relative isolate overflow-hidden bg-charcoal text-cream"
    >
      <div className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <Reveal>
            <SectionHeading
              tone="light"
              eyebrow="Loved locally"
              title={
                <span id="reputation-heading">
                  Rated 4.6 by Surat diners
                </span>
              }
              description="A genuine snapshot of Mahesh Pav Bhaji's Google reputation. We don't publish invented reviews — see the real ratings on Google Maps."
            />
            <div className="mt-8">
              <Button href={business.googleMaps} external variant="primary">
                View on Google Maps
                <ExternalLink className="h-[18px] w-[18px]" aria-hidden="true" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-feature border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="flex items-end gap-4">
                <span className="font-display text-6xl font-semibold leading-none text-cream">
                  {business.rating}
                </span>
                <div className="pb-1">
                  <StarRow rating={business.rating} />
                  <p className="mt-1 text-sm text-cream/70">
                    Average Google rating
                  </p>
                </div>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-card border border-white/10 bg-charcoal/40 p-4">
                  <dt className="text-xs uppercase tracking-wide text-cream/60">
                    Total reviews
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-cream">
                    {business.reviewCount.toLocaleString("en-IN")}
                  </dd>
                </div>
                <div className="rounded-card border border-white/10 bg-charcoal/40 p-4">
                  <dt className="text-xs uppercase tracking-wide text-cream/60">
                    Five-star reviews
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-cream">
                    {business.fiveStarReviews.toLocaleString("en-IN")}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 text-xs text-cream/55">
                Figures last verified on {business.lastVerifiedDisplay} and may
                change.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
