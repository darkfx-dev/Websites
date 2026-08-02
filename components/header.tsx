import { MobileNav } from "@/components/mobile-nav";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { outlet } from "@/data/outlet";
import { anchors, whatsappHref } from "@/lib/links";

const navItems = [
  { href: anchors.menu, label: "Menu" },
  { href: anchors.about, label: "About" },
  { href: anchors.location, label: "Location" },
  { href: anchors.faq, label: "FAQ" },
];

/**
 * 064 — the entrance is CSS-driven (`[data-navbar]` in globals.css) because
 * the header is above the fold and must be painted and operable before any
 * JavaScript runs.
 *
 * The backdrop blur is the single static glass surface on the site.
 */
export function Header() {
  return (
    <header
      data-navbar
      /**
       * Opaque on purpose. A translucent blurred header let whatever scrolled
       * behind it darken the backdrop, which dropped the small copper
       * "Adajan Patiya" label to 3.56:1 — measured, not theoretical. Contrast
       * that changes with scroll position cannot be guaranteed, so the one
       * permitted glass surface is traded for a stable one.
       */
      className="sticky top-0 z-30 border-b border-border bg-canvas"
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <a
          href="#top"
          className="flex min-h-[44px] flex-col justify-center leading-none no-underline"
        >
          <span className="font-display text-[1.0625rem] font-semibold text-ink sm:text-xl">
            {outlet.name}
          </span>
          <span className="mt-1 text-[0.6875rem] font-semibold tracking-[0.16em] text-copper uppercase">
            Adajan Patiya
          </span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((entry) => (
              <li key={entry.href}>
                <a
                  href={entry.href}
                  className="inline-flex min-h-[44px] items-center rounded-md px-3 text-[0.9375rem] font-medium text-ink no-underline transition-colors duration-[160ms] hover:bg-surface-subtle"
                >
                  {entry.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <WhatsAppLink href={whatsappHref()}>{outlet.cta.whatsapp}</WhatsAppLink>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
