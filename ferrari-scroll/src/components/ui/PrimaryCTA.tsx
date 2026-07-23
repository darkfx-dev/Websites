import { m } from "framer-motion";
import type { ReactNode } from "react";
import { dur, easeCine } from "../../lib/motion";

/* Button/link with default, hover, focus-visible, pressed, disabled + loading
   states. <250ms feedback. */
type Common = { variant?: "primary" | "secondary"; children: ReactNode; className?: string };

const base =
  "tap inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-[2px] " +
  "font-body text-[0.9rem] font-semibold tracking-wide uppercase no-underline cursor-pointer " +
  "border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
const variants = {
  primary: "bg-red text-white border-red hover:bg-[#ff1a1a] focus-visible:bg-[#ff1a1a]",
  secondary: "bg-transparent text-warm-white border-silver/50 hover:border-warm-white hover:bg-white/5",
};

export function PrimaryCTA(
  props:
    | (Common & { href: string; onClick?: never; loading?: never; disabled?: never })
    | (Common & { href?: never; onClick: () => void; loading?: boolean; disabled?: boolean }),
) {
  const { variant = "primary", children, className = "" } = props;
  const cls = `${base} ${variants[variant]} ${className}`;
  const press = { scale: 0.97 };
  const t = { duration: dur.micro, ease: easeCine };

  if ("href" in props && props.href) {
    return (
      <m.a href={props.href} className={cls} whileTap={press} transition={t}>
        {children}
      </m.a>
    );
  }
  return (
    <m.button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      aria-busy={props.loading || undefined}
      className={cls}
      whileTap={press}
      transition={t}
    >
      {props.loading ? "…" : children}
    </m.button>
  );
}
