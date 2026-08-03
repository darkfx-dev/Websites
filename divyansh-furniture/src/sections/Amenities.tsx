import { amenities } from "@/data/site";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Why us.
 *
 * A numbered list, because the numbering is the only structure this content
 * has — it is not a sequence, so the numerals are set quietly in brass as
 * index marks rather than dressed up as steps.
 */
export function Amenities() {
  return (
    <section className="section-y relative" aria-labelledby="why-title">
      <div className="page">
        <Reveal>
          <SectionHeading
            label="Why us"
            title="The things that actually change the result"
            id="why-title"
          />
        </Reveal>

        <ul className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 70}>
              <div className="flex gap-5 border-t border-hairline pt-6">
                <span
                  aria-hidden="true"
                  className="figures shrink-0 text-label text-brass"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-medium tracking-tight text-silk">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-silk-dim">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
