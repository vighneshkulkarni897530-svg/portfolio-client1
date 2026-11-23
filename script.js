/**
 * The Office of the Principal — Executive Academic Portfolio
 * Obsidian Aurora Edition (Government B.Sc. Nursing College, Jalna)
 * Interactions, Mobile Drawer, ScrollSpy, Metric Counters & Protocol Dispatch
 */

document.addEventListener('DOMContentLoaded', () => {

  // Guarantee Obsidian Aurora Theme Lock
  document.body.classList.add('multicolour-dark-theme');

  /* ==========================================================================
     1. Sovereign Navigation & Mobile Drawer
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const executiveNav = document.getElementById('executiveNav');
  const navItems = document.querySelectorAll('.nav-item, .nav-btn-gold');
  const header = document.getElementById('header');

  if (menuToggle && executiveNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = executiveNav.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking any nav link
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        executiveNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile nav if user clicks outside
    document.addEventListener('click', (e) => {
      if (!executiveNav.contains(e.target) && !menuToggle.contains(e.target)) {
        if (executiveNav.classList.contains('active')) {
          executiveNav.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  /* ==========================================================================
     3. Sticky Header Elevation Effect
     ========================================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ==========================================================================
     4. Active Navigation ScrollSpy
     ========================================================================== */
  const trackedSections = document.querySelectorAll('section[id]');
  const mainNavLinks = document.querySelectorAll('.executive-nav .nav-item');

  function updateActiveNav() {
    const scrollPos = window.pageYOffset + 200;

    trackedSections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop;
      const secId = sec.getAttribute('id');

      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        mainNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${secId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // run once on initial load

  /* ==========================================================================
     5. Smooth Scroll for Anchor Links
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 84;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     6. Animated Metric Counters
     ========================================================================== */
  const counterElements = document.querySelectorAll('.metric-num');
  let metricsStarted = false;

  function runMetricCounters() {
    counterElements.forEach(counter => {
      const rawTarget = counter.getAttribute('data-target');
      if (!rawTarget) return;
      const targetVal = parseFloat(rawTarget);
      const hasDecimal = targetVal % 1 !== 0;
      const animDuration = 1800; // ms
      const startStamp = performance.now();

      function updateStep(now) {
        const elapsed = now - startStamp;
        const progress = Math.min(elapsed / animDuration, 1);
        
        // Cubic ease out
        const easeVal = 1 - Math.pow(1 - progress, 3);

        if (hasDecimal) {
          counter.textContent = (easeVal * targetVal).toFixed(1);
        } else {
          counter.textContent = Math.floor(easeVal * targetVal);
        }

        if (progress < 1) {
          requestAnimationFrame(updateStep);
        } else {
          counter.textContent = targetVal;
        }
      }

      requestAnimationFrame(updateStep);
    });
  }

  const metricsGrid = document.querySelector('.metrics-grid');
  if (metricsGrid) {
    const metricsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsStarted) {
          metricsStarted = true;
          runMetricCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    metricsObserver.observe(metricsGrid);
  }

  /* ==========================================================================
     7. Audience Protocol Dispatch Form (Secretariat)
     ========================================================================== */
  const audienceForm = document.getElementById('audienceForm');
  const audienceSuccess = document.getElementById('audienceSuccess');

  if (audienceForm) {
    audienceForm.addEventListener('submit', (evt) => {
      evt.preventDefault();

      const fullName = document.getElementById('fullName');
      const affiliationRole = document.getElementById('affiliationRole');
      const emailAddr = document.getElementById('emailAddr');
      const audiencePurpose = document.getElementById('audiencePurpose');
      const agendaBrief = document.getElementById('agendaBrief');

      let isValid = true;

      function checkValidity(inputEl, condition) {
        if (!inputEl) return;
        const parentField = inputEl.closest('.form-field');
        if (!condition) {
          parentField?.classList.add('has-error');
          isValid = false;
        } else {
          parentField?.classList.remove('has-error');
        }
      }

      // Execute Field Checks
      checkValidity(fullName, fullName && fullName.value.trim().length >= 3);
      checkValidity(affiliationRole, affiliationRole && affiliationRole.value !== '');
      checkValidity(emailAddr, emailAddr && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddr.value.trim()));
      checkValidity(audiencePurpose, audiencePurpose && audiencePurpose.value !== '');
      checkValidity(agendaBrief, agendaBrief && agendaBrief.value.trim().length >= 6);

      if (isValid) {
        const dispatchBtn = document.getElementById('dispatchBtn');
        const prevContent = dispatchBtn ? dispatchBtn.innerHTML : '';

        if (dispatchBtn) {
          dispatchBtn.disabled = true;
          dispatchBtn.innerHTML = `<span>Dispatching Audience Protocol...</span>`;
        }

        setTimeout(() => {
          if (dispatchBtn) {
            dispatchBtn.disabled = false;
            dispatchBtn.innerHTML = prevContent;
          }

          // Reveal Success Notice
          if (audienceSuccess) {
            audienceSuccess.style.display = 'flex';
            audienceSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }

          audienceForm.reset();

          // Auto-hide alert after 10 seconds
          setTimeout(() => {
            if (audienceSuccess) {
              audienceSuccess.style.display = 'none';
            }
          }, 10000);
        }, 1200);
      }
    });

    // Real-time clearance of validation errors on input
    audienceForm.querySelectorAll('.field-input, .field-select, .field-textarea').forEach(elem => {
      elem.addEventListener('input', () => {
        const field = elem.closest('.form-field');
        if (field) field.classList.remove('has-error');
      });
    });
  }

  /* ==========================================================================
     8. Sovereign Back to Top Button
     ========================================================================== */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     9. Regal Scroll Reveal Animations
     ========================================================================== */
  const cardsToReveal = document.querySelectorAll(
    '.metric-plaque, .editorial-manuscript-card, .cornerstone-card, .tablet-monument, .bento-card, .timeline-parchment-card, .laurel-monument-box, .voice-plaque'
  );

  if ('IntersectionObserver' in window) {
    const revealWatcher = new IntersectionObserver((entries, watcher) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          watcher.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    cardsToReveal.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      revealWatcher.observe(card);
    });
  } else {
    // Fallback for older browsers
    cardsToReveal.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
  }

});
