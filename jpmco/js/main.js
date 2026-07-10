/* ============================================================
   JPM & CO. — main.js
   Modules: Env · RAF · Smooth · Preloader · Current (Sig.1) ·
   Ambient (Sig.2) · Nav · Magnetic · Reveals · Hero · Counters ·
   Why · Process · Voices · FAQ · Portal · Clock · Footer · TopTray
   ============================================================ */
(function () {
  'use strict';

  /* ---------- ENV ---------- */
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const MOBILE = window.matchMedia('(max-width: 768px)').matches;
  const HAS_GSAP = typeof window.gsap !== 'undefined';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const lerp = (a, b, t) => a + (b - a) * t;

  if (HAS_GSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- SHARED RAF ---------- */
  const rafSubs = [];
  function onFrame(fn) { rafSubs.push(fn); }
  (function tick(t) { for (let i = 0; i < rafSubs.length; i++) rafSubs[i](t); requestAnimationFrame(tick); })(0);

  /* ---------- SMOOTH SCROLL + VELOCITY ---------- */
  let lenis = null;
  let velocity = 0; // signed, lerped
  let curX = innerWidth / 2, curY = innerHeight * 0.4; // last known hand position (mouse OR touch)
  addEventListener('pointermove', (e) => { curX = e.clientX; curY = e.clientY; }, { passive: true });
  addEventListener('touchstart', (e) => { if (e.touches[0]) { curX = e.touches[0].clientX; curY = e.touches[0].clientY; } }, { passive: true });
  addEventListener('touchmove', (e) => { if (e.touches[0]) { curX = e.touches[0].clientX; curY = e.touches[0].clientY; } }, { passive: true });

  function initSmooth() {
    // velocity from raw scroll deltas — identical for mouse wheel, touch
    // fling, and keyboard, so The Current charges the same on every input
    let lastY = window.scrollY;
    onFrame(() => {
      const y = window.scrollY;
      const dy = y - lastY; lastY = y;
      velocity = lerp(velocity, dy, Math.abs(dy) > Math.abs(velocity) ? 0.3 : 0.07);
    });
    if (REDUCED || typeof window.Lenis === 'undefined') return;
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    onFrame((time) => lenis.raf(time));
    if (HAS_GSAP && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.lagSmoothing(0); }
  }
  function scrollTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: -64 });
    else { const el = typeof target === 'string' ? $(target) : target; el && el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); }
  }

  /* ============================================================
     PRELOADER — monogram builds stroke by stroke, < 2.5s
     ============================================================ */
  function initPreloader(onDone) {
    const pre = $('#preloader');
    if (!pre || REDUCED || !HAS_GSAP) { pre && pre.remove(); onDone(); return; }
    document.body.classList.add('is-locked');
    const mono = $('#preMono'), check = $('#preCheck');
    const checkLen = check.getTotalLength();
    check.style.strokeDasharray = checkLen;
    check.style.strokeDashoffset = checkLen;
    mono.style.strokeDasharray = 620;
    mono.style.strokeDashoffset = 620;
    mono.style.fill = 'transparent';
    const tl = gsap.timeline({ onComplete: () => { pre.remove(); document.body.classList.remove('is-locked'); } });
    tl.to(mono, { strokeDashoffset: 0, duration: 0.95, ease: 'power2.inOut' }, 0)
      .to(mono, { fill: '#0E2239', duration: 0.4, ease: 'power1.in' }, 0.75)
      .to(check, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 0.95)
      .to('#preWord', { opacity: 1, letterSpacing: '0.62em', duration: 0.5, ease: 'power2.out' }, 1.0)
      .to('#preCurtain', { y: '0%', duration: 0.5, ease: 'power3.inOut' }, 1.55)
      .add(() => onDone(), 1.8)
      .to(pre, { yPercent: -100, duration: 0.55, ease: 'power3.inOut' }, 1.85);
  }

  /* ============================================================
     SIGNATURE 1 · THE CURRENT
     glow follows the hand (mouse & touch), stretches/brightens
     with scroll velocity, relaxes to an idle pulse; charges the
     cue tray, top tray, and hairline rules
     ============================================================ */
  function initCurrent() {
    const glow = $('#currentGlow');
    if (!glow || REDUCED) { glow && glow.remove(); return; }
    let gx = curX, gy = curY, idleT = 0, charge = 0;
    addEventListener('pointermove', () => { idleT = 0; }, { passive: true });
    onFrame((t) => {
      gx = lerp(gx, curX, 0.09); gy = lerp(gy, curY, 0.09);
      const v = Math.abs(velocity);
      charge = lerp(charge, clamp(v / 30, 0, 1), 0.1);
      idleT += 1 / 60;
      // stretch along scroll axis + brighten with speed; slow pulse at rest
      const stretch = 1 + charge * 0.7;
      const pulse = idleT > 2 ? 1 + Math.sin(t / 900) * 0.05 : 1;
      glow.style.transform = `translate(${gx - 280}px, ${gy - 280}px) scale(${pulse}, ${(stretch * pulse).toFixed(3)})`;
      glow.style.opacity = (0.4 + charge * 0.5 + (idleT > 2 ? Math.sin(t / 900) * 0.07 : 0)).toFixed(3);
      document.documentElement.style.setProperty('--charge', charge.toFixed(3));
    });
    // charged hairline rules — inject overlays on ledger boundaries
    const hosts = $$('.lrow').slice(0);
    $$('.lgroup').forEach((g) => hosts.push(g));
    const rules = hosts.map((host) => {
      host.style.position = 'relative';
      const r = document.createElement('span');
      r.className = 'rule-hair';
      r.style.cssText = 'position:absolute;top:-1px;left:0;right:0;background:none;';
      r.setAttribute('aria-hidden', 'true');
      host.appendChild(r);
      return r;
    });
    let frame = 0;
    onFrame(() => {
      if (frame++ % 2) return; // 30Hz is plenty
      for (const r of rules) {
        const b = r.getBoundingClientRect();
        if (b.bottom < -40 || b.top > innerHeight + 40) { r.style.setProperty('--near', 0); continue; }
        const dy = Math.abs(curY - b.top);
        const near = clamp(1 - dy / 190, 0, 1);
        r.style.setProperty('--near', near.toFixed(3));
        if (near > 0) r.style.setProperty('--cx', (((curX - b.left) / (b.width || 1)) * 100).toFixed(1) + '%');
      }
    });
  }

  /* ============================================================
     SIGNATURE 2 · AMBIENT LEDGER MOTION
     per-section canvas loops · DPR-aware · paused off-screen
     ============================================================ */
  const Ambient = (() => {
    const loops = [];
    function register(canvas, draw) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const L = { canvas, ctx, draw, visible: false, w: 0, h: 0 };
      const DPR = Math.min(devicePixelRatio || 1, 2);
      function resize() {
        const r = canvas.getBoundingClientRect();
        L.w = r.width || canvas.width; L.h = r.height || canvas.height;
        canvas.width = L.w * DPR; canvas.height = L.h * DPR;
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      resize(); addEventListener('resize', resize);
      new IntersectionObserver((en) => (L.visible = en[0].isIntersecting), { rootMargin: '60px' }).observe(canvas);
      loops.push(L);
      if (REDUCED) { L.draw(ctx, L.w, L.h, 0); } // one calm still frame
    }
    if (!REDUCED) onFrame((t) => { for (const L of loops) if (L.visible && L.w) L.draw(L.ctx, L.w, L.h, t); });
    return { register };
  })();

  const SAGE = (a) => `rgba(129, 190, 152, ${a})`;
  const LIGHTC = (a) => `rgba(239, 243, 242, ${a})`;

  /* the ledger — faint grid, an evolving balance line, drifting figures */
  function makeLedgerDraw(bright) {
    const figs = Array.from({ length: 12 }, () => ({
      x: Math.random(), y: Math.random(), s: 0.00016 + Math.random() * 0.00028,
      v: (1000 + Math.random() * 9000).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    }));
    const k = bright ? 1.9 : 1;
    return function draw(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      // ledger grid
      ctx.strokeStyle = LIGHTC(0.035 * k); ctx.lineWidth = 1;
      const gap = 72;
      ctx.beginPath();
      for (let x = gap; x < w; x += gap) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = gap; y < h; y += gap) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();
      // drifting tabular figures
      ctx.font = '11px "IBM Plex Mono", monospace';
      ctx.fillStyle = LIGHTC(0.05 * k);
      for (const f of figs) {
        f.y -= f.s; if (f.y < -0.03) { f.y = 1.03; f.x = Math.random(); }
        ctx.fillText(f.v, f.x * w, f.y * h);
      }
      // the balance line — evolves continuously, never repeats abruptly
      const N = 90, base = h * 0.66, amp = h * 0.13;
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * w;
        const y = base
          - (Math.sin(i * 0.11 + t * 0.00019) * 0.55 + Math.sin(i * 0.043 + t * 0.00011) * 0.45) * amp
          - (i / N) * h * 0.1;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, SAGE(0));
      grad.addColorStop(0.35, SAGE(0.16 * k));
      grad.addColorStop(1, SAGE(0.42 * k));
      ctx.strokeStyle = grad; ctx.lineWidth = 1.4; ctx.stroke();
      // glowing head
      const hy = base - (Math.sin(N * 0.11 + t * 0.00019) * 0.55 + Math.sin(N * 0.043 + t * 0.00011) * 0.45) * amp - h * 0.1;
      const halo = ctx.createRadialGradient(w - 2, hy, 0, w - 2, hy, 26);
      halo.addColorStop(0, SAGE(0.4 * k)); halo.addColorStop(1, SAGE(0));
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(w - 2, hy, 26, 0, Math.PI * 2); ctx.fill();
    };
  }

  /* pinned-statement backdrop — three slow engraved rings */
  function drawRings(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    [0.22, 0.32, 0.43].forEach((f, i) => {
      const r = Math.min(w, h) * f;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((t * 0.00002 * (i % 2 ? -1 : 1) * (i + 1)) % (Math.PI * 2));
      ctx.setLineDash(i === 1 ? [2, 9] : [14, 10]);
      ctx.strokeStyle = i === 2 ? 'rgba(192, 161, 94, 0.07)' : LIGHTC(0.06);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
  }

  /* group micro-motifs — each drawn from its group's actual work */
  const motifs = {
    /* tax — a chart that draws itself, holds, and re-inks */
    chart(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(20, 36, 59, 0.12)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(8, 8); ctx.lineTo(8, h - 14); ctx.lineTo(w - 8, h - 14); ctx.stroke();
      const cycle = (t % 7000) / 7000; // draw 0→.55 · hold →.8 · fade →1
      const p = cycle < 0.55 ? cycle / 0.55 : 1;
      const alpha = cycle > 0.8 ? 1 - (cycle - 0.8) / 0.2 : 1;
      const pts = [[0, 0.75], [0.18, 0.6], [0.36, 0.68], [0.55, 0.42], [0.75, 0.5], [1, 0.18]];
      ctx.beginPath();
      const upto = p * (pts.length - 1);
      for (let i = 0; i <= Math.floor(upto); i++) {
        const [px, py] = pts[i];
        const x = 8 + px * (w - 20), y = 12 + py * (h - 30);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      if (upto < pts.length - 1 && upto > 0) {
        const i = Math.floor(upto), f = upto - i;
        const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
        ctx.lineTo(8 + lerp(ax, bx, f) * (w - 20), 12 + lerp(ay, by, f) * (h - 30));
      }
      ctx.strokeStyle = `rgba(95, 169, 126, ${0.75 * alpha})`; ctx.lineWidth = 1.8; ctx.stroke();
    },
    /* advisory — a compass needle settling on a heading */
    compass(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.4;
      ctx.strokeStyle = 'rgba(20, 36, 59, 0.16)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (r - 5), cy + Math.sin(a) * (r - 5));
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
      }
      const ang = -Math.PI / 3 + Math.sin(t * 0.00042) * 0.5 + Math.sin(t * 0.00013) * 0.25;
      ctx.strokeStyle = 'rgba(95, 169, 126, 0.85)'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - Math.cos(ang) * r * 0.3, cy - Math.sin(ang) * r * 0.3);
      ctx.lineTo(cx + Math.cos(ang) * r * 0.72, cy + Math.sin(ang) * r * 0.72); ctx.stroke();
      ctx.fillStyle = '#14243B'; ctx.beginPath(); ctx.arc(cx, cy, 2.6, 0, Math.PI * 2); ctx.fill();
    },
    /* operations — a ledger grid filling entry by entry */
    grid(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      const cols = 7, rows = 4, gx = (w - 16) / cols, gy = (h - 16) / rows;
      const total = cols * rows;
      const cycle = (t % 8400) / 8400;
      const filled = cycle < 0.75 ? Math.floor((cycle / 0.75) * total) : total;
      const alpha = cycle > 0.87 ? 1 - (cycle - 0.87) / 0.13 : 1;
      for (let i = 0; i < total; i++) {
        const c = i % cols, r = (i / cols) | 0;
        const x = 8 + c * gx, y = 8 + r * gy;
        ctx.strokeStyle = 'rgba(20, 36, 59, 0.12)'; ctx.lineWidth = 1;
        ctx.strokeRect(x + 1, y + 1, gx - 2, gy - 2);
        if (i < filled) {
          ctx.fillStyle = `rgba(95, 169, 126, ${0.3 * alpha})`;
          ctx.fillRect(x + 3.5, y + 3.5, gx - 7, gy - 7);
        }
      }
    },
    /* resolution — a seal that keeps its slow authority, check re-inks */
    seal(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.4;
      [1, 0.8].forEach((f, i) => {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.00012 * (i ? -1 : 1));
        ctx.setLineDash(i ? [3, 6] : [10, 7]);
        ctx.strokeStyle = i ? 'rgba(192, 161, 94, 0.4)' : 'rgba(20, 36, 59, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(0, 0, r * f, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      });
      const cycle = (t % 5200) / 5200;
      const p = clamp(cycle / 0.3, 0, 1), alpha = cycle > 0.82 ? 1 - (cycle - 0.82) / 0.18 : 1;
      const seg = [[cx - r * 0.32, cy], [cx - r * 0.06, cy + r * 0.26], [cx + r * 0.36, cy - r * 0.24]];
      ctx.strokeStyle = `rgba(95, 169, 126, ${0.9 * alpha})`; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(seg[0][0], seg[0][1]);
      const legs = p * 2;
      if (legs > 0) {
        const f1 = clamp(legs, 0, 1);
        ctx.lineTo(lerp(seg[0][0], seg[1][0], f1), lerp(seg[0][1], seg[1][1], f1));
        if (legs > 1) { const f2 = legs - 1; ctx.lineTo(lerp(seg[1][0], seg[2][0], f2), lerp(seg[1][1], seg[2][1], f2)); }
      }
      ctx.stroke();
    },
  };

  function initAmbient() {
    Ambient.register($('#heroCanvas'), makeLedgerDraw(false));
    Ambient.register($('#ctaCanvas'), makeLedgerDraw(true));
    Ambient.register($('#whyCanvas'), drawRings);
    $$('.motif').forEach((cv) => Ambient.register(cv, motifs[cv.dataset.motif] || motifs.chart));
  }

  /* ============================================================
     NAV — hide/show · paper inversion · active link · mobile
     ============================================================ */
  function initNav() {
    const nav = $('#nav'), burger = $('#burger'), menu = $('#mobileMenu');
    let lastY = 0;
    onFrame(() => {
      const y = window.scrollY;
      if (y > lastY && y > 260 && !menu.classList.contains('is-open')) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      if (y < 200) $$('[data-nav].is-active').forEach((l) => l.classList.remove('is-active'));
      lastY = y;
    });
    // invert over light sections
    const lightIds = ['trust', 'services', 'process', 'voices', 'faq', 'contact'];
    if (HAS_GSAP && window.ScrollTrigger) {
      const active = new Set();
      lightIds.forEach((id) => {
        const sec = $('#' + id);
        sec && ScrollTrigger.create({
          trigger: sec, start: 'top 56px', end: 'bottom 56px',
          onToggle: (self) => { self.isActive ? active.add(id) : active.delete(id); nav.classList.toggle('nav--paper', active.size > 0); },
        });
      });
    } else {
      onFrame(() => {
        const onLight = lightIds.some((id) => { const el = $('#' + id); if (!el) return false; const r = el.getBoundingClientRect(); return r.top <= 56 && r.bottom >= 56; });
        nav.classList.toggle('nav--paper', onLight);
      });
    }
    // active link
    const links = $$('[data-nav]');
    const map = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.remove('is-active'));
        const link = map.get(en.target.id);
        link && link.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['services', 'process', 'credentials', 'faq', 'contact'].forEach((id) => { const el = $('#' + id); el && io.observe(el); });
    // mobile
    let open = false;
    function toggle(state) {
      open = state ?? !open;
      burger.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('is-locked', open);
      if (HAS_GSAP && !REDUCED) {
        if (open) gsap.to('.mmenu__links a span', { y: 0, duration: 0.65, stagger: 0.07, ease: 'power4.out', delay: 0.2 });
        else gsap.set('.mmenu__links a span', { y: '110%' });
      }
    }
    if (REDUCED || !HAS_GSAP) $$('.mmenu__links a span').forEach((s) => (s.style.transform = 'none'));
    burger.addEventListener('click', () => toggle());
    $$('[data-mm]').forEach((a) => a.addEventListener('click', () => toggle(false)));
    // smooth anchors
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1 && $(id)) { e.preventDefault(); scrollTo(id); }
      });
    });
  }

  /* ============================================================
     MAGNETIC
     ============================================================ */
  function initMagnetic() {
    if (TOUCH || REDUCED) return;
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        if (d < 90) { const f = (1 - d / 90) * 10; el.style.transform = `translate(${(dx / 90) * f}px, ${(dy / 90) * f}px)`; }
      });
      el.addEventListener('pointerleave', () => {
        if (HAS_GSAP) gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.45)', clearProps: 'transform' });
        else el.style.transform = '';
      });
    });
  }

  /* ============================================================
     REVEALS + HERO
     ============================================================ */
  function initReveals() {
    if (!HAS_GSAP || REDUCED) {
      $$('[data-reveal], [data-fade]').forEach((el) => (el.style.opacity = 1));
      $$('.hero__title .w').forEach((w) => (w.style.transform = 'none'));
      window.__heroIntro = () => $('#hero').classList.add('is-in');
      return;
    }
    $$('[data-fade]').forEach((el) => gsap.set(el, { opacity: 0 }));
    $$('[data-reveal]').forEach((el) => {
      gsap.from(el, { y: 26, opacity: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    });
    window.__heroIntro = function () {
      $('#hero').classList.add('is-in');
      const tl = gsap.timeline();
      tl.to('.hero__title .w', { y: 0, duration: 1.0, stagger: 0.07, ease: 'power4.out' })
        .fromTo('.hero__sub', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.55')
        .fromTo('.hero__cta', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .fromTo('.hero__stats', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.35')
        .fromTo('.hero .fineprint', { opacity: 0 }, { opacity: 0.65, duration: 0.5 }, '-=0.2');
    };
    // scroll-out: the scene settles — content sinks, canvas dims, no hard fade
    gsap.to('.hero__inner', {
      yPercent: -9, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: '18% top', end: 'bottom top', scrub: 1 },
    });
    gsap.to('#heroCanvas', {
      opacity: 0.35, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });
  }

  /* ============================================================
     COUNTERS — tabular figures, counted with restraint
     ============================================================ */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
    const grouped = 'grouped' in el.dataset;
    const fmt = (v) => prefix + (grouped ? Math.round(v).toLocaleString('en-IN') : String(Math.round(v))) + suffix;
    if (REDUCED || !HAS_GSAP) { el.textContent = fmt(target); return; }
    const o = { v: 0 };
    gsap.to(o, { v: target, duration: 1.7, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)) });
  }
  function initCounters() {
    $$('[data-count]').forEach((el) => {
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return; io.disconnect();
        animateCount(el);
      }, { threshold: 0.55 });
      io.observe(el);
    });
  }

  /* ============================================================
     WHY — pinned statement, words illuminate under scrub
     ============================================================ */
  function initWhy() {
    const text = $('#whyText');
    if (!text) return;
    if (!HAS_GSAP || REDUCED) { return; }
    Array.from(text.childNodes).forEach((node) => {
      if (node.nodeType !== 3) { node.classList.add('word'); return; }
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((tok) => {
        if (tok.trim()) { const s = document.createElement('span'); s.className = 'word'; s.textContent = tok; frag.appendChild(s); }
        else frag.appendChild(document.createTextNode(tok));
      });
      text.replaceChild(frag, node);
    });
    gsap.timeline({
      scrollTrigger: { trigger: '#why', start: 'top 60%', end: 'bottom 80%', scrub: 1, pin: '.why__text', pinSpacing: true },
    }).to($$('.word', text), { opacity: 1, stagger: 0.35, ease: 'none' });
  }

  /* ============================================================
     PROCESS — horizontal scrub, vertical below 768px
     ============================================================ */
  function initProcess() {
    const track = $('#processTrack');
    if (!track || !HAS_GSAP || REDUCED || MOBILE) { const f = $('#processFill'); if (f) f.style.transform = 'scaleX(1)'; return; }
    const getScroll = () => track.scrollWidth - innerWidth;
    const fill = $('#processFill');
    gsap.to(track, {
      x: () => -getScroll(), ease: 'none',
      scrollTrigger: {
        trigger: '#process', start: 'top top', end: () => '+=' + getScroll(),
        scrub: 1, pin: true, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => { fill.style.transform = `scaleX(${self.progress})`; },
      },
    });
  }

  /* ============================================================
     VOICES — draggable carousel (placeholder quotes, flagged)
     ============================================================ */
  function initVoices() {
    const track = $('#voicesTrack'), dotsWrap = $('#voicesDots'), carousel = $('#voicesCarousel');
    if (!track) return;
    const data = [
      { q: 'A notice I had been dreading for months was closed in three meetings. They answered it; I only signed.', n: 'M. Desai', r: 'TEXTILE EXPORTER · SURAT' },
      { q: 'Our books went from a yearly emergency to a monthly non-event. The bank noticed before we did.', n: 'A. Shah', r: 'D2C FOUNDER' },
      { q: 'They planned the year in March instead of repairing it in July. The difference showed up in the return.', n: 'R. Kapadia', r: 'LOGISTICS DIRECTOR' },
      { q: 'The estate work was handled with more patience than we managed ourselves. Everything reached the right hands.', n: 'S. Mehta', r: 'FAMILY TRUSTEE' },
    ];
    data.forEach((d, i) => {
      const c = document.createElement('article');
      c.className = 'vcard';
      c.innerHTML = `
        <svg class="vcard__tick" viewBox="0 0 16 14" aria-hidden="true"><path d="M2 7 L6 11 L14 3"/></svg>
        <p class="vcard__quote">&ldquo;${d.q}&rdquo;</p>
        <div class="vcard__who"><b>${d.n}</b><i>${d.r}</i></div>`;
      track.appendChild(c);
      const dot = document.createElement('button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const cards = $$('.vcard', track), dots = $$('button', dotsWrap);
    let cardW = 0, index = 0, offset = 0, target = 0;
    function measure() { cardW = cards[0].offsetWidth + 22; }
    function goTo(i) { index = clamp(i, 0, cards.length - 1); target = -index * cardW; update(); }
    function update() {
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
      cards.forEach((c, i) => c.classList.toggle('is-side', i !== index));
    }
    measure(); update();
    addEventListener('resize', () => { measure(); target = -index * cardW; });
    let dragging = false, startX = 0, startOffset = 0, vel = 0, lastX = 0;
    onFrame(() => {
      if (!dragging) target = -index * cardW;
      offset = REDUCED ? target : lerp(offset, target, 0.13);
      track.style.transform = `translateX(${offset}px)`;
    });
    function down(x) { dragging = true; startX = x; startOffset = offset; lastX = x; carousel.classList.add('is-drag'); }
    function move(x) { if (!dragging) return; offset = startOffset + (x - startX); target = offset; vel = x - lastX; lastX = x; }
    function up() {
      if (!dragging) return; dragging = false; carousel.classList.remove('is-drag');
      index = clamp(Math.round(-(offset + vel * 6) / cardW), 0, cards.length - 1);
      target = -index * cardW; update();
    }
    carousel.addEventListener('pointerdown', (e) => { e.preventDefault(); down(e.clientX); });
    addEventListener('pointermove', (e) => move(e.clientX));
    addEventListener('pointerup', up);
    carousel.addEventListener('touchstart', (e) => down(e.touches[0].clientX), { passive: true });
    carousel.addEventListener('touchmove', (e) => move(e.touches[0].clientX), { passive: true });
    carousel.addEventListener('touchend', up);
    if (!REDUCED) {
      let auto = setInterval(() => goTo((index + 1) % cards.length), 7000);
      carousel.addEventListener('pointerenter', () => clearInterval(auto));
      carousel.addEventListener('pointerdown', () => clearInterval(auto));
    }
  }

  /* ============================================================
     FAQ
     ============================================================ */
  function initFaq() {
    $$('.faq__item').forEach((item) => {
      const q = $('.faq__q', item), a = $('.faq__a', item);
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        $$('.faq__item.is-open').forEach((other) => {
          if (other === item) return;
          other.classList.remove('is-open');
          $('.faq__q', other).setAttribute('aria-expanded', 'false');
          if (HAS_GSAP && !REDUCED) gsap.to($('.faq__a', other), { height: 0, duration: 0.4, ease: 'power2.inOut' });
          else $('.faq__a', other).style.height = '0px';
        });
        item.classList.toggle('is-open', !isOpen);
        q.setAttribute('aria-expanded', String(!isOpen));
        if (HAS_GSAP && !REDUCED) gsap.to(a, { height: isOpen ? 0 : 'auto', duration: 0.45, ease: 'power2.inOut' });
        else a.style.height = isOpen ? '0px' : 'auto';
      });
    });
  }

  /* ============================================================
     CONTACT PORTAL — a small application
     ============================================================ */
  function initPortal() {
    const form = $('#contactForm'), panel = $('#formPanel'), success = $('#successPanel');
    if (!form) return;
    let service = '', pcm = 'Email';
    const chips = $$('.chip');
    chips.forEach((chip) => chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-on'));
      chip.classList.add('is-on');
      service = chip.dataset.val;
      setErr('errSvc', '');
    }));
    // route from ledger "Enquire" links — arrive with the matter preselected
    $$('[data-route]').forEach((a) => a.addEventListener('click', () => {
      const chip = chips.find((c) => c.dataset.val === a.dataset.route);
      chip && chip.click();
    }));
    $$('.seg', $('#pcmSeg')).forEach((seg) => seg.addEventListener('click', () => {
      $$('.seg').forEach((s) => { s.classList.remove('is-on'); s.setAttribute('aria-checked', 'false'); });
      seg.classList.add('is-on'); seg.setAttribute('aria-checked', 'true');
      pcm = seg.dataset.pcm;
    }));

    const fName = $('#fName'), fEmail = $('#fEmail'), fPhone = $('#fPhone'), fMsg = $('#fMsg');
    function setErr(id, msg) {
      const el = $('#' + id);
      el.textContent = msg;
      el.closest('.ffield, .portal__svc')?.classList.toggle('is-bad', !!msg);
    }
    const validators = {
      svc: () => (service ? '' : 'Choose the matter that brings you in.'),
      name: () => (fName.value.trim().length >= 2 ? '' : 'Your name, so we know who is writing.'),
      email: () => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fEmail.value.trim()) ? '' : 'A valid email address is needed for our reply.'),
      phone: () => {
        const digits = fPhone.value.replace(/\D/g, '');
        if (pcm !== 'Email' && digits.length === 0) return `A phone number is needed — ${pcm} is your preferred contact.`;
        if (digits.length && (digits.length < 7 || digits.length > 15)) return 'That number looks incomplete.';
        return '';
      },
      msg: () => (fMsg.value.trim().length >= 10 ? '' : 'A few lines about the situation helps us prepare.'),
    };
    fName.addEventListener('blur', () => setErr('errName', validators.name()));
    fEmail.addEventListener('blur', () => setErr('errEmail', validators.email()));
    fPhone.addEventListener('blur', () => setErr('errPhone', validators.phone()));
    fMsg.addEventListener('blur', () => setErr('errMsg', validators.msg()));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = {
        errSvc: validators.svc(), errName: validators.name(), errEmail: validators.email(),
        errPhone: validators.phone(), errMsg: validators.msg(),
      };
      Object.entries(errs).forEach(([id, msg]) => setErr(id, msg));
      if (Object.values(errs).some(Boolean)) {
        panel.classList.remove('is-shake'); void panel.offsetWidth; panel.classList.add('is-shake');
        return;
      }
      const btn = $('#submitBtn');
      btn.classList.add('is-loading'); btn.disabled = true;
      // NOTE: static demo — no transport wired; see launch report
      setTimeout(() => {
        btn.classList.remove('is-loading'); btn.disabled = false;
        form.hidden = true;
        success.hidden = false;
        requestAnimationFrame(() => success.classList.add('is-in'));
        $('#refCode').textContent = 'JPM-' + Date.now().toString(36).slice(-5).toUpperCase();
        $('#refSvc').textContent = service;
        $('#refPcm').textContent = pcm.toLowerCase();
      }, 1400);
    });
    $('#againBtn').addEventListener('click', () => {
      success.hidden = true; success.classList.remove('is-in');
      form.hidden = false; form.reset();
      chips.forEach((c) => c.classList.remove('is-on')); service = '';
      ['errSvc', 'errName', 'errEmail', 'errPhone', 'errMsg'].forEach((id) => setErr(id, ''));
    });
  }

  /* ---------- office clock — IST, ticking ---------- */
  function initClock() {
    const clock = $('#istClock'), day = $('#istDay');
    if (!clock) return;
    const tFmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
    const dFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' });
    (function tickClock() {
      const now = new Date();
      clock.textContent = tFmt.format(now);
      day.textContent = dFmt.format(now).toUpperCase() + ' · SURAT';
      setTimeout(tickClock, 1000);
    })();
  }

  /* ============================================================
     FOOTER — watermark resolves into gold at the true bottom
     ============================================================ */
  function initFooter() {
    if (!HAS_GSAP || REDUCED) { const g = $('#wmGold'); if (g) g.style.opacity = 1; return; }
    gsap.to('#wmGold', {
      opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '#footer', start: 'top 85%', end: 'bottom bottom', scrub: 1 },
    });
  }

  /* ---------- back-to-top neon tray ---------- */
  function initTopTray() {
    const tray = $('#topTray'), btn = $('#backTop'), ring = $('#backRing');
    if (!tray) return;
    const len = 2 * Math.PI * 16;
    onFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight || 1;
      const p = clamp(window.scrollY / max, 0, 1);
      ring.style.strokeDashoffset = String(len * (1 - p));
      tray.classList.toggle('is-on', window.scrollY > 600);
    });
    btn.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initSmooth();
    initCurrent();
    initAmbient();
    initNav();
    initMagnetic();
    initReveals();
    initCounters();
    initWhy();
    initProcess();
    initVoices();
    initFaq();
    initPortal();
    initClock();
    initFooter();
    initTopTray();
    initPreloader(() => window.__heroIntro && window.__heroIntro());
  });
})();
