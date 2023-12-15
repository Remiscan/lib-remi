import { ThemeSelector } from 'theme-selector';

ThemeSelector.addTheme('blue', { fr: 'Bleu clair', en: 'Light blue' });

// Detects theme changes
window.addEventListener('themechange', event => {
  const html = document.documentElement;
  html.dataset.theme = event.detail.theme;
});