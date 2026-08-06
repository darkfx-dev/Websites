import { Reveal } from "@/components/motion/reveal";
import { outlet } from "@/data/outlet";

/**
 * Four plain facts about this outlet. Deliberately not a "features" section:
 * nothing here is a benefit claim, a superlative, or a service promise.
 */
const facts = [
  { label: "Outlet", value: outlet.locationQualifier },
  { label: "Where", value: outlet.address.shortCue },
  { label: "Hours", value: outlet.hours.fallback },
  { label: "Kitchen", value: outlet.businessType },
];

export function QuickFacts() {
  return (
    <section aria-label="Outlet at a glance" className="veil">
      <div className="container-page py-16">
        <Reveal className="rounded-2xl border border-border bg-surface p-2 shadow-card">
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-[1.15rem] bg-border sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-canvas px-5 py-5">
              <dt className="text-[0.6875rem] font-semibold tracking-[0.16em] text-copper uppercase">
                {fact.label}
              </dt>
              <dd className="mt-2 text-[0.9375rem] leading-snug text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
        </Reveal>
      </div>
    </section>
  );
}
