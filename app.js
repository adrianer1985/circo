/**
 * Application interactions for Chucherías Circo
 * Handles:
 * 1. Internationalization (i18n) for ES, EN, FR with localStorage persistence
 * 2. Responsive mobile navigation menu
 */

document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. INTERNATIONALIZATION (i18n)
     ========================================================================== */
  const LANG_KEY = 'circo-lang';
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  let currentLang = urlLang || localStorage.getItem(LANG_KEY) || 'es';

  // Validate language
  if (!['es', 'en', 'fr'].includes(currentLang)) {
    currentLang = 'es';
  }

  // Apply translations to the page elements
  const applyTranslations = (lang) => {
    if (!window.circoTranslations || !window.circoTranslations[lang]) return;
    
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    const dictionary = window.circoTranslations[lang];

    // 1. Translate elements with data-i18n (sets innerHTML to support <strong> and standard formatting)
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dictionary[key] !== undefined) {
        if (el.tagName.toLowerCase() === 'meta') {
          el.setAttribute('content', dictionary[key]);
        } else {
          el.innerHTML = dictionary[key];
        }
      }
    });

    // 2. Translate elements with data-i18n-placeholder (inputs placeholders)
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dictionary[key] !== undefined) {
        el.setAttribute('placeholder', dictionary[key]);
      }
    });

    // 3. Translate elements with data-i18n-title (tooltip/title attributes)
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (dictionary[key] !== undefined) {
        el.setAttribute('title', dictionary[key]);
      }
    });

    // 4. Update language active button states
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
    
    // Dynamically update document title if translation key exists
    if (dictionary['meta_title'] !== undefined) {
      document.title = dictionary['meta_title'];
    } else {
      // Custom title templates based on language if not in dictionary
      const titles = {
        es: 'Chucherías Circo | El Templo de la Golosina Retro en Mijas',
        en: 'Chucherías Circo | The Retro Candy Temple in Mijas',
        fr: 'Chucherías Circo | Le Temple des Bonbons Rétro à Mijas'
      };
      document.title = titles[lang] || titles.es;
    }
  };

  // Bind click listeners to all language switcher links
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (btn) {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      localStorage.setItem(LANG_KEY, lang);
      
      // Update URL query parameter smoothly without full page reload
      const url = new URL(window.location);
      url.searchParams.set('lang', lang);
      window.history.pushState({}, '', url);

      applyTranslations(lang);
    }
  });

  // Apply default language on load
  applyTranslations(currentLang);


  /* ==========================================================================
     2. RESPONSIVE MOBILE NAVIGATION
     ========================================================================== */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && mainNav) {
    const toggleMenu = () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('no-scroll', !isExpanded);
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking nav links (for smooth scrolling to anchors)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }


});
