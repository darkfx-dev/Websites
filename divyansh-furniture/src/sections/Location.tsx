import { Clock, MapPin, Phone } from "lucide-react";
import { business, isPlaceholder, real } from "@/data/site";
import { BookButton } from "@/components/ui/BookButton";
import { Corner, SectionHeading, Text } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";
import { FurnitureArt } from "@/components/ui/FurnitureArt";
import { messages } from "@/lib/whatsapp";

/**
 * Visit us.
 *
 * The address, hours and phone number are rendered as real links only when
 * they are real values. A `tel:` link built from "[Phone number]" would dial
 * nothing and look like a fault in the phone rather than a gap in the site.
 */
export function Location() {
  const phone = real(business.phone);
  const maps = real(business.address.mapsUrl);

  return (
    <section id="visit" className="section-y relative" aria-labelledby="visit-title">
      <div className="page grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <SectionHeading
              label="Visit"
              title="Come and see the wood"
              lede="Finishes look different in daylight than on a screen. Come to the showroom, hold the samples, and we will talk through your room."
              id="visit-title"
            />
          </Reveal>

          <Reveal delay={120}>
            <dl className="mt-10 space-y-7 border-t border-hairline pt-8">
              <div className="flex gap-4">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-brass"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div>
                  <dt className="label">Showroom</dt>
                  <dd className="mt-2 space-y-1 text-sm text-silk-dim">
                    <p>
                      <Text value={business.address.line1} />
                    </p>
                    <p>
                      <Text value={business.address.line2} />
                    </p>
                    <p>
                      <Text value={business.address.postalCode} />
                    </p>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock
                  className="mt-0.5 h-5 w-5 shrink-0 text-brass"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div>
                  <dt className="label">Hours</dt>
                  <dd className="mt-2 text-sm text-silk-dim">
                    <Text value={business.hours} />
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone
                  className="mt-0.5 h-5 w-5 shrink-0 text-brass"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div>
                  <dt className="label">Phone</dt>
                  <dd className="mt-2 text-sm">
                    {phone ? (
                      <a
                        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                        className="text-silk-dim underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-silk hover:decoration-brass"
                      >
                        {phone}
                      </a>
                    ) : (
                      <Text value={business.phone} />
                    )}
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-9 flex flex-wrap gap-3">
              <BookButton
                message={messages.consultation("visiting the showroom")}
                variant="primary"
              >
                Book a visit
              </BookButton>
              {maps ? (
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Open in Maps
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <span className="btn" aria-disabled="true">
                  Open in Maps
                  <span className="sr-only">
                    {" "}
                    — unavailable until a Google Maps link is added to the site
                    configuration
                  </span>
                </span>
              )}
            </div>
          </Reveal>
        </div>

        {/* A map embed would need a paid key and would load a third-party
            frame onto every visit. Until a real map link exists this is a
            drawn placeholder rather than an empty grey rectangle. */}
        <Reveal delay={160}>
          <div className="card relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 grid place-items-center p-12">
              <FurnitureArt kind="wardrobe" />
            </div>
            <Corner position="tl" className="m-4" />
            <Corner position="br" className="m-4" />
            {isPlaceholder(business.address.mapsUrl) ? (
              <p className="absolute inset-x-0 bottom-0 border-t border-hairline bg-walnut-raised/90 px-5 py-3 text-center text-label text-silk-faint">
                Add a Maps link in site.ts to show the showroom here
              </p>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
