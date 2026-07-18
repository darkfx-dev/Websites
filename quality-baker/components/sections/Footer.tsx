import { GlowButton } from "@/components/GlowButton";
import { Reveal } from "@/components/Reveal";
import { defaultWhatsappHref, site } from "@/lib/site";

/* Social icons render as quiet placeholders until the shop shares real
   handles — swap `href` from null to the real profile URL to activate. */
const socials: { label: string; href: string | null; d: string }[] = [
  {
    label: "Instagram",
    href: null,
    d: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.6 5.4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  },
  {
    label: "Facebook",
    href: null,
    d: "M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.45-4 4.1v2.3H7.6V14h2.7v8h3.2z",
  },
];

export function Footer() {
  return (
    <footer className="bg-noir text-cream">
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-24 sm:px-8 md:pt-32">
        <Reveal>
          <div className="text-center">
            {/* Script accent #1 of 3 — small, deliberate, never body copy */}
            <p className="font-script text-2xl text-caramel">
              handmade with love, since day one
            </p>
            <h2 className="mx-auto mt-4 max-w-[18ch] font-display text-[clamp(2.4rem,7vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.015em]">
              Order your next celebration cake
            </h2>
            <p className="mx-auto mt-6 max-w-[44ch] text-lg leading-relaxed text-cream/70">
              One message is enough — tell us the date, the flavour, and the
              person it&rsquo;s for. We&rsquo;ll take it from there.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <GlowButton href={defaultWhatsappHref} target="_blank" rel="noopener">
                WhatsApp your order
              </GlowButton>
              <GlowButton href={site.phoneHref} variant="ghost">
                {site.phoneDisplay}
              </GlowButton>
            </div>
          </div>
        </Reveal>

        <div className="mt-24 flex flex-col items-center justify-between gap-5 border-t border-cream/10 pt-8 text-sm text-cream/50 sm:flex-row">
          <p className="font-display text-base text-cream/80">{site.name}</p>
          <div className="flex items-center gap-4">
            {socials.map((s) =>
              s.href ? (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-cream/60 transition-colors duration-150 hover:text-caramel"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.d} />
                  </svg>
                </a>
              ) : (
                <span
                  key={s.label}
                  title={`${s.label} — coming soon`}
                  className="cursor-default text-cream/30"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={s.d} />
                  </svg>
                </span>
              )
            )}
          </div>
          <p className="max-w-[42ch] text-center sm:text-right">
            {site.address} · {site.hours}, {site.hoursNote.toLowerCase()}
          </p>
        </div>
      </div>
    </footer>
  );
}
