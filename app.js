/**
 * Application interactions for Chucherías Circo
 * Handles:
 * 1. Internationalization (i18n) for ES, EN, FR with localStorage persistence
 * 2. Responsive mobile navigation menu
 * 3. Newsletter subscription form validation & success state
 * 4. Interactive star rating inputs & review submission with localStorage persistence
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


  /* ==========================================================================
     3. NEWSLETTER FORM (BOLETO DORADO)
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterError = document.getElementById('newsletterError');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        newsletterError.style.display = 'block';
        newsletterEmail.parentElement.classList.add('invalid');
      } else {
        newsletterError.style.display = 'none';
        newsletterEmail.parentElement.classList.remove('invalid');
        
        // Hide form and show success message
        newsletterForm.classList.add('hidden');
        newsletterSuccess.classList.remove('hidden');

        // Reset input
        newsletterEmail.value = '';
      }
    });

    // Reset error class on typing
    newsletterEmail.addEventListener('input', () => {
      newsletterError.style.display = 'none';
      newsletterEmail.parentElement.classList.remove('invalid');
    });
  }


  /* ==========================================================================
     4. TESTIMONIALS & INTERACTIVE STAR RATING
     ========================================================================== */
  const reviewForm = document.getElementById('reviewForm');
  const reviewName = document.getElementById('reviewName');
  const reviewLocation = document.getElementById('reviewLocation');
  const reviewText = document.getElementById('reviewText');
  const starRatingInput = document.getElementById('starRatingInput');
  const testimonialsList = document.getElementById('testimonialsList');
  const reviewSuccess = document.getElementById('reviewSuccess');

  // Error elements
  const nameError = document.getElementById('nameError');
  const ratingError = document.getElementById('ratingError');
  const textError = document.getElementById('textError');

  let selectedRating = 0;
  const LOCAL_REVIEWS_KEY = 'circo-user-reviews';

  // --- Star Rating Interaction Logic ---
  if (starRatingInput) {
    const stars = starRatingInput.querySelectorAll('.star-btn');

    // Highlight stars up to a target index
    const highlightStars = (rating) => {
      stars.forEach(star => {
        const starVal = parseInt(star.getAttribute('data-value'));
        if (starVal <= rating) {
          star.classList.add('hover');
        } else {
          star.classList.remove('hover');
        }
      });
    };

    // Remove temporary highlights
    const clearHighlights = () => {
      stars.forEach(star => star.classList.remove('hover'));
    };

    // Set permanent active stars based on selection
    const setActiveStars = (rating) => {
      stars.forEach(star => {
        const starVal = parseInt(star.getAttribute('data-value'));
        if (starVal <= rating) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
    };

    stars.forEach(star => {
      // Hover event
      star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.getAttribute('data-value'));
        highlightStars(rating);
      });

      // Click event
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-value'));
        setActiveStars(selectedRating);
        ratingError.style.display = 'none'; // Clear error on select
      });
    });

    // Mouse leave event for the container
    starRatingInput.addEventListener('mouseleave', () => {
      clearHighlights();
    });
  }

  // --- Local Storage Reviews Handling ---
  const loadLocalReviews = () => {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const saveLocalReview = (review) => {
    const reviews = loadLocalReviews();
    reviews.unshift(review); // Add new reviews to the top
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
  };

  // Generate HTML for a testimonial card
  const createReviewCardHTML = (review) => {
    // Generate initials for avatar
    const initials = review.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    // Create star string
    const starsString = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    // Get translatable date text dynamically
    const dateText = window.circoTranslations && window.circoTranslations[currentLang] && window.circoTranslations[currentLang]['testimonial_date_now']
      ? window.circoTranslations[currentLang]['testimonial_date_now']
      : 'Hace unos momentos';

    return `
      <article class="testimonial-card" style="animation: slideDown 0.3s ease-out forwards;">
        <div class="testimonial-header">
          <div class="user-info">
            <span class="user-avatar">${initials}</span>
            <div>
              <h4 class="user-name">${escapeHTML(review.name)}</h4>
              <span class="user-location">${escapeHTML(review.location || 'Visitante')}</span>
            </div>
          </div>
          <div class="star-rating-display" aria-label="${review.rating} de 5 estrellas">
            ${starsString}
          </div>
        </div>
        <p class="testimonial-text">"${escapeHTML(review.text)}"</p>
        <span class="testimonial-date" data-i18n="testimonial_date_now">${dateText}</span>
      </article>
    `;
  };

  // Helper to escape HTML and prevent XSS injections
  const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  };

  // Render both pre-configured reviews and user-generated ones from storage
  const renderReviews = () => {
    const localReviews = loadLocalReviews();
    
    // Render only the local storage reviews above hardcoded ones
    localReviews.forEach(review => {
      testimonialsList.insertAdjacentHTML('afterbegin', createReviewCardHTML(review));
    });
  };

  // Render existing local reviews on page load
  renderReviews();

  // --- Form Submission Handling ---
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = reviewName.value.trim();
      const location = reviewLocation.value.trim();
      const text = reviewText.value.trim();
      let isValid = true;

      // Validation checks
      if (!name) {
        reviewName.parentElement.classList.add('invalid');
        nameError.style.display = 'block';
        isValid = false;
      } else {
        reviewName.parentElement.classList.remove('invalid');
        nameError.style.display = 'none';
      }

      if (selectedRating === 0) {
        ratingError.style.display = 'block';
        isValid = false;
      } else {
        ratingError.style.display = 'none';
      }

      if (!text) {
        reviewText.parentElement.classList.add('invalid');
        textError.style.display = 'block';
        isValid = false;
      } else {
        reviewText.parentElement.classList.remove('invalid');
        textError.style.display = 'none';
      }

      if (isValid) {
        // Create new review object
        const newReview = {
          name,
          location,
          rating: selectedRating,
          text,
          date: new Date().toISOString()
        };

        // Save review
        saveLocalReview(newReview);

        // Prepend to UI list with anim
        testimonialsList.insertAdjacentHTML('afterbegin', createReviewCardHTML(newReview));

        // Reset form & star rating selection
        reviewForm.reset();
        selectedRating = 0;
        if (starRatingInput) {
          const stars = starRatingInput.querySelectorAll('.star-btn');
          stars.forEach(star => star.classList.remove('active'));
        }

        // Show success banner
        reviewSuccess.classList.remove('hidden');
        reviewForm.classList.add('hidden');

        // Hide success banner and restore form after 4 seconds
        setTimeout(() => {
          reviewSuccess.classList.add('hidden');
          reviewForm.classList.remove('hidden');
        }, 4000);
      }
    });

    // Clear validation error styling dynamically
    reviewName.addEventListener('input', () => {
      reviewName.parentElement.classList.remove('invalid');
      nameError.style.display = 'none';
    });

    reviewText.addEventListener('input', () => {
      reviewText.parentElement.classList.remove('invalid');
      textError.style.display = 'none';
    });
  }
});
