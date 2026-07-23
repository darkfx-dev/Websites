import { AnimatePresence, m } from "framer-motion";
import { brand } from "../../content/experience";
import { Poster } from "./Poster";

/* Shown until the WebGL scene has painted its first frame. No fake percentage —
   a brand indeterminate indicator that completes on the real ready signal. The
   poster is visible underneath so the page never starts on empty black. */
export function CinematicLoader({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-carbon"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          role="status"
          aria-live="polite"
        >
          <Poster className="opacity-40" />
          <div className="relative flex flex-col items-center gap-4">
            <span className="font-display text-[1.4rem] tracking-[0.2em] text-warm-white">
              {brand.wordmark}
            </span>
            <span className="relative h-[2px] w-40 overflow-hidden bg-white/10">
              <m.span
                className="absolute inset-y-0 w-1/3 bg-red"
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            <span className="sr-only">Loading the experience</span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
