/* Centralized motion tokens for the DOM overlay layer. */
import type { Variants, Transition } from "framer-motion";

export const easeCine: Transition["ease"] = [0.22, 1, 0.36, 1];

export const dur = { micro: 0.22, ui: 0.35, reveal: 0.6 };

/** Staggered entrance for an overlay's eyebrow → title → body → cta. */
export const overlayParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

export const overlayChild: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: easeCine } },
};

export const menuPanel: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: dur.ui, ease: easeCine } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: easeCine } },
};
