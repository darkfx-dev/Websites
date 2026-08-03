import type { ReactNode } from "react";
import { isPlaceholder } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Renders text that may still be an unfilled `[placeholder]`.
 *
 * Placeholders are shown, not hidden — but they are visually and
 * semantically marked so nobody can mistake one for a real claim. The
 * screen-reader text says so explicitly, because a sighted reader gets that
 * from the dashed outline and a screen-reader user would not.
 */
export function Text({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  if (!isPlaceholder(value)) return <span className={className}>{value}</span>;

  return (
    <span
      className={cn(
        "rounded-sm border border-dashed border-accent/45 bg-accent-soft/40 px-1.5 py-0.5",
        "text-ink-soft",
        className
      )}
      data-placeholder="true"
    >
      {value}
      <span className="sr-only"> (placeholder — content not yet supplied)</span>
    </span>
  );
}

/**
 * A link that refuses to pretend.
 *
 * If the destination is still a placeholder it renders as inert marked text
 * rather than an anchor, because a link that goes nowhere is worse than no
 * link at all — it costs the visitor a click and costs you credibility.
 *
 * External destinations get `rel="noopener noreferrer"`; `mailto:` does not
 * need it and does not get a new tab.
 */
export function SafeLink({
  href,
  children,
  className,
  placeholderClassName,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  placeholderClassName?: string;
  ariaLabel?: string;
}) {
  if (isPlaceholder(href)) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-sm border border-dashed border-accent/45",
          "bg-accent-soft/40 px-2 py-1 text-sm text-ink-soft",
          placeholderClassName
        )}
        data-placeholder="true"
      >
        {children}
        <span className="sr-only"> (link not yet supplied)</span>
      </span>
    );
  }

  const isMail = href.startsWith("mailto:");
  const external = !isMail && /^https?:/i.test(href);

  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

/**
 * A short note explaining that a piece of media or proof is deliberately
 * absent. Used instead of inventing a screenshot or a statistic.
 */
export function MediaRequirement({
  title,
  detail,
  className,
}: {
  title: string;
  detail: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-center gap-2 rounded-lg border border-dashed border-line-strong",
        "bg-[rgba(255,255,255,0.02)] p-6 text-center",
        className
      )}
      data-placeholder="true"
    >
      <p className="eyebrow">Media required</p>
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mx-auto max-w-[38ch] text-sm text-ink-soft">{detail}</p>
    </div>
  );
}
