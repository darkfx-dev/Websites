import { GlowButton } from "@/components/GlowButton";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-espresso text-cream">
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-24 sm:px-8 md:pt-32">
        <Reveal>
          <div className="text-center">
            <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(2.4rem,7vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.015em]">
              Order your next celebration cake
            </h2>
            <p className="mx-auto mt-6 max-w-[44ch] text-lg leading-relaxed text-cream/70">
              One call is enough — tell us the date, the flavour, and the
              person it&rsquo;s for. We&rsquo;ll take it from there.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <GlowButton href={site.whatsappHref}>
                WhatsApp your order
              </GlowButton>
              <GlowButton href={site.phoneHref} variant="ghost">
                {site.phoneDisplay}
              </GlowButton>
            </div>
          </div>
        </Reveal>

        {/*
          Social links intentionally omitted until the shop shares real
          handles — a dead "#" icon row is worse than none. Add them here.
        */}
        <div className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-sm text-cream/50 sm:flex-row">
          <p className="font-display text-base text-cream/80">{site.name}</p>
          <p className="max-w-[42ch] text-center sm:text-right">
            {site.address} · {site.hours}, {site.hoursNote.toLowerCase()}
          </p>
        </div>
      </div>
    </footer>
  );
}
