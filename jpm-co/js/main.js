/* ==========================================================================
   JPM & Co. — "Glass Ledger" motion system
   Steps 3–5: Lenis smooth scroll, GSAP/ScrollTrigger choreography, polish.

   Governing rule (from the brief): every effect must make the firm look
   MORE PRECISE, never distracting. All entrances settle (decelerating
   ease); nothing bounces, nothing loops in the reading path.

   Progressive enhancement contract:
   - Without JS, or if a CDN fails, the page is fully readable (initial
     hidden states are gated behind the html.js class, removed on failure).
   - prefers-reduced-motion: native scroll, no parallax/pinning/wipes;
     content reveals as simple short opacity fades, count-ups render final
     values instantly.
   ========================================================================== */

(function () {
    "use strict";

    var docEl = document.documentElement;

    /* CDN failure guard: if GSAP didn't arrive, un-hide everything and exit.
       The site degrades to a clean static page. */
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        docEl.classList.remove("js");
        var wipe = document.querySelector(".page-wipe");
        if (wipe) { wipe.remove(); }
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var EASE = "expo.out"; /* JS-side twin of cubic-bezier(0.16,1,0.3,1) */
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(pointer: fine)").matches;

    var pageWipe = document.querySelector(".page-wipe");
    var lenis = null;

    /* ---------------------------------------------------------------------
       SMOOTH SCROLL (Lenis) — skipped under reduced motion
       ScrollTrigger and Lenis share one clock via gsap.ticker.
       --------------------------------------------------------------------- */
    function initLenis() {
        if (reduceMotion || typeof Lenis === "undefined") { return; }

        lenis = new Lenis({
            duration: 1.1,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }
        });

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }

    /* Anchor navigation: wipe covers the jump, reveals at the destination.
       Under reduced motion we simply let the browser jump natively. */
    function initAnchorNavigation() {
        var header = document.querySelector(".site-header");
        var navRoot = document.querySelector(".nav");
        var links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function (link) {
            link.addEventListener("click", function (event) {
                var target = document.querySelector(link.getAttribute("href"));
                if (!target) { return; }
                event.preventDefault();
                closeMobileMenu();

                if (reduceMotion || !pageWipe) {
                    target.scrollIntoView();
                    return;
                }

                /* Navy wipe with neon leading edge (brief §6) */
                var tl = gsap.timeline();
                tl.set(pageWipe, { yPercent: 100, autoAlpha: 1 })
                  .to(pageWipe, { yPercent: 0, duration: 0.4, ease: "power3.in" })
                  .add(function () {
                      var y = target.getBoundingClientRect().top + window.scrollY;
                      if (lenis) { lenis.scrollTo(y, { immediate: true }); }
                      else { window.scrollTo(0, y); }
                      ScrollTrigger.refresh();
                  })
                  .to(pageWipe, { yPercent: -100, duration: 0.5, ease: "power3.out" }, "+=0.05")
                  /* Park hidden: otherwise the neon edge peeks at the
                     viewport bottom while the overlay waits off-screen */
                  .set(pageWipe, { yPercent: 100, autoAlpha: 0 });
            });
        });

        /* Mobile menu toggle */
        var toggle = document.querySelector(".nav__toggle");
        function closeMobileMenu() {
            navRoot.classList.remove("nav--open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
        }
        toggle.addEventListener("click", function () {
            var open = navRoot.classList.toggle("nav--open");
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        /* Header switches to structural black once the hero is left */
        ScrollTrigger.create({
            start: "top -60",
            onUpdate: function (self) {
                header.classList.toggle("is-scrolled", self.scroll() > 60);
            }
        });
    }

    /* ---------------------------------------------------------------------
       SCROLL PROGRESS BAR — spatial orientation (brief §2)
       --------------------------------------------------------------------- */
    function initProgressBar() {
        gsap.to(".scroll-progress", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3
            }
        });
    }

    /* ---------------------------------------------------------------------
       HERO — word-by-word rise with blur-to-sharp resolve (brief §1)
       --------------------------------------------------------------------- */
    function initHero() {
        var words = gsap.utils.toArray(".hero__word");

        var intro = gsap.timeline({ delay: 0.15 });

        /* Lift the initial cover wipe to reveal the hero */
        if (pageWipe) {
            intro.to(pageWipe, {
                yPercent: -100,
                duration: 0.7,
                ease: "power3.inOut",
                onComplete: function () {
                    pageWipe.classList.remove("page-wipe--initial");
                    gsap.set(pageWipe, { yPercent: 100, autoAlpha: 0 });
                }
            });
        }

        intro.fromTo(words,
            { opacity: 0, y: 22, filter: "blur(7px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                duration: 0.9,
                ease: EASE,
                stagger: 0.075,           /* 75ms per word, per brief */
                clearProps: "filter,willChange"
            }, "-=0.25")
        .from([".hero__subtitle", ".hero__actions", ".hero__seal-wrap"], {
            opacity: 0, y: 18,
            duration: 0.9,
            ease: EASE,
            stagger: 0.12
        }, "-=0.55")
        .from(".hero__scroll-cue", { opacity: 0, duration: 0.8 }, "-=0.3");

        /* Parallax depth: background layers drift slower than the copy.
           Ledger grid rises gently; mesh even less. (brief §2) */
        gsap.to(".hero__ledger-grid", {
            yPercent: -12,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
        gsap.to(".hero__mesh", {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });

        /* NOTE: #hero-seal-mount is intentionally untouched here.
           Step 6 (reserved) mounts the Three.js glass-and-gold seal. */
    }

    /* ---------------------------------------------------------------------
       GENERIC REVEALS — opacity + translateY + scale 0.96 → 1
       The "settling into place" entrance used site-wide (brief §2).
       --------------------------------------------------------------------- */
    function settleIn(targets, trigger, extra) {
        gsap.from(targets, Object.assign({
            opacity: 0,
            y: 32,
            scale: 0.96,
            duration: 1,
            ease: EASE,
            stagger: 0.1,
            scrollTrigger: {
                trigger: trigger,
                start: "top 78%",
                toggleActions: "play none none none"
            }
        }, extra || {}));
    }

    function initSectionReveals() {
        gsap.utils.toArray(".section-head").forEach(function (head) {
            settleIn(head.children, head);
        });
        settleIn(".about__copy p", ".about__inner");
        settleIn(".about__media", ".about__inner", { stagger: 0 });
        settleIn(".contact__details > *", ".contact__inner", { stagger: 0.06 });
        settleIn(".contact__map-wrap", ".contact__inner", { stagger: 0 });
        settleIn(".trust__badges .badge", ".trust__badges");
    }

    /* ---------------------------------------------------------------------
       SERVICES — pinned sequence on desktop, cards slide from alternating
       sides (brief §2/§3). Mobile keeps a simple per-card settle: pinning
       tall scrub sections on small screens reads as scroll-jacking.
       --------------------------------------------------------------------- */
    function initServices() {
        var cards = gsap.utils.toArray(".service-card");

        ScrollTrigger.matchMedia({

            /* Desktop: pin the section; cards take turns entering */
            "(min-width: 1024px)": function () {
                var tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".services",
                        start: "top top",
                        end: "+=140%",
                        pin: true,
                        scrub: 0.6
                    }
                });

                cards.forEach(function (card, i) {
                    /* fromTo, not from: scrubbed from() tweens re-capture
                       start values on ScrollTrigger.refresh and corrupt
                       the resting position. Explicit states are stable. */
                    tl.fromTo(card,
                        { xPercent: (i % 2 === 0) ? -45 : 45, autoAlpha: 0 },
                        {
                            xPercent: 0,
                            autoAlpha: 1,
                            ease: "power2.out",
                            duration: 1,
                            immediateRender: true
                        }, i * 0.65);
                    /* paused(false): the tween is built paused for the
                       standalone mobile path; inside a scrubbed timeline
                       the timeline must drive it */
                    tl.add(drawIconTween(card).paused(false), i * 0.65 + 0.35);
                });
            },

            /* Mobile / tablet: independent settles, alternating slide-in */
            "(max-width: 1023px)": function () {
                cards.forEach(function (card, i) {
                    gsap.from(card, {
                        opacity: 0,
                        x: (i % 2 === 0) ? -36 : 36,
                        y: 24,
                        duration: 0.9,
                        ease: EASE,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%",
                            toggleActions: "play none none none",
                            onEnter: function () { drawIconTween(card).play(); }
                        }
                    });
                });
            }
        });
    }

    /* SVG stroke self-drawing — "meticulous, line-by-line" (brief §3).
       Returns a paused tween so it can slot into timelines or fire solo. */
    function drawIconTween(card) {
        var strokes = card.querySelectorAll(".icon-stroke");
        strokes.forEach(function (path) {
            var len = path.getTotalLength();
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
        });
        return gsap.to(strokes, {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: "power2.inOut",
            stagger: 0.15,
            paused: true
        });
    }

    /* ---------------------------------------------------------------------
       TRUST — count-ups fire ONCE, decelerating into the final figure
       (brief §4). Tabular numerals in CSS prevent digit jitter.
       --------------------------------------------------------------------- */
    function initCountUps() {
        gsap.utils.toArray(".stat__value").forEach(function (el) {
            var target = parseInt(el.dataset.countTo, 10) || 0;
            var suffix = el.dataset.countSuffix || "";
            var state = { value: 0 };

            ScrollTrigger.create({
                trigger: el,
                start: "top 82%",
                once: true, /* first scroll-into-view only */
                onEnter: function () {
                    gsap.to(state, {
                        value: target,
                        duration: 2.2,
                        ease: "power3.out", /* decelerates as it lands */
                        onUpdate: function () {
                            el.textContent = Math.round(state.value) + suffix;
                        }
                    });
                }
            });
        });
    }

    /* ---------------------------------------------------------------------
       CURSOR GLOW TRAIL — desktop only, additive to the native cursor
       (brief §5). quickTo keeps it off the main-thread hot path.
       --------------------------------------------------------------------- */
    function initCursorGlow() {
        if (!finePointer) { return; }

        var glow = document.createElement("div");
        glow.className = "cursor-glow";
        glow.setAttribute("aria-hidden", "true");
        document.body.appendChild(glow);

        var xTo = gsap.quickTo(glow, "x", { duration: 0.35, ease: "power3.out" });
        var yTo = gsap.quickTo(glow, "y", { duration: 0.35, ease: "power3.out" });

        window.addEventListener("pointermove", function (e) {
            if (e.pointerType !== "mouse") { return; }
            xTo(e.clientX);
            yTo(e.clientY);
            gsap.to(glow, { opacity: 1, duration: 0.3, overwrite: "auto" });
        });
        document.addEventListener("mouseleave", function () {
            gsap.to(glow, { opacity: 0, duration: 0.3 });
        });

        /* Glow tightens over interactive elements */
        document.querySelectorAll("a, button").forEach(function (el) {
            el.addEventListener("mouseenter", function () {
                gsap.to(glow, { scale: 1.7, duration: 0.3, ease: EASE });
            });
            el.addEventListener("mouseleave", function () {
                gsap.to(glow, { scale: 1, duration: 0.3, ease: EASE });
            });
        });
    }

    /* ---------------------------------------------------------------------
       REDUCED MOTION PATH — non-negotiable (brief §6)
       Everything visible; stats show final values; short fades only.
       --------------------------------------------------------------------- */
    function initReducedMotion() {
        if (pageWipe) { pageWipe.remove(); }

        gsap.set(".hero__word", { opacity: 1 });

        document.querySelectorAll(".stat__value").forEach(function (el) {
            el.textContent = (el.dataset.countTo || "0") + (el.dataset.countSuffix || "");
        });

        /* Gentle opacity-only acknowledgement of section entry */
        gsap.utils.toArray("section, .footer").forEach(function (block) {
            gsap.from(block, {
                opacity: 0,
                duration: 0.4,
                ease: "none",
                scrollTrigger: { trigger: block, start: "top 90%", once: true }
            });
        });

        initProgressBar();      /* informational, not decorative — keep */
        initAnchorNavigation(); /* wipe branch is skipped internally */
    }

    /* ---------------------------------------------------------------------
       BOOT
       --------------------------------------------------------------------- */
    function init() {
        if (reduceMotion) {
            initReducedMotion();
            return;
        }
        initLenis();
        initAnchorNavigation();
        initProgressBar();
        initHero();
        initSectionReveals();
        initServices();
        initCountUps();
        initCursorGlow();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
