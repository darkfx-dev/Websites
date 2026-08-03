import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type LiquidGlassProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Adds the lift-on-hover response. Off for static panels. */
  interactive?: boolean;
};

/**
 * The one glass surface used across the site.
 *
 * Centralised so the material stays consistent and so it is easy to see how
 * often it is used — glass is reserved for navigation, the hero status card,
 * project media frames and the contact panel. Body copy sits on the page
 * ground, not on glass, which keeps text contrast predictable.
 */
export function LiquidGlass({
  children,
  as: Tag = "div",
  className,
  interactive = false,
}: LiquidGlassProps) {
  // See the note in `Reveal`: one narrowing here beats a cast at every use.
  const Element = Tag as React.ComponentType<{
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <Element
      className={cn("liquid-glass", interactive && "glass-hover", className)}
    >
      {children}
    </Element>
  );
}
