import Image from "next/image";
import { ArrowUpRight, Code } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { isPlaceholder } from "@/data/portfolio";
import { MediaRequirement, SafeLink, Text } from "@/components/ui/content";
import { TiltCard } from "@/components/motion/tilt-card";
import { Reveal } from "@/components/motion/reveal";
import { ProjectFlowPreview } from "./project-flow-preview";
import { cn } from "@/lib/utils";

/**
 * One project, told in the order someone actually needs it:
 * what was wrong → what I did → what happened.
 *
 * The layout alternates side to side so a list of three does not read as a
 * template, but the DOM order is constant: heading, then narrative, then
 * media. Reversing columns is done with `lg:order-*`, which leaves reading
 * order and tab order alone.
 */
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const flipped = index % 2 === 1;
  const hasFlow = (project.flow?.screens.length ?? 0) >= 3;
  const headingId = `project-${project.slug}`;

  return (
    <article
      aria-labelledby={headingId}
      className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      {/* ── Narrative ─────────────────────────────────────────────────── */}
      <div className={cn(flipped && "lg:order-2")}>
        <Reveal>
          <p className="eyebrow">
            {String(index + 1).padStart(2, "0")} — selected work
          </p>
        </Reveal>

        <Reveal delay={70}>
          <h3 id={headingId} className="mt-4 text-xl">
            <Text value={project.name} />
          </h3>
        </Reveal>

        <Reveal delay={130}>
          <dl className="mt-7 space-y-5">
            <div>
              <dt className="eyebrow">The problem</dt>
              <dd className="mt-1.5 text-base leading-relaxed text-ink-soft">
                <Text value={project.problem} />
              </dd>
            </div>
            <div>
              <dt className="eyebrow">What I did</dt>
              <dd className="mt-1.5 text-base leading-relaxed text-ink-soft">
                <Text value={project.whatIDid} />
              </dd>
            </div>
            <div>
              <dt className="eyebrow">What happened</dt>
              <dd className="mt-1.5 text-base leading-relaxed text-ink-soft">
                <Text value={project.outcome} />
              </dd>
            </div>
          </dl>
        </Reveal>

        {project.stack.length > 0 ? (
          <Reveal delay={190}>
            <ul className="mt-7 flex flex-wrap gap-2" aria-label="Built with">
              {project.stack.map((tool, i) => (
                <li
                  key={`${tool}-${i}`}
                  {...(isPlaceholder(tool) ? { "data-placeholder": "true" } : {})}
                  className={cn(
                    "mono rounded-sm border px-2.5 py-1 text-xs",
                    isPlaceholder(tool)
                      ? "border-dashed border-accent/45 bg-accent-soft/40 text-ink-soft"
                      : "border-line text-ink-soft"
                  )}
                >
                  {tool}
                  {isPlaceholder(tool) ? (
                    <span className="sr-only">
                      {" "}
                      (placeholder — content not yet supplied)
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <Reveal delay={250}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SafeLink
              href={project.liveUrl}
              className="btn btn-ghost"
              ariaLabel={`${project.name} — view live`}
            >
              View live
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </SafeLink>
            <SafeLink
              href={project.codeUrl}
              className="btn btn-quiet inline-flex items-center gap-2"
              ariaLabel={`${project.name} — read the code`}
            >
              <Code className="h-4 w-4" aria-hidden="true" />
              Read the code
            </SafeLink>
          </div>
        </Reveal>
      </div>

      {/* ── Media ─────────────────────────────────────────────────────── */}
      <Reveal
        delay={120}
        className={cn(flipped && "lg:order-1")}
      >
        <TiltCard>
          {hasFlow ? (
            <ProjectFlowPreview project={project} />
          ) : project.cover ? (
            <figure className="liquid-glass m-0 overflow-hidden rounded-lg">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover object-top"
                />
              </div>
            </figure>
          ) : (
            <MediaRequirement
              className="aspect-[16/10]"
              title={`${project.name}: no interface images supplied yet`}
              detail="Add a cover image, or three ordered screenshots for the flow walk-through, in src/data/portfolio.ts. Nothing is invented in its place."
            />
          )}
        </TiltCard>
      </Reveal>
    </article>
  );
}
