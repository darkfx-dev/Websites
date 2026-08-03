import { cn } from "@/lib/utils";

/**
 * Every call-to-action on this site is a real anchor, never a scripted button.
 * `tel:` and `wa.me` links must work with JavaScript disabled, and an anchor
 * is also what gives keyboard users and screen readers the right affordance
 * for free.
 *
 * External links get `target="_blank"` with `rel="noopener noreferrer"` and a
 * visually-hidden "(opens in a new tab)" so the behaviour is announced rather
 * than surprising. `tel:` links deliberately stay in the same tab.
 */
type Variant = "primary" | "secondary" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-card border px-5 text-sm font-semibold transition-colors duration-150 ease-standard";

const variants: Record<Variant, string> = {
  // Black fill, white text — the brief's primary CTA treatment.
  primary:
    "border-ink bg-ink text-white hover:bg-ink-soft active:bg-ink-soft",
  secondary:
    "border-[rgba(10,10,10,0.16)] bg-surface text-ink hover:bg-surface-muted",
  quiet:
    "border-transparent bg-transparent text-ink underline underline-offset-4 hover:text-ink-soft",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function ActionLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  return (
    <a
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      {...rest}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
