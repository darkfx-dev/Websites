import { menu } from "@/data/menu";
import { GlowButton } from "@/components/GlowButton";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * The price list, set like a patisserie menu board: serif category heads,
 * dotted leaders, caramel prices. Data lives in data/menu.ts — edit there.
 */
export function MenuSection() {
  return (
    <section id="menu" className="bg-espresso text-cream">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.06] tracking-[-0.015em]">
              The menu
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream/70">
              Everything is baked in-house, fresh for the day. Prices shown are
              starting points — custom work is quoted once we&rsquo;ve talked
              through your design.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-x-14 gap-y-14 md:grid-cols-3">
          {menu.map((category, ci) => (
            <Reveal key={category.title} delay={0.08 * ci}>
              <div>
                <h3 className="font-display text-2xl font-medium text-caramel">
                  {category.title}
                </h3>
                <ul className="mt-7 space-y-7">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-baseline">
                        <span className="font-semibold leading-snug">
                          {item.name}
                        </span>
                        <span aria-hidden className="leader" />
                        <span className="shrink-0 font-display text-lg text-caramel">
                          {item.price}
                        </span>
                      </div>
                      {(item.note || item.eggless) && (
                        <p className="mt-1.5 text-[0.9rem] leading-relaxed text-cream/60">
                          {item.note}
                          {item.eggless && (
                            <span className="ml-2 whitespace-nowrap rounded-full border border-caramel/40 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-caramel">
                              eggless
                            </span>
                          )}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-20 flex flex-wrap items-center gap-5 border-t border-cream/10 pt-10">
            <p className="max-w-[38ch] text-cream/70">
              Don&rsquo;t see your idea here? That&rsquo;s what we&rsquo;re
              best at.
            </p>
            <GlowButton href={site.whatsappHref}>
              Ask about a custom cake
            </GlowButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
