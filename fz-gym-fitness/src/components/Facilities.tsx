import {
  Dumbbell,
  Heart,
  UserCheck,
  LayoutGrid,
  CalendarDays,
  Users,
  type LucideIcon,
} from "lucide-react";
import { facilities, type Facility } from "@/config/siteConfig";
import { Reveal } from "./ui/Reveal";

const iconMap: Record<Facility["icon"], LucideIcon> = {
  dumbbell: Dumbbell,
  heart: Heart,
  "user-check": UserCheck,
  layout: LayoutGrid,
  calendar: CalendarDays,
  users: Users,
};

export function Facilities() {
  return (
    <section id="facilities" className="relative py-20 sm:py-28">
      <div className="container-px">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">
            Facilities &amp; Benefits
          </span>
          <h2 className="heading mt-4 text-3xl text-ink sm:text-4xl">
            Everything you need to{" "}
            <span className="neon-text">train with purpose</span>
          </h2>
          <p className="mt-4 text-muted">
            Focus areas and membership benefits designed to keep you moving
            forward.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f, i) => {
            const Icon = iconMap[f.icon];
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <article className="glass-card group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40 hover:shadow-neon-lime motion-reduce:hover:translate-y-0">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-lime/30 bg-lime/10 text-lime transition-colors group-hover:bg-lime/20">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {f.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
