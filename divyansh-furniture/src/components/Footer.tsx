import { ArrowUp, ArrowUpRight } from "lucide-react";
import { business, navLinks, real } from "@/data/site";
import { BookButton } from "@/components/ui/BookButton";
import { Rating, Text } from "@/components/ui/Primitives";
import { messages } from "@/lib/whatsapp";

/**
 * Footer.
 *
 * The year is computed at build time — this page is statically rendered, so
 * a client-side `new Date()` would only cost hydration work to produce a
 * value that is already correct in the HTML.
 *
 * Social links render only when they are real. An icon that links nowhere is
 * worse than a footer with one fewer icon.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const instagram = real(business.instagram);
  const facebook = real(business.facebook);
  const email = real(business.email);

  return (
    <footer className="relative border-t border-hairline bg-walnut-deep/70">
      <div className="page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-[1.5rem] leading-none tracking-tight">
                Divyansh
              </span>
              <span className="text-label tracking-[0.22em] text-brass">
                FURNITURE
              </span>
            </p>
            <p className="mt-4 max-w-prose text-sm text-silk-dim">
              {business.tagline}. Made to order in our own workshop and
              installed by our own team.
            </p>

            <div className="mt-7">
              <Rating
                value={business.rating}
                count={business.reviewCount}
                source={business.reviewSource}
              />
            </div>

            {/* Named in text rather than drawn as brand marks: this icon set
                no longer ships Instagram and Facebook logos, and redrawing
                someone's trademark approximately is worse than writing it. */}
            {instagram || facebook ? (
              <div className="mt-7 flex flex-wrap items-center gap-2">
                {(
                  [
                    { label: "Instagram", href: instagram },
                    { label: "Facebook", href: facebook },
                  ] as Array<{ label: string; href: string | null }>
                )
                  .filter(
                    (entry): entry is { label: string; href: string } =>
                      entry.href !== null
                  )
                  .map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline-strong px-4 text-sm text-silk-dim transition-colors hover:border-brass-line hover:text-silk"
                    >
                      {label}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
              </div>
            ) : null}
          </div>

          <nav aria-label="Sections">
            <h2 className="label">Explore</h2>
            <ul className="mt-4 flex flex-col">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="flex min-h-[44px] items-center text-sm text-silk-dim transition-colors hover:text-silk"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label">Get in touch</h2>
            <ul className="mt-4 space-y-3 text-sm text-silk-dim">
              <li>
                <Text value={business.address.line1} />
              </li>
              <li>
                <Text value={business.address.line2} />
              </li>
              <li>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-[44px] items-center underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-silk hover:decoration-brass"
                  >
                    {email}
                  </a>
                ) : (
                  <Text value={business.email} />
                )}
              </li>
            </ul>

            <div className="mt-6">
              <BookButton message={messages.general} variant="ghost">
                Book on WhatsApp
              </BookButton>
            </div>
          </div>
        </div>

        <hr className="rule my-12" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-label text-silk-faint">
            © {year} {business.name}. All rights reserved.
          </p>
          <a
            href="#top"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm text-silk-dim transition-colors hover:text-silk"
          >
            Back to top
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
