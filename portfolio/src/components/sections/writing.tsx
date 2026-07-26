import { ArrowUpRight } from "lucide-react";
import { site, writing } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { SafeLink } from "@/components/ui/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatDate } from "@/lib/utils";

/**
 * Writing.
 *
 * Only real, published posts, and only when there are some. A "Coming soon"
 * blog is a promise the page cannot keep; the nav drops the Notes link in the
 * same condition, so there is never a link to a section that isn't here.
 */
export function Writing() {
  if (writing.length === 0) return null;

  return (
    <section id="notes" className="section-y relative">
      <div className="shell">
        <SectionHeading
          eyebrow="05 / notes"
          title="Things I have written down"
          id="notes-heading"
        />

        <ul className="mt-14 divide-y divide-line border-y border-line">
          {writing.map((entry, i) => (
            <Reveal as="li" key={entry.url || entry.title} delay={i * 60}>
              <SafeLink
                href={entry.url}
                className="group flex flex-col gap-2 py-7 transition-colors sm:flex-row sm:items-baseline sm:gap-8"
              >
                <time
                  dateTime={entry.date}
                  className="mono shrink-0 text-xs text-ink-faint sm:w-28"
                >
                  {formatDate(entry.date, site.locale)}
                </time>
                <span className="flex-1">
                  <span className="flex items-start gap-2 text-base font-medium text-ink group-hover:text-accent">
                    {entry.title}
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1.5 block text-sm text-ink-soft">
                    {entry.summary}
                  </span>
                </span>
              </SafeLink>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
