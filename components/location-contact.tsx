import { CopyAddress } from "@/components/copy-address";
import { Reveal } from "@/components/motion/reveal";
import { ActionLink } from "@/components/ui/action-link";
import { MapPinIcon, PhoneIcon } from "@/components/ui/icons";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { featureFlags, outlet } from "@/data/outlet";
import { directionsHref, telHref, whatsappHref } from "@/lib/links";

/**
 * Location and contact.
 *
 * `ENABLE_MAP_EMBED` is false: a third-party map iframe would add tracking,
 * a cookie question and a large amount of script for a link that already
 * works. The illustration below is abstract and decorative — it is not a map
 * and does not imply routing geometry. The real destination is always the
 * Place-ID URL.
 */
export function LocationContact() {
  return (
    <section id="location" className="scroll-mt-24 border-t border-border bg-surface-subtle/50">
      <div className="container-page py-20 md:py-28">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-copper uppercase">
                Find the outlet
              </p>
              <h2 className="text-section text-ink">{outlet.locationQualifier}</h2>

              <address className="measure mt-6 text-lg not-italic text-ink">
                {outlet.address.display}
              </address>

              <p className="mt-4 text-muted">{outlet.hours.fallback}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <WhatsAppLink href={whatsappHref()} size="lg">
                  {outlet.cta.whatsapp}
                </WhatsAppLink>
                <ActionLink href={telHref} variant="secondary" size="lg" icon={<PhoneIcon />}>
                  {outlet.contact.phoneDisplay}
                </ActionLink>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ActionLink
                  href={directionsHref}
                  variant="secondary"
                  external
                  externalLabel="(opens Google Maps)"
                  icon={<MapPinIcon />}
                >
                  Open in Google Maps
                </ActionLink>
                <CopyAddress address={outlet.address.display} />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-[1.5rem] border border-border bg-canvas shadow-card">
                {featureFlags.ENABLE_MAP_EMBED ? null : (
                  <div className="lattice relative aspect-[4/3] w-full bg-surface">
                    <svg
                      viewBox="0 0 400 300"
                      className="absolute inset-0 h-full w-full"
                      aria-hidden="true"
                      focusable="false"
                    >
                      {/* Abstract streets. Not a survey; purely decorative. */}
                      <path
                        d="M-10 210 L410 150"
                        stroke="var(--color-border)"
                        strokeWidth="26"
                        fill="none"
                      />
                      <path
                        d="M150 -10 L205 310"
                        stroke="var(--color-border)"
                        strokeWidth="16"
                        fill="none"
                      />
                      <path
                        d="M-10 210 L410 150"
                        stroke="var(--color-surface)"
                        strokeWidth="2"
                        strokeDasharray="10 12"
                        fill="none"
                      />
                      <circle cx="196" cy="176" r="34" fill="var(--color-accent)" opacity="0.25" />
                      <g transform="translate(184,152)">
                        <path
                          d="M12 27S22 17.6 22 11a10 10 0 1 0-20 0c0 6.6 10 16 10 16Z"
                          fill="var(--color-brand)"
                        />
                        <circle cx="12" cy="11" r="3.6" fill="var(--color-canvas)" />
                      </g>
                    </svg>
                  </div>
                )}

                <div className="border-t border-border p-6">
                  <p className="text-sm text-muted">
                    The illustration above is decorative. Use the link below for real directions —
                    it opens this exact shop by its Google Place ID, not another outlet with the
                    same name.
                  </p>
                  <p className="mt-4">
                    <a
                      href={directionsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center font-semibold text-ink underline decoration-border-strong underline-offset-4 hover:text-brand hover:decoration-brand"
                    >
                      Open in Google Maps
                      <span className="sr-only"> (opens Google Maps)</span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
