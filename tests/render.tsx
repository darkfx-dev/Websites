import { render } from "@testing-library/react";
import type { ReactElement } from "react";

import { MotionProvider } from "@/components/motion/motion-provider";

/** Every `m.*` component needs the LazyMotion provider that wraps the app. */
export function renderWithMotion(ui: ReactElement) {
  return render(<MotionProvider>{ui}</MotionProvider>);
}
