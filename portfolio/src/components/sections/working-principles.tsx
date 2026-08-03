import { principles } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";

/**
 * How I work, on a thin vertical timeline.
 *
 * An ordered list, because the order is the argument: understand the problem,
 * ship, write it down, protect quality by cutting scope. Rendered beside the
 * About copy rather than as its own section — it is context for the person,
 * not a separate claim.
 */
export function WorkingPrinciples() {
  if (principles.length === 0) return null;

  return (
    <ol className="relative" aria-label="How I work">
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[7px] top-2 w-px bg-line"
      />
      {principles.map((p, i) => (
        <Reveal
          as="li"
          key={p.title}
          delay={i * 90}
          className="relative pb-9 pl-9 last:pb-0"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-[7px] grid h-[15px] w-[15px] place-items-center rounded-full border border-line-strong bg-background"
          >
            <span className="h-[5px] w-[5px] rounded-full bg-accent" />
          </span>
          <h3 className="text-base font-medium tracking-tight text-ink">
            {p.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}
