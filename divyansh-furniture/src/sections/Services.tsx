import { Bed, Hammer, Ruler, Sofa, Truck, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "@/data/site";
import { SectionHeading } from "@/components/ui/Primitives";
import { BookButton } from "@/components/ui/BookButton";
import { Reveal } from "@/components/motion/Reveal";
import { messages } from "@/lib/whatsapp";

const ICONS: Record<string, LucideIcon> = {
  sofa: Sofa,
  bed: Bed,
  utensils: UtensilsCrossed,
  ruler: Ruler,
  hammer: Hammer,
  truck: Truck,
};

/**
 * Services.
 *
 * A single grid separated by its own hairlines rather than six floating
 * cards — a room list reads better as one object than as six competing ones,
 * and it keeps the brass for the things that are actually interactive.
 */
export function Services() {
  return (
    <section id="services" className="section-y relative" aria-labelledby="services-title">
      <div className="page">
        <Reveal>
          <SectionHeading
            label="What we make"
            title="Furniture for every room, built to your measurements"
            lede="Tell us the room and the budget. We will tell you what is possible in solid wood and what it will cost, before anything is cut."
            id="services-title"
          />
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = ICONS[service.icon] ?? Sofa;
              return (
                <li
                  key={service.title}
                  className="group relative bg-walnut-raised p-8 transition-colors duration-300 hover:bg-[#261e19]"
                >
                  <Icon
                    className="h-6 w-6 text-brass"
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-h3">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-silk-dim">
                    {service.body}
                  </p>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 bottom-0 h-px scale-x-0 bg-brass opacity-60 transition-transform duration-300 ease-soft group-hover:scale-x-100"
                  />
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <BookButton
              message={messages.consultation("a piece for my home")}
              variant="ghost"
            >
              Ask about a piece
            </BookButton>
            <p className="text-sm text-silk-faint">
              Send a photo of the space and we will work from that.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
