import { isPlaceholder, profile } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Text } from "@/components/ui/content";
import { WorkingPrinciples } from "./working-principles";

/**
 * About + how I work.
 *
 * The years-of-experience sentence is only rendered when a real value exists,
 * because a portfolio that says "[Years of experience] years" is worse than
 * one that simply doesn't mention it.
 */
export function About() {
  const hasYears = !isPlaceholder(profile.yearsOfExperience);

  return (
    <section id="about" className="section-y relative">
      <div className="shell">
        <SectionHeading
          eyebrow="01 / about"
          title="A bit about how I work"
          id="about-heading"
        />

        <div className="mt-14 grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            {/* Editorial statement, revealed as masked lines. */}
            <div className="space-y-4 text-lg leading-relaxed text-ink">
              <Reveal mask delay={0}>
                <p>
                  I&rsquo;m <Text value={profile.name} />, a{" "}
                  <Text value={profile.role} /> based in{" "}
                  <Text value={profile.location} />.
                </p>
              </Reveal>
              {hasYears ? (
                <Reveal mask delay={90}>
                  <p className="text-ink-soft">
                    I&rsquo;ve spent {profile.yearsOfExperience} working on{" "}
                    <Text value={profile.domain} />.
                  </p>
                </Reveal>
              ) : (
                <Reveal mask delay={90}>
                  <p className="text-ink-soft">
                    I work on <Text value={profile.domain} />.
                  </p>
                </Reveal>
              )}
              <Reveal mask delay={180}>
                <p className="text-ink-soft">
                  Right now I&rsquo;m <Text value={profile.currentStatus} />.
                </p>
              </Reveal>
            </div>

            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
                <div>
                  <p className="eyebrow">Currently learning</p>
                  <p className="mt-2 text-sm text-ink">
                    <Text value={profile.currentlyLearning} />
                  </p>
                </div>
                <div>
                  <p className="eyebrow">Away from the screen</p>
                  <p className="mt-2 text-sm text-ink">
                    <Text value={profile.humanDetail} />
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <WorkingPrinciples />
        </div>
      </div>
    </section>
  );
}
