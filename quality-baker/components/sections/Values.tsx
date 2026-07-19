import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * Reasons to choose the shop — verified facts only, set as an editorial
 * manifesto list with fine rules rather than another card grid.
 */
const values = [
  {
    title: "Designed before it's baked",
    body: "Custom cakes start as a sketch we agree on together. Reviewers call the results “fab”.",
  },
  {
    title: "Fresh for the day",
    body: "Pastries and slices are baked for the day they're sold, not the week.",
  },
  {
    title: "Eggless, happily",
    body: "Most of the menu is available eggless — just say so when you order.",
  },
  {
    title: "Open when you need us",
    body: `${site.hours}, ${site.hoursNote.toLowerCase()}. Collection from the shop in Bhestan.`,
  },
];

export function Values() {
  return (
    <section aria-label="Why choose us" className="bg-vanilla text-ink">
      <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-28">
        <Reveal>
          <h2 className="max-w-[16ch] font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.015em] text-cocoa">
            Small shop. High standards.
          </h2>
        </Reveal>
        <dl className="mt-14 grid gap-x-14 md:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={0.06 * i}>
              <div className="border-t border-cocoa/25 py-7">
                <dt className="font-display text-2xl font-medium text-cocoa">
                  {v.title}
                </dt>
                <dd className="mt-2.5 max-w-[46ch] leading-relaxed text-ink/75">
                  {v.body}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
