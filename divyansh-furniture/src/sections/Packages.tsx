import { Check } from "lucide-react";
import { isPlaceholder, packages } from "@/data/site";
import { BookButton } from "@/components/ui/BookButton";
import { Corner, Marked, SectionHeading, Text } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";
import { messages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Packages() {
  return (
    <section id="packages" className="section-y relative" aria-labelledby="packages-title">
      <div className="page">
        <Reveal>
          <SectionHeading
            label="Packages"
            title="Three ways to work with us"
            lede="Prices are quoted per project, because a wardrobe for one wall and a wardrobe for a walk-in are not the same job. Send us the room and we will send a fixed number."
            id="packages-title"
            align="center"
            className="mx-auto text-center"
          />
        </Reveal>

        <ul className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {packages.map((tier, i) => (
            <Reveal as="li" key={tier.name} delay={i * 90}>
              <div
                className={cn(
                  "card relative flex h-full flex-col p-8",
                  tier.featured &&
                    "border-brass-line shadow-[0_28px_80px_-40px_rgba(200,162,101,0.65)]"
                )}
              >
                {tier.featured ? (
                  <>
                    <Corner position="tl" className="m-3" />
                    <Corner position="br" className="m-3" />
                    <p className="label absolute -top-3 left-8 bg-walnut-raised px-2">
                      Most chosen
                    </p>
                  </>
                ) : null}

                <h3 className="text-h3">{tier.name}</h3>
                <p className="mt-1.5 text-sm text-silk-dim">{tier.forWho}</p>

                {/* Set apart, and marked, so a placeholder is never mistaken
                    for a quoted price. */}
                <div className="mt-7 border-y border-hairline py-5">
                  {isPlaceholder(tier.price) ? (
                    <Text value={tier.price} className="text-sm" />
                  ) : (
                    <p className="figures text-h3 text-silk">{tier.price}</p>
                  )}
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-3.5 text-sm text-silk-dim">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brass"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                      <Marked value={feature} />
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <BookButton
                    message={messages.packageEnquiry(tier.name)}
                    variant={tier.featured ? "primary" : "ghost"}
                    fullWidth
                  >
                    Enquire
                  </BookButton>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
