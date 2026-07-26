import { isPlaceholder, skillGroups } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

/**
 * Skills, grouped by what they let me do rather than by vendor.
 *
 * Deliberately not an animated logo marquee: a moving strip of brand marks is
 * hard to read, impossible to tab through sensibly, and says nothing about
 * depth. A grouped list is scannable, keyboard-neutral, and honest about the
 * fact that these are tools, not achievements.
 *
 * There are no proficiency bars. A bar claims a precision nobody can measure,
 * and "React — 87%" is a number with no method behind it.
 */
export function Skills() {
  const groups = skillGroups.filter((g) => g.items.length > 0);
  if (groups.length === 0) return null;

  return (
    <section id="skills" className="section-y relative">
      <div className="shell">
        <SectionHeading
          eyebrow="03 / toolkit"
          title="What I work with"
          lede="Grouped by the job it does. No percentages — proficiency bars measure nothing."
          id="skills-heading"
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group, gi) => (
            <Reveal
              key={group.title}
              delay={gi * 80}
              className="bg-background p-6 lg:p-7"
            >
              <h3 className="eyebrow !text-ink">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item, i) => (
                  <li
                    key={`${item}-${i}`}
                    className="flex items-baseline gap-2.5 text-sm text-ink-soft"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                    <span
                      {...(isPlaceholder(item)
                        ? { "data-placeholder": "true" }
                        : {})}
                      className={cn(
                        isPlaceholder(item) &&
                          "rounded-sm border border-dashed border-accent/45 bg-accent-soft/40 px-1.5"
                      )}
                    >
                      {item}
                      {isPlaceholder(item) ? (
                        <span className="sr-only">
                          {" "}
                          (placeholder — content not yet supplied)
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
