import 'popover-polyfill';
import { getOsTheme } from 'theme-utils';
import translationObserver from 'translation-observer';



function makeThemeInput(name, colorScheme) {
  return /*html*/`
    <label for="theme-${name}" part="input-label">
      <input type="radio" part="input-radio" name="theme" id="theme-${name}" value="${name}" data-color-scheme="${colorScheme}">
      <span part="theme-name" data-string="theme-${name}"></span>
      <span part="theme-cookie-star">*</span>
    </label>
  `;
}


function addPart(element, part) {
  const parts = new Set((element.getAttribute('part') ?? '').split(' '));
  parts.add(part);
  element.setAttribute('part', [...parts].join(' '));
}

function deletePart(element, part) {
  const parts = new Set((element.getAttribute('part') ?? '').split(' '));
  parts.delete(part);
  element.setAttribute('part', [...parts].join(' '));
}



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <form name="theme" action="" part="form">
    <fieldset part="selector">
      <legend part="selector-title">
        <span part="selector-title-text" data-string="selector-title"></span>
      </legend>

      <div part="selector-choices">
        ${makeThemeInput('auto', 'auto')}
        ${makeThemeInput('light', 'light')}
        ${makeThemeInput('dark', 'dark')}
      </div>

      <span part="selector-cookie-notice" data-string="cookie-notice"></span>
    </fieldset>
  </form>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host {
    color: inherit !important; /* to override popover polyfill styles */
    font: inherit;
    color-scheme: inherit;
  }
  
  [part="selector"] {
    display: flex;
    border: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    flex-direction: column;
  }

  [part="selector-title"] {
    display: contents;
    border: none;
    padding: 0;
  }

  [part="selector-title-text"] {
    border-bottom: 1px solid;
    text-align: center;
  }

  [part="selector-choices"] {
    display: grid;
    grid-template-columns: 1fr;
  }

  [part="selector > *:first-child"],
  [part="selector-title"],
  [part="selector-cookie-notice"] {
    grid-column: 1 / -1;
  }

  [part="selector-choices"] > input {
    grid-column: 1;
  }

  [part="selector-choices"] > label {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
  }

  [part="selector-choices"] > label:not(:first-of-type) {
    border-top: 1px dashed;
  }

  @media (any-pointer: coarse) {
    [part="selector-choices"] > label {
      min-height: 44px;
    }
  }

  :host(:not([cookie])) [part="theme-cookie-star"],
  :host(:not([cookie])) [part="selector-cookie-notice"] {
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



const supportedThemes = new Map();
supportedThemes.set('auto', { name: 'auto', colorScheme: 'auto' });
supportedThemes.set('light', { name: 'light', colorScheme: 'light' });
supportedThemes.set('dark', { name: 'dark', colorScheme: 'dark' });



export class ThemeSelectorList extends HTMLElement {
  changeHangler = async (event) => {
    const form = this.shadow.querySelector('form');
    const formData = new FormData(form);
    const theme = formData.get('theme');

    const input = form.querySelector(`input[value="${theme}"]`);
    const label = form.querySelector(`label[for="theme-${theme}"]`);
    const colorScheme = input.getAttribute('data-color-scheme');

    form.querySelectorAll('input').forEach(i => {
      if (i === input) addPart(i, 'input-checked');
      else deletePart(i, 'input-checked');
    });

    form.querySelectorAll('label').forEach(l => {
      if (l === label) addPart(l, 'input-checked');
      else deletePart(l, 'input-checked');
    });
    
    window.dispatchEvent(new CustomEvent('themechange', {
      bubbles: true,
      detail: {
        theme,
        resolvedTheme: ThemeSelectorList.resolve(theme),
        colorScheme,
        resolvedColorScheme: ThemeSelectorList.resolve(colorScheme)
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


  static get supportedThemes() { return supportedThemes; }


  /**
   * Adds a theme to the theme selector.
   * @param {string} name - The name of the added theme.
   * @param {object} translatedNames - An object with languages as keys, theme name translations as values (for example { en: "Blue", fr: "Bleue" }).
   * @param {'light'|'dark'} colorScheme - The color scheme applied with the theme: light or dark.
   */
  static addTheme(name, translatedNames, colorScheme = 'light') {
    for (const lang of Object.keys(strings)) {
      strings[lang][`theme-${name}`] = translatedNames[lang];
    }

    for (const selector of [...document.querySelectorAll('theme-selector-list')]) {
      const alreadyHasTheme = selector.shadow.querySelector(`#theme-${name}`);
      if (alreadyHasTheme) return;
      
      const selectorChoices = selector.shadow.querySelector('[part="selector-choices"]');
      selectorChoices.innerHTML += makeThemeInput(name, colorScheme);

      translationObserver.translate(selector, strings);
      supportedThemes.set(name, { name, colorScheme });
    }
  }


  silentlySelectTheme(theme) {
    const input = this.shadow.querySelector(`input[value="${theme}"]`);
    if (input) input.checked = true;
  }


  passStateToParts() {
    const form = this.shadow.querySelector('form');
    const input = form.querySelector(`input:checked, input[checked]`);
    const label = form.querySelector(`label[for="theme-${input.getAttribute('value')}"]`);

    form.querySelectorAll('input').forEach(i => {
      if (i === input) addPart(i, 'input-checked');
      else deletePart(i, 'input-checked');
    });

    form.querySelectorAll('label').forEach(l => {
      if (l === label) addPart(l, 'input-checked');
      else deletePart(l, 'input-checked');
    });
  }


  /** Returns the default theme (l) */
  static get defaultTheme() {
    return this.getAttribute('default') === 'dark' ? 'dark' : 'light';
  }


  /** Resolves which theme will be applied (in case of auto). */
  static resolve(theme) {
    if (theme === 'auto') return getOsTheme() || ThemeSelectorList.defaultTheme;
    if (supportedThemes.has(theme)) return theme;
    else return getOsTheme() || ThemeSelectorList.defaultTheme;
  }


  connectedCallback() {
    translationObserver.serve(this, { method: 'attribute' });

    // Check the current selected theme, if any
    const root = document.documentElement;
    const currentTheme = root.dataset.theme || 'auto';
    const input = this.shadow.querySelector(`input[value="${currentTheme}"]`);
    input.setAttribute('checked', 'true'); // use attribute instead of checked property because it's not rendered yet
    const label = this.shadow.querySelector(`label[for="theme-${currentTheme}"]`);
    addPart(label, 'input-checked');

    // Monitor the choice of theme
    const form = this.shadow.querySelector('form');
    form.addEventListener('change', this.changeHangler);

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
      } break;
    }
  }
}

if (!customElements.get('theme-selector-list')) customElements.define('theme-selector-list', ThemeSelectorList);