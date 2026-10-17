/**
 * Avanthi's St. Theressa Institute of Engineering & Technology (ASTC)
 * Interactive UI Logic & State Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initTabs();
  initAdmissionModal();
  initBackToTop();
  initStatCounters();
  initSmoothScroll();
});

/* Mobile Navigation Toggle */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('primaryNavMenu');
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close on link click
    navMenu.querySelectorAll('.nav-link:not(.dropdown-trigger)').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Mobile dropdown toggle
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('expanded');
        }
      });
    }
  });
}

/* Tabs Switcher for Programs */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Switch tab pane
      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });
}

/* Admission Application Modal */
function initAdmissionModal() {
  const modalOverlay = document.getElementById('admissionModal');
  const openButtons = document.querySelectorAll('.trigger-admission-modal');
  const closeButton = document.getElementById('closeModalBtn');
  const form = document.getElementById('onlineAdmissionForm');

  if (!modalOverlay) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  // Click outside modal card to close
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Admission Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Submitting Application...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        closeModal();
        showToast('Application submitted successfully! Our Admissions Cell will contact you shortly.');
      }, 900);
    });
  }
}

/* Toast Message Notification */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* Back to Top floating button */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* Animated Statistics Counter */
function initStatCounters() {
  const counterElements = document.querySelectorAll('.animate-counter');
  if (!counterElements.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const stepTime = 30;
    const totalSteps = duration / stepTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(target * easeOut);

      el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animate(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

/* Smooth Navigation Active State Tracking */
function initSmoothScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}
