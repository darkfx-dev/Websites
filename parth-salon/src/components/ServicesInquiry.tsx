import { business } from "../config/business";
import { whatsappLink } from "../lib/whatsapp";
import {
  publishedServices,
  serviceCategories,
  type ServiceItem,
} from "../content/services";
import { SectionReveal } from "./SectionReveal";
import { AccessibleButton } from "./AccessibleButton";
import { ChatGlyph } from "./Icons";

/* Data-driven and publication-gated: services live in content/services.ts and
   render only when the owner has approved publication AND an item is confirmed
   + enabled (see publishedServices()). Until then the honest "ask us" prompt
   shows — no invented services, prices, or durations. Each published card
   deep-links to WhatsApp with the item's own enquiry prompt. */
export function ServicesInquiry() {
  const services = publishedServices();
  const hasServices = services.length > 0;

  // Group confirmed services under their category label, preserving order.
  const grouped = serviceCategories
    .map((c) => ({
      category: c,
      items: services.filter((s) => s.categoryId === c.id),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <section id="services" className="bg-forest-deep text-ivory">
      <div className="on-dark container-page py-20 md:py-28">
        <SectionReveal className="max-w-[42rem]">
          <p className="eyebrow text-silver">Services &amp; pricing</p>
          <h2 className="mt-4 text-ivory" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            {hasServices ? "What we offer" : "Ask about services and prices"}
          </h2>
          {!hasServices && (
            <p className="mt-6 text-[1.05rem] text-ivory/80">
              For the current service list, prices, and appointment
              availability, contact Parth Salon directly — or build a quick
              enquiry and we&apos;ll reply with everything you need.
            </p>
          )}
        </SectionReveal>

        {hasServices ? (
          <div className="mt-12 grid gap-10">
            {grouped.map(({ category, items }) => (
              <div key={category.id}>
                <h3 className="font-body text-[0.85rem] font-semibold uppercase tracking-wider text-silver">
                  {category.label}
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SectionReveal className="mt-8 flex flex-wrap gap-3">
            <AccessibleButton
              variant="whatsapp"
              href={business.whatsappUrl}
              external
              ariaLabel="Ask about services and pricing on WhatsApp"
            >
              <ChatGlyph />
              Ask on WhatsApp
            </AccessibleButton>
            <AccessibleButton
              variant="ghost"
              href="#contact"
              className="!text-ivory hover:!bg-white/10"
            >
              Build a detailed enquiry
            </AccessibleButton>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <div className="flex flex-col rounded-[10px] border border-white/12 bg-white/[0.04] p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="font-display text-[1.35rem] text-ivory">{service.name}</h4>
        {service.priceDisplay && (
          <span className="shrink-0 font-body text-[0.95rem] font-semibold text-silver">
            {service.priceDisplay}
          </span>
        )}
      </div>
      {service.shortDescription && (
        <p className="mt-2 text-[0.92rem] text-ivory/75">{service.shortDescription}</p>
      )}
      {service.durationDisplay && (
        <p className="mt-3 text-[0.8rem] text-silver">{service.durationDisplay}</p>
      )}
      <AccessibleButton
        variant="whatsapp"
        href={whatsappLink(
          `Hello Parth Salon, ${service.enquiryPrompt} Please share availability and pricing.`,
        )}
        external
        className="mt-5 w-full"
        ariaLabel={`Enquire about ${service.name} on WhatsApp`}
      >
        <ChatGlyph />
        Enquire
      </AccessibleButton>
    </div>
  );
}
