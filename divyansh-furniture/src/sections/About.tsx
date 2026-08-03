import { about } from "@/data/site";
import { Corner, SectionHeading, Text } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";
import { FurnitureArt } from "@/components/ui/FurnitureArt";

export function About() {
  return (
    <section id="about" className="section-y relative" aria-labelledby="about-title">
      <div className="page grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="card relative aspect-[5/4] overflow-hidden">
            <div className="absolute inset-0 grid place-items-center p-12">
              <FurnitureArt kind="table" />
            </div>
            <Corner position="tl" className="m-4" />
            <Corner position="br" className="m-4" />
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <SectionHeading
              label={about.eyebrow}
              title={about.title}
              id="about-title"
            />
          </Reveal>

          <div className="mt-7 space-y-5 text-silk-dim">
            {about.body.map((paragraph, i) => (
              <Reveal key={i} as="p" delay={90 + i * 80}>
                {paragraph}
              </Reveal>
            ))}
          </div>

          {/* Facts, each of which needs a real answer before launch. They are
              shown marked rather than quietly dropped, so nothing about the
              business is asserted that has not been confirmed. */}
          <Reveal delay={280}>
            <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-hairline pt-8 sm:grid-cols-3">
              {about.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="label">{fact.label}</dt>
                  <dd className="mt-2 text-sm text-silk">
                    <Text value={fact.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
