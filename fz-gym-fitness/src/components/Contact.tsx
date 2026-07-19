import { Phone, MapPin, MessageCircle, Instagram, Clock } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { generalWhatsappUrl } from "@/lib/utils";
import { Reveal } from "./ui/Reveal";

export function Contact() {
  const { address } = siteConfig;

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="container-px grid gap-10 lg:grid-cols-2">
        {/* Details */}
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">
            Contact &amp; Location
          </span>
          <h2 className="heading mt-4 text-3xl text-ink sm:text-4xl">
            Come train with <span className="neon-text">us</span>
          </h2>

          <div className="mt-8 space-y-5">
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-1 h-5 w-5 shrink-0 text-cyan"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-ink">{siteConfig.name}</p>
                <p className="text-sm text-muted">
                  {address.line1}
                  <br />
                  {address.line2}
                </p>
              </div>
            </div>

            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="flex items-center gap-3 text-ink transition-colors hover:text-lime"
            >
              <Phone
                className="h-5 w-5 shrink-0 text-lime"
                aria-hidden="true"
              />
              <span className="font-medium">{siteConfig.phoneDisplay}</span>
            </a>

            {siteConfig.showHours && (
              <div className="flex items-start gap-3">
                <Clock
                  className="mt-1 h-5 w-5 shrink-0 text-cyan"
                  aria-hidden="true"
                />
                <div>
                  <ul className="space-y-1 text-sm text-muted">
                    {siteConfig.hours.map((h) => (
                      <li key={h.days} className="flex gap-2">
                        <span className="min-w-[9.5rem] font-medium text-ink">
                          {h.days}
                        </span>
                        <span>{h.time}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs italic text-muted/80">
                    {siteConfig.hoursNote}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-4 py-3 text-sm font-semibold text-base transition-all hover:shadow-neon-lime hover:brightness-110"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call Now
            </a>
            <a
              href={siteConfig.links.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan/50 px-4 py-3 text-sm font-semibold text-cyan transition-all hover:bg-cyan/10 hover:shadow-neon-cyan"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Directions
            </a>
            <a
              href={generalWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366]/60 px-4 py-3 text-sm font-semibold text-[#25D366] transition-all hover:bg-[#25D366]/10"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E1306C]/60 px-4 py-3 text-sm font-semibold text-[#E1306C] transition-all hover:bg-[#E1306C]/10"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
              Instagram
            </a>
          </div>
        </Reveal>

        {/* Map embed */}
        <Reveal delay={0.15}>
          <a
            href={siteConfig.links.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open F Z Gym & Fitness location in Google Maps"
            className="group relative flex h-full min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-surface/70 p-8 text-center transition-all hover:border-cyan/40 hover:shadow-neon-cyan"
          >
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan/10 blur-3xl" />
            <MapPin
              className="relative h-12 w-12 text-cyan transition-transform group-hover:scale-110 motion-reduce:group-hover:scale-100"
              aria-hidden="true"
            />
            <p className="relative mt-4 font-display text-xl font-semibold text-ink">
              Find us in Rustampura, Surat
            </p>
            <p className="relative mt-1 text-sm text-muted">
              Tap to open in Google Maps
            </p>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
