import { Reveal } from "@/components/motion/reveal";

/**
 * Public-feedback summary — deliberately not a testimonial section, and no
 * longer a rating display.
 *
 * The numeric rating and review count were removed: the newer briefs list
 * ratings among the facts that must not be published until verified, and the
 * indexed counts disagree with one another. What remains is a neutral summary
 * of recurring themes, with the operational criticisms given the same
 * prominence as the praise. Nothing is presented as a quotation and no
 * reviewer is identified.
 */
const positiveThemes = [
  "Locho",
  "Butter locho",
  "Cheese-butter locho",
  "Khaman",
  "Idada",
  "Khamni",
  "Samosas",
  "Affordability",
  "Breakfast",
];

const operationalNotes = [
  "Some older reviews report inconsistency with takeaway orders",
  "Some older reviews report inconsistency with certain cheese dishes",
];

export function ReviewEvidence() {
  return (
    <section aria-labelledby="reviews-heading" className="veil-strong border-y border-border">
      <div className="container-page py-24 md:py-32">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-terracotta uppercase">
                Public feedback
              </p>
              <h2 id="reviews-heading" className="text-section">
                What visitors often mention
              </h2>
              <p className="measure mt-5 text-secondary">
                A neutral summary of themes that recur in public reviews. These are paraphrased,
                not quoted, and no individual reviewer is identified or represented here.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface p-6">
                  <h3 className="text-sub font-display">Dishes people name most</h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {positiveThemes.map((theme) => (
                      <li
                        key={theme}
                        className="rounded-full border border-border bg-canvas px-3 py-1.5 text-sm text-ink"
                      >
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-surface p-6">
                  <h3 className="text-sub font-display">Practical things people raise</h3>
                  <ul className="mt-5 flex flex-col gap-3">
                    {operationalNotes.map((note) => (
                      <li key={note} className="flex gap-3 text-sm text-ink">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-terracotta"
                        />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
