import type { ReactNode } from "react";

export type ActionVariant = "primary" | "secondary" | "onDark" | "secondaryOnDark" | "quiet";
export type ActionSize = "md" | "lg";

/**
 * One shared control style for every call and directions action.
 * Visible labels stay distinct; only the styling is reused.
 *
 * Every size clears the 44×44px minimum touch target.
 */
export function actionClasses(
  variant: ActionVariant = "primary",
  size: ActionSize = "md",
  extra = "",
): string {
  const base =
    "inline-flex items-center justify-center gap-2.5 font-semibold no-underline transition-colors duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  const sizes: Record<ActionSize, string> = {
    md: "min-h-[48px] rounded-lg px-6 py-2.5 text-[0.9375rem]",
    lg: "min-h-[52px] rounded-lg px-7 py-3.5 text-base",
  };

  const variants: Record<ActionVariant, string> = {
    primary: "bg-ink text-white hover:bg-black active:bg-black",
    secondary:
      "border border-border-strong bg-surface text-ink hover:bg-surface-subtle active:bg-[#f0e2c9]",
    /**
     * For the ink panel. This is a distinct variant rather than an override
     * appended to `secondary`: two colour utilities on one element are
     * resolved by their order in the generated stylesheet, not by their order
     * in the class attribute, so `text-ink` silently won and the label
     * rendered ink-on-ink.
     */
    secondaryOnDark:
      "border border-white/45 bg-transparent text-white hover:bg-white/10 active:bg-white/15",
    /** Solid light button for use on the ink panel. */
    onDark: "bg-white text-ink hover:bg-white/90 active:bg-white/80",
    quiet:
      "min-h-[44px] px-1 text-ink underline decoration-border-strong decoration-1 underline-offset-4 hover:decoration-brand hover:text-brand",
  };

  return [base, variant === "quiet" ? "" : sizes[size], variants[variant], extra]
    .filter(Boolean)
    .join(" ");
}

/**
 * A plain anchor: it works with no JavaScript, which is a hard requirement
 * for the phone and directions actions.
 */
export function ActionLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  externalLabel,
  className = "",
  icon,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: ActionVariant;
  size?: ActionSize;
  /** Opens a third party. Adds rel/target and names the destination. */
  external?: boolean;
  externalLabel?: string;
  className?: string;
  icon?: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">) {
  return (
    <a
      href={href}
      className={actionClasses(variant, size, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {icon}
      <span>{children}</span>
      {externalLabel ? <span className="sr-only"> {externalLabel}</span> : null}
    </a>
  );
}
