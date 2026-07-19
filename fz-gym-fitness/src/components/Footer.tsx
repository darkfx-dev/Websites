import { Phone, MapPin, MessageCircle, Instagram } from "lucide-react";
import { siteConfig, navLinks } from "@/config/siteConfig";
import { generalWhatsappUrl } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-surface/40">
      <div className="container-px grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <a href="#home" className="flex items-center gap-2" aria-label="Home">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-lime/60 bg-lime/10 font-display text-lg font-bold text-lime shadow-neon-lime">
              FZ
            </span>
            <span className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              Gym &amp; Fitness
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm text-muted">
            {siteConfig.description}
          </p>
        </div>

        {/* Nav */}
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
            Explore
          </h3>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-lime"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-lime"
              >
                <Phone className="h-4 w-4 text-lime" aria-hidden="true" />
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-cyan"
                aria-hidden="true"
              />
              <span>
                {siteConfig.address.line1}, {siteConfig.address.line2}
              </span>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
            Connect
          </h3>
          <div className="mt-4 flex gap-3">
            <a
              href={generalWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message F Z Gym & Fitness on WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-[#25D366] transition-all hover:border-[#25D366]/60 hover:bg-[#25D366]/10"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit F Z Gym & Fitness on Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-[#E1306C] transition-all hover:border-[#E1306C]/60 hover:bg-[#E1306C]/10"
            >
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href={siteConfig.links.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open F Z Gym & Fitness in Google Maps"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-cyan transition-all hover:border-cyan/60 hover:bg-cyan/10"
            >
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-muted sm:flex-row sm:text-left">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Rustampura, Surat · Gym &amp; Fitness Centre</p>
        </div>
      </div>
    </footer>
  );
}
