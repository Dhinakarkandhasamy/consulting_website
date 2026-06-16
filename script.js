/* ============================================================
   ELEVATE CONSULTING GROUP — script.js
   ============================================================ */

'use strict';

/* ── Navbar scroll behavior ─────────────────────────────── */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

function onScroll() {
  const scrollY = window.scrollY;

  // Sticky nav
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top
  if (scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Mobile navigation ──────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ── Team avatar color fill ─────────────────────────────── */
document.querySelectorAll('.team-avatar').forEach(el => {
  el.textContent = el.dataset.initials || '';
  if (el.dataset.color) {
    el.style.background = el.dataset.color;
  }
});

/* ── Testimonial avatar fill ────────────────────────────── */
document.querySelectorAll('.testi-avatar').forEach(el => {
  el.textContent = el.dataset.initials || '';
});

/* ── Animated stat counters ─────────────────────────────── */
const statItems = document.querySelectorAll('.stat-item');
let statsAnimated = false;

function animateStat(el, index) {
  const target  = parseInt(el.dataset.count, 10);
  const suffix  = el.dataset.suffix || '';
  const numEl   = document.getElementById(`stat-${index}`);
  if (!numEl) return;

  const duration = 1800;
  const steps    = 60;
  const interval = duration / steps;
  let current    = 0;

  const timer = setInterval(() => {
    current += target / steps;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    numEl.textContent = Math.floor(current) + suffix;
  }, interval);
}

function tryAnimateStats(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statItems.forEach((el, i) => animateStat(el, i));
      observer.disconnect();
    }
  });
}

const statsObserver = new IntersectionObserver(tryAnimateStats, { threshold: 0.3 });
const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* ── Scroll reveal animation ────────────────────────────── */
const revealSelectors = [
  '.service-card',
  '.case-card',
  '.team-card',
  '.testi-card',
  '.about-content',
  '.about-visual',
  '.contact-info',
  '.contact-form-wrap',
  '.section-header',
  '.pillar',
];

function addRevealClass() {
  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger siblings
      const delay = el.dataset.delay || (i % 3) * 100;
      el.style.transitionDelay = `${delay}ms`;
    });
  });
}

function revealOnScroll(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}

const revealObserver = new IntersectionObserver(revealOnScroll, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

addRevealClass();
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Contact form ────────────────────────────────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

function validateField(input) {
  const errorEl = document.getElementById(`${input.id}-error`);
  let message   = '';

  if (input.required && !input.value.trim()) {
    message = 'This field is required.';
  } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    message = 'Please enter a valid email address.';
  }

  input.classList.toggle('error', !!message);
  if (errorEl) errorEl.textContent = message;
  return !message;
}

// Live validation on blur
if (form) {
  form.querySelectorAll('input[required], textarea[required]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) valid = false;
    });
    if (!valid) return;

    // Show loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate async submission (replace with real API call)
    await new Promise(resolve => setTimeout(resolve, 1600));

    // Show success
    form.style.display = 'none';
    formSuccess.classList.add('visible');

    // Reset button (in case user navigates back)
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  });
}

/* ── Smooth active nav link highlight ───────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active-nav', a.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ── Init ────────────────────────────────────────────────── */
onScroll();
updateActiveNav();
