import type { AnchorHTMLAttributes, ReactNode } from "react";

type GlowButtonProps = {
  href: string;
  children: ReactNode;
  /** solid = caramel CTA · dark = espresso-on-cream · ghost = outline on dark */
  variant?: "solid" | "dark" | "ghost";
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const variantClasses: Record<NonNullable<GlowButtonProps["variant"]>, string> =
  {
    solid: "bg-caramel text-espresso",
    dark: "bg-espresso text-cream",
    ghost: "border border-cream/30 text-cream",
  };

/**
 * The house CTA. Warm caramel glow on hover/focus via a pre-baked blurred
 * layer (opacity-only animation), glare sweep, and scale-down press feedback.
 * All of it lives in globals.css under `.glow-btn`.
 */
export function GlowButton({
  href,
  children,
  variant = "solid",
  className = "",
  ...rest
}: GlowButtonProps) {
  return (
    <a
      href={href}
      className={`glow-btn inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3 text-[0.95rem] font-semibold tracking-wide ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      <span aria-hidden className="glare" />
      {children}
    </a>
  );
}
