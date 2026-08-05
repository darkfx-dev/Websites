import type { ReactNode } from "react";

/** One heading composition for every chapter of the page. */
export function SectionHeading({
  eyebrow,
  title,
  id,
  support,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  id?: string;
  support?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-copper uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="text-section text-ink">
        {title}
      </h2>
      {support ? <p className="measure mt-4 text-secondary">{support}</p> : null}
    </div>
  );
}
