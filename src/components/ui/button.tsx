import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "whatsapp" | "dark";
type Size = "md" | "lg";

// Motion note: CSS owns this button's hover/press feedback (a small 3D lift and
// press-in), per the project's GSAP/Framer/CSS ownership split. `will-change` is
// deliberately omitted — these are short, discrete transitions, not sustained
// animation, so promoting every button to its own layer would cost more than it
// saves. Motion is dropped entirely under prefers-reduced-motion via the global
// rule in globals.css.
const base =
  "group inline-flex items-center justify-center gap-2 rounded-button font-semibold " +
  "min-h-[48px] px-5 text-[0.9375rem] sm:text-base leading-none " +
  "transition-[color,background-color,border-color,transform,box-shadow] " +
  "duration-220 ease-standard transform-gpu " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-transparent " +
  "disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  // Saffron Gold background, Spiced Charcoal text.
  primary:
    "bg-saffron text-charcoal hover:bg-[#e79b2b] " +
    "focus-visible:ring-charcoal shadow-card",
  // Transparent/cream surface with clear border and high-contrast text.
  secondary:
    "bg-cream/80 text-charcoal border border-warm-border hover:bg-ivory " +
    "focus-visible:ring-charcoal",
  // Coriander Green with white text for WhatsApp.
  whatsapp:
    "bg-coriander text-white hover:bg-[#27563c] focus-visible:ring-coriander",
  // For placement on dark (charcoal) surfaces.
  dark:
    "bg-white/10 text-cream border border-white/20 hover:bg-white/15 " +
    "focus-visible:ring-cream",
};

const sizes: Record<Size, string> = {
  md: "",
  lg: "min-h-[52px] px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
    /** When true, adds target/rel + an accessible "opens in a new tab" note. */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Presentational button that renders as an <a> when `href` is provided and a
 * <button> otherwise. External links get secure rel attributes and an
 * assistive-tech hint. Never relies on colour alone for meaning.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, external, ...rest } = props as ButtonAsLink;
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    // Strip presentational-only keys before spreading onto the DOM node.
    delete (rest as Partial<CommonProps>).variant;
    delete (rest as Partial<CommonProps>).size;
    delete (rest as Partial<CommonProps>).className;
    return (
      <a href={href} className={classes} {...externalProps} {...rest}>
        {children}
        {external ? (
          <span className="sr-only"> (opens in a new tab)</span>
        ) : null}
      </a>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  delete (rest as Partial<CommonProps>).variant;
  delete (rest as Partial<CommonProps>).size;
  delete (rest as Partial<CommonProps>).className;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
