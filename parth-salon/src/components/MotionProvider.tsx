import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { easeHeritage } from "../motion/variants";

/* Loads only the DOM animation feature set (smaller bundle than the full
   `motion` import) and makes the whole tree honour the OS reduced-motion
   setting automatically. All components use the `m.*` primitives. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: easeHeritage }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
