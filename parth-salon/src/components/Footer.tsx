import { Phone, Navigation } from "lucide-react";
import { business } from "../config/business";
import { directionsUrl } from "../lib/whatsapp";
import { getWeekRows } from "../lib/hours";
import { navLinks } from "../data/nav";
import { ChatGlyph } from "./Icons";

export function Footer() {
  const year = new Date().getFullYear();
  const rows = getWeekRows();

  return (
    <footer className="border-t border-white/10 bg-forest-deep pb-24 pt-16 text-ivory lg:pb-16">
      <div className="on-dark container-page grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        {/* Brand + contact */}
        <div>
          <p className="font-display text-[1.8rem] leading-none">
            Parth<span className="text-forest-rich">.</span> Salon
          </p>
          <p className="mt-3 text-[0.9rem] text-silver">Established in 2003</p>
          <address className="mt-4 not-italic text-[0.9rem] leading-relaxed text-ivory/70">
            {business.addressLines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </address>
          <a
            href={business.telephoneUrl}
            className="mt-4 inline-flex items-center gap-2 text-[0.92rem] text-silver hover:text-ivory"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {business.phoneDisplay}
          </a>
        </div>

        {/* Section links */}
        <nav aria-label="Footer" className="text-[0.92rem]">
          <p className="eyebrow mb-3 text-silver">Explore</p>
          <ul className="grid gap-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-ivory/75 hover:text-ivory">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3">
            <a
              href={business.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message Parth Salon on WhatsApp"
              className="tap inline-flex items-center justify-center rounded-[8px] bg-whatsapp px-3 text-[#04310f]"
            >
              <ChatGlyph />
            </a>
            <a
              href={directionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get directions to Parth Salon"
              className="tap inline-flex items-center justify-center rounded-[8px] bg-map-blue px-3 text-white"
            >
              <Navigation className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
          </div>
        </nav>

        {/* Hours summary */}
        <div className="text-[0.9rem]">
          <p className="eyebrow mb-3 text-silver">Hours</p>
          <ul className="grid gap-1.5">
            {rows.map((r) => (
              <li
                key={r.key}
                className={`flex justify-between gap-4 ${
                  r.isToday ? "text-ivory" : "text-ivory/70"
                }`}
              >
                <span>{r.label}</span>
                <span className="tabular-nums">
                  {r.closes ? `${r.opens} – ${r.closes}` : r.opens}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page mt-12">
        <div className="hairline" />
        <p className="mt-5 text-[0.8rem] text-ivory/55">
          © {year} Parth Salon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
