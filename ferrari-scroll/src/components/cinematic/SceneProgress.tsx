import { useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { scenes } from "../../content/experience";
import { SCENE_COUNT } from "../../lib/progress";

/* Five-stop progress rail (desktop). Anchor links keep native scrolling + full
   keyboard access; the active stop reflects live scroll position. Hidden on
   small screens where the mobile menu covers navigation. */
export function SceneProgress({ progress }: { progress: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setActive(Math.round(Math.min(1, Math.max(0, v)) * (SCENE_COUNT - 1)));
  });

  return (
    <nav
      aria-label="Scenes"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
    >
      {scenes.map((s, i) => {
        const on = i === active;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={on ? "true" : undefined}
            className="group flex items-center justify-end gap-3"
          >
            <span
              className={`font-body text-[0.7rem] uppercase tracking-[0.16em] transition-opacity ${
                on ? "text-warm-white opacity-100" : "text-silver opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              }`}
            >
              {s.label}
            </span>
            <span
              className="inline-block rounded-full transition-all"
              style={{
                width: on ? 10 : 7,
                height: on ? 10 : 7,
                background: on ? s.accent : "transparent",
                border: `1px solid ${on ? s.accent : "var(--color-silver)"}`,
              }}
            />
            <span className="sr-only">{`Go to ${s.label}`}</span>
          </a>
        );
      })}
    </nav>
  );
}
