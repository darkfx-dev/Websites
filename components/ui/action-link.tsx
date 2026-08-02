import type { ReactNode } from "react";

export type ActionVariant = "primary" | "secondary" | "secondaryOnDark" | "quiet";
export type ActionSize = "md" | "lg";

/**
 * One shared control style for every WhatsApp, call and directions action.
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
    md: "min-h-[44px] rounded-md px-5 py-2.5 text-[0.9375rem]",
    lg: "min-h-[52px] rounded-md px-6 py-3.5 text-base",
  };

  const variants: Record<ActionVariant, string> = {
    primary: "bg-brand text-canvas hover:bg-[#83261e] active:bg-[#6f201a]",
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
      "border border-canvas/50 bg-transparent text-canvas hover:bg-canvas/10 active:bg-canvas/15",
    quiet:
      "min-h-[44px] px-1 text-ink underline decoration-border-strong decoration-1 underline-offset-4 hover:decoration-brand hover:text-brand",
  };

  return [base, variant === "quiet" ? "" : sizes[size], variants[variant], extra]
    .filter(Boolean)
    .join(" ");
}

/**
 * A plain anchor: it works with no JavaScript, which is a hard requirement
 * for the phone, WhatsApp and directions actions.
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
