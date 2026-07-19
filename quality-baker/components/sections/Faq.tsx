import { Reveal } from "@/components/Reveal";

/**
 * Confirmed-information FAQ. Where the shop hasn't confirmed a policy, the
 * answer honestly routes to WhatsApp instead of inventing one.
 * EDITABLE: refine answers with the owner before launch.
 */
const faqs = [
  {
    q: "How early should I order a custom cake?",
    a: "The earlier the better for detailed designs. Message us with your date and we'll confirm what's possible — same-day pastries are always available.",
  },
  {
    q: "Do you deliver?",
    a: "Collection is from the shop. Ask about delivery for your area on WhatsApp and we'll tell you honestly what we can do.",
  },
  {
    q: "Can you make my cake eggless?",
    a: "Yes — most of the menu is available eggless. Mention it in your order message.",
  },
  {
    q: "Can you copy a design I've seen?",
    a: "Send the reference photo on WhatsApp. We'll tell you what translates well and sketch our version with you before baking.",
  },
  {
    q: "How do I pay?",
    a: "Payment is settled with the shop when you confirm your order — ask on WhatsApp for current options.",
  },
];

export function Faq() {
  return (
    <section aria-label="Frequently asked questions" className="bg-cream text-ink">
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 md:py-28">
        <Reveal>
          <h2 className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-medium leading-[1.06] tracking-[-0.015em] text-cocoa">
            Good to know
          </h2>
        </Reveal>
        <div className="mt-10">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={0.04 * i}>
              <details className="group border-t border-cocoa/20 py-1 last:border-b">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-6 py-4 font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="text-caramel transition-transform duration-200 group-open:rotate-45"
                  >
                    ✚
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-5 leading-relaxed text-ink/75">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
