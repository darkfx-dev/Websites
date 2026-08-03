import { Star } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { business, reviewThemes } from "@/data/business";

/**
 * Aggregated public sentiment, presented as themes rather than testimonials.
 *
 * There are deliberately no customer names, no quotation marks and no
 * carousel: no review has been permissioned for republication, so presenting
 * paraphrased themes as if they were quotes would be inventing evidence.
 *
 * No Maps link appears here — that belongs only to the final section.
 */
export function ReviewEvidence() {
  return (
    <section
      id="reviews"
      className="section-y border-b border-[rgba(10,10,10,0.12)] bg-surface-muted"
    >
      <Reveal className="container-page">
        <p className="section-index text-xs font-semibold uppercase text-muted">
          02 — Reviews
        </p>

        <div className="mt-3 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="max-w-[14ch] font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.01em] text-ink">
              What visitors often mention
            </h2>

            <p className="mt-6 inline-flex items-center gap-2 text-lg text-ink">
              <Star className="h-5 w-5 fill-khaman text-khaman" aria-hidden />
              <span className="tabular font-semibold">
                {business.rating.value}
              </span>
              <span className="text-ink-soft">Google rating</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Last checked 3 August 2026
            </p>
          </div>

          <div className="lg:col-span-7">
            <ul className="flex flex-wrap gap-2">
              {reviewThemes.map((theme) => (
                <li
                  key={theme}
                  className="rounded-full border border-[rgba(10,10,10,0.16)] bg-surface px-4 py-2 text-sm text-ink"
                >
                  {theme}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
