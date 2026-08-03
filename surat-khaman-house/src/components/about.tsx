import { Reveal } from "@/components/motion/reveal";

/**
 * Deliberately short. There is no founder, family history, founding date,
 * award, secret recipe or sourcing story here because none of that has been
 * verified — and no area, address or landmark, because location belongs to
 * the final section.
 */
export function About() {
  return (
    <section
      id="about"
      className="section-y border-b border-[rgba(10,10,10,0.12)]"
    >
      <Reveal className="container-page">
        <p className="section-index text-xs font-semibold uppercase text-muted">
          03 — About
        </p>

        <div className="mt-3 grid gap-8 lg:grid-cols-12">
          <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.01em] text-ink lg:col-span-5">
            A Surti farsan counter
          </h2>

          <p className="max-w-measure text-lg text-ink-soft lg:col-span-7">
            Surat Khaman House is a vegetarian Surti breakfast and farsan
            outlet. Its listed menu includes locho, khaman, idada, patudi,
            patra, sev khamani, samosas, pattice and ghee jalebi. Customers can
            browse the menu and contact the outlet to confirm current prices
            and availability.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
