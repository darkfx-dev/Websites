import { Reveal } from "./ui/Reveal";
import { siteConfig } from "@/config/siteConfig";

export function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="container-px grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">
            About Us
          </span>
          <h2 className="heading mt-4 text-3xl text-ink sm:text-4xl">
            A local gym built around{" "}
            <span className="neon-text">your results</span>
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
            <p>
              {siteConfig.name} is a welcoming, results-focused fitness centre
              in Rustampura, Surat. Whether you are starting your first workout
              or chasing a new personal best, you will find the space, the
              equipment focus, and the encouragement to keep going.
            </p>
            <p>
              Our approach is simple: consistent training, honest guidance, and
              a supportive community that shows up for each other. No hype —
              just steady progress you can feel.
            </p>
          </div>
        </Reveal>

        {/* Stats — only genuine, confirmed figures are shown here. */}
        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 text-center">
              <div className="font-display text-4xl font-bold text-lime">
                {siteConfig.rating}
                <span className="text-2xl">★</span>
              </div>
              <p className="mt-1 text-sm text-muted">Google rating</p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="font-display text-4xl font-bold text-cyan">
                {siteConfig.reviewCount}
              </div>
              <p className="mt-1 text-sm text-muted">Member reviews</p>
            </div>
            <div className="glass-card col-span-2 p-6">
              <p className="text-sm leading-relaxed text-muted">
                <span className="font-semibold text-ink">
                  Located in Rustampura, Surat.
                </span>{" "}
                Easy to reach, easy to make part of your daily routine.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
