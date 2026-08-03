import Image from "next/image";
import { gallery, isPlaceholder } from "@/data/site";
import { Corner, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";
import { FurnitureArt, type ArtKind } from "@/components/ui/FurnitureArt";

/**
 * Gallery.
 *
 * Each tile shows a photograph when one has been supplied and a drawing when
 * one has not. It never shows a stock photo of somebody else's furniture as
 * though it were this workshop's — that is the one thing a furniture gallery
 * must not do, and the reason the fallback is a drawing rather than a
 * borrowed image.
 *
 * The aspect ratio is fixed on every tile, so swapping a drawing for a real
 * photograph cannot shift the layout.
 */
export function Gallery() {
  if (gallery.length === 0) return null;

  return (
    <section id="gallery" className="section-y relative" aria-labelledby="gallery-title">
      <div className="page">
        <Reveal>
          <SectionHeading
            label="Gallery"
            title="Recent work"
            lede="Pieces we have built for customers. Every one was made to a specific room's measurements."
            id="gallery-title"
          />
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, i) => {
            const photo = !isPlaceholder(item.src);
            return (
              <Reveal as="li" key={item.caption} delay={i * 70}>
                <figure className="card group relative m-0 overflow-hidden">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1b1512]">
                    {photo ? (
                      <Image
                        src={item.src}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center p-10 transition-transform duration-500 ease-soft group-hover:scale-[1.03]">
                        <FurnitureArt kind={item.art as ArtKind} />
                      </div>
                    )}
                    <Corner position="tl" className="m-3" />
                    <Corner position="br" className="m-3" />
                  </div>

                  <figcaption className="flex items-baseline justify-between gap-4 border-t border-hairline px-5 py-4">
                    <span className="text-sm text-silk">{item.caption}</span>
                    {!photo ? (
                      <span className="text-label text-silk-faint">
                        Drawing
                        <span className="sr-only">
                          {" "}
                          — illustration shown because no photograph has been
                          supplied for this piece yet
                        </span>
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
