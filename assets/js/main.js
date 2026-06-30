document.addEventListener('DOMContentLoaded', () => {
  // ===== STICKY SITE HEADER =====
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        siteHeader.classList.add('sticky');
      } else {
        siteHeader.classList.remove('sticky');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // ===== CUSTOM CURSOR =====
  const cursorOuter = document.querySelector('.circle-cursor-outer');
  const cursorInner = document.querySelector('.circle-cursor-inner');

  if (cursorOuter && cursorInner) {
    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;
    let isMagnet = false;

    // Show cursor when mouse moves
    document.body.classList.add('custom-cursor');
    cursorInner.style.visibility = 'visible';
    cursorOuter.style.visibility = 'visible';

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Position inner cursor instantly
      cursorInner.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      
      // Position outer cursor if not in magnet state
      if (!isMagnet) {
        cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;
      }
    });

    // Smooth lerp animation for outer cursor
    function animateOuterCursor() {
      if (!isMagnet) {
        outerX += (mouseX - outerX) * 0.2;
        outerY += (mouseY - outerY) * 0.2;
        cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;
      }
      requestAnimationFrame(animateOuterCursor);
    }
    animateOuterCursor();

    // Hover effect on standard links and elements styled as pointers
    const addHover = () => {
      cursorInner.classList.add('cursor-link-hover');
      cursorOuter.classList.add('cursor-link-hover');
    };
    const removeHover = () => {
      cursorInner.classList.remove('cursor-link-hover');
      cursorOuter.classList.remove('cursor-link-hover');
    };

    document.body.addEventListener('mouseenter', e => {
      if (e.target.matches && (e.target.matches('a, button, .btn, .faq-question, .hamburger-btn, .social-link') || e.target.closest('a, button, .btn'))) {
        addHover();
      }
    }, true);

    document.body.addEventListener('mouseleave', e => {
      if (e.target.matches && (e.target.matches('a, button, .btn, .faq-question, .hamburger-btn, .social-link') || e.target.closest('a, button, .btn'))) {
        removeHover();
      }
    }, true);

    // Hover effect for special data-cursor-class (e.g. data-cursor-class="cursor-link" on project cards)
    document.body.addEventListener('mouseenter', e => {
      const target = e.target.closest('[data-cursor-class]');
      if (target) {
        const className = target.getAttribute('data-cursor-class');
        cursorInner.classList.add(className);
        cursorOuter.classList.add(className);
      }
    }, true);

    document.body.addEventListener('mouseleave', e => {
      const target = e.target.closest('[data-cursor-class]');
      if (target) {
        const className = target.getAttribute('data-cursor-class');
        cursorInner.classList.remove(className);
        cursorOuter.classList.remove(className);
      }
    }, true);

    // Hover effect for scroll-top-btn
    document.body.addEventListener('mouseenter', e => {
      const target = e.target.closest('.scroll-top-btn');
      if (target) {
        addHover();
      }
    }, true);

    document.body.addEventListener('mouseleave', e => {
      const target = e.target.closest('.scroll-top-btn');
      if (target) {
        removeHover();
      }
    }, true);

    // Magnet effect on icon buttons or elements with .cursor-magnet
    document.body.addEventListener('mouseenter', e => {
      const target = e.target.closest('.cursor-magnet, .hamburger-btn, .btn-header-contact, .scroll-top-btn');
      if (target) {
        const rect = target.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const left = rect.left + width / 2;
        const top = rect.top + height / 2;

        isMagnet = true;
        cursorOuter.style.transition = 'all 0.2s ease-out';
        cursorOuter.style.transform = `translate(${left}px, ${top}px)`;
        cursorOuter.style.width = `${width + 10}px`;
        cursorOuter.style.height = `${height + 10}px`;
        cursorOuter.style.marginLeft = `-${(width + 10) / 2}px`;
        cursorOuter.style.marginTop = `-${(height + 10) / 2}px`;
      }
    }, true);

    document.body.addEventListener('mouseleave', e => {
      const target = e.target.closest('.cursor-magnet, .hamburger-btn, .btn-header-contact, .scroll-top-btn');
      if (target) {
        isMagnet = false;
        cursorOuter.style.transition = '';
        cursorOuter.style.width = '';
        cursorOuter.style.height = '';
        cursorOuter.style.marginLeft = '';
        cursorOuter.style.marginTop = '';
      }
    }, true);
  }

  // ===== HAMBURGER OVERLAY =====
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const overlay = document.querySelector('.hamburger-overlay');

  if (hamburgerBtn && overlay) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    });

    overlay.querySelectorAll('.overlay-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== OVERLAY SUBMENU =====
  document.querySelectorAll('.hamburger-overlay .has-submenu > a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const parent = link.parentElement;
      const submenu = parent.querySelector('.overlay-submenu');
      if (submenu) {
        submenu.classList.toggle('open');
      }
    });
  });

  // ===== SCROLL PROGRESS BAR =====
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.height = progress + '%';
    }, { passive: true });
  }

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.counter-item');
  if (counters.length) {
    let animated = false;

    const animateAll = () => {
      if (animated) return;
      animated = true;

      counters.forEach(item => {
        const counterEl = item.querySelector('.number, .counter-number');
        if (!counterEl) return;
        
        let targetAttr = counterEl.getAttribute('data-target') || item.querySelector('[data-counter]')?.getAttribute('data-counter') || item.querySelector('[data-target]')?.getAttribute('data-target');
        if (!targetAttr) {
          const parentCounter = item.closest('[data-counter]') || item.querySelector('.counter') || item;
          targetAttr = parentCounter.getAttribute('data-counter') || parentCounter.getAttribute('data-target');
        }

        if (!targetAttr) return;
        const target = parseInt(targetAttr, 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          counterEl.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else counterEl.textContent = target;
        }
        requestAnimationFrame(update);
      });
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateAll();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const countersSection = document.querySelector('.counters-grid') || document.querySelector('.counter-item');
    if (countersSection) observer.observe(countersSection);
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
  const scrollBtn = document.querySelector('.scroll-top') || document.querySelector('.scroll-top-btn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== FADE-IN ON SCROLL =====
  document.querySelectorAll('.fade-in').forEach(el => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      });
    }, { threshold: .15 });
    observer.observe(el);
  });

  // ===== PARTICLES CANVAS BACKGROUND =====
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse connection
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ===== ACTIVE NAV LINK HIGHLIGHT =====
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-menu a, .overlay-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '/') || (href !== '/' && href !== '#' && currentPath.startsWith(href))) {
      link.classList.add('active');
    }
  });
});
