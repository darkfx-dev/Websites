(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger, window.Draggable);
  }

  /* -------------------------------------------------------------
     shared rAF ticker — the one continuous animation loop on the
     page (CTA ambient particles). Everything else is scroll-scrubbed
     and needs no per-frame loop of its own.
  --------------------------------------------------------------*/
  const ticker = (() => {
    const callbacks = new Set();
    let running = false;
    function frame(t) {
      if (!running) return;
      callbacks.forEach((fn) => fn(t));
      requestAnimationFrame(frame);
    }
    return {
      add(fn) {
        callbacks.add(fn);
        if (!running) {
          running = true;
          requestAnimationFrame(frame);
        }
      },
      remove(fn) {
        callbacks.delete(fn);
        if (callbacks.size === 0) running = false;
      },
    };
  })();

  /* -------------------------------------------------------------
     0. Preloader -> Curtain Wipe -> Hero video start
  --------------------------------------------------------------*/
  function runPreloader() {
    const preloader = document.getElementById("preloader");
    const curtain = document.getElementById("curtain");
    const markPath = document.getElementById("mark-path");
    const markLine = document.querySelector("#preloader .mark-line");
    const startHero = () => window.EspressoHeroVideo && window.EspressoHeroVideo.start();

    document.body.style.overflow = "hidden";

    if (prefersReducedMotion) {
      preloader.style.display = "none";
      curtain.style.display = "none";
      document.body.style.overflow = "";
      startHero();
      return;
    }

    const len = markPath.getTotalLength();
    markPath.style.strokeDasharray = len;
    markPath.style.strokeDashoffset = len;

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
      },
    });

    tl.to(markPath, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" })
      .to(markLine, { scaleX: 1, duration: 0.35, ease: "power2.out" }, "-=0.1")
      .to({}, { duration: 0.35 }) // brief hold
      .add(startHero)
      .to([preloader, curtain], { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "<")
      .set([preloader, curtain], { display: "none" });
  }

  /* -------------------------------------------------------------
     1. Navbar — scroll state + light/dark section awareness
  --------------------------------------------------------------*/
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    window.addEventListener(
      "scroll",
      () => {
        navbar.classList.toggle("is-scrolled", window.scrollY > 40);
      },
      { passive: true }
    );

    const lightSections = [document.getElementById("process"), document.getElementById("faq")];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) navbar.classList.add("on-light");
        });
        const anyLightVisible = lightSections.some((s) => {
          const r = s.getBoundingClientRect();
          return r.top < 80 && r.bottom > 80;
        });
        navbar.classList.toggle("on-light", anyLightVisible);
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0 }
    );
    lightSections.forEach((s) => s && io.observe(s));
  }

  /* -------------------------------------------------------------
     1b. Ambient cursor glow — warm light trailing the pointer
  --------------------------------------------------------------*/
  function initCursorGlow() {
    if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;
    const glow = document.createElement("div");
    glow.id = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    let queued = false;
    let lastX = -500;
    let lastY = -500;
    window.addEventListener("pointermove", (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        glow.style.setProperty("--gx", lastX + "px");
        glow.style.setProperty("--gy", lastY + "px");
        queued = false;
      });
    });
  }

  /* -------------------------------------------------------------
     2. Magnetic hover-pull
  --------------------------------------------------------------*/
  function initMagnetic() {
    if (prefersReducedMotion) return;
    const RADIUS = 80;
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.classList.add("magnetic");
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS) {
          const pull = (1 - dist / RADIUS) * 0.35;
          gsap.to(el, { "--mx": dx * pull + "px", "--my": dy * pull + "px", duration: 0.3, ease: "power2.out" });
        }
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { "--mx": "0px", "--my": "0px", duration: 0.4, ease: "power3.out" });
      });
    });
  }

  /* -------------------------------------------------------------
     3. Mask Reveal — auto-wraps heading text into staggered words
  --------------------------------------------------------------*/
  function wrapMaskWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach((word, i) => {
      const wrap = document.createElement("span");
      wrap.className = "mask-word";
      const inner = document.createElement("span");
      inner.textContent = word;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    return el.querySelectorAll(".mask-word > span");
  }

  function initMaskReveals() {
    const targets = document.querySelectorAll(
      ".origins-intro h2, .process-heading h2, .testimonials-head h2, .faq-wrap h2, .roast-card-body h3"
    );
    targets.forEach((el) => {
      const spans = wrapMaskWords(el);
      if (prefersReducedMotion) {
        gsap.set(spans, { y: 0 });
        return;
      }
      gsap.set(spans, { y: "110%" });
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        onEnter: () => gsap.to(spans, { y: "0%", duration: 0.9, stagger: 0.06, ease: "power4.out" }),
        once: true,
      });
    });
  }

  /* -------------------------------------------------------------
     Hero headline mask reveal — synced to the curtain-wipe handoff
  --------------------------------------------------------------*/
  function initHeroHeadline() {
    const spans = document.querySelectorAll("#hero .mask-word > span");
    if (prefersReducedMotion) {
      gsap.set(spans, { y: 0 });
      return;
    }
    gsap.set(spans, { y: "110%" });
    // fires right after the curtain wipe hands off to the now-playing video
    gsap.to(spans, {
      y: "0%",
      duration: 1.1,
      stagger: 0.09,
      ease: "power4.out",
      delay: 2.3,
    });
    gsap.from(".hero-sub, .hero-cta-row", {
      opacity: 0,
      y: 16,
      duration: 0.9,
      delay: 2.9,
      stagger: 0.1,
      ease: "power2.out",
    });
  }

  /* -------------------------------------------------------------
     Curtain Wipe — Hero exit into the Liquid Morph section
  --------------------------------------------------------------*/
  function initHeroExitWipe() {
    const wipe = document.createElement("div");
    wipe.className = "curtain-wipe";
    wipe.style.position = "fixed";
    wipe.style.zIndex = "50";
    wipe.setAttribute("aria-hidden", "true");
    document.body.appendChild(wipe);

    gsap.set(wipe, { yPercent: 100 });

    if (prefersReducedMotion) {
      wipe.remove();
      return;
    }

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "bottom bottom",
          end: "+=100%",
          scrub: 0.7,
        },
      })
      .to(wipe, { yPercent: 0, ease: "none" })
      .to(wipe, { yPercent: -100, ease: "none" });
  }

  /* -------------------------------------------------------------
     4. Liquid Morph — real frame sequence
  --------------------------------------------------------------*/
  function initLiquidMorph() {
    const section = document.getElementById("liquid-morph");
    const canvas = document.getElementById("liquid-canvas");
    if (!section || !canvas || !window.EspressoFrameSequence) return;
    window.EspressoFrameSequence.create({
      canvas,
      frameCount: 300,
      framePath: (i) => `assets/sequence/ezgif-frame-${String(i).padStart(3, "0")}.jpg`,
      section,
    });
  }

  /* -------------------------------------------------------------
     5. Origins — pinned stacked cards + parallax drift layers
  --------------------------------------------------------------*/
  function initStackedCards() {
    const cards = gsap.utils.toArray(".stack-card");
    const stickies = gsap.utils.toArray(".stack-card-sticky");

    // first-appearance entrance — each card rises and settles into place
    cards.forEach((card, i) => {
      if (prefersReducedMotion) return;
      gsap.from(card, {
        opacity: 0,
        y: 60,
        scale: 0.96,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: stickies[i], start: "top 92%", once: true },
      });
    });

    // outgoing card scales/dims as the next one slides over it — damped
    // with a short gsap.to instead of an instant gsap.set for a smoother,
    // trailing feel rather than a value that snaps 1:1 with the scrollbar
    stickies.forEach((sticky, i) => {
      if (i === 0) return;
      const prevCard = cards[i - 1];
      ScrollTrigger.create({
        trigger: sticky,
        start: "top bottom",
        end: "top top",
        onUpdate: (self) => {
          gsap.to(prevCard, {
            scale: 1 - self.progress * 0.08,
            filter: `brightness(${1 - self.progress * 0.45})`,
            duration: 0.35,
            ease: "power1.out",
            overwrite: "auto",
          });
        },
      });
    });
  }

  /* -------------------------------------------------------------
     5b. Roast card tilt — subtle depth on pointer movement
  --------------------------------------------------------------*/
  function initCardTilt() {
    if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".stack-card-media").forEach((media) => {
      const texture = media.querySelector(".roast-texture");
      if (!texture) return;
      media.addEventListener("mousemove", (e) => {
        const rect = media.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(texture, {
          rotateX: py * -6,
          rotateY: px * 8,
          scale: 1.04,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
      media.addEventListener("mouseleave", () => {
        gsap.to(texture, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      });
    });
  }

  function initParallaxDrift() {
    document.querySelectorAll(".parallax-layer").forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed) || 0.3;
      gsap.to(layer, {
        yPercent: 40 * speed * -1,
        ease: "none",
        scrollTrigger: {
          trigger: layer.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    });
  }

  /* -------------------------------------------------------------
     6. The Ritual — per-word scroll-scrubbed illumination
  --------------------------------------------------------------*/
  function initRitual() {
    const words = gsap.utils.toArray("#ritual .ritual-word");
    if (!words.length) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#ritual",
        start: "top top",
        end: "+=140%",
        scrub: 0.8,
        pin: true,
      },
    });
    words.forEach((word) => {
      tl.to(word, { color: word.classList.contains("is-gold") ? getVar("--gold-foil") : getVar("--paper"), duration: 1 }, ">-0.15");
    });
  }

  function getVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /* -------------------------------------------------------------
     7. Process — pinned horizontal scroll
  --------------------------------------------------------------*/
  function initProcess() {
    const section = document.getElementById("process");
    const track = document.getElementById("process-track");
    const steps = gsap.utils.toArray(".process-step");
    const fill = document.getElementById("process-progress-fill");
    if (!section || !track) return;

    function getScrollDistance() {
      return Math.max(0, track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(document.documentElement).fontSize) * 4);
    }

    gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${section.offsetHeight - window.innerHeight}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.to(fill, { scaleX: self.progress, duration: 0.3, ease: "power1.out", overwrite: "auto" });
          const litCount = Math.round(self.progress * steps.length);
          steps.forEach((step, i) => step.classList.toggle("is-lit", i < litCount));
        },
      },
    });
  }

  /* -------------------------------------------------------------
     8. Stats — count-up + divider draw-in
  --------------------------------------------------------------*/
  function initStats() {
    const stats = document.querySelectorAll(".stat");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const stat = entry.target;
          const numEl = stat.querySelector(".stat-num");
          const divider = stat.querySelector(".divider");
          const target = parseInt(numEl.dataset.countTo, 10);

          gsap.set(divider, { scaleY: 0 });
          gsap.to(divider, { scaleY: 1, duration: 0.6, ease: "power2.out" });
          if (!prefersReducedMotion) {
            gsap.from(stat, { opacity: 0, y: 26, duration: 0.7, ease: "power2.out" });
          }

          if (prefersReducedMotion) {
            numEl.textContent = target;
          } else {
            const counter = { val: 0 };
            gsap.to(counter, {
              val: target,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => (numEl.textContent = Math.round(counter.val)),
            });
          }
          io.unobserve(stat);
        });
      },
      { threshold: 0.4 }
    );
    stats.forEach((s) => io.observe(s));
  }

  /* -------------------------------------------------------------
     9. Testimonials — draggable carousel
  --------------------------------------------------------------*/
  function initCarousel() {
    const viewport = document.getElementById("carousel-viewport");
    const track = document.getElementById("carousel-track");
    if (!viewport || !track || !window.Draggable) return;

    function bounds() {
      const max = 0;
      const min = Math.min(0, viewport.clientWidth - track.scrollWidth - 24);
      return { minX: min, maxX: max };
    }

    const dragInstance = Draggable.create(track, {
      type: "x",
      edgeResistance: 0.7,
      bounds: bounds(),
      inertia: false,
      onDragStart: () => viewport.classList.add("is-dragging"),
      onDragEnd: () => viewport.classList.remove("is-dragging"),
    })[0];

    window.addEventListener("resize", () => {
      dragInstance.applyBounds(bounds());
    });
  }

  /* -------------------------------------------------------------
     9b. Testimonials — stagger entrance for the cards themselves
  --------------------------------------------------------------*/
  function initTestimonialsReveal() {
    if (prefersReducedMotion) return;
    const cards = gsap.utils.toArray(".testi-card");
    if (!cards.length) return;
    gsap.from(cards, {
      opacity: 0,
      y: 40,
      scale: 0.96,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: "#testimonials", start: "top 75%", once: true },
      onComplete: () => gsap.set(cards, { clearProps: "transform" }),
    });
  }

  /* -------------------------------------------------------------
     10. FAQ accordion
  --------------------------------------------------------------*/
  function initFaqReveal() {
    if (prefersReducedMotion) return;
    const items = gsap.utils.toArray(".faq-item");
    if (!items.length) return;
    gsap.from(items, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger: "#faq", start: "top 80%", once: true },
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const btn = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("is-open");
      gsap.set(answer, { height: isOpen ? "auto" : 0 });

      btn.addEventListener("click", () => {
        const opening = !item.classList.contains("is-open");
        item.classList.toggle("is-open", opening);
        btn.setAttribute("aria-expanded", String(opening));

        if (opening) {
          gsap.set(answer, { height: "auto" });
          const h = answer.offsetHeight;
          gsap.fromTo(answer, { height: 0 }, { height: h, duration: 0.45, ease: "power2.out", onComplete: () => gsap.set(answer, { height: "auto" }) });
        } else {
          gsap.to(answer, { height: 0, duration: 0.35, ease: "power2.in" });
        }
      });
    });
  }

  /* -------------------------------------------------------------
     11. CTA — ambient particle drift + per-letter magnetic lift
  --------------------------------------------------------------*/
  function initCta() {
    const section = document.getElementById("cta");
    const canvas = document.getElementById("cta-canvas");
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    function resize() {
      w = canvas.width = section.clientWidth;
      h = canvas.height = section.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: prefersReducedMotion ? 0 : 36 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 30 + Math.random() * 90,
      speed: 0.00006 + Math.random() * 0.00012,
      phase: Math.random() * Math.PI * 2,
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.phase += p.speed * 16;
        const y = ((p.y - p.phase * 4) % 1.2 + 1.2) % 1.2;
        const alpha = 0.06 + Math.sin(p.phase * 3) * 0.03;
        const grad = ctx.createRadialGradient(p.x * w, y * h, 0, p.x * w, y * h, p.r);
        grad.addColorStop(0, `rgba(200,150,102,${Math.max(0, alpha)})`);
        grad.addColorStop(1, "rgba(200,150,102,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && particles.length) ticker.add(draw);
          else ticker.remove(draw);
        });
      },
      { threshold: 0.05 }
    );
    io.observe(section);

    if (!prefersReducedMotion) {
      const letters = section.querySelectorAll(".letter-lift");
      section.addEventListener("mousemove", (e) => {
        const rect = section.getBoundingClientRect();
        letters.forEach((letter) => {
          const lr = letter.getBoundingClientRect();
          const cx = lr.left + lr.width / 2 - rect.left;
          const cy = lr.top + lr.height / 2 - rect.top;
          const dx = e.clientX - rect.left - cx;
          const dy = e.clientY - rect.top - cy;
          const dist = Math.hypot(dx, dy);
          const radius = 90;
          if (dist < radius) {
            const lift = (1 - dist / radius) * 14;
            gsap.to(letter, { y: -lift, duration: 0.3, ease: "power2.out" });
          } else {
            gsap.to(letter, { y: 0, duration: 0.4, ease: "power2.out" });
          }
        });
      });
    }
  }

  /* -------------------------------------------------------------
     12. Footer back-to-top
  --------------------------------------------------------------*/
  function initFooter() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    if (prefersReducedMotion) return;

    gsap.from([".footer-grid", ".footer-bottom"], {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: { trigger: "footer", start: "top 85%", once: true },
    });

    gsap.to(".footer-watermark", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: { trigger: "footer", start: "top bottom", end: "bottom bottom", scrub: 1 },
    });
  }

  /* -------------------------------------------------------------
     Boot
  --------------------------------------------------------------*/
  document.addEventListener("DOMContentLoaded", () => {
    runPreloader();
    initNavbar();
    initCursorGlow();
    initMagnetic();
    initHeroHeadline();
    initHeroExitWipe();
    initLiquidMorph();
    initMaskReveals();
    initStackedCards();
    initCardTilt();
    initParallaxDrift();
    initRitual();
    initProcess();
    initStats();
    initCarousel();
    initTestimonialsReveal();
    initFaqReveal();
    initFaq();
    initCta();
    initFooter();

    window.addEventListener("load", () => ScrollTrigger.refresh());
  });
})();
