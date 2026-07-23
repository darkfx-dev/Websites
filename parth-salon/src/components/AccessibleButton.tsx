import { m } from "framer-motion";
import type { ReactNode } from "react";
import { duration, easeHeritage } from "../motion/variants";

type Variant = "primary" | "whatsapp" | "call" | "ghost" | "directions";

const base =
  "tap inline-flex items-center justify-center gap-2 rounded-[8px] px-5 font-semibold " +
  "text-[0.95rem] leading-none no-underline cursor-pointer select-none " +
  "transition-colors duration-200 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  // Solid forest — primary brand action
  primary:
    "bg-forest text-white border border-forest hover:bg-forest-rich focus-visible:bg-forest-rich",
  // WhatsApp green reserved strictly for WhatsApp actions
  whatsapp: "bg-whatsapp text-[#04310f] border border-transparent hover:brightness-95",
  // Call — outlined on ivory / filled context
  call: "bg-white text-forest border border-silver-line hover:border-forest-rich",
  // Ghost — quiet tertiary
  ghost:
    "bg-transparent text-forest border border-transparent hover:bg-[color-mix(in_srgb,var(--color-forest)_8%,transparent)]",
  // Directions — map blue
  directions:
    "bg-map-blue text-white border border-transparent hover:brightness-95",
};

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Accessible name when the visible content is icon-only or needs context */
  ariaLabel?: string;
}

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
  disabled?: never;
};

type AsButton = CommonProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function AccessibleButton(props: AsLink | AsButton) {
  const { variant = "primary", children, className = "", ariaLabel } = props;
  const cls = `${base} ${variants[variant]} ${className}`;
  const press = { scale: 0.97 };
  const transition = { duration: duration.micro, ease: easeHeritage };

  if ("href" in props && props.href !== undefined) {
    const ext = props.external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <m.a
        href={props.href}
        aria-label={ariaLabel}
        className={cls}
        whileTap={press}
        transition={transition}
        {...ext}
      >
        {children}
      </m.a>
    );
  }

  return (
    <m.button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={ariaLabel}
      className={cls}
      whileTap={press}
      transition={transition}
    >
      {children}
    </m.button>
  );
}
