import { useEffect, useState } from "react";
import { subscribe, view, type ScrollView } from "../lib/scroll";

/**
 * Quantised scroll state for DOM chrome.
 *
 * Only the header and the meter rail use this. Everything animated by scroll
 * position in 3D reads `view` inside the render loop instead, so this hook is
 * never the reason a frame is dropped.
 */
export function useScrollView(): ScrollView {
  const [snapshot, setSnapshot] = useState<ScrollView>(() => ({ ...view }));

  useEffect(
    () => subscribe((next) => setSnapshot({ ...next })),
    []
  );

  return snapshot;
}
