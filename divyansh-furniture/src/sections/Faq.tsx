import { Plus } from "lucide-react";
import { faqs } from "@/data/site";
import { Marked, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";

/**
 * FAQ.
 *
 * Native `<details>` / `<summary>`: keyboard-operable, screen-reader
 * announced and open-by-default-when-printed without a line of JavaScript.
 * A hand-rolled accordion here would be more code doing the same job worse.
 *
 * Several answers are still marked placeholders. A lead time or a warranty
 * invented to fill a gap is exactly the kind of claim a customer will hold
 * the business to.
 */
export function Faq() {
  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="section-y relative" aria-labelledby="faq-title">
      <div className="page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <SectionHeading
            label="FAQ"
            title="Questions we get asked"
            lede="If yours is not here, message us — it is usually a one-line answer."
            id="faq-title"
          />
        </Reveal>

        <Reveal delay={110}>
          <ul className="border-t border-hairline">
            {faqs.map((item) => (
              <li key={item.q} className="border-b border-hairline">
                <details className="group">
                  <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-medium text-silk transition-colors duration-200 hover:text-brass [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <Plus
                      className="h-4 w-4 shrink-0 text-brass transition-transform duration-300 ease-soft group-open:rotate-45"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="pb-6 pr-10 text-sm leading-relaxed text-silk-dim">
                    <p>
                      <Marked value={item.a} />
                    </p>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
