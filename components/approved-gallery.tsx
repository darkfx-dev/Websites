import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { approvedAssets, featureFlags } from "@/data/outlet";

/**
 * Conditional photo gallery.
 *
 * No rights-cleared photography of this outlet has been verified, so
 * `approvedAssets` is empty and this renders nothing at all — no heading, no
 * navigation entry, no reserved whitespace, and no placeholder. Customer
 * uploads on Google, Justdial and Restaurant Guru are reference material and
 * must never be copied in.
 *
 * When the owner supplies originals with written permission, add them to
 * `approvedAssets` and flip `APPROVED_PHOTOS_AVAILABLE`. Rights fields stay
 * server-side; only `src`, `alt` and dimensions reach the markup.
 */
export function ApprovedGallery() {
  if (!featureFlags.APPROVED_PHOTOS_AVAILABLE || approvedAssets.length === 0) return null;

  return (
    <section id="gallery" className="container-page scroll-mt-24 py-20 md:py-28">
      <Reveal>
        <h2 className="text-section text-ink">Inside the outlet</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {approvedAssets.map((asset) => (
            <li key={asset.src} className="overflow-hidden rounded-[1.25rem] border border-border">
              <Image
                src={asset.src}
                alt={asset.alt}
                width={asset.width}
                height={asset.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-full w-full object-cover"
                style={asset.focalPoint ? { objectPosition: asset.focalPoint } : undefined}
              />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
