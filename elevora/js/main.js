/* ============================================================
   ELEVORA — main.js
   Modules: Env · Preloader · Cursor · Magnetic · Smooth(Lenis) ·
   HeroScene · ScrollFX · Services · Results · Portfolio · Process ·
   Carousel · FAQ · VortexScene · Forms · Footer · Clock · RAF
   ============================================================ */
(function () {
  'use strict';

  /* ---------- ENV ---------- */
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const MOBILE = window.matchMedia('(max-width: 768px)').matches;
  const HAS_GSAP = typeof window.gsap !== 'undefined';
  const HAS_THREE = typeof window.THREE !== 'undefined';
  const $ = (s, ctx) => (ctx || document).querySelector(s);
  const $$ = (s, ctx) => Array.from((ctx || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const lerp = (a, b, t) => a + (b - a) * t;

  if (HAS_GSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- SHARED RAF ---------- */
  const rafSubs = [];
  function onFrame(fn) { rafSubs.push(fn); }
  function tick(time) {
    for (let i = 0; i < rafSubs.length; i++) rafSubs[i](time);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ============================================================
     SMOOTH SCROLL (Lenis) synced to ScrollTrigger
     ============================================================ */
  let lenis = null;
  function initSmooth() {
    if (REDUCED || typeof window.Lenis === 'undefined') return;
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    onFrame((time) => lenis.raf(time));
    if (HAS_GSAP && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
    }
  }
  function scrollTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: -20 });
    else document.querySelector(target)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* ============================================================
     PRELOADER
     ============================================================ */
  function initPreloader(onDone) {
    const pre = $('#preloader');
    if (!pre || REDUCED || !HAS_GSAP) { pre && pre.remove(); document.body.classList.remove('is-locked'); onDone && onDone(); return; }
    document.body.classList.add('is-locked');
    const countEl = $('#preCount');
    const tl = gsap.timeline({ onComplete: () => { pre.remove(); document.body.classList.remove('is-locked'); onDone && onDone(); } });
    const counter = { v: 0 };
    tl.to(counter, { v: 100, duration: 2.0, ease: 'power2.inOut', onUpdate: () => { countEl.textContent = String(Math.round(counter.v)).padStart(3, '0'); } }, 0);
    tl.to('#preWord', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.inOut' }, 0.3);
    tl.to('#preWord', { clipPath: 'inset(0 0 0 100%)', duration: 0.5, ease: 'power2.in' }, 1.9);
    tl.to('.preloader__panel--1', { y: '0%', duration: 0.6, ease: 'power4.inOut' }, 2.0);
    tl.to('.preloader__panel--2', { y: '0%', duration: 0.6, ease: 'power4.inOut' }, 2.12);
  }

  /* ============================================================
     CURSOR
     ============================================================ */
  function initCursor() {
    if (TOUCH || REDUCED) { $('#cursor')?.remove(); return; }
    const cursor = $('#cursor'), dot = $('#cursorDot'), ring = $('#cursorRing'), label = $('#cursorLabel');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    onFrame(() => {
      rx = lerp(rx, mx, 0.12); ry = lerp(ry, my, 0.12);
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    });
    $$('a, button, [data-magnetic], .work-item, .faq__q').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover', 'is-label'));
    });
    $$('[data-cursor-label]').forEach((el) => {
      el.addEventListener('pointerenter', () => { cursor.classList.add('is-label'); label.textContent = el.dataset.cursorLabel; });
      el.addEventListener('pointerleave', () => { cursor.classList.remove('is-label'); label.textContent = ''; });
    });
    $$('input, textarea').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hidden'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hidden'));
    });
  }

  /* ============================================================
     MAGNETIC
     ============================================================ */
  function initMagnetic() {
    if (TOUCH || REDUCED) return;
    $$('[data-magnetic]').forEach((el) => {
      let hover = false;
      el.addEventListener('pointerenter', () => (hover = true));
      el.addEventListener('pointermove', (e) => {
        if (!hover) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < 80) { const f = (1 - dist / 80) * 12; el.style.transform = `translate(${(dx / 80) * f}px, ${(dy / 80) * f}px)`; }
      });
      el.addEventListener('pointerleave', () => { hover = false; el.style.transform = ''; if (HAS_GSAP) gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)', clearProps: 'transform' }); });
    });
  }

  /* ============================================================
     GLASS GLOW TRACK (cursor-follow interior glow)
     ============================================================ */
  function initGlowTrack() {
    if (TOUCH) return;
    $$('.glass-2, .glow-track').forEach((el) => {
      el.classList.add('glow-track');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ============================================================
     NAVBAR
     ============================================================ */
  function initNav() {
    const nav = $('#nav'), burger = $('#burger'), menu = $('#mobileMenu');
    let lastY = 0;
    onFrame(() => {
      const y = window.scrollY;
      if (y > lastY && y > 200 && !menu.classList.contains('is-open')) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      lastY = y;
    });
    // mobile toggle
    let open = false;
    function toggle(state) {
      open = state ?? !open;
      burger.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('is-locked', open);
      if (open && HAS_GSAP && !REDUCED) gsap.fromTo('.mobile-menu__links a, .mobile-menu__cta', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: 0.15 });
    }
    burger.addEventListener('click', () => toggle());
    $$('[data-mm]').forEach((a) => a.addEventListener('click', () => toggle(false)));
    // smooth anchor scroll
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1 && $(id)) { e.preventDefault(); scrollTo(id); }
      });
    });
    // section-aware highlight
    const links = $$('[data-nav-link]');
    const map = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { links.forEach((l) => l.classList.remove('is-active')); map.get(en.target.id)?.classList.add('is-active'); } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['services', 'work', 'process', 'voices', 'contact'].forEach((id) => { const el = $('#' + id); el && io.observe(el); });
  }

  /* ============================================================
     HERO — THREE.JS "THE ASCENSION"
     ============================================================ */
  let heroCtl = null;
  function initHero() {
    const canvas = $('#heroCanvas');
    const fallback = $('.hero__fallback');
    if (!HAS_THREE || REDUCED) { canvas.style.display = 'none'; fallback.style.display = 'block'; return; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !MOBILE }); }
    catch (e) { canvas.style.display = 'none'; fallback.style.display = 'block'; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    // knot
    const geo = new THREE.TorusKnotGeometry(1.7, 0.5, MOBILE ? 120 : 220, MOBILE ? 16 : 32);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x0a1a1f, metalness: 0.1, roughness: 0.08, transmission: 0.9, thickness: 1.5, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.4, transparent: true });
    const knot = new THREE.Mesh(geo, mat);
    scene.add(knot);

    // lights
    const env = new THREE.HemisphereLight(0x00e5ff, 0x050507, 1.2); scene.add(env);
    const rim = new THREE.DirectionalLight(0xffffff, 1.5); rim.position.set(5, 5, 5); scene.add(rim);
    const p1 = new THREE.PointLight(0x00e5ff, 60, 30); scene.add(p1);
    const p2 = new THREE.PointLight(0x7df9ff, 40, 30); scene.add(p2);

    // particles
    const PC = MOBILE ? 120 : 250;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(PC * 3);
    const speed = new Float32Array(PC);
    for (let i = 0; i < PC; i++) { pos[i * 3] = (Math.random() - 0.5) * 16; pos[i * 3 + 1] = (Math.random() - 0.5) * 16; pos[i * 3 + 2] = (Math.random() - 0.5) * 10; speed[i] = 0.005 + Math.random() * 0.02; }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.05, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let W = 0, H = 0;
    function resize() { const r = canvas.getBoundingClientRect(); W = r.width; H = r.height; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); }
    resize(); window.addEventListener('resize', resize);

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    window.addEventListener('pointermove', (e) => { tmx = (e.clientX / window.innerWidth - 0.5); tmy = (e.clientY / window.innerHeight - 0.5); }, { passive: true });

    let visible = true;
    const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    let scrollProg = 0;
    heroCtl = { setScroll: (v) => (scrollProg = v) };

    const clock = new THREE.Clock();
    onFrame(() => {
      if (!visible) return;
      const t = clock.getElapsedTime();
      knot.rotation.x = t * 0.15; knot.rotation.y = t * 0.22;
      const breathe = 1 + Math.sin(t * (Math.PI * 2 / 6)) * 0.05;
      knot.scale.setScalar(breathe * (1 - scrollProg * 0.6));
      knot.position.y = scrollProg * 4;
      p1.position.set(Math.sin(t * 0.6) * 5, Math.cos(t * 0.5) * 4, 3);
      p2.position.set(Math.cos(t * 0.4) * 5, Math.sin(t * 0.7) * 4, -2);
      const pa = pGeo.attributes.position.array;
      for (let i = 0; i < PC; i++) { pa[i * 3 + 1] += speed[i] * (1 + scrollProg * 6); if (pa[i * 3 + 1] > 8) pa[i * 3 + 1] = -8; }
      pGeo.attributes.position.needsUpdate = true;
      mx = lerp(mx, tmx, 0.05); my = lerp(my, tmy, 0.05);
      camera.position.x = mx * 2; camera.position.y = -my * 2;
      camera.lookAt(0, knot.position.y * 0.3, 0);
      pMat.opacity = 0.8 * (1 - scrollProg);
      renderer.render(scene, camera);
    });
  }

  /* ============================================================
     SCROLL FX — reveals, hero title, hero scroll-out, manifesto
     ============================================================ */
  function initScrollFX() {
    if (!HAS_GSAP) {
      // graceful fallback: reveal everything statically if GSAP is unavailable
      $$('[data-reveal], [data-fade]').forEach((el) => (el.style.opacity = 1));
      $$('.hero__title [data-word]').forEach((el) => (el.style.transform = 'translateY(0)'));
      const mt = $('#manifestoText'); if (mt) mt.style.color = 'var(--white)';
      $$('.marquee__track span').forEach((s) => (s.style.color = 'rgba(255,255,255,0.5)'));
      window.__heroIntro = function () {};
      return;
    }

    // hero title word reveal (after preloader hands off)
    function heroIntro() {
      if (REDUCED) { gsap.set('.hero__title [data-word]', { y: '0%' }); gsap.set('.hero__sub, .hero__cta, .hero__stats', { opacity: 1, y: 0 }); return; }
      const tl = gsap.timeline();
      // .set clears the data-fade inline opacity:0 on the containers before animating their contents
      tl.to('.hero__title [data-word]', { y: '0%', duration: 1.0, stagger: 0.08, ease: 'power4.out' })
        .set('.hero__cta, .hero__stats', { opacity: 1 }, '-=0.5')
        .fromTo('.hero__sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '<')
        .from('.hero__cta > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
        .from('.hero__stats > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, '-=0.3');
    }
    window.__heroIntro = heroIntro;

    // generic reveals
    if (!REDUCED) {
      $$('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });
      $$('[data-fade]').forEach((el) => { el.style.opacity = 0; });
    } else {
      $$('[data-reveal], [data-fade]').forEach((el) => (el.style.opacity = 1));
      gsap.set('.hero__title [data-word]', { y: '0%' });
    }

    // hero scroll-out (scrubbed)
    if (!REDUCED) {
      gsap.to('.hero__content', { yPercent: -18, filter: 'blur(10px)', opacity: 0.2, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1, onUpdate: (self) => heroCtl && heroCtl.setScroll(self.progress) } });
    }

    // manifesto per-word illuminate
    const mText = $('#manifestoText');
    if (mText && !REDUCED) {
      const html = mText.innerHTML;
      // wrap words while keeping the .grad span intact
      const walk = (node) => {
        Array.from(node.childNodes).forEach((child) => {
          if (child.nodeType === 3) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((tok) => {
              if (tok.trim()) { const s = document.createElement('span'); s.className = 'word'; s.textContent = tok; frag.appendChild(s); }
              else frag.appendChild(document.createTextNode(tok));
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1) { child.classList.add('word'); }
        });
      };
      walk(mText);
      const words = $$('.word', mText);
      gsap.to(words, { opacity: 1, stagger: 0.5, ease: 'none',
        scrollTrigger: { trigger: '#manifesto', start: 'top 70%', end: 'bottom 70%', scrub: 1, pin: '.manifesto__text', pinSpacing: true } });
    } else if (mText) { $$('.word', mText).forEach((w) => (w.style.opacity = 1)); }

    // eyebrow scramble
    $$('[data-scramble]').forEach((el) => scramble(el));
  }

  function scramble(el) {
    if (REDUCED) return;
    const final = el.textContent;
    const chars = '!<>-_\\/[]{}=+*^?#';
    let frame = 0;
    const start = () => {
      frame = 0;
      const id = setInterval(() => {
        el.textContent = final.split('').map((c, i) => (c === ' ' || i < frame / 2 ? c : chars[Math.floor(Math.random() * chars.length)])).join('');
        frame++;
        if (frame / 2 > final.length) { clearInterval(id); el.textContent = final; }
      }, 30);
    };
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { start(); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
  }

  /* ============================================================
     COUNTERS
     ============================================================ */
  function initCounters() {
    $$('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dec = parseInt(el.dataset.decimal || '0', 10);
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return; io.disconnect();
        if (REDUCED || !HAS_GSAP) { el.textContent = target.toFixed(dec) + suffix; return; }
        const obj = { v: 0 };
        gsap.to(obj, { v: target, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = obj.v.toFixed(dec) + suffix; } });
      }, { threshold: 0.5 });
      io.observe(el);
    });
    // results underline sync
    $$('.result').forEach((r) => {
      const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { r.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.6 });
      io.observe(r);
    });
  }

  /* ============================================================
     SERVICES — stacked pin + mocks
     ============================================================ */
  function initServices() {
    const cards = $$('.svc-card');
    if (HAS_GSAP && !REDUCED && !MOBILE && cards.length === 2) {
      ScrollTrigger.create({ trigger: cards[0], start: 'top 14%', endTrigger: cards[1], end: 'top 20%', pin: cards[0], pinSpacing: false });
      gsap.to(cards[0], { scale: 0.92, filter: 'blur(6px)', opacity: 0.5, ease: 'none',
        scrollTrigger: { trigger: cards[1], start: 'top 80%', end: 'top 20%', scrub: 1 } });
      gsap.from(cards[1], { yPercent: 6, ease: 'none', scrollTrigger: { trigger: cards[1], start: 'top 90%', end: 'top 30%', scrub: 1 } });
    }
    // caps stagger
    cards.forEach((card) => {
      if (!HAS_GSAP || REDUCED) return;
      gsap.from($$('.svc-card__caps li', card), { x: -20, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 70%', once: true } });
    });

    // phone view counter + clip cycle
    const phone = $('#phoneMock');
    if (phone) {
      const vc = $('#viewCounter'), clip = $('[data-clip]');
      const grads = ['linear-gradient(135deg,#00E5FF,#0891B2)', 'linear-gradient(135deg,#7DF9FF,#0891B2)', 'linear-gradient(135deg,#0891B2,#00E5FF)'];
      let gi = 0, views = 12400;
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return;
        if (!REDUCED) {
          setInterval(() => { gi = (gi + 1) % grads.length; if (clip) clip.style.background = grads[gi]; }, 2200);
          setInterval(() => { views += Math.floor(Math.random() * 340); if (vc) vc.textContent = views.toLocaleString(); }, 400);
          if (HAS_GSAP) gsap.to('.phone-mock__react', { opacity: 1, y: -8, duration: 0.5, stagger: 0.3, repeat: -1, yoyo: true, ease: 'power1.inOut' });
        } else if (vc) vc.textContent = views.toLocaleString();
        io.disconnect();
      }, { threshold: 0.4 });
      io.observe(phone);
    }

    // dashboard: line draw, bars, follower count
    const dash = $('.dash-mock');
    if (dash) {
      const line = $('.dash-mock__line'), fc = $('#follCounter');
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return;
        dash.classList.add('is-live');
        if (HAS_GSAP && !REDUCED) { gsap.to(line, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.out' }); const o = { v: 0 }; gsap.to(o, { v: 128400, duration: 2, ease: 'power2.out', onUpdate: () => (fc.textContent = Math.round(o.v).toLocaleString()) }); }
        else { line.style.strokeDashoffset = 0; fc.textContent = '128,400'; }
        io.disconnect();
      }, { threshold: 0.4 });
      io.observe(dash);
    }
  }

  /* ============================================================
     PORTFOLIO
     ============================================================ */
  function initPortfolio() {
    const grid = $('#workGrid');
    if (!grid) return;
    const projects = [
      { t: 'Nova Skincare', tag: 'UGC · TIKTOK', metric: '8.4M views', g: 'linear-gradient(135deg,#00E5FF,#0891B2)' },
      { t: 'Pulse Fitness', tag: 'SOCIAL · IG', metric: '+220% reach', g: 'linear-gradient(135deg,#0891B2,#083344)' },
      { t: 'Orbit Finance', tag: 'UGC · REELS', metric: '3.8x ROAS', g: 'linear-gradient(135deg,#22d3ee,#0e7490)' },
      { t: 'Lumen Coffee', tag: 'SOCIAL · TT', metric: '1.2M followers', g: 'linear-gradient(135deg,#67e8f9,#0891B2)' },
      { t: 'Verde Wellness', tag: 'UGC · SHORTS', metric: '5.1M views', g: 'linear-gradient(135deg,#00E5FF,#155e75)' },
      { t: 'Atlas Travel', tag: 'SOCIAL · IG', metric: '+180% eng.', g: 'linear-gradient(135deg,#7DF9FF,#0891B2)' },
    ];
    projects.forEach((p, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'work-item' + (i % 2 === 1 ? ' work__col-offset' : '');
      wrap.dataset.cursorLabel = 'VIEW';
      wrap.innerHTML = `
        <div class="work-item__frame">
          <div class="work-item__img" style="background:${p.g}"></div>
          <div class="work-item__wipe"></div>
          <div class="work-item__bar"><h3>${p.t}</h3><span>${p.metric}</span></div>
        </div>
        <div class="work-item__meta"><em>${p.tag}</em><em>0${i + 1}</em></div>`;
      grid.appendChild(wrap);
      if (HAS_GSAP && !REDUCED) {
        gsap.to($('.work-item__wipe', wrap), { scaleX: 0, duration: 0.9, ease: 'power3.inOut', scrollTrigger: { trigger: wrap, start: 'top 82%', once: true } });
        gsap.from(wrap, { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: wrap, start: 'top 88%', once: true } });
        gsap.to($('.work-item__img', wrap), { yPercent: i % 2 ? 6 : -6, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      } else { $('.work-item__wipe', wrap).style.transform = 'scaleX(0)'; }
    });
  }

  /* ============================================================
     PROCESS — horizontal scroll (pinned)
     ============================================================ */
  function initProcess() {
    const track = $('#processTrack'), vp = $('#processViewport');
    if (!track) return;
    $$('.step').forEach((s) => {
      const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { s.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.4 });
      io.observe(s);
    });
    if (!HAS_GSAP || REDUCED || MOBILE) return; // mobile falls back to vertical scroll of the flex track
    const getScroll = () => track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(vp).paddingLeft || 0);
    gsap.to(track, { x: () => -getScroll(), ease: 'none',
      scrollTrigger: { trigger: '#process', start: 'top top', end: () => '+=' + getScroll(), scrub: 1, pin: true, invalidateOnRefresh: true, anticipatePin: 1 } });
  }

  /* ============================================================
     TESTIMONIALS — draggable carousel
     ============================================================ */
  function initCarousel() {
    const track = $('#voicesTrack'), dotsWrap = $('#voicesDots'), carousel = $('#voicesCarousel');
    if (!track) return;
    const data = [
      { q: 'Elevora turned our TikTok from an afterthought into our #1 acquisition channel. The creative just hits.', n: 'Sofia Marchetti', r: 'CMO, Nova Skincare' },
      { q: 'We went from posting randomly to a machine. 220% reach growth in one quarter — and it keeps compounding.', n: 'Daniel Okafor', r: 'Founder, Pulse Fitness' },
      { q: 'Their UGC packages consistently beat our in-house ads. 3.8x ROAS is not a fluke with these people.', n: 'Amara Chen', r: 'Head of Growth, Orbit' },
      { q: 'Community management alone paid for itself. Our DMs became a sales pipeline overnight.', n: 'Liam Novak', r: 'CEO, Lumen Coffee' },
    ];
    let cardW = 0, gap = 24, index = 0, offset = 0, target = 0;
    data.forEach((d, i) => {
      const c = document.createElement('article');
      c.className = 'voice-card';
      c.innerHTML = `
        <div class="voice-card__stars">${'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z"/></svg>'.repeat(5)}</div>
        <p class="voice-card__quote">${d.q}</p>
        <div class="voice-card__author"><div class="voice-card__avatar"><span>${d.n.split(' ').map((w) => w[0]).join('')}</span></div><div class="voice-card__who"><b>${d.n}</b><em>${d.r}</em></div></div>`;
      track.appendChild(c);
      const dot = document.createElement('button');
      dot.setAttribute('role', 'tab'); dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const cards = $$('.voice-card', track);
    const dots = $$('button', dotsWrap);
    function measure() { cardW = cards[0].offsetWidth + gap; }
    function maxIndex() { return cards.length - 1; }
    function goTo(i) { index = clamp(i, 0, maxIndex()); target = -index * cardW; update(); }
    function update() {
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
      cards.forEach((c, i) => c.classList.toggle('is-side', i !== index));
    }
    measure(); update();
    window.addEventListener('resize', () => { measure(); target = -index * cardW; });

    // inertia + drag
    let dragging = false, startX = 0, startOffset = 0, velocity = 0, lastX = 0;
    onFrame(() => {
      if (!dragging) { target = -index * cardW; }
      offset = lerp(offset, target + (dragging ? 0 : 0), 0.12);
      if (!REDUCED) track.style.transform = `translateX(${offset}px)`; else track.style.transform = `translateX(${target}px)`;
    });
    function down(x) { dragging = true; startX = x; startOffset = offset; lastX = x; carousel.classList.add('is-drag'); }
    function move(x) { if (!dragging) return; const dx = x - startX; offset = startOffset + dx; target = offset; velocity = x - lastX; lastX = x; }
    function up() {
      if (!dragging) return; dragging = false; carousel.classList.remove('is-drag');
      let landed = Math.round(-(offset + velocity * 6) / cardW);
      index = clamp(landed, 0, maxIndex()); target = -index * cardW; update();
    }
    carousel.dataset.cursorLabel = 'DRAG';
    carousel.addEventListener('pointerdown', (e) => { down(e.clientX); });
    window.addEventListener('pointermove', (e) => move(e.clientX));
    window.addEventListener('pointerup', up);
    carousel.addEventListener('touchstart', (e) => down(e.touches[0].clientX), { passive: true });
    carousel.addEventListener('touchmove', (e) => move(e.touches[0].clientX), { passive: true });
    carousel.addEventListener('touchend', up);

    // auto-advance
    if (!REDUCED) { let auto = setInterval(() => goTo((index + 1) % cards.length), 6000);
      carousel.addEventListener('pointerenter', () => clearInterval(auto));
      carousel.addEventListener('pointerleave', () => { auto = setInterval(() => goTo((index + 1) % cards.length), 6000); });
    }
  }

  /* ============================================================
     FAQ
     ============================================================ */
  function initFAQ() {
    const list = $('#faqList');
    if (!list) return;
    const faqs = [
      { q: 'How fast can we launch?', a: 'Most clients go live within 7–10 days. We kick off with a discovery sprint, then move straight into creator matching and content production.' },
      { q: 'Do you work with our niche?', a: 'We work across DTC, SaaS, wellness, hospitality, and finance. If your audience lives on short-form, we can drive growth for you.' },
      { q: 'How much does UGC cost?', a: 'Packages start at a fixed monthly retainer based on output volume. You always know your cost per creative up front — no surprise invoices.' },
      { q: 'How do you measure success?', a: 'We tie every campaign to the metrics that matter: ROAS, retention, watch-time, and qualified reach — reported transparently every week.' },
      { q: 'Can we start with just one service?', a: 'Absolutely. Many clients begin with UGC or Social Management alone, then expand once they see the compounding results.' },
    ];
    faqs.forEach((f) => {
      const item = document.createElement('div');
      item.className = 'faq__item';
      const qid = 'faq-' + Math.random().toString(36).slice(2, 7);
      item.innerHTML = `
        <button class="faq__q" aria-expanded="false" aria-controls="${qid}"><h3>${f.q}</h3><span class="faq__icon" aria-hidden="true"></span></button>
        <div class="faq__a" id="${qid}" role="region"><p>${f.a}</p></div>`;
      list.appendChild(item);
      const btn = $('.faq__q', item), panel = $('.faq__a', item);
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        // close others
        $$('.faq__item.is-open').forEach((o) => { if (o !== item) closeItem(o); });
        isOpen ? closeItem(item) : openItem(item);
      });
      function openItem(it) {
        it.classList.add('is-open'); $('.faq__q', it).setAttribute('aria-expanded', 'true');
        if (HAS_GSAP && !REDUCED) gsap.to($('.faq__a', it), { height: 'auto', duration: 0.45, ease: 'power3.out' });
        else $('.faq__a', it).style.height = 'auto';
      }
      function closeItem(it) {
        it.classList.remove('is-open'); $('.faq__q', it).setAttribute('aria-expanded', 'false');
        if (HAS_GSAP && !REDUCED) gsap.to($('.faq__a', it), { height: 0, duration: 0.4, ease: 'power3.inOut' });
        else $('.faq__a', it).style.height = '0';
      }
    });
  }

  /* ============================================================
     LAUNCHPAD — vortex + title letters + copy mail
     ============================================================ */
  function initLaunchTitle() {
    const title = $('#launchTitle');
    if (!title) return;
    const text = title.textContent;
    title.textContent = '';
    text.split('').forEach((ch) => { const s = document.createElement('span'); s.className = 'char'; s.textContent = ch === ' ' ? ' ' : ch; title.appendChild(s); });
    if (TOUCH || REDUCED || !HAS_GSAP) return;
    const chars = $$('.char', title);
    chars.forEach((c) => {
      c.addEventListener('pointerenter', () => gsap.to(c, { y: -14, color: '#00E5FF', duration: 0.3, ease: 'power2.out' }));
      c.addEventListener('pointerleave', () => gsap.to(c, { y: 0, color: '#FFFFFF', duration: 0.5, ease: 'elastic.out(1,0.4)' }));
    });
  }

  function initCopyMail() {
    const btn = $('#copyMail'), toast = $('#toast');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const mail = 'hello@elevora.studio';
      try { await navigator.clipboard.writeText(mail); } catch (e) { /* ignore */ }
      toast.classList.add('is-show');
      setTimeout(() => toast.classList.remove('is-show'), 2000);
    });
  }

  function initVortex() {
    const canvas = $('#vortexCanvas'), fallback = $('.launchpad__fallback');
    if (!HAS_THREE || REDUCED) { canvas.style.display = 'none'; fallback.style.display = 'block'; return; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false }); }
    catch (e) { canvas.style.display = 'none'; fallback.style.display = 'block'; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    const COUNT = MOBILE ? 180 : 340;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const base = [];
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2 * 6;
      const rad = 3 + (i / COUNT) * 4.5; // 3 → 7.5, larger horizon ring
      base.push({ a, rad });
      pos[i * 3] = Math.cos(a) * rad; pos[i * 3 + 1] = (i / COUNT - 0.5) * 1.6; pos[i * 3 + 2] = Math.sin(a) * rad;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.09, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Points(geo, mat);
    ring.rotation.x = 1.0; // stronger tilt toward a horizon plane
    scene.add(ring);

    let W, H;
    function resize() { const r = canvas.getBoundingClientRect(); W = r.width; H = r.height; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); }
    resize(); window.addEventListener('resize', resize);
    let tmx = 0, tmy = 0, mx = 0, my = 0;
    window.addEventListener('pointermove', (e) => { tmx = e.clientX / window.innerWidth - 0.5; tmy = e.clientY / window.innerHeight - 0.5; }, { passive: true });
    let visible = false;
    new IntersectionObserver((en) => (visible = en[0].isIntersecting), { threshold: 0 }).observe(canvas);
    const clock = new THREE.Clock();
    onFrame(() => {
      if (!visible) return;
      const t = clock.getElapsedTime();
      ring.rotation.y = t * 0.15;
      const pa = geo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) { const b = base[i]; const a = b.a + t * 0.3; pa[i * 3] = Math.cos(a) * b.rad; pa[i * 3 + 2] = Math.sin(a) * b.rad; }
      geo.attributes.position.needsUpdate = true;
      mx = lerp(mx, tmx, 0.05); my = lerp(my, tmy, 0.05);
      camera.position.x = mx * 1.8; camera.position.y = -my * 1.8; camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    });
  }

  /* ============================================================
     FORMS
     ============================================================ */
  function initForms() {
    const form = $('#contactForm'), btn = $('#submitBtn');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        $$('.field', form).forEach((field) => {
          const input = $('input, textarea', field);
          const ok = input.checkValidity();
          field.classList.toggle('is-invalid', !ok);
          if (!ok) { valid = false; field.classList.remove('shake'); void field.offsetWidth; field.classList.add('shake'); }
        });
        if (!valid) return;
        btn.classList.add('is-loading'); btn.disabled = true;
        setTimeout(() => {
          btn.classList.remove('is-loading'); btn.classList.add('is-done');
          const label = $('.contact__submit-label', btn); label.textContent = 'Sent — we reply within 24h';
          setTimeout(() => { btn.classList.remove('is-done'); btn.disabled = false; label.textContent = 'Send Message'; form.reset(); }, 3500);
        }, 1600);
      });
      $$('.field input, .field textarea', form).forEach((inp) => inp.addEventListener('input', () => inp.closest('.field').classList.remove('is-invalid')));
    }
    const news = $('#newsForm');
    news && news.addEventListener('submit', (e) => { e.preventDefault(); const i = $('input', news); i.value = ''; i.placeholder = 'Subscribed ✓'; });
  }

  /* ============================================================
     FOOTER — watermark fill + back-to-top ring
     ============================================================ */
  function initFooter() {
    const mark = $('#footerMark'), ring = $('#backRing'), backTop = $('#backTop');
    if (mark && HAS_GSAP && !REDUCED) {
      gsap.to(mark, { clipPath: 'inset(0 0% 0 0)', ease: 'power2.out', scrollTrigger: { trigger: '.footer', start: 'top 60%', end: 'bottom bottom', scrub: 1 } });
    } else if (mark) { mark.style.clipPath = 'inset(0 0% 0 0)'; }

    if (ring) {
      const len = 2 * Math.PI * 16;
      onFrame(() => {
        const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
        ring.style.strokeDashoffset = String(len * (1 - clamp(scrolled, 0, 1)));
        const bar = $('.scroll-progress span'); if (bar) bar.style.width = clamp(scrolled, 0, 1) * 100 + '%';
      });
    }
    backTop && backTop.addEventListener('click', () => scrollTo('#top'));
  }

  /* ============================================================
     CLOCK
     ============================================================ */
  function initClock() {
    const el = $('#clock');
    if (!el) return;
    const upd = () => { el.textContent = new Date().toLocaleTimeString('en-GB'); };
    upd(); setInterval(upd, 1000);
  }

  /* ============================================================
     MARQUEE
     ============================================================ */
  function initMarquee() {
    const words = ['NOVA', 'PULSE', 'ORBIT', 'LUMEN', 'VERDE', 'ATLAS', 'ZENITH', 'FLUX', 'HALO', 'VOLT'];
    const build = (host) => { if (!host) return; host.innerHTML = words.map((w) => `<span>${w}</span>`).join(''); const clone = host.parentElement.querySelector('.marquee__track[aria-hidden]'); if (clone) clone.innerHTML = host.innerHTML; };
    build($('#mqA')); build($('#mqB'));
    if (REDUCED || !HAS_GSAP) return;
    $$('.marquee__row').forEach((row) => {
      const dir = parseFloat(row.dataset.marquee);
      const tracks = $$('.marquee__track', row);
      let x = 0;
      onFrame(() => { x -= 0.5 * dir; const w = tracks[0].offsetWidth; if (Math.abs(x) >= w) x = 0; tracks.forEach((t) => (t.style.transform = `translateX(${x}px)`)); });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function boot() {
    initSmooth();
    initCursor();
    initMagnetic();
    initGlowTrack();
    initNav();
    initHero();
    initMarquee();
    initScrollFX();
    initCounters();
    initServices();
    initPortfolio();
    initProcess();
    initCarousel();
    initFAQ();
    initLaunchTitle();
    initCopyMail();
    initVortex();
    initForms();
    initFooter();
    initClock();
    if (HAS_GSAP && window.ScrollTrigger) { ScrollTrigger.refresh(); window.addEventListener('load', () => ScrollTrigger.refresh()); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPreloader(() => { window.__heroIntro && window.__heroIntro(); });
    boot();
  });
})();
