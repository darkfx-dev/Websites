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

/* ============================================================
 * Section 4 — Contact: a single gentle fade-in on scroll.
 * Deliberately the quietest moment on the page — a resting
 * point, mirroring the About reveal pattern but softer (y: 20).
 * ============================================================ */
const contactSection = document.querySelector("#contact");

if (contactSection) {
  gsap.from(contactSection, {
    scrollTrigger: {
      trigger: "#contact",
      start: "top 80%",
    },
    duration: 0.8,
    opacity: 0,
    y: 20,
    ease: "power2.out",
  });
}

/* ============================================================
 * THE SEAL — the hero's glass-and-gold medallion.
 * The one deliberate moment of spectacle on the page.
 *
 * Layered construction: engraved gold outer ring (lathe profile
 * with inner/outer bevels + sunburst bump + brushed roughness
 * variation), aged-bronze inlay ring, recessed physical-glass
 * lens, and an engraved gold backing disc the light reaches
 * through the glass.
 *
 * Motion states (composed via a 3-deep group rig so they never
 * fight): idle Y-rotation (~20s/turn, gsap.ticker-driven) →
 * breathing scale (desktop only) → scroll-scrubbed scale/tilt →
 * pointer tilt (>1024px) → touch tap rim-light pulse (<400ms).
 *
 * Fallbacks: prefers-reduced-motion or missing WebGL swaps in a
 * static poster image. Render loop is frame-capped (60 desktop /
 * 30 mobile) and geometry has a low-poly mobile variant.
 * ============================================================ */
(function initSeal() {
  const mount = document.querySelector(".hero-seal");
  if (!mount) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function webglAvailable() {
    try {
      const c = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }

  function showPoster() {
    const img = document.createElement("img");
    img.className = "seal-poster";
    img.src = "seal-poster.jpg";
    img.alt = "";
    mount.appendChild(img);
  }

  if (
    prefersReducedMotion ||
    typeof THREE === "undefined" ||
    !webglAvailable()
  ) {
    showPoster();
    return;
  }

  const isMobileWidth = window.innerWidth < 768; // geometry + fps variant

  /* ---------- Renderer / scene / camera ---------- */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    showPoster(); // context creation failed despite the probe
    return;
  }
  renderer.setClearColor(0x000000, 0); // transparent — hero backdrop shows through
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileWidth ? 1.75 : 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
  camera.position.set(0, 0, 4.05); // seal ≈ 52-57% of viewport height at 60vh mount

  function resize() {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  /* ---------- Environment map (procedural gradient studio) ----------
     A soft navy-to-warm gradient dome plus a few bright "softbox"
     panels, PMREM-processed, so the gold picks up streaky studio
     reflections that visibly travel as the seal rotates. */
  (function buildEnvironment() {
    const envScene = new THREE.Scene();
    // Gradient dome via CanvasTexture on a basic material — custom
    // ShaderMaterials render black inside r128's PMREM pass, so the
    // gradient must come from a texture, not a shader.
    const gc = document.createElement("canvas");
    gc.width = 2;
    gc.height = 256;
    const gg = gc.getContext("2d");
    const grad = gg.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#59503c"); // warm bronze-gray above (keeps the gold golden)
    grad.addColorStop(1, "#0b1d33"); // deep navy below
    gg.fillStyle = grad;
    gg.fillRect(0, 0, 2, 256);
    const gradMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(gc),
      side: THREE.BackSide,
    });
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(10, 16, 12), gradMat));

    // Studio softboxes: one large warm key panel, one cool strip, one crown
    function panel(color, intensity, w, h, pos, lookAtOrigin) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity) })
      );
      m.position.copy(pos);
      if (lookAtOrigin) m.lookAt(0, 0, 0);
      envScene.add(m);
    }
    panel(0xffdda6, 6, 5, 3, new THREE.Vector3(4, 5, 3), true);   // warm gold key
    panel(0xcfe0ff, 2, 1.2, 6, new THREE.Vector3(-5, -2, 2), true); // cool strip
    panel(0xffe9c4, 3, 8, 1, new THREE.Vector3(0, 7, -2), true);  // warm crown streak

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.04).texture; // r128 clips sigma > ~0.04
    pmrem.dispose();
  })();

  /* ---------- Procedural textures ---------- */
  // Sunburst engraving: fine radiating lines, applied as a bump map.
  function makeSunburstBump(lineCount) {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 64;
    const g = c.getContext("2d");
    g.fillStyle = "#808080";
    g.fillRect(0, 0, c.width, c.height);
    const step = c.width / lineCount;
    for (let i = 0; i < lineCount; i++) {
      const x = i * step;
      const grad = g.createLinearGradient(x, 0, x + step, 0);
      grad.addColorStop(0.0, "#808080");
      grad.addColorStop(0.35, "#c8c8c8"); // raised ridge
      grad.addColorStop(0.5, "#404040");  // engraved groove
      grad.addColorStop(0.65, "#c8c8c8");
      grad.addColorStop(1.0, "#808080");
      g.fillStyle = grad;
      g.fillRect(x, 0, step, c.height);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // Brushed-metal roughness variation: soft horizontal noise streaks so the
  // gold reads as handled metal, not a uniform computer surface.
  function makeBrushedRoughness() {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) {
      const y = Math.random() * 256;
      const x = Math.random() * 256;
      const len = 20 + Math.random() * 90;
      const shade = 205 + Math.floor(Math.random() * 50); // 0.80–1.0 multiplier
      g.strokeStyle = "rgb(" + shade + "," + shade + "," + shade + ")";
      g.globalAlpha = 0.35;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + len, y + (Math.random() - 0.5) * 3);
      g.stroke();
    }
    g.globalAlpha = 1;
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  const sunburstTex = makeSunburstBump(120);
  const brushedTex = makeBrushedRoughness();

  /* ---------- Materials ---------- */
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xc9a961, // Glass Ledger gold, exact
    metalness: 0.9,
    roughness: 0.35,
    bumpMap: sunburstTex,
    bumpScale: 0.012,
    roughnessMap: brushedTex,
    envMapIntensity: 1.0,
  });

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0x7d5f38, // aged bronze, deliberately darker than the gold
    metalness: 0.85,
    roughness: 0.5,
    envMapIntensity: 0.8,
    side: THREE.DoubleSide, // collar interior visible at glancing angles
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xf2f6fa,
    metalness: 0,
    roughness: 0.05,
    transmission: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    envMapIntensity: 1.3,
  });
  // r128's constructor rejects these two as setValues keys; assign directly.
  // (thickness only affects shading on newer three revisions — declared per
  // spec so the material carries the intended physical description.)
  glassMat.thickness = 0.5;
  glassMat.ior = 1.5;

  const backingMat = new THREE.MeshStandardMaterial({
    color: 0xc9a961,
    metalness: 0.9,
    roughness: 0.45,
    bumpMap: sunburstTex,
    bumpScale: 0.008,
    envMapIntensity: 0.6,
  });

  /* ---------- Geometry (desktop vs low-poly mobile variant) ----------
     Segment counts give ~2.3k vertices on desktop and ~26% of that on
     mobile — both far below the hard 15k ceiling. */
  const SEG = isMobileWidth
    ? { ring: 36, inlay: 24, glass: 18, backing: 14 }
    : { ring: 128, inlay: 96, glass: 64, backing: 48 };

  function lathe(profilePairs, segments) {
    const pts = profilePairs.map((p) => new THREE.Vector2(p[0], p[1]));
    const geo = new THREE.LatheGeometry(pts, segments);
    geo.rotateX(Math.PI / 2); // face the camera (+Z)
    return geo;
  }

  // Gold ring: bevelled outer edge, engraved face, bevelled inner edge.
  const ringGeo = lathe(
    [
      [0.62, -0.1],
      [0.62, 0.05],
      [0.67, 0.1],  // inner bevel up to the face
      [0.95, 0.1],  // engraved front face
      [1.0, 0.05],  // outer bevel
      [1.0, -0.06],
      [0.95, -0.1], // back bevel
      [0.62, -0.1],
    ],
    SEG.ring
  );

  // Bronze inlay: a thin fitted lip between gold and glass.
  const inlayGeo = lathe(
    [
      [0.55, 0.0],
      [0.55, 0.06],
      [0.585, 0.085],
      [0.62, 0.06],
      [0.62, 0.0],
    ],
    SEG.inlay
  );

  // Bronze collar: closes the cavity between glass rim and ring so angled
  // views never see through the assembly — it must read as solid metalwork.
  const collarGeo = lathe(
    [
      [0.585, -0.14],
      [0.585, 0.02],
    ],
    SEG.inlay
  );

  // Glass lens: gently domed front, flat back, sits recessed.
  const glassGeo = lathe(
    [
      [0.02, 0.09],
      [0.18, 0.085],
      [0.34, 0.065],
      [0.46, 0.035],
      [0.54, -0.005],
      [0.56, -0.04],
      [0.56, -0.08],
      [0.3, -0.09],
      [0.02, -0.09],
    ],
    SEG.glass
  );

  const backingGeo = new THREE.CircleGeometry(0.58, SEG.backing);

  /* ---------- Rig hierarchy (motion states compose, never fight) ----
     scrollRig  — scroll-scrubbed scale + X tilt
       pointerRig — cursor-follow tilt (desktop > 1024px)
         spin     — idle Y rotation + breathing scale            */
  const scrollRig = new THREE.Group();
  const pointerRig = new THREE.Group();
  const spin = new THREE.Group();

  const ringMesh = new THREE.Mesh(ringGeo, goldMat);
  const inlayMesh = new THREE.Mesh(inlayGeo, bronzeMat);
  const collarMesh = new THREE.Mesh(collarGeo, bronzeMat);
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  const backingMesh = new THREE.Mesh(backingGeo, backingMat);
  glassMesh.position.z = -0.04; // recessed behind the ring face
  backingMesh.position.z = -0.14;

  spin.add(ringMesh, inlayMesh, collarMesh, glassMesh, backingMesh);
  pointerRig.add(spin);
  scrollRig.add(pointerRig);
  scene.add(scrollRig);

  const vertexCount =
    ringGeo.attributes.position.count +
    inlayGeo.attributes.position.count +
    collarGeo.attributes.position.count +
    glassGeo.attributes.position.count +
    backingGeo.attributes.position.count;

  /* ---------- Lighting: dedicated three-point setup + slow sweep ---- */
  const keyLight = new THREE.DirectionalLight(0xffe3b3, 1.5); // warm gold key
  keyLight.position.set(2.5, 3, 2.5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xbfd4ff, 0.3); // cool low fill
  fillLight.position.set(-2.5, -2, 1.5);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xeaf2ff, 1.35, 12); // halo behind the glass
  rimLight.position.set(0, 0.6, -2.2);
  scene.add(rimLight);

  const RIM_BASE = rimLight.intensity;

  // Slow independent sweep (75s cycle vs the 20s spin) so highlights keep
  // drifting even for a reader who never scrolls — the seal must never
  // feel like a short looped render.
  const sweepLight = new THREE.PointLight(0xfff2d8, 0.25, 10);
  sweepLight.position.set(3, 0, 2);
  scene.add(sweepLight);

  scene.add(new THREE.AmbientLight(0x223349, 0.35));

  /* ---------- Base tilt: look slightly down onto the face ----------
     The ring/glass are lathe-revolved solids whose ONLY visible
     silhouette change under spin.rotation.y comes from spinning around
     an axis (Y) perpendicular to the face normal (Z) — i.e. a literal
     coin flip, which is edge-on for an instant every 180°. A pure Y-spin
     viewed dead-on therefore always has that instant; tilting the whole
     rig down means that instant is no longer viewed edge-on-flat but
     from slightly above, so the ring's beveled surfaces (which are NOT
     parallel to the flat face) keep catching light and stay legible
     as a bright ellipse instead of vanishing to a line. */
  const BASE_TILT_X = THREE.MathUtils.degToRad(16);
  scrollRig.rotation.x = BASE_TILT_X;

  /* ---------- State 1+2: idle rotation + breathing ---------- */
  const SPIN_PERIOD = 20; // seconds per full turn (18–22s spec window)
  const SWEEP_PERIOD = 75;
  // Ease the rotation's angular speed (not its period) so the seal
  // lingers near face-on and passes quickly through the two edge-on
  // instants each revolution, cutting the time spent looking thin.
  // phi = linear - EDGE_EASE*sin(2*linear); derivative stays positive
  // (0.52..1.48x speed) so rotation is still smooth and monotonic.
  const EDGE_EASE = 0.24;

  let breatheTween = null;
  function syncBreathing() {
    const enable = window.innerWidth >= 768;
    if (enable && !breatheTween) {
      breatheTween = gsap.to(spin.scale, {
        x: 0.98,
        y: 0.98,
        z: 0.98,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    } else if (!enable && breatheTween) {
      breatheTween.kill();
      breatheTween = null;
      spin.scale.setScalar(1);
    }
  }
  syncBreathing();
  window.matchMedia("(min-width: 768px)").addEventListener("change", syncBreathing);

  /* ---------- State 3: scroll-scrubbed scale + tilt ---------- */
  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    })
    .to(scrollRig.scale, { x: 1.15, y: 1.15, z: 1.15, ease: "none" }, 0)
    .to(scrollRig.rotation, { x: BASE_TILT_X + 0.12, ease: "none" }, 0);

  /* ---------- State 4: pointer tilt (desktop > 1024px only) ---------- */
  const heroSection = document.querySelector("#hero");
  const tiltX = gsap.quickTo(pointerRig.rotation, "x", { duration: 0.8, ease: "power2.out" });
  const tiltY = gsap.quickTo(pointerRig.rotation, "y", { duration: 0.8, ease: "power2.out" });
  const MAX_TILT = 0.06; // ≈3.4° — a hint of awareness, never a toy

  heroSection.addEventListener("mousemove", (e) => {
    if (window.innerWidth <= 1024) return;
    const r = heroSection.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    tiltY(nx * MAX_TILT);
    tiltX(ny * MAX_TILT * 0.8);
  });
  heroSection.addEventListener("mouseleave", () => {
    tiltX(0);
    tiltY(0);
  });

  /* ---------- State 5: touch tap → rim-light pulse (<400ms) ---------- */
  const raycaster = new THREE.Raycaster();
  const tapNDC = new THREE.Vector2();
  let pulseActive = false;

  renderer.domElement.addEventListener("touchstart", (e) => {
    if (pulseActive || e.touches.length === 0) return;
    const rect = renderer.domElement.getBoundingClientRect();
    tapNDC.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
    tapNDC.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(tapNDC, camera);
    if (raycaster.intersectObjects(spin.children).length === 0) return;
    pulseActive = true;
    gsap
      .timeline({ onComplete: () => (pulseActive = false) })
      .to(rimLight, { intensity: RIM_BASE * 2.6, duration: 0.13, ease: "power2.out" })
      .to(rimLight, { intensity: RIM_BASE, duration: 0.21, ease: "power2.in" });
    // total ≈ 340ms — inside the 400ms budget
  }, { passive: true });

  /* ---------- Render loop: gsap.ticker-driven, frame-capped ---------- */
  const FPS_CAP = isMobileWidth ? 30 : 60;
  const minFrameGap = 1 / FPS_CAP - 0.002; // small epsilon for timer jitter
  let lastRender = -1;
  let renderedFrames = 0;

  gsap.ticker.add((time) => {
    // Idle rotation reads the ticker clock directly, so speed stays
    // identical across refresh rates and frame drops. The linear phase
    // is warped by EDGE_EASE so real-world speed dips near face-on
    // (lingers) and rises near edge-on (rushes through) each half-turn,
    // while still completing one full revolution every SPIN_PERIOD.
    const linearPhase = (time * Math.PI * 2) / SPIN_PERIOD;
    spin.rotation.y = linearPhase - EDGE_EASE * Math.sin(2 * linearPhase);

    const sweepA = (time * Math.PI * 2) / SWEEP_PERIOD;
    sweepLight.position.set(Math.cos(sweepA) * 3, Math.sin(sweepA * 0.7) * 1.6, 2 + Math.sin(sweepA) * 0.8);

    if (time - lastRender < minFrameGap) return; // fps cap
    lastRender = time;
    renderedFrames++;
    renderer.render(scene, camera);
  });

  // Test/diagnostics hook (also used to capture the poster frame).
  window.__seal = {
    renderer, scene, camera, spin, pointerRig, scrollRig,
    rimLight, vertexCount, fpsCap: FPS_CAP,
    stats: () => ({ frames: renderedFrames, vertexCount, fpsCap: FPS_CAP,
      rotationY: spin.rotation.y, scale: spin.scale.x, scrollScale: scrollRig.scale.x,
      scrollTiltX: scrollRig.rotation.x, pointerX: pointerRig.rotation.x, pointerY: pointerRig.rotation.y,
      breathing: !!breatheTween, rim: rimLight.intensity }),
  };
})();
