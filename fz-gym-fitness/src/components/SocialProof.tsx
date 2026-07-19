import { Star, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { Reveal } from "./ui/Reveal";

export function SocialProof() {
  return (
    <section id="reviews" className="relative py-20 sm:py-28">
      <div className="container-px">
        <Reveal className="mx-auto max-w-3xl">
          <div className="glass-card overflow-hidden p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
            <div className="relative">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">
                Loved by our members
              </span>

              <div className="mt-6 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-7 w-7 fill-lime text-lime"
                    aria-hidden="true"
                  />
                ))}
              </div>

              <div className="mt-5 font-display text-5xl font-bold text-ink sm:text-6xl">
                {siteConfig.rating}
                <span className="text-3xl text-muted"> / 5</span>
              </div>
              <p className="mt-2 text-muted">
                Based on{" "}
                <span className="font-semibold text-ink">
                  {siteConfig.reviewCount} genuine reviews
                </span>{" "}
                on Google Maps
              </p>

              <a
                href={siteConfig.links.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-base transition-all hover:shadow-neon-lime hover:brightness-110"
              >
                See Reviews on Google Maps
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
