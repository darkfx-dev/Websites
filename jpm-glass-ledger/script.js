/* JPM & Co. — "Glass Ledger" design system
 * Step 3: animation setup.
 */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);

// Verify GSAP loaded
console.log("✓ GSAP version:", gsap.version);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Drive Lenis from GSAP's ticker and keep ScrollTrigger in sync with the
// smoothed scroll position, so every ScrollTrigger reveal/pin tracks Lenis
// rather than the native scroll (which would drift during smoothing).
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // GSAP ticker time is in seconds; Lenis expects ms
});
gsap.ticker.lagSmoothing(0);

console.log("✓ Lenis initialized");

// Verify Three.js loaded
console.log("✓ Three.js version:", THREE.REVISION);

/* ============================================================
 * Hero headline — word-by-word reveal on page load
 * (This is the only animated section in this step.)
 * ============================================================ */
const heroHeadline = document.querySelector("#hero-heading");

if (heroHeadline) {
  const splitHeadline = new SplitText(heroHeadline, { type: "words" });

  gsap.from(splitHeadline.words, {
    duration: 0.8,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    ease: "power2.out",
    delay: 0.3,
  });
}

/* ============================================================
 * Section 1 — About / Trust: fade + slide the text content in
 * on scroll. Only the text wrapper is animated (transform +
 * opacity); the background video is never touched by JS.
 * ============================================================ */
const aboutContent = document.querySelector(".about-content");

if (aboutContent) {
  gsap.from(aboutContent, {
    scrollTrigger: {
      trigger: "#about",
      start: "top 80%",
    },
    duration: 0.8,
    opacity: 0,
    y: 30,
    ease: "power2.out",
  });
}

/* ============================================================
 * Section 2 — Services: scroll-pinned stacking cards.
 * The section pins; as the user scrolls, each card rises from
 * below to lay over the previous one (like a deck being dealt),
 * while the card beneath scales down + dims for a sense of depth.
 * Only transform + opacity are animated. Restrained on purpose.
 * ============================================================ */
const serviceCards = gsap.utils.toArray("#services .service");

if (serviceCards.length > 1) {
  // First card in place; the rest wait just below the stage.
  serviceCards.forEach((card, i) => {
    gsap.set(card, { zIndex: i, yPercent: i === 0 ? 0 : 110 });
  });

  const stackTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#services",
      start: "top top",
      // ~0.7 viewport of scroll per card feels calm, not frantic
      end: () => "+=" + serviceCards.length * window.innerHeight * 0.7,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  serviceCards.forEach((card, i) => {
    if (i === 0) return;
    const prev = serviceCards[i - 1];
    stackTl
      .to(prev, { scale: 0.94, opacity: 0.5, ease: "none" }, i)
      .to(card, { yPercent: 0, ease: "none" }, i);
  });
}

/* ============================================================
 * Section 3 — Team: swipeable carousel on mobile (<= 768px),
 * plain single row on desktop. Swiper is created only when the
 * mobile media query matches and destroyed when it stops
 * matching, so desktop carries zero carousel behavior.
 * ============================================================ */
let teamSwiper = null;
const teamMq = window.matchMedia("(max-width: 768px)");

function syncTeamCarousel(mq) {
  if (mq.matches && !teamSwiper) {
    teamSwiper = new Swiper(".team-swiper", {
      slidesPerView: 1.2,
      centeredSlides: true,
      spaceBetween: 16,
      grabCursor: true,
      pagination: {
        el: ".team-swiper .swiper-pagination",
        clickable: true,
      },
    });
  } else if (!mq.matches && teamSwiper) {
    teamSwiper.destroy(true, true);
    teamSwiper = null;
  }
}

syncTeamCarousel(teamMq);
teamMq.addEventListener("change", syncTeamCarousel);
