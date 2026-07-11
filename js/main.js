import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ---------- Lenis smooth scroll, synced to GSAP's ticker ---------- */
const lenis = new Lenis({
  autoRaf: false,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ---------- SplitText hero reveal ---------- */
const heroSplit = new SplitText(".hero__title", { type: "chars" });

gsap.from(heroSplit.chars, {
  yPercent: 120,
  opacity: 0,
  duration: 0.8,
  ease: "power4.out",
  stagger: 0.02,
  delay: 0.2,
});

/* ---------- ScrollTrigger reveal for each section ---------- */
gsap.utils.toArray("[data-reveal]").forEach((el) => {
  gsap.from(el, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
});

/* ---------- Three.js: one spinning shape ---------- */
const canvas = document.querySelector("#webgl");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 6);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 200, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0x7c5cff,
  roughness: 0.3,
  metalness: 0.6,
});
const shape = new THREE.Mesh(geometry, material);
scene.add(shape);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(3, 3, 4);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x7c5cff, 2, 20);
rimLight.position.set(-4, -2, -3);
scene.add(rimLight);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

gsap.ticker.add(() => {
  shape.rotation.x += 0.003;
  shape.rotation.y += 0.005;
  renderer.render(scene, camera);
});
