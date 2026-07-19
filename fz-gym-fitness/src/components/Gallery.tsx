import { ImageIcon } from "lucide-react";
import { gallery } from "@/config/siteConfig";
import { cn } from "@/lib/utils";
import { Reveal } from "./ui/Reveal";

/**
 * Responsive gallery. These are ABSTRACT, clearly-replaceable placeholders —
 * they do NOT purport to show the actual gym, trainers, or members. Swap in
 * authentic photography via the `gallery` array in siteConfig.
 */
export function Gallery() {
  return (
    <section id="gallery" className="relative py-20 sm:py-28">
      <div className="container-px">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">
            Gallery
          </span>
          <h2 className="heading mt-4 text-3xl text-ink sm:text-4xl">
            Inside the <span className="neon-text">energy</span>
          </h2>
          <p className="mt-4 text-sm text-muted">
            Placeholder visuals — replace with authentic photos of the gym.
          </p>
        </Reveal>

        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] lg:grid-cols-3">
          {gallery.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.05}
              className={cn(
                i === 0 && "sm:col-span-2 sm:row-span-2",
                i === 3 && "lg:col-span-2"
              )}
            >
              <div
                role="img"
                aria-label={item.alt}
                className={cn(
                  "group relative flex h-full w-full items-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-5",
                  item.gradient
                )}
              >
                <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
                <ImageIcon
                  className="absolute right-4 top-4 h-6 w-6 text-white/20"
                  aria-hidden="true"
                />
                <span className="relative font-display text-lg font-semibold uppercase tracking-wide text-ink/90">
                  {item.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
