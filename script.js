/* =============================================
   GET YOUR NEWS — JAVASCRIPT
   ============================================= */

// --- NAVBAR scroll effect ---
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- HAMBURGER mobile menu ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// --- FAQ accordion ---
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all items
    document.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('open');
    });

    // Open clicked item if it was closed
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// --- Animate elements on scroll ---
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in animation to key elements
const animatedSelectors = [
  '.step', '.pricing-card', '.faq-item'
];

animatedSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    observer.observe(el);
  });
});

// Add visible class styles via JS (no extra CSS needed)
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);


// --- TOPICS CAROUSEL (stacked depth effect) ---
(function () {
  const track = document.getElementById('topicsTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  const viewport = document.querySelector('.carousel-viewport');

  if (!track || !prevBtn || !nextBtn || !dotsContainer || !viewport) return;

  const cards = track.querySelectorAll('.topic-card');
  let currentPage = 0;

  function getPerView() {
    return window.innerWidth <= 768 ? 1 : 3;
  }

  function getTotalPages() {
    return Math.ceil(cards.length / getPerView());
  }

  function goToPage(page) {
    const total = getTotalPages();
    currentPage = Math.max(0, Math.min(page, total - 1));

    // Calculate offset
    const gap = 20;
    const cardWidth = cards[0].offsetWidth;
    const step = getPerView() * (cardWidth + gap);
    track.style.transform = 'translateX(-' + (currentPage * step) + 'px)';

    // Depth effect — active cards full, others dimmed/scaled
    const perView = getPerView();
    const startIdx = currentPage * perView;
    const endIdx = startIdx + perView;

    cards.forEach(function (card, i) {
      if (i >= startIdx && i < endIdx) {
        card.classList.remove('peek');
      } else {
        card.classList.add('peek');
      }
    });

    // Update arrows
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === total - 1;

    // Update dots
    dotsContainer.querySelectorAll('.carousel-dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentPage);
    });
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    var total = getTotalPages();
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Página ' + (i + 1));
      (function (idx) {
        dot.addEventListener('click', function () { goToPage(idx); });
      })(i);
      dotsContainer.appendChild(dot);
    }
  }

  // Arrow clicks
  prevBtn.addEventListener('click', function () { goToPage(currentPage - 1); });
  nextBtn.addEventListener('click', function () { goToPage(currentPage + 1); });

  // Touch swipe
  var touchStartX = 0;
  var touchDelta = 0;

  viewport.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchDelta = 0;
  }, { passive: true });

  viewport.addEventListener('touchmove', function (e) {
    touchDelta = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  viewport.addEventListener('touchend', function () {
    if (Math.abs(touchDelta) > 50) {
      goToPage(currentPage + (touchDelta < 0 ? 1 : -1));
    }
    touchDelta = 0;
  });

  // Mouse drag for desktop
  var isDragging = false;
  var dragStartX = 0;
  var dragDelta = 0;

  viewport.addEventListener('mousedown', function (e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragDelta = 0;
    viewport.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    dragDelta = e.clientX - dragStartX;
  });

  window.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    viewport.style.cursor = '';
    if (Math.abs(dragDelta) > 50) {
      goToPage(currentPage + (dragDelta < 0 ? 1 : -1));
    }
    dragDelta = 0;
  });

  // Init & resize
  function init() {
    buildDots();
    goToPage(0);
  }

  window.addEventListener('resize', init);
  init();
})();

// Ano atual no footer
document.getElementById('ano-atual').textContent = new Date().getFullYear();

