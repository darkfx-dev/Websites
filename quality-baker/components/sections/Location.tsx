import { GlowButton } from "@/components/GlowButton";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * Address, hours, and the two actions that matter: call and directions.
 * The map is a styled card linking out to Google Maps — no third-party
 * iframe cost on first load, which matters more than an embedded pan/zoom.
 */
export function Location() {
  return (
    <section id="visit" className="bg-cream text-ink">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 sm:px-8 md:grid-cols-[1.1fr_1fr] md:items-center md:py-32">
        <Reveal>
          <div>
            <p className="font-display text-lg italic text-terracotta">
              Come say hello
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.06] tracking-[-0.015em]">
              Find us in Bhestan
            </h2>

            <address className="mt-7 max-w-[40ch] text-lg not-italic leading-relaxed text-ink/75">
              {site.address}
            </address>

            <dl className="mt-8 space-y-3 text-lg">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <dt className="font-semibold">Hours</dt>
                <dd className="text-ink/75">
                  {site.hours} · {site.hoursNote}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <dt className="font-semibold">Phone</dt>
                <dd>
                  <a
                    href={site.phoneHref}
                    className="text-terracotta underline decoration-caramel/50 underline-offset-4 transition-colors duration-150 hover:text-caramel"
                  >
                    {site.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>

            <p className="mt-6 max-w-[44ch] leading-relaxed text-ink/70">
              Pastries are same-day, always. Custom cakes need a little
              notice — a phone call today is a cake tomorrow.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <GlowButton href={site.phoneHref}>Call the shop</GlowButton>
              <GlowButton href={site.mapsHref} variant="dark" target="_blank" rel="noopener">
                Get directions
              </GlowButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={site.mapsHref}
            target="_blank"
            rel="noopener"
            aria-label="Open The Quality Baker in Google Maps"
            className="frame block overflow-hidden rounded-2xl border border-terracotta/20 bg-espresso"
          >
            {/* Stylised neighbourhood sketch, not a live map */}
            <svg
              viewBox="0 0 400 300"
              aria-hidden="true"
              className="w-full"
              fill="none"
              strokeLinecap="round"
            >
              <g stroke="rgb(212 160 84 / 0.28)" strokeWidth="10">
                <path d="M-10 80h420" />
                <path d="M-10 190h420" />
                <path d="M120 -10v320" />
                <path d="M290 -10v320" />
              </g>
              <g stroke="rgb(212 160 84 / 0.16)" strokeWidth="4">
                <path d="M-10 135h420" />
                <path d="M205 -10v320" />
                <path d="M-10 245h420" />
              </g>
              <circle cx="205" cy="135" r="34" fill="rgb(212 160 84 / 0.12)" />
              <g transform="translate(205 121)">
                <path
                  d="M0 42C-14 24-22 12-22 0a22 22 0 1 1 44 0c0 12-8 24-22 42z"
                  fill="#d4a054"
                />
                <circle cx="0" cy="0" r="9" fill="#0f0d0b" />
              </g>
            </svg>
            <p className="border-t border-caramel/15 px-6 py-4 text-sm text-cream/75">
              Shop No. 10, Sai Ram Residency — tap for directions
            </p>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
