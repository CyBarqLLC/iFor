/* =========================================================
   IFOR Mobile — Interactions
   - Sticky nav state
   - Mobile drawer
   - Reveal-on-scroll
   - FAQ accordion
   - Active link highlight
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Sticky nav state ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile drawer ---------- */
  const burger = document.querySelector('.nav__burger');
  const body = document.body;
  const closeMenu = () => {
    body.classList.remove('is-menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  };
  if (burger) {
    burger.addEventListener('click', () => {
      const open = body.classList.toggle('is-menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.drawer a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Hero pointer tilt (desktop, subtle) ---------- */
  const tilt = document.querySelector('[data-tilt]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  if (tilt && fine && !reduce) {
    const MAX = 6; // degrees
    const reset = () => { tilt.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'; };
    tilt.addEventListener('pointermove', e => {
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform =
        `perspective(900px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg)`;
    }, { passive: true });
    tilt.addEventListener('pointerleave', reset);
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__item').forEach(item => {
    const btn = item.querySelector('.faq__q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- Smooth in-page anchor scroll (extra easing on supported browsers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeMenu();
        }
      }
    });
  });

  /* ---------- Active section indicator (home only) ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const map = {};
    navLinks.forEach(l => {
      const id = l.getAttribute('href').replace('#', '');
      map[id] = l;
    });
    const so = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = map[id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => so.observe(s));
  }
})();
