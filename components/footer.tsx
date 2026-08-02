import { MapPinIcon, MessageIcon, PhoneIcon } from "@/components/ui/icons";
import { outlet } from "@/data/outlet";
import { anchors, directionsHref, telHref, whatsappHref } from "@/lib/links";

/**
 * Footer.
 *
 * No email address, social profile, owner name, delivery platform, payment
 * method or opening time appears here: none of it is verified for this
 * outlet. There is no newsletter form, because there is no backend to
 * receive one.
 *
 * The year is resolved at build time; a rebuild refreshes it.
 */
const buildYear = new Date().getFullYear();

const sections = [
  { href: anchors.menu, label: "Menu" },
  { href: anchors.about, label: "About" },
  { href: anchors.location, label: "Location" },
  { href: anchors.faq, label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-subtle/60">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="font-display text-xl text-ink">{outlet.displayName}</p>
            <p lang="gu" className="font-gujarati mt-1 text-lg text-muted">
              {outlet.gujaratiName}
            </p>
            <address className="mt-4 max-w-sm text-sm not-italic text-muted">
              {outlet.address.display}
            </address>
            <p className="mt-4 text-sm text-ink">{outlet.hours.fallback}</p>
          </div>

          <div className="md:col-span-4">
            <h2 className="text-[0.6875rem] font-semibold tracking-[0.16em] text-copper uppercase">
              Reach the outlet
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              <li>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2.5 text-ink no-underline hover:text-brand"
                >
                  <MessageIcon />
                  {outlet.cta.whatsapp}
                  <span className="sr-only"> (opens WhatsApp)</span>
                </a>
              </li>
              <li>
                <a
                  href={telHref}
                  className="inline-flex min-h-[44px] items-center gap-2.5 text-ink no-underline hover:text-brand"
                >
                  <PhoneIcon />
                  {outlet.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2.5 text-ink no-underline hover:text-brand"
                >
                  <MapPinIcon />
                  Open in Google Maps
                  <span className="sr-only"> (opens Google Maps)</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-[0.6875rem] font-semibold tracking-[0.16em] text-copper uppercase">
              On this page
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {sections.map((entry) => (
                <li key={entry.href}>
                  <a
                    href={entry.href}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center text-ink no-underline hover:text-brand"
                  >
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="measure text-sm text-muted">
            Menu availability and prices change. Please confirm both with the outlet on WhatsApp or
            by phone before travelling or ordering. Opening and closing times are not published here
            because reported timings differ and none has been confirmed by the owner.
          </p>
          <p className="mt-6 text-sm text-muted">
            © {buildYear} {outlet.name}, {outlet.locationQualifier}.
          </p>
        </div>
      </div>
    </footer>
  );
}
