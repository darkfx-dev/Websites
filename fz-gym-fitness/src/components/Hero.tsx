"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { Button } from "./ui/Button";
import { RatingBadge } from "./ui/RatingBadge";
import { Hero3D } from "./Hero3D";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scroll-linked movement of the 3D visual (disabled for reduced motion).
  const visualY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const visualScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduce ? 1 : 0.9]
  );
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24"
    >
      {/* Backdrop: grid + cinematic glows */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-lime/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-cyan/10 blur-[120px]" />

      <div className="container-px relative grid items-center gap-10 lg:grid-cols-2 lg:gap-8">
        {/* Copy */}
        <motion.div style={{ y: textY }} className="min-w-0 max-w-xl">
          <RatingBadge className="mb-6" />

          <h1 className="heading text-[1.7rem] leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
            {siteConfig.name}
            <span className="mt-3 block neon-text">
              Build Strength.
              <br />
              Transform Your Life.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Show up, stay consistent, and grow stronger with a community that
            has your back. Train with focus at a results-driven gym in
            Rustampura, Surat.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#pricing" variant="primary" size="lg">
              View Membership Plans
            </Button>
            <Button
              href={siteConfig.links.googleMaps}
              variant="secondary"
              size="lg"
              external
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Get Directions
            </Button>
          </div>

          {/* Phone + location */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-lime"
            >
              <Phone className="h-4 w-4 text-lime" aria-hidden="true" />
              {siteConfig.phoneDisplay}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan" aria-hidden="true" />
              Rustampura, Surat
            </span>
          </div>
        </motion.div>

        {/* 3D visual */}
        <motion.div
          style={{ y: visualY, scale: visualScale }}
          className="flex min-w-0 items-center justify-center lg:justify-end"
        >
          <div className="w-full max-w-[300px] sm:max-w-md">
            <Hero3D />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
