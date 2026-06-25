// Elements
const hamburger = document.querySelector('.hamburger');
const mobileToggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.querySelector('.scroll-top');
const scrollTrack = document.querySelector('.scroll-track');
const circleCursorOuter = document.querySelector('.circle-cursor-outer');
const circleCursorInner = document.querySelector('.circle-cursor-inner');
const dropdowns = document.querySelectorAll('.has-dropdown');

// ===== MOBILE HAMBURGER MENU =====
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

// ===== STICKY HEADER =====
const header = document.querySelector('.header');
if (header) {
  const handleScroll = () => {
    if (window.scrollY > 100) {
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

  const animateCounters = () => {
    counters.forEach((counter) => {
      const counterRect = counter.getBoundingClientRect();
      if (counterRect.top < window.innerHeight && counterRect.bottom > 0) {
        animateCounter(counter);
      }
    });
  };

  window.addEventListener('scroll', animateCounters);
  animateCounters();
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

// ===== CUSTOM CURSOR =====
if (circleCursorOuter && circleCursorInner) {
  document.addEventListener('mousemove', (e) => {
    circleCursorOuter.style.left = e.clientX + 'px';
    circleCursorOuter.style.top = e.clientY + 'px';
    circleCursorInner.style.left = e.clientX + 'px';
    circleCursorInner.style.top = e.clientY + 'px';
  });

  document.addEventListener('mouseenter', (e) => {
    if (e.target.closest('a, button, .card, .btn')) {
      circleCursorOuter.classList.add('hover');
    }
  });

  document.addEventListener('mouseleave', (e) => {
    if (e.target.closest('a, button, .card, .btn')) {
      circleCursorOuter.classList.remove('hover');
    }
  });

  // Cursor click effect
  document.addEventListener('mousedown', () => {
    circleCursorOuter.classList.add('dragging');
  });

  document.addEventListener('mouseup', () => {
    circleCursorOuter.classList.remove('dragging');
  });
}

// ===== SCROLL TO TOP WITH PROGRESS =====
if (scrollTopBtn && scrollTrack) {
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollTrack.style.transform = `scaleY(${scrollPercent / 100})`;

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

// ===== DROPDOWN MENU (SERVICES) =====
dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector('a');

  if (toggle) {
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
  }
});

// Close open dropdowns on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    document.querySelectorAll('.dropdown.open').forEach((d) => {
      d.classList.remove('open');
    });
  }
});

// ===== PARALLAX HERO BACKGROUNDS =====
const parallaxHeroes = document.querySelectorAll('.hero-with-bg');

parallaxHeroes.forEach((hero) => {
  hero.style.backgroundSize = 'cover';
  hero.style.backgroundPosition = 'center';
});

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

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');

  if (question) {
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      if (isActive) {
        item.classList.remove('active');
      } else {
        faqItems.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  }
});

// ===== VIDEO PLAY BUTTON (if present) =====
const videoPlayBtns = document.querySelectorAll('.video-play-btn');
videoPlayBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const video = btn.closest('.video-wrapper').querySelector('video');
    if (video) {
      video.play();
      btn.style.display = 'none';
    }
  });
});

// ===== CARD HOVER EFFECTS =====
const cards = document.querySelectorAll('.card');
cards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-8px)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// ===== SET ACTIVE NAV LINK ON SCROLL =====
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section[id]');

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          imageObserver.unobserve(img);
        }
      });
    }
  );

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}