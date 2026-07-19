import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-lime text-base hover:shadow-neon-lime hover:brightness-110 font-semibold",
  secondary:
    "bg-transparent text-cyan border border-cyan/60 hover:bg-cyan/10 hover:shadow-neon-cyan font-semibold",
  outline:
    "bg-white/5 text-ink border border-white/15 hover:border-white/40 hover:bg-white/10 font-medium",
  ghost: "bg-transparent text-ink hover:text-lime font-medium",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  external?: boolean;
  children: ReactNode;
};

/**
 * Link-styled button. Every CTA on the site is a real, working link — there
 * are no empty buttons. Use `external` for links that must open in a new tab.
 */
export function Button({
  variant = "primary",
  size = "md",
  external = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      {...externalProps}
      {...props}
    >
      {children}
    </a>
  );
}
