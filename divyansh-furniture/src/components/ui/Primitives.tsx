import type { ReactNode } from "react";
import { isPlaceholder } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Text that may still be an unfilled `[placeholder]`.
 *
 * Placeholders are shown, not hidden — but marked, visually and for screen
 * readers, so nobody mistakes one for a fact. This matters more here than on
 * most sites: the page states a real 4.9 rating, and an unmarked placeholder
 * sitting next to a real number borrows its credibility.
 */
export function Text({ value, className }: { value: string; className?: string }) {
  if (!isPlaceholder(value)) return <span className={className}>{value}</span>;
  return (
    <span className={cn("ph", className)} data-placeholder="true">
      {value}
      <span className="sr-only"> (placeholder — not yet filled in)</span>
    </span>
  );
}

/**
 * A sentence that contains an unfilled token rather than being one.
 *
 * "[Placeholder] — lead time not yet confirmed" is mostly real prose with one
 * unknown in it, so marking the whole line would be misleading in the other
 * direction. This marks only the bracketed part and leaves the rest to read
 * normally.
 */
export function Marked({ value, className }: { value: string; className?: string }) {
  const parts = value.split(/(\[[^\]]+\])/g);
  if (parts.length === 1) return <span className={className}>{value}</span>;

  return (
    <span className={className}>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <span key={i} className="ph" data-placeholder="true">
            {part}
            <span className="sr-only"> (placeholder — not yet filled in)</span>
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

/**
 * A brass corner bracket.
 *
 * The signature detail: two short strokes meeting at a right angle, drawn
 * from the hardware on a cabinet door. It marks section headings and the
 * featured package, and it is the only ornament on the page.
 */
export function Corner({
  position = "tl",
  className,
}: {
  position?: "tl" | "tr" | "bl" | "br";
  className?: string;
}) {
  const edge: Record<string, string> = {
    tl: "left-0 top-0 border-l border-t",
    tr: "right-0 top-0 border-r border-t",
    bl: "left-0 bottom-0 border-l border-b",
    br: "right-0 bottom-0 border-r border-b",
  };
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute h-5 w-5 border-brass-line",
        edge[position],
        className
      )}
    />
  );
}

/** Section heading: brass label, serif title, optional lede. */
export function SectionHeading({
  label,
  title,
  lede,
  id,
  align = "left",
  className,
}: {
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative max-w-prose",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="label">{label}</p>
      <h2 id={id} className="mt-5 text-h2">
        {title}
      </h2>
      {lede ? (
        <p className="mt-5 text-lead leading-relaxed text-silk-dim">{lede}</p>
      ) : null}
    </div>
  );
}

/**
 * The rating, drawn rather than described.
 *
 * Both figures come from the owner. Nothing else is claimed — the review
 * platform is only named if it has been filled in, because inventing one
 * would turn a true number into a false citation.
 */
export function Rating({
  value,
  count,
  source,
  className,
}: {
  value: string;
  count: string;
  source: string;
  className?: string;
}) {
  const platform = isPlaceholder(source) ? null : source;
  const filled = Math.round(Number(value) || 0);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} filled={i < filled} />
        ))}
      </span>
      <p className="text-sm text-silk-dim">
        <span className="figures font-semibold text-silk">{value}</span>
        <span className="text-silk-faint"> / 5</span>
        <span aria-hidden="true"> · </span>
        <span className="figures">{count}</span> reviews
        {platform ? ` ${platform}` : ""}
      </p>
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" focusable="false">
      <path
        d="M12 3.2l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.6l6-.8L12 3.2z"
        fill={filled ? "var(--brass)" : "none"}
        stroke="var(--brass)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
