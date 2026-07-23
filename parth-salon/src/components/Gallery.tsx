import { useCallback, useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { business } from "../config/business";
import { sectionReveal, staggerParent, staggerChild, viewportOnce, duration, easeHeritage } from "../motion/variants";
import { ResponsiveMedia } from "./ResponsiveMedia";

/* Gallery grid + accessible lightbox.
   Pattern adapted from the 21st.dev "Gallery Grid with Lightbox"
   (moumensoliman/gallery-grid-block-shadcnui). Reworked to the Parth Salon
   design system (forest/ivory/silver, the `m` LazyMotion primitives, our
   ResponsiveMedia), the shadcn Badge/Button/Card deps removed, and the
   lightbox hardened: focus trap, Escape to close, ←/→ navigation, body
   scroll-lock, and focus returned to the triggering tile on close.

   Renders nothing unless real gallery images exist, so it never shows
   placeholders. */
export function Gallery() {
  const images = business.galleryImages;
  const [index, setIndex] = useState<number | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null); // tile that opened the lightbox

  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const openAt = useCallback((i: number) => {
    openerRef.current = tileRefs.current[i];
    setIndex(i);
  }, []);

  // Scroll-lock + focus management. Runs only on open/close (not on navigation),
  // so arrow-key paging never churns focus, and closing returns focus to the
  // tile that originally opened the lightbox.
  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [open]);

  // Keyboard: Escape closes, arrows navigate, Tab is trapped in the dialog.
  // close/next/prev are stable (useCallback), so this binds once per open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  if (images.length === 0) return null;
  const current = index !== null ? images[index] : null;

  return (
    <section id="gallery" className="bg-ivory">
      <div className="container-page py-20 md:py-28">
        <m.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <p className="eyebrow text-forest-rich">Gallery</p>
          <h2 className="section-title text-forest" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            A look inside
          </h2>
          <p className="max-w-[44ch] text-[1.02rem] text-muted-ink">
            A few views of the salon in Katargam. Select an image to view it larger.
          </p>
        </m.div>

        <m.ul
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {images.map((img, i) => (
            <m.li key={img.src} variants={staggerChild}>
              <button
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                type="button"
                onClick={() => openAt(i)}
                aria-haspopup="dialog"
                aria-label={`View larger: ${img.title}`}
                className="group relative block w-full cursor-pointer overflow-hidden rounded-[10px] border border-silver-line bg-white transition-colors hover:border-forest-rich"
              >
                <span className="block aspect-square overflow-hidden">
                  <m.span className="block h-full w-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3, ease: easeHeritage }}>
                    <ResponsiveMedia
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      widths={img.widths}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                      className="block h-full w-full"
                      imgClassName="h-full w-full object-cover"
                    />
                  </m.span>
                </span>
                {/* Decorative hover/focus overlay — the label above carries the info */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-forest-deep/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <ZoomIn className="h-7 w-7 text-ivory" />
                  <span className="font-display text-[1.2rem] text-ivory">{img.title}</span>
                </span>
              </button>
            </m.li>
          ))}
        </m.ul>
      </div>

      <AnimatePresence>
        {open && current && (
          <m.div
            className="on-dark fixed inset-0 z-200 flex items-center justify-center bg-forest-deep/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.nav }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery image: ${current.title}`}
            ref={dialogRef}
          >
            {/* Controls */}
            <button
              ref={closeRef}
              type="button"
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Close gallery"
              className="tap absolute right-4 top-4 inline-flex items-center justify-center rounded-full text-ivory hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="tap absolute left-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full text-ivory hover:bg-white/10 sm:left-4"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="tap absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full text-ivory hover:bg-white/10 sm:right-4"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Image + caption */}
            <figure className="max-h-[86svh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <m.div
                key={current.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: duration.micro }}
                className="overflow-hidden rounded-[10px] border border-white/15"
              >
                <ResponsiveMedia
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  widths={current.widths}
                  sizes="(min-width: 1024px) 1024px, 92vw"
                  loading="eager"
                  imgClassName="max-h-[72svh] w-auto object-contain"
                />
              </m.div>
              <figcaption className="mt-3 text-center text-[0.9rem] text-silver">
                {current.title}
                <span className="ml-2 tabular-nums text-ivory/60">
                  {index! + 1} / {images.length}
                </span>
              </figcaption>
            </figure>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
