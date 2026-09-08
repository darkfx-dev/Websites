/* Generic scroll-scrubbed canvas frame sequence.
   Drives the Liquid Morph section from the real 300-frame shot sequence
   (assets/sequence/) rather than a procedural blob-morph — this is genuine
   footage, so drawing it is cheaper and truer than simulating it. */
(function () {
  function createFrameSequence({ canvas, frameCount, framePath, section, sticky }) {
    const ctx = canvas.getContext("2d");
    const images = new Array(frameCount);
    let loadedCount = 0;
    let currentFrame = 1;
    let ready = false;

    function drawFrame(index) {
      const img = images[index - 1];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    function loadFrame(i) {
      if (images[i - 1]) return images[i - 1];
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(i);
      img.onload = () => {
        loadedCount += 1;
        if (i === currentFrame) drawFrame(i);
        if (!ready && loadedCount >= Math.min(12, frameCount)) {
          ready = true;
          drawFrame(currentFrame);
        }
      };
      images[i - 1] = img;
      return img;
    }

    function setFrame(index) {
      const clamped = Math.min(frameCount, Math.max(1, index));
      currentFrame = clamped;
      loadFrame(clamped);
      drawFrame(clamped);
    }

    // preload the first handful eagerly for an instant first paint,
    // then stream the rest in the background once the section nears view
    for (let i = 1; i <= Math.min(12, frameCount); i++) loadFrame(i);

    const lazyIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            for (let i = 1; i <= frameCount; i++) loadFrame(i);
            lazyIO.disconnect();
          }
        });
      },
      { rootMargin: "150% 0px 150% 0px" }
    );
    lazyIO.observe(section);

    if (window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          const index = Math.round(1 + self.progress * (frameCount - 1));
          setFrame(index);
        },
      });
    }

    return { setFrame };
  }

  window.EspressoFrameSequence = { create: createFrameSequence };
})();
