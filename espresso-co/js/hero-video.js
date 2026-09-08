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
  const heroSection = document.getElementById("hero");

  if (!frame || !videoA || !videoB || !heroSection) return;

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

  let retryArmed = false;

  // some sandboxed/embedded viewers block autoplay outright even when muted —
  // if that happens, retry on the first real user interaction instead of
  // giving up and sitting on the static poster forever
  function armInteractionRetry() {
    if (retryArmed) return;
    retryArmed = true;
    const retry = () => {
      retryArmed = false;
      const p = videoA.play();
      if (p && p.catch) p.catch(() => {});
    };
    ["pointerdown", "touchstart", "keydown", "wheel", "scroll"].forEach((evt) =>
      window.addEventListener(evt, retry, { once: true, passive: true })
    );
  }

  function start() {
    if (running) return;
    running = true;
    const playPromise = videoA.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        armInteractionRetry();
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
