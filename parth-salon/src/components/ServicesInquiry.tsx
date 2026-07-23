import { business } from "../config/business";
import { whatsappLink } from "../lib/whatsapp";
import { SectionReveal } from "./SectionReveal";
import { AccessibleButton } from "./AccessibleButton";
import { ChatGlyph } from "./Icons";

/* Data-driven: while `services` is empty the honest enquiry prompt shows.
   Add confirmed services to the config and the full card layout renders
   automatically — no invented example services are ever displayed. */
export function ServicesInquiry() {
  const services = [...business.services].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const hasServices = services.length > 0;

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
              availability, contact Parth Salon directly on WhatsApp.
            </p>
          )}
        </SectionReveal>

        {hasServices ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.name}
                className="rounded-[10px] border border-white/12 bg-white/[0.04] p-6"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[1.35rem] text-ivory">{s.name}</h3>
                  {s.price && (
                    <span className="shrink-0 font-body text-[0.95rem] font-semibold text-silver">
                      {s.price}
                    </span>
                  )}
                </div>
                {s.description && (
                  <p className="mt-2 text-[0.92rem] text-ivory/75">{s.description}</p>
                )}
                {s.duration && (
                  <p className="mt-3 text-[0.8rem] text-silver">{s.duration}</p>
                )}
                <AccessibleButton
                  variant="whatsapp"
                  href={whatsappLink(
                    `Hello Parth Salon, I would like to ask about "${s.name}". Please share availability and pricing.`,
                  )}
                  external
                  className="mt-5 w-full"
                >
                  <ChatGlyph />
                  Enquire
                </AccessibleButton>
              </div>
            ))}
          </div>
        ) : (
          <SectionReveal className="mt-8">
            <AccessibleButton
              variant="whatsapp"
              href={business.whatsappUrl}
              external
              ariaLabel="Ask about services and pricing on WhatsApp"
            >
              <ChatGlyph />
              Ask on WhatsApp
            </AccessibleButton>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}
