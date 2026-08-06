import { Reveal } from "@/components/motion/reveal";
import { outlet } from "@/data/outlet";

/**
 * Approved about copy only.
 *
 * No founder story, no year of founding, no owner name, no sourcing or
 * recipe claims, no authenticity or longevity language — none of that is
 * verified for this outlet.
 */
export function AboutOutlet() {
  return (
    <section id="about" className="veil scroll-mt-28">
      <div className="container-page py-24 md:py-32">
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-copper uppercase">
              About this outlet
            </p>
            <h2 className="text-section text-ink">
              One shop on Adajan Road, opposite Sevadarshan Hospital.
            </h2>
            <p className="measure mt-6 text-lg text-secondary">{outlet.copy.about}</p>
            <p className="measure mt-4 text-secondary">
              This website covers that address only. Other businesses trade under the same name
              elsewhere; their menus, numbers and timings are not represented here.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div
              data-surface
              className="lattice h-full rounded-[1.5rem] border border-border bg-surface/70 p-7 shadow-card sm:p-9"
            >
              <p lang="gu" className="font-gujarati text-2xl leading-tight text-ink">
                {outlet.gujaratiName}
              </p>
              <p className="mt-1 font-display text-lg text-ink">{outlet.displayName}</p>
              <dl className="mt-7 flex flex-col gap-5 text-sm">
                <div>
                  <dt className="text-[0.6875rem] font-semibold tracking-[0.16em] text-copper uppercase">
                    Kitchen
                  </dt>
                  <dd className="mt-1.5 text-ink">{outlet.businessType}</dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] font-semibold tracking-[0.16em] text-copper uppercase">
                    Address
                  </dt>
                  <dd className="mt-1.5 text-ink">{outlet.address.display}</dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] font-semibold tracking-[0.16em] text-copper uppercase">
                    Hours
                  </dt>
                  <dd className="mt-1.5 text-ink">{outlet.hours.fallback}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Reveal>
      </div>
    </section>
  );
}
