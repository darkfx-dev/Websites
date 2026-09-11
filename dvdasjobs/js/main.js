/* ============================================================
   DVDAS JOBS — main.js
   Modules: Env · RAF · Smooth · Preloader · Favicon · TitleSwap ·
   Cursor · Magnetic · Logo · Nav · BgGrid · Watermarks · Fragments ·
   Particles · ScrollFX · Typewriter · Counters · Marquee · Wipes ·
   Manifesto · Services · Results · Process · Split · Carousel ·
   FAQ · Launch · Forms · Footer · Clock
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
  let velocity = 0; // lerped px/frame, signed
  let curX = innerWidth / 2, curY = innerHeight / 2; // last known cursor position (The Current)
  addEventListener('pointermove', (e) => { curX = e.clientX; curY = e.clientY; }, { passive: true });
  function initSmooth() {
    if (REDUCED || typeof window.Lenis === 'undefined') {
      let lastY = window.scrollY;
      onFrame(() => { const y = window.scrollY; velocity = lerp(velocity, y - lastY, 0.1); lastY = y; });
      return;
    }
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    onFrame((time) => lenis.raf(time));
    lenis.on('scroll', (e) => { velocity = lerp(velocity, e.velocity || 0, 0.2); });
    if (HAS_GSAP && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.lagSmoothing(0); }
    onFrame(() => { velocity = lerp(velocity, 0, 0.06); });
  }
  function scrollTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: -70 });
    else { const el = typeof target === 'string' ? $(target) : target; el && el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); }
  }

  /* ============================================================
     PRELOADER — white, letters rise, rule → black curtain up
     ============================================================ */
  function initPreloader(onDone) {
    const pre = $('#preloader');
    if (!pre || REDUCED || !HAS_GSAP) { pre && pre.remove(); document.body.classList.remove('is-locked'); onDone(); return; }
    document.body.classList.add('is-locked');
    const brand = $('#preBrand');
    'DVDAS JOBS'.split('').forEach((ch) => {
      const b = document.createElement('b');
      if (ch === ' ') b.className = 'sp'; else b.textContent = ch;
      brand.appendChild(b);
    });
    const count = $('#preCount');
    const obj = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => { pre.remove(); document.body.classList.remove('is-locked'); } });
    tl.to(obj, { v: 100, duration: 1.9, ease: 'power2.inOut', onUpdate: () => {
        // split-flap flicker while assets resolve, settling into the true count
        const s = String(Math.round(obj.v)).padStart(3, '0');
        count.textContent = obj.v < 10 ? s.split('').map((c, i) => (i < 2 ? String((Math.random() * 10) | 0) : c)).join('') : s;
      } }, 0)
      .to('#preBrand b', { y: 0, duration: 0.9, stagger: 0.055, ease: 'power4.out' }, 0.25)
      .to('#preRule', { scaleX: 1, duration: 1.0, ease: 'power3.inOut' }, 0.6)
      .to('#preCurtain', { y: '0%', duration: 0.7, ease: 'power4.inOut' }, 2.0)
      .add(() => onDone(), 2.35)
      .to(pre, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, 2.45);
  }

  /* ============================================================
     MICRO — favicon blink · title swap · progress bar
     ============================================================ */
  function initMicro() {
    const fav = $('#favicon');
    if (fav && !REDUCED) {
      const f1 = fav.href;
      const f2 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230A0A0A'/%3E%3Ctext x='16' y='23' font-family='Arial Black,sans-serif' font-size='19' font-weight='900' fill='%23FAFAFA' text-anchor='middle' opacity='0.25'%3ED%3C/text%3E%3C/svg%3E";
      const f3 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23FAFAFA'/%3E%3Ctext x='16' y='23' font-family='Arial Black,sans-serif' font-size='19' font-weight='900' fill='%230A0A0A' text-anchor='middle'%3ED%3C/text%3E%3C/svg%3E";
      let on = true, charged = false;
      setInterval(() => { if (charged) return; on = !on; fav.href = on ? f1 : f2; }, 1200);
      flashFavicon = () => { charged = true; fav.href = f3; setTimeout(() => { charged = false; fav.href = f1; }, 280); };
    }
    const realTitle = document.title;
    document.addEventListener('visibilitychange', () => {
      document.title = document.hidden ? 'Come back — your career is waiting.' : realTitle;
    });
    const bar = $('#progressBar'), ring = $('#backRing');
    const len = 2 * Math.PI * 16;
    onFrame(() => {
      const p = clamp(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1), 0, 1);
      if (bar) bar.style.width = p * 100 + '%';
      if (ring) ring.style.strokeDashoffset = String(len * (1 - p));
    });
  }

  /* ============================================================
     CURSOR — blend-difference, flips over black automatically
     ============================================================ */
  function initCursor() {
    if (TOUCH || REDUCED) { $('#cursor')?.remove(); return; }
    const cursor = $('#cursor'), dot = $('#cursorDot'), ring = $('#cursorRing'), label = $('#cursorLabel');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    let glow = 0, idleT = 0;
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; idleT = 0; }, { passive: true });
    onFrame(() => {
      rx = lerp(rx, mx, 0.13); ry = lerp(ry, my, 0.13);
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      // The Current: velocity-charged glow + comet stretch along scroll axis
      const v = Math.abs(velocity);
      glow = lerp(glow, clamp(v / 26, 0, 1), 0.12);
      ring.style.setProperty('--glow', glow.toFixed(3));
      ring.style.setProperty('--tiltz', velocity > 2 ? '90deg' : velocity < -2 ? '90deg' : '0deg');
      idleT += 1 / 60;
      cursor.classList.toggle('is-idle', idleT > 2.2 && v < 0.5);
    });
    $$('a, button, [data-magnetic], .faq__q, .split__half').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover', 'is-label'));
    });
    const car = $('#voicesCarousel');
    if (car) {
      car.addEventListener('pointerenter', () => { cursor.classList.add('is-label'); label.textContent = 'DRAG'; });
      car.addEventListener('pointerleave', () => { cursor.classList.remove('is-label'); label.textContent = ''; });
    }
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
      let over = false;
      el.addEventListener('pointerenter', () => (over = true));
      el.addEventListener('pointermove', (e) => {
        if (!over) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        if (d < 80) { const f = (1 - d / 80) * 12; el.style.transform = `translate(${(dx / 80) * f}px,${(dy / 80) * f}px)`; }
      });
      el.addEventListener('pointerleave', () => {
        over = false;
        if (HAS_GSAP) gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)', clearProps: 'transform' });
        else el.style.transform = '';
      });
    });
  }

  /* ============================================================
     LOGO — letters drop in, float on sine, flip on hover
     ============================================================ */
  function initLogo() {
    const logo = $('#logo');
    if (!logo) return;
    const inners = [];
    'DVDAS'.split('').forEach((ch, i) => {
      const out = document.createElement('span'); out.className = 'l-out';
      const inn = document.createElement('span'); inn.className = 'l-in'; inn.textContent = ch;
      out.appendChild(inn); logo.appendChild(out);
      inners.push({ el: inn, phase: i * 1.1, speed: 4.2 + i * 0.45 });
    });
    if (REDUCED) return;
    let floatOn = false;
    onFrame((t) => {
      if (!floatOn) return;
      const s = t / 1000;
      inners.forEach((L) => { L.el.style.transform = `translateY(${Math.sin((s / L.speed) * Math.PI * 2 + L.phase) * 2}px)`; });
    });
    window.__logoDrop = () => {
      if (!HAS_GSAP) { floatOn = true; return; }
      gsap.from('.l-out', { y: -34, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'back.out(2)', onComplete: () => (floatOn = true) });
    };
    if (HAS_GSAP && !TOUCH) {
      let flipping = false;
      logo.addEventListener('pointerenter', () => {
        if (flipping) return; flipping = true;
        gsap.fromTo('.l-out', { rotateX: 0 }, { rotateX: 360, duration: 0.6, stagger: 0.05, ease: 'power2.inOut', onComplete: () => (flipping = false) });
      });
    }
  }

  /* ============================================================
     NAV — hide/show · sliding indicator · dark inversion · mobile
     ============================================================ */
  function initNav() {
    const nav = $('#nav'), burger = $('#burger'), menu = $('#mobileMenu'), ind = $('#navInd');
    requestAnimationFrame(() => nav.classList.add('is-ready'));
    let lastY = 0;
    onFrame(() => {
      const y = window.scrollY;
      if (y > lastY && y > 220 && !menu.classList.contains('is-open')) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      lastY = y;
    });
    // dark-section inversion
    if (HAS_GSAP && window.ScrollTrigger) {
      $$('.sec-dark').forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec, start: 'top 60px', end: 'bottom 60px',
          onToggle: (self) => nav.classList.toggle('nav--dark', self.isActive && $$('.sec-dark').some((s) => { const r = s.getBoundingClientRect(); return r.top <= 60 && r.bottom >= 60; })),
        });
      });
    }
    // sliding indicator + active link
    const links = $$('[data-nav-link]');
    const map = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
    function moveInd(link) {
      if (!link || !ind) return;
      const pr = link.parentElement.getBoundingClientRect();
      const r = link.getBoundingClientRect();
      ind.style.left = r.left - pr.left + 'px';
      ind.style.width = r.width + 'px';
      ind.classList.add('is-on');
    }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.remove('is-active'));
        const link = map.get(en.target.id);
        if (link) { link.classList.add('is-active'); moveInd(link); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['services', 'process', 'results', 'voices', 'contact'].forEach((id) => { const el = $('#' + id); el && io.observe(el); });
    addEventListener('resize', () => moveInd($('.nav__links a.is-active')));
    // mobile menu
    let open = false;
    function toggle(state) {
      open = state ?? !open;
      burger.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('is-locked', open);
      if (open && HAS_GSAP && !REDUCED) gsap.to('.mmenu__links a span', { y: 0, duration: 0.7, stagger: 0.07, ease: 'power4.out', delay: 0.25 });
      else if (!open && HAS_GSAP && !REDUCED) gsap.set('.mmenu__links a span', { y: '110%' });
    }
    burger.addEventListener('click', () => toggle());
    $$('[data-mm]').forEach((a) => a.addEventListener('click', () => toggle(false)));
    if (REDUCED) $$('.mmenu__links a span').forEach((s) => (s.style.transform = 'none'));
    // anchor scroll
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1 && $(id)) { e.preventDefault(); scrollTo(id); }
      });
    });
  }

  /* ============================================================
     BG GRID — 6 vertical lines, distinct parallax speeds
     ============================================================ */
  function initBgGrid() {
    const cols = $$('#bgGrid span');
    if (!cols.length || REDUCED) return;
    const speeds = [0.02, -0.035, 0.05, -0.02, 0.04, -0.05];
    onFrame(() => {
      const y = window.scrollY;
      cols.forEach((c, i) => { c.style.transform = `translateY(${(y * speeds[i]) % 120}px)`; });
    });
  }

  /* ============================================================
     WATERMARKS — drift at 0.15–0.25× scroll
     ============================================================ */
  function initWatermarks() {
    if (!HAS_GSAP || REDUCED) return;
    $$('[data-wm]').forEach((wm, i) => {
      gsap.fromTo(wm, { xPercent: i % 2 ? 4 : -12 }, {
        xPercent: i % 2 ? -12 : 4, ease: 'none',
        scrollTrigger: { trigger: wm.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
  }

  /* ============================================================
     FRAGMENTS — sine float + velocity lag spring
     ============================================================ */
  function initFragments() {
    const frags = $$('[data-frag]');
    if (!frags.length || REDUCED) return;
    const F = frags.map((el, i) => ({ el, phase: i * 1.7, speed: 3.8 + (i % 4) * 0.9, amp: 5 + (i % 3) * 3, lag: 0 }));
    onFrame((t) => {
      const s = t / 1000;
      F.forEach((f) => {
        f.lag = lerp(f.lag, -velocity * 0.35, 0.08);
        f.el.style.transform = `translateY(${Math.sin((s / f.speed) * Math.PI * 2 + f.phase) * f.amp + f.lag}px)`;
      });
    });
  }

  /* ============================================================
     PARTICLES — monochrome canvas field (hero + CTA)
     ============================================================ */
  function initParticles(canvasId, color) {
    const canvas = $(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const COUNT = REDUCED ? 0 : MOBILE ? 70 : 150;
    let W = 0, H = 0, visible = false;
    const DPR = Math.min(devicePixelRatio || 1, 2);
    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize(); addEventListener('resize', resize);
    const P = Array.from({ length: COUNT }, () => ({
      x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.4, v: 0.0002 + Math.random() * 0.00055, drift: (Math.random() - 0.5) * 0.0001,
    }));
    let tmx = 0, mx = 0;
    addEventListener('pointermove', (e) => { tmx = e.clientX / innerWidth - 0.5; }, { passive: true });
    new IntersectionObserver((en) => (visible = en[0].isIntersecting)).observe(canvas);
    if (REDUCED) return;
    let streak = 0; // spring-eased velocity response (The Current #4)
    onFrame(() => {
      if (!visible || !W) return;
      mx = lerp(mx, tmx, 0.04);
      streak = lerp(streak, clamp(Math.abs(velocity) / 20, 0, 1), 0.09);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = color; ctx.strokeStyle = color;
      const boost = 1 + streak * 7;
      for (const p of P) {
        p.y -= p.v * boost; p.x += p.drift;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        const px = p.x * W + mx * 30 * p.r, py = p.y * H;
        ctx.globalAlpha = 0.5 - streak * 0.2;
        if (streak > 0.08) {
          ctx.lineWidth = p.r * 1.3;
          ctx.beginPath(); ctx.moveTo(px, py);
          ctx.lineTo(px, py + p.r * streak * 22 * Math.sign(velocity || 1));
          ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    });
  }

  /* ============================================================
     TEXT FX — scramble helper
     ============================================================ */
  function scramble(el) {
    if (REDUCED) return;
    const final = el.textContent;
    const chars = '!<>-_\\/[]{}=+*^?#';
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return; io.disconnect();
      let frame = 0;
      const id = setInterval(() => {
        el.textContent = final.split('').map((c, i) => (c === ' ' || i < frame / 2 ? c : chars[(Math.random() * chars.length) | 0])).join('');
        if (frame++ / 2 > final.length) { clearInterval(id); el.textContent = final; }
      }, 28);
    }, { threshold: 0.5 });
    io.observe(el);
  }

  /* ============================================================
     SCROLL FX — hero intro/outro · reveals
     ============================================================ */
  function initScrollFX() {
    if (!HAS_GSAP) {
      $$('[data-reveal],[data-fade]').forEach((el) => (el.style.opacity = 1));
      $$('.hero__title [data-word]').forEach((el) => (el.style.transform = 'none'));
      const sf = $('.hero__title .serif'); if (sf) { sf.style.opacity = 1; sf.style.transform = 'none'; }
      window.__heroIntro = () => {};
      return;
    }
    window.__heroIntro = function () {
      $('#hero').classList.add('is-in');
      if (REDUCED) {
        gsap.set('.hero__title [data-word]', { y: 0 });
        gsap.set('.hero__title .serif', { opacity: 1, y: 0, rotate: 0 });
        gsap.set('[data-fade]', { opacity: 1 });
        return;
      }
      const tl = gsap.timeline();
      tl.to('.hero__title [data-word]', { y: 0, duration: 1.0, stagger: 0.09, ease: 'power4.out' })
        .to('.hero__title .serif', { opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: 'power3.out' }, '-=0.45')
        .set('.hero__cta, .hero__stats', { opacity: 1 }, '-=0.5')
        .fromTo('.hero__sub', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '<')
        .from('.hero__cta > *', { y: 18, opacity: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out' }, '-=0.35')
        .from('.hero__stats > *', { y: 16, opacity: 0, duration: 0.5, stagger: 0.09, ease: 'power3.out' }, '-=0.3')
        .add(() => window.__heroMagnet && window.__heroMagnet());
    };
    if (!REDUCED) {
      $$('[data-fade]').forEach((el) => (el.style.opacity = 0));
      $$('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });
      // hero scroll-out: lines drift apart, tracking expands, blur
      const lines = $$('.hero__title .line');
      gsap.to(lines[0], { yPercent: -26, letterSpacing: '0.02em', ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to(lines[1], { yPercent: 14, letterSpacing: '0.05em', ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.hero__inner', { filter: 'blur(2px)', opacity: 0.35, ease: 'none', scrollTrigger: { trigger: '#hero', start: '12% top', end: 'bottom top', scrub: 1 } });
    } else {
      $$('[data-reveal],[data-fade]').forEach((el) => (el.style.opacity = 1));
    }
    $$('[data-scramble]').forEach(scramble);
  }

  /* ============================================================
     TYPEWRITER — hero rotating disciplines
     ============================================================ */
  function initTypewriter() {
    const el = $('#typeLine');
    if (!el) return;
    const phrases = ['Career Placement.', 'Resume Engineering.', 'Interview Mastery.', 'Corporate Hiring.'];
    if (REDUCED) { el.textContent = phrases[0]; return; }
    let pi = 0, ci = 0, deleting = false;
    (function step() {
      const p = phrases[pi];
      el.textContent = p.slice(0, ci);
      let delay = deleting ? 34 : 62;
      if (!deleting && ci === p.length) { delay = 1600; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
      else ci += deleting ? -1 : 1;
      setTimeout(step, delay);
    })();
  }

  /* ============================================================
     COUNTERS
     ============================================================ */
  /* split-flap: every digit flicks through intermediate values, locking left→right */
  function animateCount(el, target, opts = {}) {
    const suffix = opts.suffix || '';
    const grouped = opts.grouped;
    const final = (grouped ? Math.round(target).toLocaleString('en-US') : String(Math.round(target))) + suffix;
    if (REDUCED) { el.textContent = final; return; }
    const dur = (opts.duration || 1.6) * 1000;
    const start = performance.now();
    const digitIdx = final.split('').map((c, i) => (/\d/.test(c) ? i : -1)).filter((i) => i >= 0);
    (function flap(now) {
      const t = clamp((now - start) / dur, 0, 1);
      const locked = Math.floor(t * digitIdx.length + 0.0001);
      el.textContent = final.split('').map((c, i) => {
        if (!/\d/.test(c)) return c;
        const pos = digitIdx.indexOf(i);
        return pos < locked ? c : String((Math.random() * 10) | 0);
      }).join('');
      if (t < 1) requestAnimationFrame(flap);
      else el.textContent = final;
    })(start);
  }
  function initCounters() {
    $$('[data-count]').forEach((el) => {
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return; io.disconnect();
        animateCount(el, parseFloat(el.dataset.count), { suffix: el.dataset.suffix || '', grouped: 'grouped' in el.dataset });
      }, { threshold: 0.5 });
      io.observe(el);
    });
    const res = $('.results');
    if (res) {
      $$('.rstat', res).forEach((r, i) => r.style.setProperty('--i', i));
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return; io.disconnect();
        res.classList.add('is-in');
        $$('.rstat', res).forEach((r) => r.classList.add('is-in'));
      }, { threshold: 0.4 });
      io.observe(res);
    }
  }

  /* ============================================================
     MARQUEE — opposing rows + velocity skew
     ============================================================ */
  function initMarquee() {
    const words = ['NORTHWIND', 'HELIX', 'VANTAGE', 'OAKLINE', 'PRIMER', 'CASCADE', 'MERIDIAN', 'FORGE', 'BLUEPEAK', 'STRATUM'];
    [['#mqA', 1], ['#mqB', -1]].forEach(([sel]) => {
      const host = $(sel);
      if (!host) return;
      host.innerHTML = words.map((w) => `<span>${w}</span>`).join('');
      const clone = host.parentElement.querySelector('[aria-hidden]');
      if (clone) clone.innerHTML = host.innerHTML;
    });
    if (REDUCED) return;
    $$('.marquee').forEach((row) => {
      const dir = parseFloat(row.dataset.mq);
      const tracks = $$('.marquee__track', row);
      let x = 0, paused = false;
      row.addEventListener('pointerenter', () => (paused = true));
      row.addEventListener('pointerleave', () => (paused = false));
      onFrame(() => {
        if (!paused) x -= 0.55 * dir;
        const w = tracks[0].offsetWidth;
        if (x <= -w) x += w; if (x > 0) x -= w;
        const skew = clamp(velocity * 0.045, -3, 3);
        tracks.forEach((t) => (t.style.transform = `translateX(${x}px)`));
        row.style.transform = `skewX(${skew}deg)`;
      });
    });
  }

  /* ============================================================
     WIPES — curtain panels, scrubbed
     ============================================================ */
  function initWipes() {
    if (!HAS_GSAP || REDUCED) { $$('.wipe__panel').forEach((p) => (p.style.transform = 'scaleY(1)')); return; }
    $$('[data-wipe]').forEach((zone) => {
      gsap.to($('.wipe__panel', zone), {
        scaleY: 1, ease: 'none',
        scrollTrigger: {
          trigger: zone, start: 'top 90%', end: 'bottom 55%', scrub: 1,
          onLeave: () => { spawnSparks(); window.__blip && window.__blip(440, 0.06, 0.02); }, // chapter spark + optional chime
        },
      });
    });
  }

  /* section-boundary spark burst from last cursor position */
  function spawnSparks() {
    if (REDUCED || TOUCH || !HAS_GSAP) return;
    for (let i = 0; i < 9; i++) {
      const s = document.createElement('i');
      s.className = 'spark';
      s.style.left = curX + 'px'; s.style.top = curY + 'px';
      document.body.appendChild(s);
      const a = (i / 9) * Math.PI * 2 + Math.random() * 0.5;
      const d = 40 + Math.random() * 60;
      gsap.to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, scale: 0.3, duration: 0.55, ease: 'power2.out', onComplete: () => s.remove() });
    }
  }

  /* static charge: fast-scroll vignette flash + favicon frame 3, ≤1/s */
  let flashFavicon = null;
  function initStaticCharge() {
    const vig = $('#chargeVignette');
    if (!vig || REDUCED || !HAS_GSAP) return;
    let last = 0;
    onFrame(() => {
      const now = performance.now();
      if (Math.abs(velocity) > 42 && now - last > 1000) {
        last = now;
        gsap.fromTo(vig, { opacity: 0 }, { opacity: 1, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        flashFavicon && flashFavicon();
      }
    });
  }

  /* ============================================================
     MANIFESTO — pinned word illumination + serif underline
     ============================================================ */
  function initManifesto() {
    const mText = $('#manifestoText');
    if (!mText) return;
    if (!HAS_GSAP || REDUCED) { $$('.word', mText).forEach((w) => (w.style.opacity = 1)); mText.style.setProperty('--u', 1); return; }
    // wrap plain words, keep the serif em intact as one unit
    Array.from(mText.childNodes).forEach((node) => {
      if (node.nodeType !== 3) { node.classList.add('word'); return; }
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((tok) => {
        if (tok.trim()) { const s = document.createElement('span'); s.className = 'word'; s.textContent = tok; frag.appendChild(s); }
        else frag.appendChild(document.createTextNode(tok));
      });
      mText.replaceChild(frag, node);
    });
    const words = $$('.word', mText);
    const em = $('#manifestoEm');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#manifesto', start: 'top 65%', end: 'bottom 75%', scrub: 1, pin: '.manifesto__text', pinSpacing: true },
    });
    tl.to(words, { opacity: 1, stagger: 0.4, ease: 'none' })
      .to(em, { '--u': 1, duration: 0.8, ease: 'none' }, '>-0.2');
  }

  /* ============================================================
     SERVICES — sticky stack scale/dim + per-card visuals
     ============================================================ */
  function initServices() {
    const cards = $$('.svc');
    if (HAS_GSAP && !REDUCED && !MOBILE) {
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.94, opacity: 0.45, filter: 'brightness(0.6)', ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 12%', scrub: 1 },
        });
      });
    }
    cards.forEach((card) => {
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return; io.disconnect();
        card.classList.add('is-in');
        // capability indexes count 00 → NN
        $$('[data-capidx]', card).forEach((idx, i) => {
          const target = parseInt(idx.dataset.capidx, 10);
          if (REDUCED || !HAS_GSAP) { idx.textContent = String(target).padStart(2, '0'); return; }
          const o = { v: 0 };
          gsap.to(o, { v: target, duration: 0.9, delay: 0.15 + i * 0.12, ease: 'power2.out', onUpdate: () => (idx.textContent = String(Math.round(o.v)).padStart(2, '0')) });
        });
        if (HAS_GSAP && !REDUCED) gsap.from($$('.svc__caps li', card), { x: -18, opacity: 0, duration: 0.55, stagger: 0.09, ease: 'power3.out' });
        runVisual(card);
      }, { threshold: 0.35 });
      io.observe(card);
    });

    function runVisual(card) {
      const vis = $('[data-visual]', card);
      if (!vis) return;
      const kind = vis.dataset.visual;
      if (kind === 'match') visualMatch(vis);
      else if (kind === 'resume') visualResume(vis);
      else if (kind === 'chat') visualChat(vis);
      else if (kind === 'funnel') visualFunnel(vis);
    }

    function visualMatch(vis) {
      const svg = $('.match-svg', vis);
      const gl = $('.match-nodes-l', svg), gr = $('.match-nodes-r', svg), lines = $('.match-lines', svg);
      const NS = 'http://www.w3.org/2000/svg';
      const ys = [50, 100, 150, 200];
      ys.forEach((y) => {
        const c1 = document.createElementNS(NS, 'circle');
        c1.setAttribute('cx', 40); c1.setAttribute('cy', y); c1.setAttribute('r', 7); gl.appendChild(c1);
        const c2 = document.createElementNS(NS, 'circle');
        c2.setAttribute('cx', 260); c2.setAttribute('cy', y); c2.setAttribute('r', 7); gr.appendChild(c2);
      });
      const pairs = [[50, 150], [100, 50], [150, 200], [200, 100]];
      const paths = pairs.map(([a, b]) => {
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', `M47,${a} C120,${a} 180,${b} 253,${b}`);
        const len = 240;
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        lines.appendChild(p);
        return p;
      });
      const stamp = $('[data-stamp]', vis);
      if (REDUCED || !HAS_GSAP) { paths.forEach((p) => (p.style.strokeDashoffset = 0)); stamp.style.transform = 'scale(1) rotate(-4deg)'; return; }
      const tl = gsap.timeline();
      tl.to(paths, { strokeDashoffset: 0, duration: 0.7, stagger: 0.25, ease: 'power2.inOut' })
        .to(stamp, { scale: 1, rotate: -4, duration: 0.5, ease: 'back.out(2.5)' }, '-=0.1');
    }

    function visualResume(vis) {
      const bars = $$('.resume__bar', vis), score = $('[data-score]', vis), stamp = $('[data-stamp]', vis);
      if (REDUCED || !HAS_GSAP) { bars.forEach((b) => (b.style.transform = 'scaleX(1)')); score.textContent = '98'; stamp.style.transform = 'scale(1) rotate(-6deg)'; return; }
      const tl = gsap.timeline();
      tl.to(bars, { scaleX: 1, duration: 0.55, stagger: 0.12, ease: 'power3.out' });
      const o = { v: 0 };
      tl.to(o, { v: 98, duration: 1.1, ease: 'power2.out', onUpdate: () => (score.textContent = Math.round(o.v)) }, '-=0.4')
        .to(stamp, { scale: 1, rotate: -6, duration: 0.5, ease: 'back.out(2.5)' }, '-=0.3');
    }

    function visualChat(vis) {
      const bubbles = $$('.chat__b', vis), meter = $('[data-meter]', vis);
      if (REDUCED || !HAS_GSAP) { bubbles.forEach((b) => { b.style.opacity = 1; b.style.transform = 'none'; }); meter.style.width = '90%'; return; }
      const tl = gsap.timeline();
      tl.to(bubbles, { opacity: 1, y: 0, duration: 0.5, stagger: 0.42, ease: 'power3.out' })
        .to(meter, { width: '90%', duration: 0.9, ease: 'power2.inOut' }, '-=0.2');
    }

    function visualFunnel(vis) {
      const linesEls = $$('.funnel-line', vis);
      linesEls.forEach((l) => { const len = 700; l.style.strokeDasharray = len; l.style.strokeDashoffset = len; });
      const dotsG = $('.funnel-dots', vis);
      const NS = 'http://www.w3.org/2000/svg';
      const dots = Array.from({ length: 8 }, (_, i) => {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', 70 + i * 23); c.setAttribute('cy', 18); c.setAttribute('r', 4);
        c.style.opacity = 0; dotsG.appendChild(c);
        return c;
      });
      const squares = $$('[data-shortlist] b', vis);
      if (REDUCED || !HAS_GSAP) { linesEls.forEach((l) => (l.style.strokeDashoffset = 0)); dots.forEach((d) => (d.style.opacity = 1)); squares.forEach((s) => (s.style.transform = 'scale(1)')); return; }
      const tl = gsap.timeline();
      tl.to(linesEls, { strokeDashoffset: 0, duration: 0.6, stagger: 0.2, ease: 'power2.inOut' })
        .to(dots, { opacity: 1, duration: 0.2, stagger: 0.07 }, '-=0.5')
        .to(dots, { attr: { cy: 190 }, opacity: (i) => (i % 3 === 0 ? 1 : 0), duration: 0.9, stagger: 0.08, ease: 'power2.in' })
        .to(squares, { scale: 1, duration: 0.4, stagger: 0.12, ease: 'back.out(3)' }, '-=0.2');
    }
  }

  /* ============================================================
     PROCESS — horizontal pin + progress line + nodes
     ============================================================ */
  function initProcess() {
    const track = $('#processTrack');
    if (!track) return;
    $$('.step').forEach((s) => {
      const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { s.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.4 });
      io.observe(s);
    });
    if (!HAS_GSAP || REDUCED || MOBILE) { const f = $('#processFill'); if (f) f.style.transform = 'scaleX(1)'; $$('.pnode').forEach((n) => n.classList.add('is-lit')); return; }
    const getScroll = () => track.scrollWidth - innerWidth;
    const fill = $('#processFill'), nodes = $$('.pnode');
    gsap.to(track, {
      x: () => -getScroll(), ease: 'none',
      scrollTrigger: {
        trigger: '#process', start: 'top top', end: () => '+=' + getScroll(),
        scrub: 1, pin: true, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => {
          fill.style.transform = `scaleX(${self.progress})`;
          nodes.forEach((n, i) => n.classList.toggle('is-lit', self.progress >= i / 3 - 0.02));
        },
      },
    });
  }

  /* ============================================================
     SPLIT — list stagger + gentle title float
     ============================================================ */
  function initSplit() {
    $$('[data-half]').forEach((half, hi) => {
      const items = $$('.split__list li', half);
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return; io.disconnect();
        if (HAS_GSAP && !REDUCED) gsap.to(items, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, delay: hi * 0.15, ease: 'power3.out' });
        else items.forEach((li) => { li.style.opacity = 1; li.style.transform = 'none'; });
      }, { threshold: 0.35 });
      io.observe(half);
    });
    if (REDUCED) return;
    const titles = $$('[data-float-title]');
    onFrame((t) => {
      const s = t / 1000;
      titles.forEach((el, i) => { el.style.transform = `translateY(${Math.sin((s / 5.2) * Math.PI * 2 + i * 2.2) * 4}px)`; });
    });
  }

  /* ============================================================
     CAROUSEL — drag inertia · dots · auto-advance
     ============================================================ */
  function initCarousel() {
    const track = $('#voicesTrack'), dotsWrap = $('#voicesDots'), carousel = $('#voicesCarousel');
    if (!track) return;
    const data = [
      { q: 'Four interviews in eleven days. I signed at a 22% raise — and DVDAS negotiated the counter, not me.', n: 'Priya Raman', r: 'PLACED: SENIOR PM @ NORTHWIND' },
      { q: 'My resume passed filters it used to die in. The rebuild paid for itself before the first interview.', n: 'Marcus Bell', r: 'PLACED: DATA LEAD @ MERIDIAN' },
      { q: 'They sent us three candidates. We hired two. Our last agency sent forty and we hired none.', n: 'Elena Vasquez', r: 'CLIENT: VP PEOPLE @ CASCADE' },
      { q: 'The mock interviews were harder than the real one. That was the point — I walked in calm.', n: 'Tomas Lindqvist', r: 'PLACED: STAFF ENGINEER @ FORGE' },
    ];
    data.forEach((d, i) => {
      const c = document.createElement('article');
      c.className = 'vcard';
      c.innerHTML = `
        <span class="vcard__stamp">VERIFIED PLACEMENT</span>
        <span class="vcard__glyph" aria-hidden="true">&ldquo;</span>
        <p class="vcard__quote">${d.q}</p>
        <span class="vcard__rule"></span>
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
    const gap = 22;
    function measure() { cardW = cards[0].offsetWidth + gap; }
    function goTo(i) { index = clamp(i, 0, cards.length - 1); target = -index * cardW; update(); }
    function update() {
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
      cards.forEach((c, i) => { c.classList.toggle('is-side', i !== index); c.classList.toggle('is-active', i === index); });
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
    carousel.addEventListener('pointerdown', (e) => down(e.clientX));
    addEventListener('pointermove', (e) => move(e.clientX));
    addEventListener('pointerup', up);
    carousel.addEventListener('touchstart', (e) => down(e.touches[0].clientX), { passive: true });
    carousel.addEventListener('touchmove', (e) => move(e.touches[0].clientX), { passive: true });
    carousel.addEventListener('touchend', up);
    if (!REDUCED) {
      let auto = setInterval(() => goTo((index + 1) % cards.length), 6000);
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
      { q: 'How long does placement take?', a: 'Most candidates have first interviews within 14 days and signed offers within 6–8 weeks. Senior and executive searches can run longer — we tell you the honest timeline in the first consult.' },
      { q: 'What industries do you cover?', a: 'Technology, finance, healthcare, operations, and marketing are our deepest benches, with partner companies across 12 more sectors. If we can’t serve your niche well, we say so upfront.' },
      { q: 'What does it cost candidates?', a: 'Nothing. Ever. Our fees are paid by hiring companies. Candidates get placement, resume engineering, and negotiation support at no cost.' },
      { q: 'How are candidates vetted?', a: 'A structured skills review, a background and reference check, and a mock interview. Only candidates we would hire ourselves go to our partner companies — that’s why our offer rate is 92%.' },
      { q: 'Do you handle remote roles?', a: 'Yes — roughly 40% of our placements are fully remote, and another 30% hybrid. Tell us your constraint and we filter for it from day one.' },
    ];
    faqs.forEach((f, n) => {
      const item = document.createElement('div');
      item.className = 'faq__item';
      const qid = 'faq-' + n;
      item.innerHTML = `
        <button class="faq__q" aria-expanded="false" aria-controls="${qid}">
          <i>0${n + 1}</i><h3>${f.q}</h3><span class="faq__icon" aria-hidden="true"></span>
        </button>
        <div class="faq__a" id="${qid}" role="region"><p>${f.a}</p></div>`;
      list.appendChild(item);
      const btn = $('.faq__q', item), panel = $('.faq__a', item);
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        $$('.faq__item.is-open', list).forEach((o) => { if (o !== item) setOpen(o, false); });
        setOpen(item, !isOpen);
      });
      function setOpen(it, open) {
        it.classList.toggle('is-open', open);
        $('.faq__q', it).setAttribute('aria-expanded', String(open));
        if (open) announce($('h3', it).textContent + ' — expanded');
        const a = $('.faq__a', it);
        if (HAS_GSAP && !REDUCED) {
          gsap.to(a, { height: open ? 'auto' : 0, duration: open ? 0.5 : 0.4, ease: open ? 'power3.out' : 'power3.inOut' });
          if (open) gsap.from($('p', a), { y: 14, opacity: 0, duration: 0.45, delay: 0.08, ease: 'power3.out' });
        } else a.style.height = open ? 'auto' : '0';
      }
    });
  }

  /* ============================================================
     LAUNCH — char lift · letter assemble · signature · copy
     ============================================================ */
  function initLaunch() {
    const title = $('#launchTitle');
    if (title) {
      const text = title.textContent;
      title.textContent = '';
      text.split(' ').forEach((word, wi, arr) => {
        const w = document.createElement('span');
        w.style.display = 'inline-block'; w.style.whiteSpace = 'nowrap';
        word.split('').forEach((ch) => { const s = document.createElement('span'); s.className = 'char'; s.textContent = ch; w.appendChild(s); });
        title.appendChild(w);
        if (wi < arr.length - 1) title.appendChild(document.createTextNode(' '));
      });
      if (!TOUCH && !REDUCED && HAS_GSAP) {
        const chars = $$('.char', title);
        title.addEventListener('pointermove', (e) => {
          chars.forEach((c) => {
            const r = c.getBoundingClientRect();
            const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
            if (d < 90) gsap.to(c, { y: -(1 - d / 90) * 14, duration: 0.3, ease: 'power2.out' });
            else gsap.to(c, { y: 0, duration: 0.5, ease: 'power2.out' });
          });
        });
        title.addEventListener('pointerleave', () => gsap.to(chars, { y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
      }
    }
    // offer letter assembly + signature draw (fires once)
    const letter = $('#letter');
    if (letter) {
      const sig = $('#sigPath');
      const sigLen = sig.getTotalLength ? sig.getTotalLength() : 420;
      sig.style.strokeDasharray = sigLen; sig.style.strokeDashoffset = sigLen;
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return; io.disconnect();
        if (REDUCED || !HAS_GSAP) { $$('.letter__bar', letter).forEach((b) => (b.style.transform = 'scaleX(1)')); sig.style.strokeDashoffset = 0; return; }
        const tl = gsap.timeline();
        tl.from(letter, { scale: 0.86, y: 30, duration: 0.8, ease: 'power3.out' })
          .to($$('.letter__bar', letter), { scaleX: 1, duration: 0.5, stagger: 0.14, ease: 'power3.out' }, '-=0.3')
          .to(sig, { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' }, '-=0.1');
      }, { threshold: 0.45 });
      io.observe(letter);
      if (!REDUCED) onFrame((t) => { letter.style.rotate = `${Math.sin(t / 2600) * 1.2}deg`; });
    }
    // copy email
    const btn = $('#copyMail'), toast = $('#toast');
    btn && btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText('talent@dvdasjobs.com'); } catch (e) { /* clipboard unavailable */ }
      toast.classList.add('is-show');
      setTimeout(() => toast.classList.remove('is-show'), 1800);
    });
  }

  /* ============================================================
     FORMS — segmented toggle · validation · morph submit
     ============================================================ */
  function initForms() {
    const seg = $('.seg');
    if (seg) {
      $$('.seg__opt', seg).forEach((opt) => {
        opt.addEventListener('click', () => {
          $$('.seg__opt', seg).forEach((o) => { o.classList.remove('is-active'); o.setAttribute('aria-pressed', 'false'); });
          opt.classList.add('is-active'); opt.setAttribute('aria-pressed', 'true');
          seg.classList.toggle('is-company', opt.dataset.seg === 'company');
        });
      });
    }
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
          const label = $('.contact__label', btn);
          label.textContent = 'Sent — we reply within 24h';
          announce('Message sent. We reply within 24 hours.');
          setTimeout(() => { btn.classList.remove('is-done'); btn.disabled = false; label.textContent = 'Send Message'; form.reset(); }, 3500);
        }, 1500);
      });
      $$('.field input, .field textarea', form).forEach((inp) => inp.addEventListener('input', () => inp.closest('.field').classList.remove('is-invalid')));
    }
    const news = $('#newsForm');
    news && news.addEventListener('submit', (e) => { e.preventDefault(); const i = $('input', news); i.value = ''; i.placeholder = 'Subscribed ✓'; });
  }

  /* ============================================================
     FOOTER — watermark letter-fill · back-to-top
     ============================================================ */
  function initFooter() {
    const wm = $('#footerWm');
    if (wm) {
      'DVDASJOBS.COM'.split('').forEach((ch) => {
        const b = document.createElement('b');
        b.textContent = ch;
        if (ch === '.') b.classList.add('blink');
        wm.appendChild(b);
      });
      const letters = $$('b', wm);
      if (HAS_GSAP && !REDUCED) {
        gsap.to(letters, {
          color: '#FAFAFA', stagger: 0.5, ease: 'none',
          scrollTrigger: { trigger: '.footer', start: 'top 75%', end: 'bottom bottom', scrub: 1 },
        });
      } else letters.forEach((l) => { l.style.color = '#FAFAFA'; l.style.webkitTextStroke = '0px transparent'; });
    }
    const backTop = $('#backTop');
    backTop && backTop.addEventListener('click', () => {
      scrollTo(document.body);
      if (HAS_GSAP && !REDUCED) {
        const arrow = $('i', backTop);
        gsap.timeline()
          .to(arrow, { y: -22, opacity: 0, duration: 0.3, ease: 'power2.in' })
          .set(arrow, { y: 22 })
          .to(arrow, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
      }
    });
  }

  /* ============================================================
     CLOCK
     ============================================================ */
  function initClock() {
    const el = $('#clock');
    if (!el) return;
    const upd = () => (el.textContent = new Date().toLocaleTimeString('en-GB'));
    upd(); setInterval(upd, 1000);
  }

  /* ============================================================
     PHASE TWO — THE CURRENT + NEW SECTIONS
     ============================================================ */

  /* announce to screen readers */
  function announce(msg) { const live = $('#srLive'); if (live) { live.textContent = ''; setTimeout(() => (live.textContent = msg), 50); } }

  /* proximity rim-light: interactives within 150px of cursor charge up */
  function initProximity() {
    if (TOUCH || REDUCED) return;
    const els = $$('.btn, .nav__links a, .faq__item, .vcard, .step, .case__media');
    let frame = 0;
    onFrame(() => {
      if (frame++ % 2) return; // 30Hz is plenty
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -60 || r.top > innerHeight + 60) { el.style.setProperty('--prox', 0); continue; }
        const dx = curX - clamp(curX, r.left, r.right);
        const dy = curY - clamp(curY, r.top, r.bottom);
        const d = Math.hypot(dx, dy);
        el.style.setProperty('--prox', d > 150 ? 0 : (1 - d / 150).toFixed(3));
      }
    });
  }

  /* charged rules: traveling highlight tracks cursor X, brightens while scrolling near cursor Y */
  function initChargeRules() {
    const rules = $$('[data-charge-rule]');
    if (!rules.length || REDUCED) return;
    onFrame(() => {
      for (const rule of rules) {
        const r = rule.getBoundingClientRect();
        if (r.bottom < -120 || r.top > innerHeight + 120) continue;
        const cx = clamp(((curX - r.left) / (r.width || 1)) * 100, 0, 100);
        const near = 1 - clamp(Math.abs(curY - r.top) / 320, 0, 1);
        rule.style.setProperty('--cx', cx + '%');
        rule.style.setProperty('--charge', (0.25 + near * 0.6 + clamp(Math.abs(velocity) / 40, 0, 0.4)).toFixed(2));
      }
    });
  }

  /* kinetic pull-quotes: words tumble in with alternating rotation, settle level */
  function initPullQuotes() {
    $$('[data-pquote]').forEach((q) => {
      const nodes = Array.from(q.childNodes);
      q.textContent = '';
      nodes.forEach((node) => {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok.trim()) { q.appendChild(document.createTextNode(tok)); return; }
            const s = document.createElement('span'); s.className = 'pw'; s.textContent = tok; q.appendChild(s);
          });
        } else { node.classList.add('pw'); q.appendChild(node); }
      });
      const words = $$('.pw', q);
      if (!HAS_GSAP || REDUCED) return;
      words.forEach((w, i) => {
        gsap.fromTo(w,
          { y: 60 + (i % 3) * 30, rotate: i % 2 ? 6 : -5, opacity: 0 },
          { y: 0, rotate: 0, opacity: 1, ease: 'power2.out',
            scrollTrigger: { trigger: q, start: 'top 92%', end: 'top 45%', scrub: 1 } });
      });
    });
  }

  /* ghost-repeat headline echo: offset outline duplicate lags the scrub */
  function initGhostEcho() {
    if (REDUCED) return;
    $$('[data-ghost]').forEach((h) => {
      const wrap = document.createElement('span'); wrap.className = 'ghost-wrap';
      h.parentNode.insertBefore(wrap, h); wrap.appendChild(h);
      const echo = document.createElement('span');
      echo.className = 'ghost-echo stitle'; echo.setAttribute('aria-hidden', 'true');
      echo.innerHTML = h.innerHTML;
      wrap.appendChild(echo);
      if (HAS_GSAP) {
        gsap.fromTo(echo, { y: 26, x: 8 }, { y: -26, x: -4, ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1.6 } });
      }
    });
  }

  /* hero headline char magnetism (same mechanic as launch title) */
  window.__heroMagnet = function () {
    if (TOUCH || REDUCED || !HAS_GSAP) return;
    const title = $('#heroTitle');
    $$('[data-word]', title).forEach((w) => {
      const text = w.textContent; w.textContent = '';
      text.split('').forEach((ch) => { const s = document.createElement('span'); s.className = 'char'; s.style.display = 'inline-block'; s.textContent = ch; w.appendChild(s); });
    });
    const chars = $$('.char', title);
    title.addEventListener('pointermove', (e) => {
      chars.forEach((c) => {
        const r = c.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        if (d < 100) gsap.to(c, { y: -(1 - d / 100) * 12, scale: 1 + (1 - d / 100) * 0.06, duration: 0.3, ease: 'power2.out' });
        else gsap.to(c, { y: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
      });
    });
    title.addEventListener('pointerleave', () => gsap.to(chars, { y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
  };

  /* live ticker: continuous crawl, pauses on hover, inherits nav inversion */
  function initTicker() {
    const track = $('#tickerTrack');
    if (!track) return;
    const items = [
      'SENIOR PM — PLACED @ NORTHWIND', 'UX LEAD — OPENING @ FORGE', '4,800+ CAREERS PLACED',
      'DATA LEAD — PLACED @ MERIDIAN', 'OPS MANAGER — OPENING @ CASCADE', '92% OFFER RATE',
      'STAFF ENGINEER — PLACED @ FORGE', 'VP MARKETING — OPENING @ VANTAGE', '14 DAYS TO FIRST INTERVIEW',
    ];
    const html = items.map((t) => `<span><b>●</b>${t}</span>`).join('');
    track.innerHTML = html + html;
    if (REDUCED) return;
    let x = 0, paused = false;
    track.parentElement.addEventListener('pointerenter', () => (paused = true));
    track.parentElement.addEventListener('pointerleave', () => (paused = false));
    onFrame(() => {
      if (paused) return;
      x -= 0.45;
      const w = track.scrollWidth / 2;
      if (-x >= w) x += w;
      track.style.transform = `translateX(${x}px)`;
    });
  }

  /* by-the-numbers: interactive editorial bars */
  function initNumbers() {
    const panel = $('#numbersPanel'), tip = $('#numbersTip');
    if (!panel) return;
    const data = [
      ['TECHNOLOGY', 34], ['FINANCE', 22], ['HEALTHCARE', 16], ['OPERATIONS', 15], ['MARKETING', 13],
    ];
    data.forEach(([label, val]) => {
      const row = document.createElement('div');
      row.className = 'nbar'; row.setAttribute('role', 'listitem');
      row.tabIndex = 0;
      row.setAttribute('aria-label', `${label}: ${val} percent of placements`);
      row.innerHTML = `<span class="nbar__label">${label}</span><span class="nbar__track"><span class="nbar__fill" style="--w:${val * 2.6}%"></span></span><span class="nbar__val">${val}%</span>`;
      panel.appendChild(row);
      const fill = $('.nbar__fill', row);
      function activate() {
        panel.classList.add('has-active');
        $$('.nbar', panel).forEach((b) => b.classList.remove('is-active'));
        row.classList.add('is-active');
        tip.textContent = `${label} — ${val}% OF PLACEMENTS`;
        tip.classList.add('is-on');
      }
      function deactivate() { panel.classList.remove('has-active'); row.classList.remove('is-active'); tip.classList.remove('is-on'); }
      row.addEventListener('pointerenter', activate);
      row.addEventListener('pointerleave', deactivate);
      row.addEventListener('focus', activate);
      row.addEventListener('blur', deactivate);
      row.addEventListener('touchstart', activate, { passive: true });
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return; io.disconnect();
        if (HAS_GSAP && !REDUCED) gsap.to(fill, { width: val * 2.6 + '%', duration: 1.1, delay: 0.1, ease: 'power3.out' });
        else fill.style.width = val * 2.6 + '%';
      }, { threshold: 0.5 });
      io.observe(row);
    });
    if (!TOUCH) onFrame(() => { tip.style.left = curX + 'px'; tip.style.top = curY + 'px'; });
    else { tip.style.position = 'static'; tip.style.transform = 'none'; tip.style.marginTop = '1rem'; }
  }

  /* ambient UI sound — off by default, WebAudio blips on major interactions */
  function initSound() {
    const btn = $('#soundToggle');
    if (!btn) return;
    let on = false, ac = null;
    function blip(freq = 660, dur = 0.05, gain = 0.025) {
      if (!on) return;
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(freq, ac.currentTime);
        o.frequency.exponentialRampToValueAtTime(freq * 0.6, ac.currentTime + dur);
        g.gain.setValueAtTime(gain, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
        o.connect(g).connect(ac.destination);
        o.start(); o.stop(ac.currentTime + dur + 0.02);
      } catch (e) { /* audio unavailable */ }
    }
    window.__blip = blip;
    btn.addEventListener('click', () => {
      on = !on;
      btn.setAttribute('aria-pressed', String(on));
      announce(on ? 'Interface sound on' : 'Interface sound off');
      if (on) blip(880, 0.07, 0.03);
    });
    document.addEventListener('click', (e) => { if (e.target.closest('.btn')) blip(560, 0.045); });
  }

  /* ink dot: brief bloom where the user clicks */
  function initInkDots() {
    if (TOUCH || REDUCED) return;
    document.addEventListener('click', (e) => {
      const d = document.createElement('i');
      d.className = 'ink-dot';
      d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px';
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 450);
    });
  }

  /* case studies: masked reveal, scroll parallax, cursor tilt, chip stagger */
  function initCases() {
    $$('[data-case]').forEach((c) => {
      const wipe = $('.case__wipe', c), art = $('.case__art', c), chips = $$('.case__chips span', c);
      if (HAS_GSAP && !REDUCED) {
        gsap.to(wipe, { scaleX: 0, duration: 1.0, ease: 'power3.inOut', scrollTrigger: { trigger: c, start: 'top 78%', once: true } });
        gsap.to(chips, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 62%', once: true } });
        gsap.fromTo(art, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      } else {
        wipe.style.transform = 'scaleX(0)';
        chips.forEach((ch) => { ch.style.opacity = 1; ch.style.transform = 'none'; });
      }
      const media = $('[data-tilt]', c);
      if (media && !TOUCH && !REDUCED && HAS_GSAP) {
        media.addEventListener('pointermove', (e) => {
          const r = media.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(media, { rotateY: px * 6, rotateX: -py * 5, transformPerspective: 700, duration: 0.4, ease: 'power2.out' });
        });
        media.addEventListener('pointerleave', () => gsap.to(media, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' }));
      }
    });
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    initSmooth();
    initMicro();
    initCursor();
    initMagnetic();
    initLogo();
    initNav();
    initBgGrid();
    initWatermarks();
    initFragments();
    initParticles('#heroParticles', '#0A0A0A');
    initParticles('#ctaParticles', '#FAFAFA');
    initScrollFX();
    initTypewriter();
    initCounters();
    initMarquee();
    initWipes();
    initManifesto();
    initServices();
    initProcess();
    initSplit();
    initCarousel();
    initFAQ();
    initLaunch();
    initForms();
    initFooter();
    initClock();
    initStaticCharge();
    initProximity();
    initChargeRules();
    initPullQuotes();
    initGhostEcho();
    initTicker();
    initNumbers();
    initSound();
    initInkDots();
    initCases();
    if (HAS_GSAP && window.ScrollTrigger) { ScrollTrigger.refresh(); addEventListener('load', () => ScrollTrigger.refresh()); }
  }

  function start() {
    boot();
    initPreloader(() => { window.__logoDrop && window.__logoDrop(); window.__heroIntro && window.__heroIntro(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
