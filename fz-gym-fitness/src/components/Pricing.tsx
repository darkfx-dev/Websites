import { Check, Sparkles } from "lucide-react";
import { plans, pricingNote } from "@/config/siteConfig";
import { formatPrice, planWhatsappUrl, cn } from "@/lib/utils";
import { Reveal } from "./ui/Reveal";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="container-px relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">
            Membership Plans
          </span>
          <h2 className="heading mt-4 text-3xl text-ink sm:text-4xl">
            Choose the plan that{" "}
            <span className="neon-text">fits your goals</span>
          </h2>
          <p className="mt-4 text-muted">
            Flexible options for every level of commitment.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.05}>
              <article
                className={cn(
                  "glass-card relative flex h-full flex-col p-6",
                  plan.mostPopular
                    ? "border-lime/60 shadow-neon-lime"
                    : "hover:border-white/20"
                )}
              >
                {plan.mostPopular && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-lime px-3 py-1 text-xs font-bold uppercase tracking-wide text-base">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Most Popular
                  </span>
                )}

                <h3 className="font-display text-2xl font-semibold text-ink">
                  {plan.name}
                </h3>

                <div className="mt-4">
                  <span
                    className={cn(
                      "font-display font-bold text-ink",
                      plan.price === null ? "text-xl" : "text-4xl"
                    )}
                  >
                    {formatPrice(plan.price)}
                  </span>
                  {plan.price !== null && (
                    <span className="ml-2 text-sm text-muted">
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-lime"
                        aria-hidden="true"
                      />
                      <span className="text-muted">{b}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={planWhatsappUrl(plan)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all active:scale-[0.97] motion-reduce:active:scale-100",
                    plan.mostPopular
                      ? "bg-lime text-base hover:shadow-neon-lime hover:brightness-110"
                      : "border border-cyan/50 text-cyan hover:bg-cyan/10 hover:shadow-neon-cyan"
                  )}
                  aria-label={`Ask about the ${plan.name} plan on WhatsApp`}
                >
                  Ask About This Plan
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Honesty note so indicative sample prices never mislead visitors. */}
        <Reveal className="mt-8 text-center">
          <p className="text-xs text-muted">* {pricingNote}</p>
        </Reveal>
      </div>
    </section>
  );
}
