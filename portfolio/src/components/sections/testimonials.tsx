import { testimonials } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Testimonials.
 *
 * Renders nothing at all when there are none. An empty "what people say"
 * heading, or a placeholder quote from "Jane D., CEO", is worse than silence —
 * it is the one thing on a portfolio a reader will actively check.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-y relative">
      <div className="shell">
        <SectionHeading
          eyebrow="04 / words"
          title="What people I have worked with said"
          id="testimonials-heading"
        />

        <ul className="mt-14 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={`${t.name}-${i}`} delay={i * 80}>
              <figure className="liquid-glass m-0 h-full p-7">
                <blockquote className="text-base leading-relaxed text-ink">
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-5 text-sm">
                  <span className="font-medium text-ink">{t.name}</span>
                  <span className="mt-0.5 block text-ink-soft">{t.title}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
