
import './scss/main.scss';
import luxuryCarousel from './components/LuxuryCarousel.html?raw';

console.log('🚀 Lumina Premium Template Loaded Successfully!');

// ===============================
// GUARD
// ===============================
let appInitialized = false;

// ===============================
// LOAD COMPONENTS (Vite SAFE)
// ===============================
async function loadComponent(selector, path) {
  const target = document.querySelector(selector);
  if (!target) return;

  if (target.dataset.loaded === "true") return;

  try {
    const res = await fetch(path);
    const html = await res.text();

    target.innerHTML = html;
    target.dataset.loaded = "true";

    console.log(`✅ Loaded ${path}`);
  } catch (err) {
    console.error(`❌ Error loading ${path}:`, err);
  }
}

// ===============================
// YEAR UPDATE
// ===============================
const updateYear = () => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
};

// ===============================
// REVEAL
// ===============================
const initReveal = () => {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
};

// ===============================
// NAVBAR SCROLL EFFECT (FIXED)
// ===============================
const initNavbarScroll = () => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('navbar--scrolled', window.scrollY > 50);
  });
};

// ===============================
// INIT APP
// ===============================

window.addEventListener('DOMContentLoaded', async () => {
  if (appInitialized) return;
  appInitialized = true;

  await Promise.all([
    loadComponent('#navbar', new URL('./components/navbar.html', import.meta.url).href),
    loadComponent('#footer', new URL('./components/footer.html', import.meta.url).href)
  ]);

  // Inject Luxury Carousel Section
  const luxuryCarouselContainer = document.getElementById('luxury-carousel');
  if (luxuryCarouselContainer) {
    luxuryCarouselContainer.innerHTML = luxuryCarousel;
    // Carousel script moved here to work after injection
    setTimeout(() => {
      const track = document.querySelector('.luxury-carousel__track');
      const cards = Array.from(document.querySelectorAll('.luxury-carousel__card'));
      let current = 0;
      const cardWidth = 340 + 40; // width + gap (gap=2.5rem ~40px)
      function updateCarousel() {
        cards.forEach((card, idx) => {
          card.classList.remove('is-center', 'is-side');
          if (idx === current) card.classList.add('is-center');
          else card.classList.add('is-side');
        });
        // Center the active card
        const visibleCards = 3;
        const offset = (current - Math.floor(visibleCards / 2)) * cardWidth;
        track.style.transform = `translateX(${-offset}px)`;
      }
      function nextSlide() {
        current = (current + 1) % cards.length;
        updateCarousel();
      }
      updateCarousel();
      setInterval(nextSlide, 2600);
    }, 0);
  }

  updateYear();
  initReveal();
  initNavbarScroll();

  // ===== Mobile Navbar Drawer =====
  const navToggle = document.getElementById('navbarToggle');
  const navDrawer = document.getElementById('navbarDrawer');
  const navBackdrop = document.getElementById('navbarBackdrop');
  const navDrawerClose = document.getElementById('navbarDrawerClose');

  function openDrawer() {
    navDrawer.setAttribute('aria-hidden', 'false');
    navBackdrop.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    navDrawer.setAttribute('aria-hidden', 'true');
    navBackdrop.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (navToggle && navDrawer && navBackdrop && navDrawerClose) {
    navToggle.addEventListener('click', openDrawer);
    navDrawerClose.addEventListener('click', closeDrawer);
    navBackdrop.addEventListener('click', closeDrawer);
    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.getAttribute('aria-hidden') === 'false') closeDrawer();
    });
    // Close on link click (mobile)
    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  console.log('✨ App initialized successfully');
});