/* VirtuEase — main.js */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', () => {

    /* ===== TOAST ===== */
    let toastEl = null;
    function showToast(message) {
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'toast';
        toastEl.innerHTML = '<span class="toast-dot"></span><span class="toast-msg"></span>';
        document.body.appendChild(toastEl);
      }
      toastEl.querySelector('.toast-msg').textContent = message;
      toastEl.classList.add('visible');
      clearTimeout(toastEl._timer);
      toastEl._timer = setTimeout(() => toastEl.classList.remove('visible'), 4200);
    }

    /* ===== ANIMATED TEXT (typewriter) ===== */
    const fancyText = document.getElementById('fancy-text');
    if (fancyText) {
      const words = JSON.parse(fancyText.getAttribute('data-words') || '["Found","Chosen"]');
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const tick = () => {
        const currentWord = words[wordIndex];

        if (isDeleting) {
          charIndex--;
          fancyText.textContent = currentWord.substring(0, charIndex);
          if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(tick, 420);
            return;
          }
          setTimeout(tick, 45);
        } else {
          charIndex++;
          fancyText.textContent = currentWord.substring(0, charIndex);
          if (charIndex === currentWord.length) {
            setTimeout(() => { isDeleting = true; tick(); }, 1900);
            return;
          }
          setTimeout(tick, 90);
        }
      };
      tick();
    }

    /* ===== STICKY HEADER ===== */
    const siteHeader = document.querySelector('.site-header');
    const onScroll = () => {
      if (!siteHeader) return;
      siteHeader.classList.toggle('sticky', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ===== CUSTOM CURSOR (fixed: mouseenter does not bubble) ===== */
    const cursorOuter = document.querySelector('.circle-cursor-outer');
    const cursorInner = document.querySelector('.circle-cursor-inner');

    if (cursorOuter && cursorInner && finePointer && !prefersReducedMotion) {
      document.body.classList.add('custom-cursor');
      cursorInner.classList.add('is-active');
      cursorOuter.classList.add('is-active');

      let mouseX = 0, mouseY = 0;
      let outerX = 0, outerY = 0;

      document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorInner.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      });

      function lerpOuter() {
        outerX += (mouseX - outerX) * 0.18;
        outerY += (mouseY - outerY) * 0.18;
        cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;
        requestAnimationFrame(lerpOuter);
      }
      requestAnimationFrame(lerpOuter);

      const interactiveSelector = 'a, button, .btn, .faq-question, .social-link, label, [data-cursor-class]';

      document.addEventListener('mouseover', e => {
        const target = e.target.closest(interactiveSelector);
        if (!target) return;

        if (e.target.closest('input, textarea, select')) {
          document.body.classList.add('no-custom-cursor');
          return;
        }
        document.body.classList.remove('no-custom-cursor');

        const special = target.closest('[data-cursor-class]');
        if (special) {
          const className = special.getAttribute('data-cursor-class');
          cursorInner.classList.add(className);
          cursorOuter.classList.add(className);
        } else {
          cursorInner.classList.add('cursor-link-hover');
          cursorOuter.classList.add('cursor-link-hover');
        }
      });

      document.addEventListener('mouseout', e => {
        const target = e.target.closest(interactiveSelector);
        if (!target) return;

        if (e.target.closest('input, textarea, select')) {
          document.body.classList.remove('no-custom-cursor');
        }

        const special = target.closest('[data-cursor-class]');
        if (special) {
          const className = special.getAttribute('data-cursor-class');
          cursorInner.classList.remove(className);
          cursorOuter.classList.remove(className);
        } else {
          cursorInner.classList.remove('cursor-link-hover');
          cursorOuter.classList.remove('cursor-link-hover');
        }
      });
    }

    /* ===== HAMBURGER OVERLAY ===== */
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const overlay = document.querySelector('.hamburger-overlay');

    if (hamburgerBtn && overlay) {
      hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll', overlay.classList.contains('active'));
      });

      overlay.querySelectorAll('.overlay-menu > li > a:not([href="#"])').forEach(link => {
        link.addEventListener('click', () => closeMenu());
      });

      function closeMenu() {
        hamburgerBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        overlay.querySelectorAll('.overlay-submenu.open').forEach(s => s.classList.remove('open'));
        overlay.querySelectorAll('.has-submenu.open').forEach(s => s.classList.remove('open'));
      }

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
      });

      document.querySelectorAll('.hamburger-overlay .has-submenu > a').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          const parent = link.parentElement;
          const submenu = parent.querySelector('.overlay-submenu');
          if (submenu) {
            const wasOpen = submenu.classList.contains('open');
            overlay.querySelectorAll('.overlay-submenu.open').forEach(s => s.classList.remove('open'));
            overlay.querySelectorAll('.has-submenu.open').forEach(s => s.classList.remove('open'));
            if (!wasOpen) {
              submenu.classList.add('open');
              parent.classList.add('open');
            }
          }
        });
      });
    }

    /* ===== SCROLL PROGRESS BAR ===== */
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
      const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.height = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
      };
      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();
    }

    /* ===== COUNTER ANIMATION ===== */
    const counters = document.querySelectorAll('.counter-number[data-target]');
    if (counters.length) {
      let animated = false;

      const animateCounter = el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const start = performance.now();

        const update = now => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        };
        requestAnimationFrame(update);
      };

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            counters.forEach(animateCounter);
            observer.disconnect();
          }
        });
      }, { threshold: 0.25 });

      const target = document.querySelector('.counters-grid');
      if (target) observer.observe(target);
    }

    /* ===== FAQ ACCORDION ===== */
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;
      question.setAttribute('role', 'button');
      question.setAttribute('aria-expanded', 'false');
      question.setAttribute('tabindex', '0');

      const toggle = () => {
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });
        if (!wasActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      };

      question.addEventListener('click', toggle);
      question.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });

    /* ===== SCROLL TO TOP ===== */
    const scrollBtn = document.querySelector('.scroll-top');
    const railBtn = document.querySelector('.scroll-top-btn');
    const allTopBtns = [scrollBtn, railBtn].filter(Boolean);

    window.addEventListener('scroll', () => {
      const show = window.scrollY > 400;
      if (scrollBtn) scrollBtn.classList.toggle('visible', show);
    }, { passive: true });

    allTopBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });

    /* ===== REVEAL ON SCROLL ===== */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => observer.observe(el));
    }

    /* ===== PARTICLES CANVAS ===== */
    const canvas = document.getElementById('particles-canvas');
    if (canvas && !prefersReducedMotion) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      const particleCount = Math.min(50, Math.floor(window.innerWidth / 26));
      let width, height, raf;

      const resize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      };

      class Particle {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.35;
          this.vy = (Math.random() - 0.5) * 0.35;
          this.radius = Math.random() * 1.4 + 0.4;
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
          ctx.fillStyle = 'rgba(226, 193, 255, 0.35)';
          ctx.fill();
        }
      }

      const init = () => {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
      };

      let mouse = { x: null, y: null };
      window.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
      document.addEventListener('mouseenter', () => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = null;
        mouse.y = null;
        void rect;
      });

      function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(164, 90, 255, ${0.14 * (1 - dist / 110)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }

          if (mouse.x !== null && mouse.y !== null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(226, 193, 255, ${0.18 * (1 - dist / 140)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        raf = requestAnimationFrame(animate);
      }

      window.addEventListener('resize', init);
      init();
      animate();
    }

    /* ===== CONTACT FORM ===== */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const successBox = contactForm.querySelector('.form-success');

        if (submitBtn) {
          submitBtn.classList.add('is-loading');
          submitBtn.textContent = 'Opening your email app…';
        }

        const subject = data.subject || 'New project inquiry';
        const lines = [
          `Hello VirtuEase team,`,
          ``,
          `Name: ${data.name || '—'}`,
          `Email: ${data.email || ''}`,
          data.company && `Company: ${data.company}`,
          data.phone && `Phone: ${data.phone}`,
          data.budget && `Budget: ${data.budget}`,
          ``,
          `Project details:`,
          data.message || '',
        ].filter(Boolean);

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.classList.remove('is-loading');
            submitBtn.textContent = 'Submit';
          }
          if (successBox) successBox.classList.add('visible');
          showToast('Thank you! Opening your email app to send your inquiry.');

          const mailto = `mailto:admin@virtueasepro.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\r\n'))}`;
          const anchor = document.createElement('a');
          anchor.href = mailto;
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
        }, 700);
      });
    }

    /* ===== NEWSLETTER FORMS ===== */
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const value = input ? input.value.trim() : '';
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRe.test(value)) {
          showToast('Please enter a valid email address.');
          if (input) input.focus();
          return;
        }
        if (input) input.value = '';
        showToast(`Thanks! You're on the list — watch your inbox for updates.`);
      });
    });

    /* ===== ACTIVE NAV LINK ===== */
    const currentPath = window.location.pathname;
    const isServicePage = ['/website-development', '/seo-google-business-profile-optimization', '/article-and-blog-writing', '/virtual-assistant']
      .some(p => currentPath.startsWith(p));

    document.querySelectorAll('.nav-menu a, .overlay-menu > li > a').forEach(link => {
      const href = link.getAttribute('href');
      let active = false;

      if (href === '/' && currentPath === '/') active = true;
      else if (href !== '/' && href !== '#' && currentPath.startsWith(href)) active = true;
      else if (isServicePage && link.textContent.trim() === 'Services') active = true;

      if (active) link.classList.add('active');
    });

  });
})();
