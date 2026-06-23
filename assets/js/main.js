document.addEventListener('DOMContentLoaded', () => {
  // ===== MOBILE HAMBURGER MENU =====
  const hamburger = document.querySelector('.hamburger');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navOverlay.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    }
  }

  // ===== STICKY HEADER =====
  const header = document.querySelector('.header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ===== ANIMATED TYPING TEXT =====
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const words = ['Found', 'Chosen'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 120;
    const deletingSpeed = 80;
    const pauseDuration = 2000;

    function typeLoop() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        delay = pauseDuration;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }

      setTimeout(typeLoop, delay);
    }

    typeLoop();
  }

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        el.textContent = Math.floor(easedProgress * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(update);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counterList = entry.target.querySelectorAll('.stat-number[data-target]');
            counterList.forEach((c) => animateCounter(c));
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.querySelector('.stats-section') || counters[0].closest('section');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }

  // ===== SCROLL FADE-IN ANIMATIONS =====
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    fadeElements.forEach((el) => fadeObserver.observe(el));
  }

  // ===== TESTIMONIAL CAROUSEL =====
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.testimonial-card');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    if (track && slides.length) {
      let current = 0;
      let autoInterval = null;

      function getVisibleCount() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
      }

      function updateCarousel() {
        const visible = getVisibleCount();
        const maxIndex = Math.max(0, slides.length - visible);
        if (current > maxIndex) current = maxIndex;

        const slideWidth = 100 / visible;
        track.style.transform = `translateX(-${current * slideWidth}%)`;
        track.style.transition = 'transform 0.5s ease';
      }

      function nextSlide() {
        const visible = getVisibleCount();
        const maxIndex = Math.max(0, slides.length - visible);
        current = current >= maxIndex ? 0 : current + 1;
        updateCarousel();
      }

      function prevSlide() {
        const visible = getVisibleCount();
        const maxIndex = Math.max(0, slides.length - visible);
        current = current <= 0 ? maxIndex : current - 1;
        updateCarousel();
      }

      function startAutoPlay() {
        stopAutoPlay();
        autoInterval = setInterval(nextSlide, 5000);
      }

      function stopAutoPlay() {
        if (autoInterval) clearInterval(autoInterval);
      }

      if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
      if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);

      let touchStartX = 0;
      let touchEndX = 0;
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      }, { passive: true });
      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) nextSlide();
        else if (touchEndX - touchStartX > 50) prevSlide();
        startAutoPlay();
      }, { passive: true });

      window.addEventListener('resize', updateCarousel);
      updateCarousel();
      startAutoPlay();
    }
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== DROPDOWN MENU (SERVICES) =====
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('a');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    // Desktop hover
    dropdown.addEventListener('mouseenter', () => {
      if (window.innerWidth > 1024) {
        dropdown.classList.add('open');
      }
    });
    dropdown.addEventListener('mouseleave', () => {
      if (window.innerWidth > 1024) {
        dropdown.classList.remove('open');
      }
    });

    // Mobile click toggle
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  });

  // Close open dropdowns on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      document.querySelectorAll('.dropdown.open').forEach((d) => {
        // Keep hover logic; remove manual open state
        d.classList.remove('open');
      });
    }
  });

  // ===== SCROLL TO TOP BUTTON =====
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
