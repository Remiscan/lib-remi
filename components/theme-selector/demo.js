import { ThemeSelector } from 'theme-selector';

const anchorPolyfillScript = document.createElement('script');
anchorPolyfillScript.setAttribute('type', 'module');
anchorPolyfillScript.innerHTML = `
  if (!("anchorName" in document.documentElement.style)) {
    window.UPDATE_ANCHOR_ON_ANIMATION_FRAME = true;
    import('css-anchor-polyfill');
  }
`;
document.head.appendChild(anchorPolyfillScript);

ThemeSelector.addTheme('blue', { fr: 'Bleue', en: 'Blue' });

// Detects theme changes
window.addEventListener('themechange', event => {
  const html = document.documentElement;
  html.dataset.theme = event.detail.theme;
});