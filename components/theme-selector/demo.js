import { ThemeSelector } from 'theme-selector';

const popoverPolyfillStyles = document.createElement('link');
popoverPolyfillStyles.setAttribute('rel', 'stylesheet');
popoverPolyfillStyles.setAttribute('src', '/_common/polyfills/popover.css');
document.head.appendChild(popoverPolyfillStyles);

const anchorPolyfillScript = document.createElement('script');
anchorPolyfillScript.setAttribute('type', 'module');
anchorPolyfillScript.innerHTML = `
  if (!("anchorName" in document.documentElement.style)) {
    const { default: polyfill } = await import('css-anchor-polyfill');
    polyfill();
  }
`;
document.head.appendChild(anchorPolyfillScript);

ThemeSelector.addTheme('blue', { fr: 'Bleue', en: 'Blue' });

// Detects theme changes
window.addEventListener('themechange', event => {
  const html = document.documentElement;
  html.dataset.theme = event.detail.theme;
});