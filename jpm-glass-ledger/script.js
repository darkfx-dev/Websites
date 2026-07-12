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

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

console.log("✓ Lenis initialized");

// Verify Three.js loaded
console.log("✓ Three.js version:", THREE.REVISION);
