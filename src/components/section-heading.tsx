import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Consistent section header: an optional eyebrow, a title, and optional
 * supporting copy. `as` controls the heading level so callers keep a correct
 * document outline (one H1 lives in the hero; sections use H2).
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const isLight = tone === "light";
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]",
            isLight ? "text-saffron" : "text-tomato"
          )}
        >
          <span
            aria-hidden="true"
            className="h-px w-6 bg-current opacity-60"
          />
          {eyebrow}
        </span>
      ) : null}
      <Tag
        className={cn(
          "font-display text-[clamp(2rem,4vw,4rem)] font-semibold leading-[1.05]",
          isLight ? "text-cream" : "text-charcoal"
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base sm:text-lg",
            align === "center" && "mx-auto",
            isLight ? "text-cream/80" : "text-charcoal/75"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
