/**
 * Theme Manager for Chucherías Circo
 * Handles Light, Dark, and System Auto theme settings with local storage persistence.
 */

(function () {
  const THEME_KEY = 'circo-theme';
  const html = document.documentElement;

  // Retrieve theme preference or default to 'auto'
  const getSavedTheme = () => localStorage.getItem(THEME_KEY) || 'auto';

  // Apply theme to the document element
  const applyTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    
    let resolvedTheme = theme;
    if (theme === 'auto') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (resolvedTheme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    
    // Highlight the active button in the selector UI
    updateThemeSelectorUI(theme);
  };

  // Update button active state in the floating selector UI
  const updateThemeSelectorUI = (theme) => {
    const buttons = document.querySelectorAll('.theme-btn');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      if (btn.getAttribute('data-theme-value') === theme) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  };

  // Initialize theme immediately to prevent layout flashing
  const currentTheme = getSavedTheme();
  applyTheme(currentTheme);

  // Watch for system color scheme changes if set to 'auto'
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (getSavedTheme() === 'auto') {
      applyTheme('auto');
    }
  });

  // Bind events and update UI once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    updateThemeSelectorUI(getSavedTheme());

    // Delegate click events on theme selector buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-btn');
      if (btn) {
        const theme = btn.getAttribute('data-theme-value');
        localStorage.setItem(THEME_KEY, theme);
        applyTheme(theme);
      }
    });
  });
})();
