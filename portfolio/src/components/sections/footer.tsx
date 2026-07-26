import { ArrowUp } from "lucide-react";
import { contact, isPlaceholder, profile, real } from "@/data/portfolio";
import { SafeLink, Text } from "@/components/ui/content";

/**
 * Footer.
 *
 * The year is computed at build time. This page is statically rendered, so a
 * client-side `new Date()` would only cost hydration work to produce a value
 * that is already correct in the HTML.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const name = real(profile.name);
  const socials = contact.socials.filter((s) => !isPlaceholder(s.href));

  return (
    <footer className="relative border-t border-line">
      <div className="shell flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-ink">
            {name ? (
              <>
                &copy; {year} {name}
              </>
            ) : (
              <>
                &copy; {year} <Text value={profile.name} />
              </>
            )}
          </p>
          <p className="mt-2 max-w-prose text-xs text-ink-faint">
            Built with Next.js, React Three Fiber, GSAP and Tailwind CSS.
            Hand-written, no template.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {socials.map((s) => (
            <SafeLink
              key={s.label}
              href={s.href}
              className="inline-flex min-h-[44px] items-center text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {s.label}
            </SafeLink>
          ))}
          <a
            href="#top"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            Back to top
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
