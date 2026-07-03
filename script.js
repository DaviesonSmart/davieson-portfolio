/* ═══════════════════════════════════════════════════════════
   SMART PORTFOLIO — script.js
   All interactions, animations, and effects
═══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. DOM READY
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initThemeToggle();
  initHeroReveal();
  initTypingAnimation();
  initParticles();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initProjectFilter();
  initTestimonialCarousel();
  initContactForm();
  initBackToTop();
  setCurrentYear();
});

/* ──────────────────────────────────────────────────────────
   2. CURSOR GLOW (signature effect)
────────────────────────────────────────────────────────── */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) {
    if (glow) glow.style.display = 'none';
    return; // skip on touch devices
  }

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
  });
}

/* ──────────────────────────────────────────────────────────
   3. SCROLL PROGRESS BAR
────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const pct = scrollTop / (scrollHeight - clientHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────
   4. NAVBAR — scroll behaviour & active link
────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add .scrolled when page is not at top
  const handleScroll = () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else                       navbar.classList.remove('scrolled');

    // Highlight active nav link based on scroll position
    let currentSection = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) currentSection = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // Smooth-scroll nav links
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ──────────────────────────────────────────────────────────
   5. MOBILE MENU
────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const open  = () => { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger.addEventListener('click', open);
  mobileClose.addEventListener('click', close);
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      close();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300);
    });
  });
}

/* ──────────────────────────────────────────────────────────
   6. THEME TOGGLE
────────────────────────────────────────────────────────── */
function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const root = document.documentElement;

  // Load saved preference
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) applyTheme(saved);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
}

/* ──────────────────────────────────────────────────────────
   7. HERO REVEAL (staggered on page load)
────────────────────────────────────────────────────────── */
function initHeroReveal() {
  // Small delay so browser has painted
  setTimeout(() => {
    document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
      el.classList.add('show');
    });
  }, 150);
}

/* ──────────────────────────────────────────────────────────
   8. TYPING ANIMATION
────────────────────────────────────────────────────────── */
function initTypingAnimation() {
  const el    = document.getElementById('typed');
  if (!el) return;

  const words = [
    'stunning websites.',
    'e-commerce stores.',
    'seamless UX.',
    'powerful backends.',
    'digital products.',
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const SPEED_TYPE   = 80;
  const SPEED_DELETE = 45;
  const PAUSE_AFTER  = 2000;
  const PAUSE_BEFORE = 400;

  function tick() {
    const word    = words[wordIdx];
    const current = word.slice(0, charIdx);
    el.textContent = current;

    if (!deleting && charIdx < word.length) {
      charIdx++;
      setTimeout(tick, SPEED_TYPE);
    } else if (!deleting && charIdx === word.length) {
      deleting = true;
      setTimeout(tick, PAUSE_AFTER);
    } else if (deleting && charIdx > 0) {
      charIdx--;
      setTimeout(tick, SPEED_DELETE);
    } else {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
      setTimeout(tick, PAUSE_BEFORE);
    }
  }

  setTimeout(tick, 800);
}

/* ──────────────────────────────────────────────────────────
   9. PARTICLE CANVAS (background dots)
────────────────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles(count = 60) {
    return Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o:  Math.random() * 0.5 + 0.1,
    }));
  }

  resize();
  particles = createParticles();
  window.addEventListener('resize', () => { resize(); particles = createParticles(); });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 99, 255, ${p.o})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ──────────────────────────────────────────────────────────
   10. SCROLL REVEAL (Intersection Observer)
────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────────────────
   11. SKILL BAR ANIMATION
────────────────────────────────────────────────────────── */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.getAttribute('data-w');
        // Small delay for visual delight
        setTimeout(() => { el.style.width = width + '%'; }, 200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────────────────
   12. ANIMATED COUNTERS (hero stats)
────────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}

/* ──────────────────────────────────────────────────────────
   13. PROJECT FILTER
────────────────────────────────────────────────────────── */
function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          card.style.opacity  = '1';
          card.style.transform = '';
          card.style.pointerEvents = 'all';
        } else {
          card.style.opacity  = '0.2';
          card.style.transform = 'scale(0.96)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });
}

/* ──────────────────────────────────────────────────────────
   14. TESTIMONIAL CAROUSEL
────────────────────────────────────────────────────────── */
function initTestimonialCarousel() {
  const track   = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoSlide;

  // Determine how many cards are visible at once
  function getVisible() {
    if (window.innerWidth < 641)  return 1;
    if (window.innerWidth < 1101) return 2;
    return 3;
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const visible = getVisible();
    const pages = Math.max(total - visible + 1, 1);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(index) {
    const visible = getVisible();
    const maxIdx  = Math.max(total - visible, 0);
    current = Math.max(0, Math.min(index, maxIdx));

    const cardW  = cards[0].offsetWidth;
    const gap    = 28;
    const offset = current * (cardW + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  function resetAuto() {
    clearInterval(autoSlide);
    autoSlide = setInterval(next, 4000);
  }

  buildDots();
  resetAuto();

  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  // Touch / swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
  });
}

/* ──────────────────────────────────────────────────────────
   15. CONTACT FORM VALIDATION & SUBMISSION
────────────────────────────────────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  const fields = {
    name:    { el: form.elements.name,    errEl: document.getElementById('nameError'),    validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    email:   { el: form.elements.email,   errEl: document.getElementById('emailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
    subject: { el: form.elements.subject, errEl: document.getElementById('subjectError'), validate: v => v.trim().length >= 3 ? '' : 'Subject must be at least 3 characters.' },
    message: { el: form.elements.message, errEl: document.getElementById('messageError'), validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' },
  };

  // Real-time validation on blur/input
  Object.values(fields).forEach(({ el, errEl, validate }) => {
    el.addEventListener('blur', () => validateField(el, errEl, validate));
    el.addEventListener('input', () => {
      if (errEl.textContent) validateField(el, errEl, validate);
    });
  });

  function validateField(el, errEl, validate) {
    const error = validate(el.value);
    errEl.textContent = error;
    el.closest('.input-wrap').classList.toggle('error',   !!error);
    el.closest('.input-wrap').classList.toggle('success', !error && el.value.trim() !== '');
    return !error;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let valid = true;
    for (const [, { el, errEl, validate }] of Object.entries(fields)) {
      if (!validateField(el, errEl, validate)) valid = false;
    }
    if (!valid) return;

    // Simulate async send
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');

    await new Promise(res => setTimeout(res, 1600)); // simulate network

    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    submitBtn.disabled = false;

    form.reset();
    Object.values(fields).forEach(({ el }) => {
      el.closest('.input-wrap').classList.remove('success', 'error');
    });

    successMsg.classList.remove('hidden');
    setTimeout(() => successMsg.classList.add('hidden'), 5000);
  });
}

/* ──────────────────────────────────────────────────────────
   16. BACK TO TOP BUTTON
────────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────────────────────
   17. FOOTER YEAR
────────────────────────────────────────────────────────── */
function setCurrentYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
