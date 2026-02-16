/**
 * IT-Agentur Website - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Header Scroll Effect
  initHeaderScroll();

  // Mobile Menu
  initMobileMenu();

  // Smooth Scroll for Anchor Links
  initSmoothScroll();

  // Cookie Banner
  initCookieBanner();

  // Logo Carousel
  initLogoCarousel();
});

/**
 * Header scroll effect - adds shadow on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const scrollThreshold = 50;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/**
 * Mobile menu toggle functionality
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.mobile-menu__close');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');

  if (!menuToggle || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('mobile-menu--open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('mobile-menu--open');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMenu);

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  // Close menu when clicking on a link
  menuLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
      closeMenu();
    }
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      // Ignore empty anchors
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Cookie banner consent functionality
 */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAccept');
  const declineBtn = document.getElementById('cookieDecline');

  if (!banner) return;

  // Check if consent already given
  if (localStorage.getItem('cookieConsent')) return;

  // Show banner after short delay
  setTimeout(function() {
    banner.classList.add('cookie-banner--visible');
  }, 1000);

  function hideBanner(consent) {
    localStorage.setItem('cookieConsent', consent);
    banner.classList.remove('cookie-banner--visible');
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      hideBanner('accepted');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', function() {
      hideBanner('declined');
    });
  }
}

/**
 * Logo carousel - infinite scroll by rotating logos
 */
function initLogoCarousel() {
  const track = document.querySelector('.logos__track');
  if (!track) return;

  const items = Array.from(track.querySelectorAll('.logos__item'));
  if (items.length === 0) return;

  const speed = 0.5; // pixels per frame
  let position = 0;
  let isPaused = false;
  let animationId;

  function getItemWidth(item) {
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 0;
    return item.offsetWidth + gap;
  }

  function animate() {
    if (!isPaused) {
      position -= speed;

      const firstItem = track.querySelector('.logos__item');
      const firstItemWidth = getItemWidth(firstItem);

      // When first item is fully scrolled out, move it to the end
      if (Math.abs(position) >= firstItemWidth) {
        track.appendChild(firstItem);
        position += firstItemWidth;
      }

      track.style.transform = `translateX(${position}px)`;
    }
    animationId = requestAnimationFrame(animate);
  }

  // Pause on hover
  track.addEventListener('mouseenter', function() {
    isPaused = true;
  });

  track.addEventListener('mouseleave', function() {
    isPaused = false;
  });

  animate();
}
