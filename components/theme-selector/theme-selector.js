/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "theme-selector": "/_common/components/theme-selector/theme-selector.js",
    "theme-icon": "/_common/components/theme-selector/theme-icon.js",
    "theme-list": "/_common/components/theme-selector/theme-list.js",
    "theme-utils": "/_common/components/theme-selector/theme-utils.js",
    "trap-focus": "/_common/js/trap-focus/mod.js",
    "translation-observer": "/_common/js/translation-observer/mod.js",
    "popover-polyfill": "/_common/polyfills/popover.min.js",
    "css-anchor-polyfill": "/_common/polyfills/css-anchor-polyfill.js"
  }
}
</script>
*/

import 'css-anchor-polyfill';
import 'popover-polyfill';
import 'theme-icon';
import { ThemeList } from 'theme-list';
import { getOsTheme } from 'theme-utils';
import translationObserver from 'translation-observer';



function getTemplate(key) {
  return /*html*/`
    <button id="theme-selector-${key}-button" type="button" data-label="change-theme" popovertarget="theme-selector-${key}">
      <theme-icon aria-hidden="true"></theme-icon>
      <span data-string="change-theme-short"></span>
    </button>
    <theme-list id="theme-selector-${key}" popover anchor="theme-selector-${key}-button"></theme-list>
  `;
}



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  theme-selector > button {
    border: none;
    background-color: transparent;
    padding: 0;
    margin: 0;
    font: inherit;
    line-height: inherit;
    text-transform: none;
    cursor: pointer;
    color-scheme: light dark;

    display: grid;
    align-items: center;
    gap: 1ch;
    color: currentColor;
  }

  theme-selector > button > * {
    grid-row: 1;
  }

  theme-selector:not([label]) > button > span {
    display: none;
  }

  theme-icon {
    pointer-events: none; /* without this, blocks clicks in Firefox */
    --size: 3rem;
    width: var(--size);
    height: var(--size);
  }

  theme-list {
    position-fallback: --auto-position;
  }

  @position-fallback --auto-position {
    /* Next try to align the top, right edge of the target
       with the bottom, right edge of the anchor. */
    @try {
      top: anchor(implicit bottom);
      right: anchor(implicit right);
    }

    /* Next try to align the top, left edge of the target
       with the bottom, left edge of the anchor. */
    @try {
      top: anchor(implicit bottom);
      left: anchor(implicit left);
    }

    /* Next try to align the bottom, right edge of the target
       with the top, right edge of the anchor. */
    @try {
      bottom: anchor(implicit top);
      right: anchor(implicit right);
    }
  
    /* Next try to align the bottom, left edge of the target
       with the top, left edge of the anchor. */
    @try {
      bottom: anchor(implicit top);
      left: anchor(implicit left);
    }
  }
`);



const strings = {
  "fr": {
    "change-theme": "Changer la palette de couleurs de la page",
    "change-theme-short": "Thème"
  },
  
  "en": {
    "change-theme": "Change the page's color scheme",
    "change-theme-short": "Theme"
  }
};



let i = 0;
export class ThemeSelector extends HTMLElement {
  themeChangeHandler = event => {
    const icon = this.querySelector('theme-icon');
    const selector = this.querySelector('theme-list');

    const theme = event.detail.theme;
    const resolvedTheme = ['light', 'dark', 'auto'].includes(theme) ? ThemeSelector.resolve(theme) : theme;
    const resolvedColorScheme = ThemeSelector.resolve(event.detail.colorScheme);

    document.documentElement.setAttribute('data-theme', theme);
    icon?.setAttribute('color-scheme', resolvedColorScheme);
    selector?.setAttribute('color-scheme', resolvedColorScheme);
    selector?.setAttribute('selected-theme', resolvedTheme);
  };


  colorSchemeChangeHandler = event => {
    const root = document.documentElement;
    const icon = this.querySelector('theme-icon');
    const selector = this.querySelector('theme-list');

    const autoColorScheme = getOsTheme() ?? 'light';
    if (!(root.dataset.theme) || root.dataset.theme === 'auto') {
      icon?.setAttribute('color-scheme', autoColorScheme);
      selector?.setAttribute('color-scheme', autoColorScheme);
    }
  };


  constructor() {
    super();
    this.key = i;
    i++;
  }


  static addTheme(name, translatedNames, scheme = 'light') {
    ThemeList.addTheme(name, translatedNames, scheme = 'light');
  }


  /** Returns the default theme (l) */
  static get defaultTheme() {
    return this.getAttribute('default') === 'dark' ? 'dark' : 'light';
  }


  /** Resolves which theme will be applied (in case of auto). */
  static resolve(theme) {
    if (['light', 'dark'].includes(theme)) return theme;
    return getOsTheme() || ThemeSelector.defaultTheme;
  }


  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    if (!this.innerHTML) {
      this.innerHTML = getTemplate(this.key);

      // Remove the button's aria-label if the label is displayed
      ThemeSelector.observedAttributes.forEach(attr => {
        this.attributeChangedCallback(attr, null, this.getAttribute(attr));
      });
    }

    translationObserver.serve(this, { method: 'attribute' });
    window.addEventListener('themechange', this.themeChangeHandler);

    // Update icon when auto theme is selected and OS-level preference changes
    this.colorSchemeChangeHandler();

    // Monitor OS-level user preferences changes
    for (const scheme of ['light', 'dark']) {
      window.matchMedia(`(prefers-color-scheme: ${scheme})`).addEventListener('change', this.colorSchemeChangeHandler);
    }
  }


  disconnectedCallback() {
    translationObserver.unserve(this);
    window.removeEventListener('themechange', this.themeChangeHandler);

    for (const scheme of ['light', 'dark']) {
      window.matchMedia(`(prefers-color-scheme: ${scheme})`).removeEventListener('change', this.colorSchemeChangeHandler);
    }
  }


  static get observedAttributes() { return ['lang', 'label', 'icon', 'cookie']; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'lang': {
        const lang = newValue;
        const defaultLang = 'en';
        translationObserver.translate(this, strings, lang, defaultLang);
      } break;

      case 'label': {
        const button = this.querySelector('button');
        if (!button) return;
        // If label shown, don't use aria-label
        if (newValue !== null) {
          button.removeAttribute('data-label');
          button.removeAttribute('aria-label');
        } else {
          button.setAttribute('data-label', 'change-theme');
          translationObserver.translate(this, strings, this.getAttribute('lang'));
        }
      } break;

      case 'icon': {
        const icon = this.querySelector('theme-icon');
        if (newValue != null) icon?.setAttribute('icon', newValue);
        else                  icon?.removeAttribute('icon');
      } break;

      case 'cookie': {
        const selector = this.querySelector('theme-list');
        if (newValue != null) selector?.setAttribute('cookie', newValue);
        else                  selector?.removeAttribute('cookie');
      }
    }
  }
}

if (!customElements.get('theme-selector')) customElements.define('theme-selector', ThemeSelector);