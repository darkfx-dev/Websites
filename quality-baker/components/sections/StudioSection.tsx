import { CakeStudio } from "@/components/studio/CakeStudio";
import { Reveal } from "@/components/Reveal";

export function StudioSection() {
  return (
    <section id="studio" className="bg-espresso text-porcelain">
      <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-caramel">
              The cake studio
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1.05] tracking-[-0.015em]">
              Build your cake
            </h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-porcelain/70">
              Choose your flavour, finish, and message. Tell us the date.
              We&rsquo;ll confirm availability and the final price on WhatsApp
              — nothing is booked until we&rsquo;ve spoken.
            </p>
          </div>
        </Reveal>
        <div className="mt-14">
          <CakeStudio />
        </div>
      </div>
    </section>
  );
}
