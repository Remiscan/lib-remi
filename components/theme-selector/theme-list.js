import 'css-anchor-polyfill';
import 'popover-polyfill';
import 'theme-icon';
import { getOsTheme } from 'theme-utils';
import translationObserver from 'translation-observer';
import { disableFocusInside } from 'trap-focus';



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <form name="theme" action="">
    <fieldset class="selector">
      <legend class="selector-title">
        <span class="selector-title-text" data-string="selector-title"></span>
      </legend>

      <div class="selector-choices">
        <input type="radio" name="theme" id="theme-auto" value="auto" data-color-scheme="auto" checked>
        <label for="theme-auto">
          <span class="theme-name" data-string="theme-auto"></span>
        </label>

        <input type="radio" name="theme" id="theme-light" value="light" data-color-scheme="light">
        <label for="theme-light">
          <span class="theme-name" data-string="theme-light"></span>
          <span class="theme-cookie-star">*</span>
        </label>

        <input type="radio" name="theme" id="theme-dark" value="dark" data-color-scheme="dark">
        <label for="theme-dark">
          <span class="theme-name" data-string="theme-dark"></span>
          <span class="theme-cookie-star">*</span>
        </label>
      </div>

      <span class="selector-cookie-notice" data-string="cookie-notice"></span>
    </fieldset>
  </form>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  .selector {
    display: flex;
    border: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    flex-direction: column;
  }

  .selector-title {
    display: contents;
    border: none;
    padding: 0;
  }

  .selector-title-text {
    border-bottom: 1px solid;
    text-align: center;
  }

  .selector-choices {
    display: grid;
    grid-template-columns: auto 1fr;
  }

  .selector > *:first-child,
  .selector-title,
  .selector-cookie-notice {
    grid-column: 1 / -1;
  }

  .selector-choices > input {
    grid-column: 1;
  }

  .selector-choices > label {
    grid-column: 2;
    display: grid;
    grid-template-columns: 1fr auto;
  }

  :host(:not([cookie])) .theme-cookie-star,
  :host(:not([cookie])) .selector-cookie-notice {
    display: none;
  }
`);



const strings = {
  "fr": {
    "selector-title": "Thème",
    "theme-auto": "Suivre le réglage système",
    "theme-light": "Claire",
    "theme-dark": "Sombre",
    "cookie-notice": "* Ce choix sera stocké dans un cookie."
  },
  
  "en": {
    "selector-title": "Theme",
    "theme-auto": "Follow system setting",
    "theme-light": "Light",
    "theme-dark": "Dark",
    "cookie-notice": "* This choice will be stored in a cookie."
  }
};



export class ThemeList extends HTMLElement {
  changeHangler = async (event) => {
    const form = this.shadow.querySelector('form');
    const formData = new FormData(form);
    const theme = formData.get('theme');

    const input = form.querySelector(`input[value="${theme}"]`);
    const colorScheme = input.getAttribute('data-color-scheme');
    
    window.dispatchEvent(new CustomEvent('themechange', {
      bubbles: true,
      detail: {
        theme,
        colorScheme
      }
    }));
  }

  schemeHandler = event => {
    const autoChoice = this.shadow.querySelector('input[value="auto"]');
    const autoColorScheme = getOsTheme() ?? 'light';
    autoChoice.setAttribute('data-color-scheme', autoColorScheme);
    const root = document.documentElement;
    if (!(root.dataset.theme) || root.dataset.theme === 'auto') this.setAttribute('color-scheme', autoColorScheme);
  };

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
  }


  /**
   * Adds a theme to the theme selector.
   * @param {string} name - The name of the added theme.
   * @param {object} translatedNames - An object with languages as keys, theme name translations as values (for example { en: "Blue", fr: "Bleue" }).
   * @param {'light'|'dark'} scheme - The color scheme applied with the theme: light or dark.
   */
  static addTheme(name, translatedNames, scheme = 'light') {
    for (const lang of Object.keys(strings)) {
      strings[lang][`theme-${name}`] = translatedNames[lang];
    }

    for (const selector of [...document.querySelectorAll('theme-list')]) {
      const alreadyHasTheme = selector.shadow.querySelector(`#theme-${name}`);
      if (alreadyHasTheme) return;
      
      const selectorChoices = selector.shadow.querySelector('.selector-choices');
      selectorChoices.innerHTML += `
        <input type="radio" name="theme" id="theme-${name}" value="${name}" data-color-scheme="${scheme}">
        <label for="theme-${name}">
          <span class="theme-name" data-string="theme-${name}"></span>
          <span class="theme-cookie-star">*</span>
        </label>
      `;

      translationObserver.translate(selector, strings);
    }
  }


  connectedCallback() {
    translationObserver.serve(this, { method: 'attribute' });

    // Check the current selected theme, if any
    const root = document.documentElement;
    const currentTheme = root.dataset.theme || 'auto';
    const input = this.shadow.querySelector(`input[value="${currentTheme}"]`);
    input.checked = true;

    // Monitor the choice of theme
    const form = this.shadow.querySelector('form');
    form.addEventListener('change', this.changeHangler);

    // Disable focusability inside the theme-list
    disableFocusInside(this);

    // Remove the button's aria-label if the label is displayed
    this.attributeChangedCallback('label', null, this.getAttribute('label'));
  }


  disconnectedCallback() {
    const form = this.shadow.querySelector('form');
    form.removeEventListener('change', this.changeHangler);

    translationObserver.unserve(this);
  }


  static get observedAttributes() { return ['lang', 'color-scheme']; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'lang': {
        const lang = newValue;
        const defaultLang = 'en';
        translationObserver.translate(this, strings, lang, defaultLang);
      } break;

      case 'color-scheme': {
        const autoChoice = this.shadow.querySelector('input[value="auto"]');
        const autoColorScheme = getOsTheme() ?? 'light';
        autoChoice.setAttribute('data-color-scheme', autoColorScheme);
      }
    }
  }
}

if (!customElements.get('theme-list')) customElements.define('theme-list', ThemeList);