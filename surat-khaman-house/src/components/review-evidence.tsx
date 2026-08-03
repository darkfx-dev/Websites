import { Reveal } from "@/components/motion/reveal";
import { business, reviewThemes } from "@/data/business";

/**
 * A 0–5 rating axis with a single marker at the observed value.
 *
 * This replaces a star icon so the one real number this section has —
 * 4.4 — reads as measured data rather than as a five-star cliché standing
 * in for a review count the site is not allowed to publish. Purely
 * decorative: the number and "Google rating" label beside it already carry
 * the information in text, so the graphic is `aria-hidden`.
 */
function RatingAxis({ value }: { value: number }) {
  const axisStart = 6;
  const axisEnd = 254;
  const axisWidth = axisEnd - axisStart;
  const ticks = [0, 1, 2, 3, 4, 5];
  const markerX = axisStart + (value / 5) * axisWidth;

  return (
    <svg
      viewBox="0 0 260 28"
      className="h-7 w-full max-w-[260px]"
      aria-hidden
      role="presentation"
      focusable="false"
    >
      <line
        x1={axisStart}
        y1={14}
        x2={axisEnd}
        y2={14}
        stroke="#0a0a0a"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      {ticks.map((tick) => {
        const x = axisStart + (tick / 5) * axisWidth;
        return (
          <line
            key={tick}
            x1={x}
            y1={9}
            x2={x}
            y2={19}
            stroke="#0a0a0a"
            strokeOpacity={tick === 0 || tick === 5 ? 0.45 : 0.2}
            strokeWidth="1"
          />
        );
      })}
      <circle cx={markerX} cy={14} r="5.5" fill="#2d6245" />
      <circle
        cx={markerX}
        cy={14}
        r="5.5"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Aggregated public sentiment, presented as themes rather than testimonials.
 *
 * There are deliberately no customer names, no quotation marks and no
 * carousel: no review has been permissioned for republication, so presenting
 * paraphrased themes as if they were quotes would be inventing evidence.
 *
 * The themes are set as a plain hairline list rather than pill chips: pills
 * are already this site's language for an interactive filter (the menu's
 * category buttons), and reusing that shape for a non-interactive list
 * would read as clickable when nothing here can be clicked.
 *
 * No Maps link appears here — that belongs only to the final section.
 */
export function ReviewEvidence() {
  const ratingValue = Number(business.rating.value);

  return (
    <section
      id="reviews"
      className="section-y border-b border-[rgba(10,10,10,0.12)] bg-surface-muted"
    >
      <Reveal className="container-page">
        <p className="section-index text-xs font-semibold uppercase text-muted">
          02 — Reviews
        </p>

        <div className="mt-3 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="max-w-[14ch] font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.01em] text-ink">
              What visitors often mention
            </h2>

            <p className="tabular mt-10 font-display text-[clamp(3.5rem,7vw,5.5rem)] leading-none text-ink">
              {business.rating.value}
            </p>
            <div className="mt-4">
              <RatingAxis value={ratingValue} />
            </div>
            <p className="mt-4 text-sm text-ink-soft">
              Google rating
              <span className="text-muted"> — last checked 3 August 2026</span>
            </p>
          </div>

          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              Frequently mentioned
            </p>
            <ul className="mt-4 grid gap-x-10 border-t border-[rgba(10,10,10,0.12)] sm:grid-cols-2">
              {reviewThemes.map((theme) => (
                <li
                  key={theme}
                  className="flex items-center gap-3 border-b border-[rgba(10,10,10,0.12)] py-4 text-base text-ink"
                >
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-chutney" />
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
