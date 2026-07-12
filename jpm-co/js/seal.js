/* ==========================================================================
   JPM & Co. — Step 6: rotating glass-and-gold seal (Three.js)
   Mounts into #hero-seal-mount. The hero's signature visual anchor:
   a gold-rimmed glass medallion turning at watch-movement speed, with a
   single neon accent ring for brand continuity.

   Degradation ladder:
   - No THREE / no WebGL → the styled CSS placeholder stays untouched.
   - prefers-reduced-motion → one static, well-lit frame; no rotation.
   - Tab hidden → requestAnimationFrame pauses automatically.
   The DOM initials ("JPM / EST. SURAT") remain as an overlay above the
   canvas, so the wordmark stays selectable, crisp, and screen-readable.
   ========================================================================== */

(function () {
    "use strict";

    if (typeof THREE === "undefined") { return; }

    var mount = document.getElementById("hero-seal-mount");
    if (!mount) { return; }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var renderer;
    try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (err) {
        return; /* WebGL unavailable — CSS placeholder remains */
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 6.2;

    /* --- Build the medallion ------------------------------------------- */
    var tilt = new THREE.Group();    /* outer: pointer-reactive tilt  */
    var spinner = new THREE.Group(); /* inner: constant slow rotation */
    tilt.add(spinner);
    scene.add(tilt);

    var goldMat = new THREE.MeshStandardMaterial({
        color: 0xC9A227, metalness: 0.95, roughness: 0.3
    });

    /* Gold rim */
    spinner.add(new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.11, 32, 96), goldMat));

    /* Glass disc body — navy-tinted, clearcoated */
    var glass = new THREE.Mesh(
        new THREE.CylinderGeometry(1.52, 1.52, 0.09, 96),
        new THREE.MeshPhysicalMaterial({
            color: 0x10233D,
            metalness: 0.1,
            roughness: 0.12,
            transparent: true,
            opacity: 0.45,
            clearcoat: 1,
            clearcoatRoughness: 0.15
        })
    );
    glass.rotation.x = Math.PI / 2; /* flat face toward camera */
    spinner.add(glass);

    /* Inner gold detail ring */
    spinner.add(new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.03, 24, 96), goldMat));

    /* Ledger tick marks — 12 gold minute-marks around the inner ring */
    var tickGeo = new THREE.BoxGeometry(0.02, 0.14, 0.03);
    for (var i = 0; i < 12; i++) {
        var tick = new THREE.Mesh(tickGeo, goldMat);
        var a = (i / 12) * Math.PI * 2;
        tick.position.set(Math.sin(a) * 1.28, Math.cos(a) * 1.28, 0.06);
        tick.rotation.z = -a;
        spinner.add(tick);
    }

    /* Single neon accent ring — the brand's one blue note, kept dim */
    spinner.add(new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.012, 12, 96),
        new THREE.MeshBasicMaterial({ color: 0x3D9EFF, transparent: true, opacity: 0.55 })
    ));

    /* Resting tilt so the rim always catches the key light */
    tilt.rotation.x = 0.22;

    /* --- Lighting: warm key for the gold, cool rim for the brand -------- */
    scene.add(new THREE.AmbientLight(0x8FA3BF, 0.55));
    var key = new THREE.PointLight(0xFFE3B3, 1.15, 30);
    key.position.set(3.5, 3, 4);
    scene.add(key);
    var rimLight = new THREE.PointLight(0x3D9EFF, 0.9, 30);
    rimLight.position.set(-4, -2.5, 3);
    scene.add(rimLight);

    /* --- Mount: canvas under the DOM initials overlay ------------------- */
    function resize() {
        var s = Math.max(1, Math.min(mount.clientWidth, mount.clientHeight));
        renderer.setSize(s, s);
    }
    resize();
    mount.prepend(renderer.domElement);
    mount.classList.add("has-webgl"); /* CSS strips the placeholder chrome */
    window.addEventListener("resize", resize);

    /* --- Motion ---------------------------------------------------------- */
    if (reduceMotion) {
        /* A single considered frame; the seal reads as an emblem, not video */
        spinner.rotation.y = 0.5;
        renderer.render(scene, camera);
        return;
    }

    var targetX = 0, targetY = 0;
    window.addEventListener("pointermove", function (e) {
        if (e.pointerType && e.pointerType !== "mouse") { return; }
        targetY = (e.clientX / window.innerWidth - 0.5) * 0.5;
        targetX = 0.22 + (e.clientY / window.innerHeight - 0.5) * 0.35;
    });

    /* Render only while the hero is on screen — the seal costs nothing
       once the user is reading the ledger sections below. */
    var running = true;
    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            running = entries[0].isIntersecting;
        }).observe(mount);
    }

    var clock = new THREE.Clock();
    (function frame() {
        requestAnimationFrame(frame);
        if (!running) { return; }
        var t = clock.getElapsedTime();

        spinner.rotation.y += 0.004;                 /* one turn ≈ 26s */
        tilt.rotation.x += (targetX - tilt.rotation.x) * 0.04;
        tilt.rotation.y += (targetY - tilt.rotation.y) * 0.04;
        tilt.position.y = Math.sin(t * 0.6) * 0.05;  /* faint breathing */

        renderer.render(scene, camera);
    })();
})();
