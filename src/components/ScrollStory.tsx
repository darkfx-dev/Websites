import { forwardRef, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { site } from "../content/site";

/* The scroll-driven 3D narrative. The outer section is tall (380vh);
   a sticky viewport pins the text while scroll progress drives both the
   text states here and the sculpture states in the WebGL layer (via
   scrollBus, written by VisualLayer from this same element's progress).
   Deterministic and fully reversible when scrolling back up. */

const WINDOWS: [number, number][] = [
  [0.02, 0.24],
  [0.28, 0.48],
  [0.53, 0.71],
  [0.76, 0.97],
];

function StoryState({
  progress,
  window: [start, end],
  title,
  body,
  index,
}: {
  progress: MotionValue<number>;
  window: [number, number];
  title: string;
  body: string;
  index: number;
}) {
  const fadeSpan = 0.05;
  const opacity = useTransform(
    progress,
    [start, start + fadeSpan, end - fadeSpan, end],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, start + fadeSpan], [24, 0]);
  return (
    <motion.div className="story__state" style={{ opacity, y }}>
      <p className="story__index">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="story__title">{title}</h3>
      <p className="story__body">{body}</p>
    </motion.div>
  );
}

export const ScrollStory = forwardRef<HTMLElement>(function ScrollStory(_, ref) {
  const localRef = useRef<HTMLElement | null>(null);
  const setRefs = (el: HTMLElement | null) => {
    localRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: localRef,
    offset: ["start start", "end end"],
  });

  /* Reduced motion: present the same content as a simple stacked list —
     complete hierarchy, no pinning, no scroll-linked movement. */
  if (reduced) {
    return (
      <section className="section story story--static" ref={setRefs} aria-label="How the studio thinks">
        <div className="container">
          <div className="story__static-grid">
            {site.story.states.map((s, i) => (
              <div className="story__state" key={s.title}>
                <p className="story__index">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="story__title">{s.title}</h3>
                <p className="story__body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="story" ref={setRefs} aria-label="How the studio thinks">
      <div className="story__sticky">
        <div className="container story__stage">
          {site.story.states.map((s, i) => (
            <StoryState
              key={s.title}
              progress={scrollYProgress}
              window={WINDOWS[i]}
              title={s.title}
              body={s.body}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
