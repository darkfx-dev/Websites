import { m, useTransform, type MotionValue } from "framer-motion";
import type { Scene } from "../../content/experience";
import { finalCta, legal } from "../../content/experience";
import { overlayRange } from "../../lib/progress";
import { PrimaryCTA } from "../ui/PrimaryCTA";

/* One text overlay per scene, entering/leaving by scroll range. The container
   opacity handles enter+leave; each line's own opacity (driven by the local
   in-window progress) staggers the entrance — nested opacities compound, so
   they stagger in and fade out together. A left contrast scrim keeps copy
   readable over the footage. */
export function SceneOverlay({
  scene,
  index,
  isLast,
  progress,
  onRestart,
}: {
  scene: Scene;
  index: number;
  isLast: boolean;
  progress: MotionValue<number>;
  onRestart: () => void;
}) {
  const [a, b, c, d] = overlayRange(index);
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [30, 0, 0, -30]);
  const local = useTransform(progress, [a, b], [0, 1]); // 0..1 across entrance
  // Staggered per-line entrance (fixed order — safe for rules-of-hooks).
  const lineEyebrow = useTransform(local, [0, 0.35], [0, 1]);
  const lineTitle = useTransform(local, [0.12, 0.47], [0, 1]);
  const lineBody = useTransform(local, [0.24, 0.59], [0, 1]);
  const lineCta = useTransform(local, [0.36, 0.71], [0, 1]);

  return (
    <m.div
      className="pointer-events-none fixed inset-0 z-10 flex items-center"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* localized contrast protection, left side only */}
      <div
        className="absolute inset-y-0 left-0 w-[min(680px,80%)]"
        style={{ background: "linear-gradient(90deg, rgba(7,7,7,0.82), rgba(7,7,7,0.35) 55%, transparent)" }}
      />
      <m.div style={{ y }} className="relative mx-auto w-full max-w-[82rem] px-[clamp(1.1rem,4vw,3rem)]">
        <div className="max-w-[34rem]">
          <m.div style={{ opacity: lineEyebrow }} className="mb-4 flex items-center gap-3">
            <span className="redline" style={{ background: scene.accent }} />
            <span className="eyebrow">{scene.eyebrow}</span>
          </m.div>
          <m.h2
            style={{ opacity: lineTitle }}
            className="text-warm-white"
            // fluid display size
          >
            <span style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}>{scene.title}</span>
          </m.h2>
          <m.p
            style={{ opacity: lineBody }}
            className="mt-5 max-w-[30rem] text-[1.05rem] text-ink-soft"
          >
            {scene.body}
          </m.p>

          {isLast && (
            <m.div style={{ opacity: lineCta }} className="pointer-events-auto mt-8 flex flex-wrap gap-3">
              <PrimaryCTA variant="primary" onClick={onRestart}>
                {finalCta.primary.label}
              </PrimaryCTA>
              <PrimaryCTA variant="secondary" href={finalCta.secondary.href}>
                {finalCta.secondary.label}
              </PrimaryCTA>
            </m.div>
          )}

          {isLast && (
            <m.p style={{ opacity: lineCta }} className="mt-8 max-w-[30rem] text-[0.72rem] leading-relaxed text-silver">
              {legal.disclaimer}
            </m.p>
          )}
        </div>
      </m.div>
    </m.div>
  );
}
