import { Reveal } from "@/components/motion/reveal";
import { actionClasses } from "@/components/ui/action-link";
import { PhoneIcon } from "@/components/ui/icons";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { outlet } from "@/data/outlet";
import { telHref, whatsappHref } from "@/lib/links";

/**
 * The one ink-coloured panel on the page. Gold reaches 11.4:1 against this
 * background, which is the only place it is legible enough to carry text.
 */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="container-page pb-20 md:pb-28">
      <Reveal className="overflow-hidden rounded-[1.75rem] bg-ink px-6 py-14 text-center sm:px-12 md:py-20">
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
          {outlet.locationQualifier}
        </p>
        <h2 id="final-cta-heading" className="text-section mt-4 text-canvas">
          {outlet.copy.finalCtaHeading}
        </h2>
        <p className="mx-auto measure mt-4 text-lg text-canvas/80">
          {outlet.copy.finalCtaSupport}
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <WhatsAppLink href={whatsappHref()} size="lg">
            {outlet.cta.whatsapp}
          </WhatsAppLink>
          <a
            href={telHref}
            className={actionClasses("secondaryOnDark", "lg")}
          >
            <PhoneIcon />
            <span>{outlet.contact.phoneDisplay}</span>
          </a>
        </div>

        <p className="mt-7 text-sm text-canvas/70">{outlet.hours.fallback}</p>
      </Reveal>
    </section>
  );
}
