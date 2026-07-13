import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers grow/shrink the viewport as the address bar hides/shows.
// By default ScrollTrigger treats that as a resize and recalculates every
// trigger mid-scroll — which makes the page visibly jump AND makes reveal
// animations fire at the wrong scroll point (they play before you reach them).
// Ignoring that specific resize keeps all positions stable, so scrolling stays
// smooth and animations trigger exactly where they should on phones.
ScrollTrigger.config({ ignoreMobileResize: true });

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

document.documentElement.classList.toggle('no-motion', prefersReduced);

/* ---------------------------------------------------------------
   1. Scroll reveals (batched, cheap, transform+opacity only)
--------------------------------------------------------------- */
function initReveals() {
  const items = gsap.utils.toArray('.reveal');
  if (prefersReduced) {
    items.forEach((el) => el.classList.add('is-in'));
    document.querySelectorAll('.clip-reveal').forEach((el) => el.classList.add('is-in'));
    return;
  }
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        onStart: () => batch.forEach((el) => el.classList.add('is-in')),
      }),
  });

  gsap.utils.toArray('.clip-reveal').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('is-in'),
    });
  });
}

/* ---------------------------------------------------------------
   2. Hero — word mask rise + subtle image parallax
--------------------------------------------------------------- */
function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const words = hero.querySelectorAll('[data-word]');
  const tag = hero.querySelector('[data-hero-tag]');
  const img = hero.querySelector('.hero__media img');

  if (!prefersReduced) {
    gsap.set(words, { yPercent: 110 });
    gsap.set(tag, { autoAlpha: 0, y: 20 });
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(words, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 })
      .to(tag, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    // Parallax on the background image — DESKTOP ONLY. On touch devices a
    // scrub-linked transform repaints this full-bleed image on every
    // momentum-scroll frame, which reads as jitter/stutter on phones. Coarse
    // pointers keep the static CSS scale(1.08) instead.
    if (img && finePointer) {
      gsap.to(img, {
        yPercent: 12,
        scale: 1.14,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }
  }
}

/* ---------------------------------------------------------------
   3. Nav — solid bar after hero + mobile menu
--------------------------------------------------------------- */
function initNav() {
  const nav = document.querySelector('[data-nav]');
  const hero = document.querySelector('[data-hero]');
  if (nav && hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom top+=80',
      onToggle: (self) => nav.classList.toggle('is-solid', self.isActive === false && self.progress >= 1),
      onUpdate: (self) => nav.classList.toggle('is-solid', self.progress >= 1),
    });
  }

  const toggle = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-menu-overlay]');
  if (toggle && overlay) {
    const setOpen = (open) => {
      overlay.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => setOpen(!overlay.classList.contains('is-open')));
    overlay.querySelectorAll('[data-menu-link]').forEach((l) => l.addEventListener('click', () => setOpen(false)));
  }
}

/* ---------------------------------------------------------------
   5. Stats — count up on enter
--------------------------------------------------------------- */
function initStats() {
  gsap.utils.toArray('[data-count-to]').forEach((el) => {
    const target = parseFloat(el.dataset.countTo);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    if (prefersReduced) { el.textContent = target.toFixed(decimals); return; }
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = obj.v.toFixed(decimals); },
        }),
    });
  });
}

/* ---------------------------------------------------------------
   6. Testimonials — simple accessible slider (auto + controls)
--------------------------------------------------------------- */
function initTestimonials() {
  const root = document.querySelector('[data-tst]');
  if (!root) return;
  const items = [...root.querySelectorAll('[data-tst-item]')];
  const dots = [...root.querySelectorAll('[data-tst-dot]')];
  let i = 0, timer;

  const go = (n) => {
    i = (n + items.length) % items.length;
    items.forEach((it, k) => it.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };
  const next = () => go(i + 1);
  const stop = () => clearInterval(timer);
  const start = () => { stop(); if (!prefersReduced) timer = setInterval(next, 5500); };

  root.querySelector('[data-tst-next]')?.addEventListener('click', () => { next(); start(); });
  root.querySelector('[data-tst-prev]')?.addEventListener('click', () => { go(i - 1); start(); });
  dots.forEach((d) => d.addEventListener('click', () => { go(+d.dataset.tstDot); start(); }));
  // Pause auto-advance on hover AND on keyboard focus (a11y); resume when both leave.
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) start(); });
  start();
}

/* ---------------------------------------------------------------
   7. Contact — the enquiry wizard is self-contained in
   ../scripts/contact-wizard.js (imported by Contact.astro).
--------------------------------------------------------------- */

/* ---------------------------------------------------------------
   8. Marquees — one shared requestAnimationFrame loop for every
   [data-marquee-track]. Used by both the logo cloud and the
   statement keyword strip so behaviour is identical everywhere.
   rAF (not CSS @keyframes) because some preview/embedded
   environments force animation-duration to ~0 and freeze CSS
   animations. Respects prefers-reduced-motion (stays static).
   Per-track config via data-attributes:
     data-marquee-speed  px/sec (default 40)
     data-marquee-slow   px/sec while hovered (default = speed)
--------------------------------------------------------------- */
function initMarquee() {
  if (prefersReduced) return; // leave content static for reduced-motion users
  const tracks = document.querySelectorAll('[data-marquee-track]');
  tracks.forEach((track) => {
    const el = /** @type {HTMLElement} */ (track);
    const base = parseFloat(el.dataset.marqueeSpeed) || 40;
    const slow = el.dataset.marqueeSlow != null ? parseFloat(el.dataset.marqueeSlow) : base;
    const viewport = el.parentElement;
    let speed = base;
    let offset = 0;
    let last = performance.now();

    if (slow !== base && viewport) {
      viewport.addEventListener('mouseenter', () => { speed = slow; });
      viewport.addEventListener('mouseleave', () => { speed = base; });
    }

    let running = false;
    let rafId = 0;
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      offset += speed * dt;
      const half = el.scrollWidth / 2; // content is doubled, so one full set = half
      if (half > 0 && offset >= half) offset -= half;
      el.style.transform = `translateX(${-offset}px)`;
      rafId = requestAnimationFrame(frame);
    };

    // Only animate while the marquee is actually on screen. Previously the rAF
    // loop ran for the whole page lifetime, so both marquees kept forcing style
    // recalcs/compositing even when scrolled far away — wasted work that eats
    // into the scroll frame budget. An IntersectionObserver starts/stops the
    // loop as the strip enters/leaves the viewport (no visual change).
    const start = () => { if (!running) { running = true; last = performance.now(); rafId = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(rafId); };
    const io = new IntersectionObserver(
      (entries) => { entries[0].isIntersecting ? start() : stop(); },
      { rootMargin: '120px' }
    );
    io.observe(viewport || el);
  });
}

/* ---------------------------------------------------------------
   Boot
--------------------------------------------------------------- */
function boot() {
  // Manual restoration is set even earlier in the Layout <head>; re-assert and
  // force the top here unless the URL deep-links to a #section. `behavior:
  // 'instant'` is required because global `scroll-behavior: smooth` would
  // otherwise animate this jump (which itself looks like the page scrolling on
  // its own). Hash links (#work, #contact, …) scroll to their section normally.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  initReveals();
  initHero();
  initNav();
  initStats();
  initTestimonials();
  initMarquee();
  ScrollTrigger.refresh();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
window.addEventListener('load', () => ScrollTrigger.refresh());
