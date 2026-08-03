import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Monospace index label, e.g. "02 / work". */
  eyebrow: string;
  title: ReactNode;
  /** Supporting sentence. Optional. */
  lede?: ReactNode;
  /** The heading level to render. Sections use h2. */
  as?: "h2" | "h3";
  id?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Tag = "h2",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-prose", className)}>
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden="true" className="inline-block h-px w-8 bg-line" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={70}>
        <Tag id={id} className="mt-5 text-2xl">
          {title}
        </Tag>
      </Reveal>
      {lede ? (
        <Reveal delay={130}>
          <p className="mt-5 text-base text-ink-soft">{lede}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
