import "./scene-fallback.css";

/**
 * What stands in for the scene when WebGL is unavailable, the device is too
 * modest, or reduced motion is set.
 *
 * Pure CSS: no canvas, no shader compile, no animation frame. It is a
 * composition rather than a blank rectangle, because for a reduced-motion
 * visitor this *is* the scene, permanently — it should look finished, not
 * like something failed to load.
 */
export function SceneFallback() {
  return (
    <div className="fallback" aria-hidden="true">
      <div className="fallback__glow" />
      <div className="fallback__core" />
      <div className="fallback__ring fallback__ring--a" />
      <div className="fallback__ring fallback__ring--b" />
      <div className="fallback__ring fallback__ring--c" />
    </div>
  );
}
