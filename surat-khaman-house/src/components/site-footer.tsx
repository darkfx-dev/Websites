import { business } from "@/data/business";
import { telHref, whatsappHref } from "@/lib/links";

/**
 * The address is intentionally absent here: it appears once, in the Location &
 * Contact section directly above, and repeating it adds nothing.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl leading-none">{business.name}</p>
          <p lang="gu" className="mt-2 font-gujarati-sans text-sm text-white/60">
            {business.alternateName}
          </p>
          <p className="mt-4 text-sm text-white/60">{business.category}</p>
        </div>

        {/* Each link is given a full 44px tap height rather than sitting at
            its text height, so footer targets match the rest of the site. */}
        <nav aria-label="Footer">
          <ul className="flex flex-col text-sm">
            <li>
              <a
                href="#menu"
                className="inline-flex min-h-11 items-center text-white/80 hover:text-white"
              >
                Menu
              </a>
            </li>
            <li>
              <a
                href={telHref}
                className="inline-flex min-h-11 items-center text-white/80 hover:text-white"
              >
                {business.telephone.display}
              </a>
            </li>
            <li>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-white/80 hover:text-white"
              >
                WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="text-sm text-white/60">
          <p>{business.hoursFallback}</p>
          <p className="mt-4">{business.priceDisclaimer}</p>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page py-6 text-sm text-white/50">
          <p>
            &copy; {year} {business.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
