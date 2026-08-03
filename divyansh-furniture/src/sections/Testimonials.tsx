import { Quote } from "lucide-react";
import { business, isPlaceholder, testimonials } from "@/data/site";
import { Rating, SectionHeading, Text } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Testimonials.
 *
 * The quotes here are placeholders and are shown as placeholders. Writing
 * plausible-sounding reviews and attributing them to invented customers
 * would be fabricating evidence — and it would sit directly beneath a real
 * 4.9 rating, borrowing credibility the workshop actually earned. Paste real
 * reviews into `src/data/site.ts`, or empty the array and this section
 * removes itself.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  const anyReal = testimonials.some((t) => !isPlaceholder(t.quote));

  return (
    <section className="section-y relative" aria-labelledby="reviews-title">
      <div className="page">
        <Reveal>
          <SectionHeading
            label="Reviews"
            title="What customers say"
            id="reviews-title"
            align="center"
          />
        </Reveal>

        <Reveal delay={90}>
          <div className="mt-7 flex justify-center">
            <Rating
              value={business.rating}
              count={business.reviewCount}
              source={business.reviewSource}
            />
          </div>
        </Reveal>

        {!anyReal ? (
          <Reveal delay={140}>
            <p className="mx-auto mt-8 max-w-prose text-center text-sm text-silk-faint">
              The rating above is real. The three quotations below are
              placeholders — paste your own reviews into{" "}
              <code className="text-silk-dim">src/data/site.ts</code> to
              replace them.
            </p>
          </Reveal>
        ) : null}

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal as="li" key={i} delay={i * 90}>
              <figure className="card m-0 flex h-full flex-col p-7">
                <Quote
                  className="h-5 w-5 shrink-0 text-brass"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
                <blockquote className="mt-5 flex-1 text-base leading-relaxed text-silk">
                  <Text value={item.quote} />
                </blockquote>
                <figcaption className="mt-6 border-t border-hairline pt-5 text-sm">
                  <span className="block font-medium text-silk">
                    <Text value={item.name} />
                  </span>
                  <span className="mt-1 block text-silk-dim">
                    <Text value={item.detail} />
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
