document.addEventListener('DOMContentLoaded', () => {
  // ===== MOBILE MENU =====
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');

  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    document.querySelectorAll('.nav a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ===== STICKY HEADER =====
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 100);
    }, { passive: true });
  }

  // ===== DROPDOWN MENU =====
  document.querySelectorAll('.has-dropdown').forEach(dd => {
    const link = dd.querySelector('a');
    dd.addEventListener('mouseenter', () => {
      if (window.innerWidth > 1024) dd.classList.add('open');
    });
    dd.addEventListener('mouseleave', () => {
      if (window.innerWidth > 1024) dd.classList.remove('open');
    });
    if (link) {
      link.addEventListener('click', e => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          dd.classList.toggle('open');
        }
      });
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      document.querySelectorAll('.has-dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });

  // ===== TYPING TEXT =====
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const words = ['Found', 'Chosen'];
    let wi = 0, ci = 0, deleting = false;

    function typeLoop() {
      const word = words[wi];
      typingEl.textContent = word.substring(0, deleting ? ci - 1 : ci + 1);
      deleting ? ci-- : ci++;

      let delay = deleting ? 80 : 120;
      if (!deleting && ci === word.length) { delay = 2000; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 400; }

      setTimeout(typeLoop, delay);
    }
    typeLoop();
  }

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    let animated = false;

    const animateAll = () => {
      if (animated) return;
      animated = true;

      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          counter.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else counter.textContent = target;
        }
        requestAnimationFrame(update);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateAll(); observer.disconnect(); }
      });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) observer.observe(statsSection);
  }

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
      });
    }
  });

  // ===== SCROLL TO TOP =====
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== FADE-IN ON SCROLL =====
  document.querySelectorAll('.fade-in').forEach(el => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(el);
  });
});
