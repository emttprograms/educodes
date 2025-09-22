/* Save as: script.js
   -------------------------------------------------------
   Responsibilities:
   - Mobile navigation toggle (accessibly open/close)
   - Smooth scroll for anchor links
   - IntersectionObserver-based reveal animations (efficient)
   - Small helpers to update footer year
   - Respects prefers-reduced-motion
   -------------------------------------------------------
*/

/* --------- Helper: DOM ready --------- */
document.addEventListener("DOMContentLoaded", () => {
    // update copyright year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    // initialize mobile nav toggling
    initMobileNav();
  
    // initialize smooth scroll for internal links
    initSmoothScroll();
  
    // initialize reveal-on-scroll animations
    initRevealOnScroll();
  });
  
  /* --------- Mobile navigation --------- */
  /* Adds accessible open/close behavior for the mobile menu. */
  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
  
    if (!toggle || !mobileMenu) return;
  
    // toggle ARIA + visibility
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });
  
    // close the menu when clicking an anchor inside it (good UX)
    mobileMenu.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        closeMobileMenu();
      }
    });
  
    // close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileMenu();
    });
  
    // Ensure nav closes when resizing up to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) closeMobileMenu();
    });
  
    function openMobileMenu() {
      toggle.setAttribute("aria-expanded", "true");
      mobileMenu.hidden = false;
      toggle.setAttribute("aria-label", "Close menu");
  
      // animate hamburger to X (simple)
      toggle.classList.add("open");
      // set focus to first link for accessibility
      const firstLink = mobileMenu.querySelector("a");
      if (firstLink) firstLink.focus();
    }
  
    function closeMobileMenu() {
      toggle.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
      toggle.setAttribute("aria-label", "Open menu");
      toggle.classList.remove("open");
      toggle.focus();
    }
  }
  
  /* --------- Smooth scrolling for anchor links --------- */
  /* Uses scrollIntoView where supported. Respects 'prefers-reduced-motion'. */
  function initSmoothScroll() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // allow normal behavior for external links or empty hrefs
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
  
        // target element
        const target = document.querySelector(href);
        if (!target) return;
  
        // prevent jump and perform smooth scroll
        e.preventDefault();
        if (prefersReduced) {
          target.scrollIntoView();
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
  
        // close mobile menu if open (nice touch)
        const mobileMenu = document.getElementById("mobile-menu");
        const toggle = document.querySelector(".nav-toggle");
        if (mobileMenu && !mobileMenu.hidden && toggle) {
          // small delay so user sees the menu close while scrolling
          setTimeout(() => toggle.click(), 120);
        }
      });
    });
  }
  
  /* --------- Reveal on scroll (efficient) ---------
     Uses IntersectionObserver. Fallbacks to scroll-based reveal if IntersectionObserver isn't available.
  */
  function initRevealOnScroll() {
    const revealElems = document.querySelectorAll(".reveal");
    if (revealElems.length === 0) return;
  
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // If user prefers reduced motion, immediately make elements visible
      revealElems.forEach(el => el.classList.add("in-view"));
      return;
    }
  
    // If IntersectionObserver is supported, use it (best performance).
    if ("IntersectionObserver" in window) {
      const observerOptions = {
        root: null,
        rootMargin: "0px 0px -100px 0px", // trigger a little before element fully in view
        threshold: 0.08
      };
  
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            // stop observing once revealed (one-time animation)
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);
  
      revealElems.forEach(el => observer.observe(el));
    } else {
      // Fallback: simple scroll check (less efficient)
      const revealOnScroll = () => {
        const triggerPoint = window.innerHeight - 80;
        revealElems.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < triggerPoint) el.classList.add("in-view");
        });
      };
      revealOnScroll();
      window.addEventListener("scroll", revealOnScroll);
      window.addEventListener("resize", revealOnScroll);
    }
  }
  