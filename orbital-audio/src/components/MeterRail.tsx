import { useScrollView } from "../hooks/useScrollView";

const SEGMENTS = 22;

const LABELS: Record<string, string> = {
  hero: "Input",
  product: "Signal",
  workflow: "Decode",
  pricing: "Output",
  cta: "Output",
  footer: "Mute",
};

/**
 * A channel meter standing in for a progress bar.
 *
 * A progress bar would say the same thing in the vocabulary of every other
 * site; a meter says it in the vocabulary of the room this product lives in.
 * The lit segments track position through the page and the peak segment runs
 * ahead in phosphor, the way a peak-hold indicator does.
 *
 * Decorative and `aria-hidden`. The header nav carries the real navigation,
 * so nothing here is the only route to anything, and nothing is lost with it
 * removed. It is hidden below 1180px, where there is no margin to spare.
 */
export function MeterRail() {
  const { progress, active } = useScrollView();
  const lit = Math.round(progress * SEGMENTS);

  return (
    <div className="meter" aria-hidden="true">
      <div className="meter__scale">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className="meter__seg"
            data-lit={i < lit || undefined}
            data-peak={i === lit - 1 || undefined}
          />
        ))}
      </div>
      <span className="meter__label">{LABELS[active] ?? ""}</span>
    </div>
  );
}
