# Lenis Scroll Library Reference

Quick reference for Lenis smooth scrolling library core usage and GSAP integration.

## Basic Setup

To initialize Lenis with automatic animation frame handling:

```javascript
const lenis = new Lenis({
  autoRaf: true,
});

lenis.on('scroll', (e) => {
  console.log(e);
});
```

Alternatively, manage the animation loop manually:

```javascript
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

## GSAP ScrollTrigger Synchronization

To connect Lenis with GSAP's ScrollTrigger plugin:

```javascript
const lenis = new Lenis();

// Sync scroll events with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Integrate Lenis into GSAP's ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable lag smoothing for responsiveness
gsap.ticker.lagSmoothing(0);
```

This approach ensures smooth scroll animations work alongside GSAP animations by updating ScrollTrigger on each frame and converting GSAP's time values from seconds to milliseconds for Lenis.

## Key Points

- **autoRaf**: Automatically manages requestAnimationFrame if set to true
- **scroll event**: Fires on every scroll event with scroll data
- **ScrollTrigger sync**: Use `lenis.on('scroll', ScrollTrigger.update)` to keep scroll triggers in sync
- **GSAP ticker integration**: Convert GSAP time (seconds) to milliseconds for Lenis
- **lagSmoothing(0)**: Disable GSAP's lag smoothing for immediate responsiveness
