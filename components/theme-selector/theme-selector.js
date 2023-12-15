/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "theme-selector": "/_common/components/theme-selector/theme-selector.js",
    "theme-icon": "/_common/components/theme-selector/theme-icon.js",
    "theme-selector-list": "/_common/components/theme-selector/theme-selector-list.js",
    "theme-utils": "/_common/components/theme-selector/theme-utils.js",
    "trap-focus": "/_common/js/trap-focus/mod.js",
    "translation-observer": "/_common/js/translation-observer/mod.js",
  }
}
</script>
*/

import 'popover-polyfill';
import 'theme-icon';
import { ThemeSelectorList } from 'theme-selector-list';
import { getOsTheme } from 'theme-utils';
import translationObserver from 'translation-observer';

if (!("anchorName" in document.documentElement.style)) {
  import('css-anchor-polyfill');
}



function getTemplate(key) {
  return /*html*/`
    <button id="theme-selector-${key}-button" type="button" data-label="change-theme" popovertarget="theme-selector-${key}">
      <theme-icon aria-hidden="true"></theme-icon>
      <span data-string="change-theme-short"></span>
    </button>
    <theme-selector-list id="theme-selector-${key}" popover anchor="theme-selector-${key}-button"></theme-selector-list>
  `;
}



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  @layer theme-selector {
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
      width: var(--size, 3rem);
      height: var(--size, 3rem);
    }

    theme-selector-list {
      inset: 0;
    }

    theme-selector-list::backdrop {
      background: black;
      opacity: .1;
    }

    @supports (top: anchor(auto)) {
      theme-selector-list {
        inset: revert;
        top: anchor(auto);
        right: anchor(auto-same);
      }

      theme-selector-list::backdrop {
        opacity: 0;
      }
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
    const selector = this.querySelector('theme-selector-list');

    const theme = event.detail.theme;
    const resolvedColorScheme = ThemeSelectorList.resolve(event.detail.colorScheme);

    document.documentElement.setAttribute('data-theme', theme);
    icon?.setAttribute('color-scheme', resolvedColorScheme);
    selector?.setAttribute('color-scheme', resolvedColorScheme);
    selector?.silentlySelectTheme(theme);
  };


  colorSchemeChangeHandler = event => {
    const root = document.documentElement;
    const icon = this.querySelector('theme-icon');
    const selector = this.querySelector('theme-selector-list');

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
    ThemeSelectorList.addTheme(name, translatedNames, scheme);
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

    // Set initial theme-icon color-scheme
    const root = document.documentElement;
    const currentTheme = root.dataset.theme || 'auto';
    const currentColorScheme = ThemeSelectorList.supportedThemes.get(currentTheme)?.colorScheme ?? 'auto';
    const icon = this.querySelector('theme-icon');
    icon?.setAttribute('color-scheme', ThemeSelectorList.resolve(currentColorScheme));

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


  static get observedAttributes() { return ['lang', 'label', 'icon', 'cookie', 'default']; }
  

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

      case 'cookie':
      case 'default': {
        const selector = this.querySelector('theme-selector-list');
        if (newValue != null) selector?.setAttribute(attr, newValue);
        else                  selector?.removeAttribute(attr);
      } break;
    }
  }
}

if (!customElements.get('theme-selector')) customElements.define('theme-selector', ThemeSelector);