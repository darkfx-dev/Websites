import { PastryArt } from "@/components/PastryArt";
import { Reveal } from "@/components/Reveal";

/**
 * Gallery — currently an illustrated plate, honestly labelled as such.
 * Swap each tile for a next/image of a real cake when photos arrive
 * (see the note in PastryArt.tsx).
 */
const pieces = [
  { variant: "tiered", label: "Tiered wedding & engagement cakes" },
  { variant: "candles", label: "Birthday cakes, any theme" },
  { variant: "layer", label: "Classic cream layer cakes" },
  { variant: "cupcake", label: "Cupcake boxes for parties" },
  { variant: "slice", label: "Pastry slices, daily fresh" },
  { variant: "croissant", label: "Small bakes & breads" },
] as const;

export function Gallery() {
  return (
    <section aria-label="Gallery" className="bg-espresso text-cream">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.06] tracking-[-0.015em]">
              From the counter
            </h2>
            <p className="max-w-[34ch] text-sm leading-relaxed text-cream/60">
              Hand-drawn for now — this grid is waiting for photographs of the
              real thing, straight from the shop.
            </p>
          </div>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {pieces.map((piece, i) => (
            <li key={piece.variant}>
              <Reveal delay={0.05 * i}>
                <figure className="frame overflow-hidden rounded-2xl border border-caramel/15 bg-ink/40">
                  <PastryArt
                    variant={piece.variant}
                    className="aspect-square w-full"
                  />
                  <figcaption className="border-t border-caramel/15 px-4 py-3 text-[0.85rem] text-cream/70 sm:px-5">
                    {piece.label}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
