/* A tiny shared mutable store bridging DOM scroll/pointer state into the
   WebGL render loop. Framer Motion writes here (outside React renders);
   the R3F useFrame loop reads it every frame. No re-renders involved. */
export const scrollBus = {
  /* 0→1 hero entrance progress (time-based intro, runs once) */
  heroIn: 0,
  /* 0→1 progress through the scroll-story section */
  story: 0,
  /* normalized pointer, -1→1, damped by the scene */
  px: 0,
  py: 0,
  /* overall canvas opacity/activity (fades after the story ends) */
  fade: 1,
};
