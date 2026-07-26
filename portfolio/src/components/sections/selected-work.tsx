import { projects } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";

/**
 * Selected work.
 *
 * Three projects, deliberately. A long list invites skimming; three invites
 * reading. If `projects` is ever emptied the section removes itself rather
 * than rendering an empty shell.
 */
export function SelectedWork() {
  if (projects.length === 0) return null;

  return (
    <section id="work" className="section-y relative">
      <div className="shell">
        <SectionHeading
          eyebrow="02 / work"
          title="Things I have built"
          lede="Each one starts with the problem it existed to solve, and ends with what actually happened — including when that is still early."
          id="work-heading"
        />

        <div className="mt-16 space-y-24 lg:mt-20 lg:space-y-32">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
