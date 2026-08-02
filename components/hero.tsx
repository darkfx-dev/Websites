import { ActionLink } from "@/components/ui/action-link";
import { MapPinIcon, PhoneIcon } from "@/components/ui/icons";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { menuCategories } from "@/data/menu";
import { outlet } from "@/data/outlet";
import { directionsHref, telHref, whatsappHref } from "@/lib/links";

const [emphasisLead, emphasisTail] = outlet.copy.heroHeadline.split(
  outlet.copy.heroHeadlineEmphasis,
);

/**
 * 001 — editorial hero entrance and 007 — underline, both CSS-owned.
 *
 * The hero carries the LCP element, so every word is present and opaque in
 * the served HTML; the entrance lives inside a `prefers-reduced-motion:
 * no-preference` block, and the CTAs are operable from the first paint.
 *
 * No photography: none of this outlet's imagery is rights-cleared, so the
 * composition is deliberately typographic rather than showing a placeholder
 * or unrelated stock food.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="container-page grid gap-12 pt-12 pb-16 md:pt-16 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-24">
        <div className="lg:col-span-7">
          <p
            data-hero-item
            className="text-xs font-semibold tracking-[0.18em] text-copper uppercase"
          >
            {outlet.businessType} · Adajan
          </p>

          <h1 data-hero-headline className="text-hero mt-5 text-ink">
            {emphasisLead}
            <span className="relative inline-block whitespace-nowrap">
              {outlet.copy.heroHeadlineEmphasis}
              <span
                data-underline
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 h-[0.12em] w-full rounded-full bg-accent"
              />
            </span>
            {emphasisTail}
          </h1>

          <p
            data-hero-item
            style={{ "--hero-delay": "140ms" } as React.CSSProperties}
            className="measure mt-6 text-lg text-muted"
          >
            {outlet.copy.heroSupport}
          </p>

          <div
            data-hero-item
            style={{ "--hero-delay": "210ms" } as React.CSSProperties}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <WhatsAppLink href={whatsappHref()} size="lg">
              {outlet.cta.whatsapp}
            </WhatsAppLink>
            <ActionLink href={telHref} variant="secondary" size="lg" icon={<PhoneIcon />}>
              {outlet.cta.call}
            </ActionLink>
          </div>

          <div
            data-hero-item
            style={{ "--hero-delay": "280ms" } as React.CSSProperties}
            className="mt-7 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6"
          >
            <a
              href={outlet.map.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-ink underline decoration-border-strong underline-offset-4 hover:text-brand hover:decoration-brand"
            >
              <MapPinIcon />
              {outlet.cta.directions}
              <span className="sr-only"> (opens Google Maps)</span>
            </a>
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center text-muted underline decoration-border underline-offset-4 hover:text-ink"
            >
              {outlet.rating.value} {outlet.rating.source} rating — last checked{" "}
              {outlet.rating.lastChecked}
            </a>
          </div>
        </div>

        {/* Typographic art direction, standing in for photography that does
            not exist yet. Decorative, and never more dominant than the H1. */}
        <div className="lg:col-span-5">
          <div
            data-surface
            className="lattice relative h-full overflow-hidden rounded-[1.5rem] border border-border bg-surface/70 p-7 shadow-card sm:p-9"
          >
            <p lang="gu" className="font-gujarati text-2xl leading-tight text-ink sm:text-3xl">
              {outlet.gujaratiName}
            </p>
            <p className="mt-2 font-display text-lg text-copper">{outlet.copy.tagline}</p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {menuCategories.map((category) => (
                <li
                  key={category.id}
                  className="rounded-full border border-border bg-canvas px-3 py-1.5 text-[0.8125rem] text-ink"
                >
                  {category.label}
                </li>
              ))}
            </ul>

            <p className="mt-7 border-t border-border pt-5 text-sm text-muted">
              {outlet.hours.fallback}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
