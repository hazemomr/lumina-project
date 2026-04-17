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
// NAVBAR SCROLL EFFECT
// ===============================
const initNavbarScroll = () => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('navbar--scrolled', window.scrollY > 50);
  });
};

// ===============================
// ENHANCED LUXURY CAROUSEL (المحسن)
// ===============================
function initLuxuryCarousel() {
  const luxuryCarouselContainer = document.getElementById('luxury-carousel');
  if (!luxuryCarouselContainer) return;

  luxuryCarouselContainer.innerHTML = luxuryCarousel;

  setTimeout(() => {
    // DOM Elements
    const track = document.querySelector('.luxury-carousel__track');
    const viewport = document.querySelector('.luxury-carousel__viewport');
    const cards = Array.from(document.querySelectorAll('.luxury-carousel__card'));
    const totalCards = cards.length;
    const visibleCards = 3;
    let currentIndex = 0;
    let autoSlideInterval = null;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let isAutoSliding = true;
    
    // لا تنشئ أزرار الأسهم إطلاقًا (كاروسيل أوتوماتيكي فقط)
    function createNavButtons() {
      // فارغة
    }
    
    // لا تنشئ مؤشرات الكاروسيل إطلاقًا
    function createIndicators() {
      // فارغة
    }
    
    // Update indicators
    function updateIndicators() {
      const indicators = document.querySelectorAll('.indicator');
      const currentGroup = Math.floor(currentIndex / visibleCards);
      indicators.forEach((ind, idx) => {
        if (idx === currentGroup) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });
    }
    
    // Go to specific slide group
    function goToSlideGroup(groupIndex) {
      const newIndex = Math.min(groupIndex * visibleCards, totalCards - visibleCards);
      currentIndex = Math.max(0, Math.min(newIndex, totalCards - visibleCards));
      updateCarousel();
    }
    
    // Get card width including gap
    function getCardWidthWithGap() {
      if (!cards.length) return 0;
      const style = window.getComputedStyle(track);
      const gapPx = parseFloat(style.gap) || 0;
      return cards[0].offsetWidth + gapPx;
    }
    
    // Reset auto slide timer
    function resetAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
      
      if (isAutoSliding) {
        startAutoSlide();
      }
    }
    
    // Start auto slide
    function startAutoSlide() {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        nextSlide();
      }, 4000);
    }
    
    // Stop auto slide
    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }
    
    // لا توقف الحركة عند hover أبداً
    function initHoverPause() {
      // فارغة: الحركة تظل مستمرة دائماً
    }
    
    // Touch swipe for mobile
    function initTouchSwipe() {
      if (!track) return;
      
      track.addEventListener('touchstart', (e) => {
        stopAutoSlide();
        isDragging = true;
        startPos = e.touches[0].clientX;
        currentTranslate = parseFloat(track.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
        track.style.transition = 'none';
      });
      
      track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentPosition = e.touches[0].clientX;
        const diff = currentPosition - startPos;
        track.style.transform = `translateX(${currentTranslate + diff}px)`;
      });
      
      track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = '';
        
        const endPos = e.changedTouches[0].clientX;
        const diff = endPos - startPos;
        
        if (Math.abs(diff) > 50) {
          if (diff > 0 && currentIndex > 0) {
            prevSlide();
          } else if (diff < 0 && currentIndex < totalCards - visibleCards) {
            nextSlide();
          } else {
            updateCarousel();
          }
        } else {
          updateCarousel();
        }
        
        startAutoSlide();
      });
    }
    
    // Update carousel display
    function updateCarousel() {
      const leftIdx = currentIndex;
      const centerIdx = currentIndex + 1;
      const rightIdx = currentIndex + 2;
      
      // Reset all cards
      cards.forEach((card) => {
        card.classList.remove('is-center', 'is-side');
      });
      
      // Apply classes to visible cards only
      if (cards[centerIdx]) cards[centerIdx].classList.add('is-center');
      if (cards[leftIdx]) cards[leftIdx].classList.add('is-side');
      if (cards[rightIdx]) cards[rightIdx].classList.add('is-side');
      
      // Move track
      const cardWidthWithGap = getCardWidthWithGap();
      track.style.transform = `translateX(${-(currentIndex * cardWidthWithGap)}px)`;
      
      // Update indicators if they exist
      if (document.querySelector('.carousel__indicators')) {
        updateIndicators();
      }
    }
    
    // Next slide (infinite loop, always auto)
    function nextSlide() {
      // انقل أول كارت لنهاية التراك كل مرة (دائري دائمًا)
      const firstCard = track.firstElementChild;
      track.appendChild(firstCard);
      cards.push(cards.shift());
      // لا داعي لتغيير المؤشر
      updateCarousel();
    }
    
    // Previous slide
    function prevSlide() {
      if (currentIndex <= 0) {
        currentIndex = totalCards - visibleCards;
      } else {
        currentIndex -= 1;
      }
      updateCarousel();
    }
    
    // Handle window resize
    let resizeTimer;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateCarousel();
      }, 250);
    }
    
    // Lazy load images
    function lazyLoadImages() {
      const images = document.querySelectorAll('.luxury-carousel__img-wrap img');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => {
        if (img.dataset.src) {
          imageObserver.observe(img);
        }
      });
    }
    
    // Initialize everything
    createNavButtons();
    // لا مؤشرات
    updateCarousel();
    startAutoSlide();
    initHoverPause();
    initTouchSwipe();
    window.addEventListener('resize', handleResize);
    lazyLoadImages();
    
    // Cleanup function
    window.cleanupCarousel = () => {
      stopAutoSlide();
      window.removeEventListener('resize', handleResize);
    };
    
  }, 0);
}

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

  // Initialize Luxury Carousel (المحسن)
  initLuxuryCarousel();

  updateYear();
  initReveal();
  initNavbarScroll();

  // ====== تفعيل underline تلقائي للرابط الحالي في النافبار ======
  function setActiveNavbarLink() {
    // Desktop
    const links = document.querySelectorAll('.navbar__link');
    const currentPath = window.location.pathname.replace(/\\/g, '/');
    links.forEach(link => {
      // إزالة الكلاس من الجميع أولاً
      link.classList.remove('navbar__link--active');
      // تفعيل الكلاس إذا كان الرابط يطابق المسار الحالي
      if (link.getAttribute('href') === currentPath || link.getAttribute('href') === '.' + currentPath) {
        link.classList.add('navbar__link--active');
      }
    });
    // Mobile Drawer
    const drawerLinks = document.querySelectorAll('.navbar__drawer-link');
    drawerLinks.forEach(link => {
      link.classList.remove('navbar__link--active');
      if (link.getAttribute('href') === currentPath || link.getAttribute('href') === '.' + currentPath) {
        link.classList.add('navbar__link--active');
      }
    });
  }
  setActiveNavbarLink();
  window.addEventListener('popstate', setActiveNavbarLink);

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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.getAttribute('aria-hidden') === 'false') closeDrawer();
    });

    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  console.log('✨ App initialized successfully');
});