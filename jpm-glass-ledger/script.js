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
