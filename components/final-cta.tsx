import { Reveal } from "@/components/motion/reveal";
import { actionClasses } from "@/components/ui/action-link";
import { MapPinIcon, PhoneIcon } from "@/components/ui/icons";
import { outlet } from "@/data/outlet";
import { directionsHref, telHref } from "@/lib/links";

/** The one ink-coloured panel on the page. */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="veil">
      <div className="container-page py-24 md:py-32">
      <Reveal className="overflow-hidden rounded-[1.75rem] bg-ink px-6 py-14 text-center sm:px-12 md:py-20">
        <p className="text-xs font-semibold tracking-[0.18em] text-brass uppercase">
          {outlet.locationQualifier}
        </p>
        <h2 id="final-cta-heading" className="text-section mt-4 text-canvas">
          {outlet.copy.finalCtaHeading}
        </h2>
        <p className="mx-auto measure mt-4 text-lg text-canvas/80">
          {outlet.copy.finalCtaSupport}
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a href={telHref} className={actionClasses("onDark", "lg")}>
            <PhoneIcon />
            <span>{outlet.contact.phoneDisplay}</span>
          </a>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClasses("secondaryOnDark", "lg")}
          >
            <MapPinIcon />
            <span>{outlet.cta.directions}</span>
            <span className="sr-only"> (opens Google Maps)</span>
          </a>
        </div>

        <p className="mt-7 text-sm text-canvas/70">{outlet.hours.fallback}</p>
      </Reveal>
      </div>
    </section>
  );
}
