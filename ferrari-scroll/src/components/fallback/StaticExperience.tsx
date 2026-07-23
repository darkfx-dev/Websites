import { scenes, finalCta, legal } from "../../content/experience";
import { Poster } from "../cinematic/Poster";
import { PrimaryCTA } from "../ui/PrimaryCTA";
import { SiteHeader } from "../navigation/SiteHeader";

/* Reduced-motion / Save-Data / no-WebGL path: a fully readable, natively
   scrolled page. No scrubbing, no forced motion — the same story as stacked
   editorial sections over a static poster. */
export function StaticExperience() {
  return (
    <div className="relative">
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteHeader />
      <div className="fixed inset-0 z-0">
        <Poster />
      </div>
      <main id="main" className="relative z-10">
        {scenes.map((s, i) => {
          const Heading = i === 0 ? "h1" : "h2";
          const last = i === scenes.length - 1;
          return (
            <section
              key={s.id}
              id={s.id}
              className="mx-auto flex min-h-screen max-w-[82rem] flex-col justify-center px-[clamp(1.1rem,4vw,3rem)] py-24"
            >
              <div className="max-w-[36rem] rounded-[3px] bg-carbon/70 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="redline" style={{ background: s.accent }} />
                  <span className="eyebrow">{s.eyebrow}</span>
                </div>
                <Heading className="text-warm-white" style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}>
                  {s.title}
                </Heading>
                <p className="mt-5 text-[1.05rem] text-ink-soft">{s.body}</p>
                {last && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    <PrimaryCTA variant="primary" href="#reveal">
                      {finalCta.primary.label}
                    </PrimaryCTA>
                    <PrimaryCTA variant="secondary" href={finalCta.secondary.href}>
                      {finalCta.secondary.label}
                    </PrimaryCTA>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>
      <footer className="relative z-10 border-t border-white/10 bg-carbon px-[clamp(1.1rem,4vw,3rem)] py-8">
        <p className="mx-auto max-w-[82rem] text-[0.78rem] leading-relaxed text-silver">
          {legal.disclaimer}
        </p>
      </footer>
    </div>
  );
}
