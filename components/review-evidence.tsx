import { RatingStars } from "@/components/motion/rating-stars";
import { Reveal } from "@/components/motion/reveal";
import { outlet } from "@/data/outlet";
import { directionsHref } from "@/lib/links";

/**
 * Rating evidence, not testimonials.
 *
 * No exact, attributable, reuse-approved customer quotes exist for this
 * outlet, so nothing here is presented as a quotation and no person is
 * named. The lists below are neutral summaries of recurring themes in
 * public feedback — positive and critical are given equal prominence — and
 * no review count is displayed, because indexed counts conflict.
 */
const positiveThemes = [
  "Vagharela khaman",
  "Locho",
  "Sev khamani",
  "Cheese idada",
  "Samosas",
  "Affordability",
  "Breakfast",
];

const operationalNotes = [
  "Parking near the shop can be difficult",
  "Takeaway and service are occasionally reported as inconsistent",
];

export function ReviewEvidence() {
  return (
    <section aria-labelledby="reviews-heading" className="border-y border-border bg-surface-subtle/50">
      <div className="container-page py-20 md:py-28">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-copper uppercase">
                Public feedback
              </p>
              <h2 id="reviews-heading" className="text-section text-ink">
                What visitors often mention
              </h2>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <RatingStars />
                <p className="text-2xl font-semibold text-ink">
                  {outlet.rating.value}
                  <span className="text-base font-normal text-muted"> / {outlet.rating.best}</span>
                </p>
              </div>

              <p className="mt-3 text-sm text-muted">
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center font-semibold text-ink underline decoration-border-strong underline-offset-4 hover:text-brand"
                >
                  {outlet.rating.source} rating — last checked {outlet.rating.lastChecked}
                  <span className="sr-only"> (opens the Google Maps listing)</span>
                </a>
              </p>
              <p className="measure mt-4 text-sm text-muted">
                Ratings can change. This figure is a snapshot taken on the date above, not a live
                value, and no review count is shown because published counts disagree.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-border bg-canvas p-6">
                  <h3 className="font-display text-lg text-ink">Dishes people name most</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {positiveThemes.map((theme) => (
                      <li
                        key={theme}
                        className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-ink"
                      >
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.25rem] border border-border bg-canvas p-6">
                  <h3 className="font-display text-lg text-ink">Practical things people raise</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {operationalNotes.map((note) => (
                      <li key={note} className="flex gap-3 text-sm text-ink">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-copper" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-5 text-sm text-muted">
                These are summaries of recurring themes in public reviews, paraphrased rather than
                quoted. No individual reviewer is identified or represented here.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
