// router.js

const PAGES = ['calculator', 'matrix', 'reverse', 'products', 'contact'];
let currentPage = '';

function navigateTo(pageId) {
  if (!PAGES.includes(pageId)) pageId = 'calculator';
  if (pageId === currentPage) return;
  currentPage = pageId;

  // Show only the target page
  PAGES.forEach(function(id) {
    document.getElementById('page-' + id).classList.toggle('hidden', id !== pageId);
  });

  // Update active state on nav links
  document.querySelectorAll('.nav-link').forEach(function(link) {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  window.scrollTo(0, 0);

  // Update URL without triggering a navigation (fixes file:// CSP error)
  if (location.hash !== '#' + pageId) {
    history.pushState(null, '', '#' + pageId);
  }
}

document.addEventListener('DOMContentLoaded', function() {

  // Wire all elements with data-page (nav links + brand)
  document.querySelectorAll('[data-page]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo(el.dataset.page);
    });
  });

  // popstate handles browser back/forward when using history.pushState
  window.addEventListener('popstate', function() {
    const hash = location.hash.replace('#', '');
    navigateTo(PAGES.includes(hash) ? hash : 'calculator');
  });

  // Navigate to the correct page on initial load
  const hash = location.hash.replace('#', '');
  navigateTo(PAGES.includes(hash) ? hash : 'calculator');
});

// ─── NAV SCROLL HINT ─────────────────────────────────────────────────────────

(function() {
  var navLinks  = document.querySelector(".nav-links");
  var hintRight = document.getElementById("nav-scroll-hint-right");
  var hintLeft  = document.getElementById("nav-scroll-hint-left");
  if (!navLinks || !hintRight || !hintLeft) return;

  function updateHints() {
    var scrollLeft     = navLinks.scrollLeft;
    var canScrollRight = scrollLeft + navLinks.clientWidth < navLinks.scrollWidth - 2;
    var canScrollLeft  = scrollLeft > 2;
    hintRight.classList.toggle("hidden", !canScrollRight);
    hintLeft.classList.toggle("hidden",  !canScrollLeft);
  }

  navLinks.addEventListener("scroll", updateHints);
  window.addEventListener("resize", updateHints);
  document.addEventListener("DOMContentLoaded", updateHints);
  setTimeout(updateHints, 200);
})();