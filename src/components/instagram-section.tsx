import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { business } from "@/data/business";
import { InstagramIcon } from "@/components/icons";
import { Reveal } from "@/components/motion-primitives";

export function InstagramSection() {
  return (
    <section aria-labelledby="instagram-heading" className="bg-cream pb-4">
      <div className="container-page">
        <Reveal>
          <div className="grain relative isolate overflow-hidden rounded-media bg-charcoal px-6 py-12 text-center text-cream sm:px-10 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-tomato/15 blur-3xl"
            />
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-card bg-white/10">
              <InstagramIcon className="h-7 w-7 text-saffron" />
            </span>
            <h2
              id="instagram-heading"
              className="mt-5 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold"
            >
              Follow us on Instagram
            </h2>
            <p className="mx-auto mt-3 max-w-md text-cream/80">
              Follow Mahesh Pav Bhaji for food updates and announcements.
            </p>
            <a
              href={business.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-button bg-saffron px-6 font-semibold text-charcoal transition-colors duration-160 hover:bg-[#e79b2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              {business.instagram.handle}
              <ArrowUpRight
                className="h-[18px] w-[18px] transition-transform duration-160 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
