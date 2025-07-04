// Menu toggle functionality
const menuToggle = document.querySelector('.header__menu-toggle');
const navMenu = document.querySelector('.header__nav');

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', !isExpanded);
  navMenu.classList.toggle('header__nav--active');
  menuToggle.classList.toggle('header__menu-toggle--active');
});

// Close menu when clicking on a link (for mobile)
document.querySelectorAll('.header__nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('header__nav--active');
    menuToggle.classList.remove('header__menu-toggle--active');
  });
});

// Update copyright year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Load CSS asynchronously
function loadCSS(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// Check if Font Awesome is already loaded
if (!document.querySelector('link[href*="font-awesome"]')) {
  loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
}