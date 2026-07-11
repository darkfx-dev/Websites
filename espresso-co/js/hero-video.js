/* Dual stacked <video> crossfade loop for the hero.
   The confirmed asset is a fixed 10.0s / 24fps clip, so the loop point is
   hand-tuned to its real duration rather than read from `duration` alone —
   metadata duration can be a few ms off from the true last frame. */
(function () {
  const CROSSFADE_S = 0.5;
  const CLIP_DURATION_S = 10.0;

  const frame = document.querySelector(".hero-video-frame");
  const videoA = document.getElementById("hero-video-a");
  const videoB = document.getElementById("hero-video-b");
  const posterFallback = document.getElementById("hero-poster-fallback");
  const heroSection = document.getElementById("hero");

  if (!frame || !videoA || !videoB || !heroSection) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    frame.hidden = true;
    posterFallback.hidden = false;
    return;
  }

  let active = videoA;
  let idle = videoB;
  let crossfading = false;
  let rafId = null;
  let running = false;

  function swapRefs() {
    const tmp = active;
    active = idle;
    idle = tmp;
  }

  function startCrossfade() {
    if (crossfading) return;
    crossfading = true;

    idle.currentTime = 0;
    const playPromise = idle.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => {});

    idle.classList.add("is-crossfading");
    active.classList.add("is-crossfading");

    requestAnimationFrame(() => {
      idle.classList.add("is-active");
      active.classList.remove("is-active");
    });

    window.setTimeout(() => {
      active.pause();
      active.classList.remove("is-crossfading");
      idle.classList.remove("is-crossfading");
      swapRefs();
      crossfading = false;
    }, CROSSFADE_S * 1000 + 40);
  }

  function tick() {
    if (!running) return;
    if (!crossfading && active.currentTime >= CLIP_DURATION_S - CROSSFADE_S) {
      startCrossfade();
    }
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    const playPromise = videoA.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        // autoplay was blocked (rare with muted+playsinline, but guard anyway)
        frame.hidden = true;
        posterFallback.hidden = false;
        running = false;
      });
    }
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    videoA.pause();
    videoB.pause();
  }

  // pause decode/rendering cost when the hero scrolls off-screen
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
        else stop();
      });
    },
    { threshold: 0.05 }
  );
  io.observe(heroSection);

  window.EspressoHeroVideo = { start, stop };
})();
