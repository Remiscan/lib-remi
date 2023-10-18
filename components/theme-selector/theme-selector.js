/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "theme-selector": "/_common/components/theme-selector/theme-selector.js",
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
import translationObserver from 'translation-observer';
import { disableFocusInside } from 'trap-focus';



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button type="button" data-label="change-theme" popovertarget="selector">
    <svg viewBox="0 0 120 120">
      <defs>
        <mask id="sun-mask">
          <rect x="0" y="0" width="120" height="120" fill="black"/>
          <circle class="sun-size" cx="60" cy="60" r="50" fill="white" transform-origin="60 60"/>
          <circle class="moon-hole" cx="90" cy="30" r="40" fill="black" transform-origin="120 0"/>
        </mask>
      </defs>

      <g class="sun-rays" transform-origin="50% 50%">
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 1">
          <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 3">
          <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10" transform="rotate(90 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 5">
          <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10" transform="rotate(180 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 7">
          <path d="M 60 10 L 60 24" stroke-linecap="round" stroke-width="10" transform="rotate(270 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 2; --m: 1;">
          <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(45 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 4; --m: 1;">
          <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(135 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 6; --m: 1;">
          <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(225 60 60)"/>
        </g>
        <g class="ray" width="120" height="120" transform-origin="60 60" style="--n: 8; --m: 1;">
          <path d="M 60 13 L 60 19" stroke-linecap="round" stroke-width="10" transform="rotate(315 60 60)"/>
        </g>
      </g>
      <rect class="sun" x="0" y="0" width="120" height="120" transform-origin="50% 50%" mask="url(#sun-mask)"/>
    </svg>

    <span data-string="change-theme-short"></span>
  </button>

  <fieldset popover id="selector" class="selector" aria-hidden="true">
    <legend class="selector-title">
      <span class="selector-title-text" data-string="selector-title"></span>
    </legend>

    <div class="selector-choices">
      <input type="radio" name="theme" id="theme-auto" value="auto" data-scheme="auto" checked>
      <label for="theme-auto">
        <span class="theme-name" data-string="theme-auto"></span>
      </label>

      <input type="radio" name="theme" id="theme-light" value="light" data-scheme="light">
      <label for="theme-light">
        <span class="theme-name" data-string="theme-light"></span>
        <span class="theme-cookie-star">*</span>
      </label>

      <input type="radio" name="theme" id="theme-dark" value="dark" data-scheme="dark">
      <label for="theme-dark">
        <span class="theme-name" data-string="theme-dark"></span>
        <span class="theme-cookie-star">*</span>
      </label>
    </div>

    <span class="selector-cookie-notice" data-string="cookie-notice"></span>
  </fieldset>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  button {
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
    grid-template-columns: var(--size) auto;
    align-items: center;
    gap: 1ch;
    color: currentColor;

    anchor-name: --theme-selector-button;
  }

  :host(:not([label])) > button {
    grid-template-columns: var(--size) 0;
    gap: 0;
  }

  :host {
    display: grid;
    place-items: center;
    position: relative;
    --size: 3rem;
  }

  :host(:not([label])) > button > span {
    display: none;
  }

  svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    fill: var(--primary-color, var(--default-color));
    --sun-resize: .5s;
    --moon-hole-apparition: .5s;
    --moon-hole-disparition: .3s;
  }

  .ray > path {
    stroke: var(--secondary-color, var(--default-color));
  }

  .sun-size,
  .moon-hole {
    will-change: transform;
    transform-style: preserve-3d;
  }

  .unusable {
    pointer-events: none !important;
  }



  /*************/
  /* ANIMATION */
  /*************/


  /************************************/
  /* Thème clair - on affiche la lune */
  /************************************/

  :host([scheme="light"]) {
    --default-color: black;
  }

  /* Si on affiche l'icône du thème en cours */

  /* - Étape 1 : la lune devient soleil */
  :host([scheme="light"]) .moon-hole {
    transform: translate(40%, -40%);
    transition: transform var(--moon-hole-disparition) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : le soleil rétrécit */
  :host([scheme="light"]) .sun {
    transform: scale(.5);
    transition: transform var(--sun-resize) ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition));
  }

  /* - Étape 3 : les rayons apparaissent */
  :host([scheme="light"]) .ray {
    opacity: 1;
    transform: scale(1);
    transition: transform .3s ease,
                opacity .3s ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition) + .2s + var(--m, 0) * 60ms);
  }

  /* Si on affiche l'icône du thème opposé */

  /* - Étape 1 : le soleil s'agrandit */
  :host([scheme="light"][icon="reverse"]) .sun {
    transform: scale(1);
    transition: transform var(--sun-resize) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : les rayons disparaissent */
  :host([scheme="light"][icon="reverse"]) .ray {
    opacity: 0;
    transform: scale(.5);
    transition: transform .15s ease-in,
                opacity .15s ease-in;
    transition-delay: 0s;
  }

  /* - Étape 3 : le soleil devient lune */
  :host([scheme="light"][icon="reverse"]) .moon-hole {
    transform: translate(0, 0);
    transition: transform var(--moon-hole-apparition) ease;
    transition-delay: calc(.5 * var(--sun-resize));
  }


  /***************************************/
  /* Thème sombre - on affiche le soleil */
  /***************************************/

  :host([scheme="dark"]) {
    --default-color: white;
  }

  /* Si on affiche l'icône du thème en cours */

  /* - Étape 1 : le soleil s'agrandit */
  :host([scheme="dark"]) .sun {
    transform: scale(1);
    transition: transform var(--sun-resize) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : les rayons disparaissent */
  :host([scheme="dark"]) .ray {
    opacity: 0;
    transform: scale(.5);
    transition: transform .15s ease-in,
                opacity .15s ease-in;
    transition-delay: 0s;
  }

  /* - Étape 3 : le soleil devient lune */
  :host([scheme="dark"]) .moon-hole {
    transform: translate(0, 0);
    transition: transform var(--moon-hole-apparition) ease;
    transition-delay: calc(.5 * var(--sun-resize));
  }

  /* Si on affiche l'icône du thème opposé */

  /* - Étape 1 : la lune devient soleil */
  :host([scheme="dark"][icon="reverse"]) .moon-hole {
    transform: translate(40%, -40%);
    transition: transform var(--moon-hole-disparition) ease;
    transition-delay: 0s;
  }

  /* - Étape 2 : le soleil rétrécit */
  :host([scheme="dark"][icon="reverse"]) .sun {
    transform: scale(.5);
    transition: transform var(--sun-resize) ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition));
  }

  /* - Étape 3 : les rayons apparaissent */
  :host([scheme="dark"][icon="reverse"]) .ray {
    opacity: 1;
    transform: scale(1);
    transition: transform .3s ease,
                opacity .3s ease;
    transition-delay: calc(.5 * var(--moon-hole-disparition) + .2s + var(--m, 0) * 60ms);
  }



  /**********/
  /* POP-UP */
  /**********/

  .selector {
    border: none;
    padding: 0;
    flex-direction: column;
    position: absolute;
    top: anchor(--theme-selector-button bottom);
    left: anchor(--theme-selector-button left);
  }

  .selector:is(:popover-open, [open]) {
    display: flex;
  }

  :host([open="true"]) > .selector {
    opacity: 1;
    pointer-events: auto;
  }

  .selector-title {
    display: contents;
    border: none;
    padding: 0;
  }

  .selector-title-text {
    border-bottom: 1px solid;
    padding: 10px;
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

  .selector-choices > label > span {
    line-height: 1em;
  }

  /*theme-selector[position="bottom"] > .selector {
    top: 100%;
  }
  theme-selector[position="top"] > .selector {
    top: unset;
    bottom: 100%;
  }
  theme-selector[position="left"] > .selector {
    top: unset;
    right: 100%;
  }
  theme-selector[position="right"] > .selector {
    top: unset;
    left: 100%;
  }*/

  :host(:not([cookie])) .theme-cookie-star,
  :host(:not([cookie])) .selector-cookie-notice {
    display: none;
  }
`);



const strings = {
  "fr": {
    "change-theme": "Changer la palette de couleurs de la page",
    "change-theme-short": "Thème",
    "selector-title": "Thème",
    "theme-auto": "Suivre le réglage système",
    "theme-light": "Claire",
    "theme-dark": "Sombre",
    "cookie-notice": "* Ce choix sera stocké dans un cookie."
  },
  
  "en": {
    "change-theme": "Change the page's color scheme",
    "change-theme-short": "Theme",
    "selector-title": "Theme",
    "theme-auto": "Follow system setting",
    "theme-light": "Light",
    "theme-dark": "Dark",
    "cookie-notice": "* This choice will be stored in a cookie."
  }
};



export class ThemeSelector extends HTMLElement {
  openHandler = event => {
    //event.stopPropagation();
    if (this.getAttribute('open') == 'true')  this.close();
    else                                      this.open();
  };

  changeHangler = async (event) => {
    const choice = event.currentTarget;
    const root = document.documentElement;
    root.dataset.theme = choice.value;

    for (const selector of [...document.querySelectorAll('theme-selector')]) {
      selector.setAttribute('scheme', ThemeSelector.resolve(choice.getAttribute('data-scheme')));
      if (selector !== this) {
        const input = selector.shadow.querySelector(`input[value="${choice.value}"]`);
        input.checked = true;
      }
    }
    
    const themeEvent = new CustomEvent('themechange', { detail: {
      theme: choice.value,
      resolvedTheme: ['light', 'dark', 'auto'].includes(choice.value) ? ThemeSelector.resolve(choice.value) : choice.value
    }});
    window.dispatchEvent(themeEvent);
  }

  schemeHandler = event => {
    const autoChoice = this.shadow.querySelector('input[value="auto"]');
    const autoScheme = ThemeSelector.osTheme ?? 'light';
    autoChoice.setAttribute('data-scheme', autoScheme);
    const root = document.documentElement;
    if (!(root.dataset.theme) || root.dataset.theme === 'auto') this.setAttribute('scheme', autoScheme);
  };

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
  }


  /** Opens the options menu. */
  /*open() {
    const selector = this.shadow.querySelector('.selector');
    selector.removeAttribute('aria-hidden');
    
    // Disable focus outside the menu
    trapFocusIn(this);

    // Listens to inputs to close the menu
    const closeMenu = event => {
      const eventPath = event.composedPath();
      if (event.type == 'keydown' && !['Escape', 'Esc'].includes(event.key)) return;
      if (event.type != 'keydown' && eventPath.includes(this)) return;
      event.stopPropagation();
      const button = this.shadow.querySelector('button');
      const focus = (event.type == 'click' && !eventPath.includes(button)) ? false : true;
      this.close(focus);
      window.removeEventListener(event.type, closeMenu);
    };
    window.addEventListener('click', closeMenu);
    window.addEventListener('keydown', closeMenu);
    // Display the menu
    this.setAttribute('open', 'true');
    // Place focus on checked input
    this.shadow.querySelector('input[type="radio"]:checked').focus();
  }*/


  /** Closes the options menu. */
  /*close(focus = true) {
    // Restore previous focusability
    releaseFocusFrom(this, { exceptions: [this.shadow.querySelector('button')] });

    const selector = this.shadow.querySelector('.selector');
    selector.setAttribute('aria-hidden', 'true');
    
    const button = this.shadow.querySelector('button');
    button.tabIndex = 0;
    // Hide the menu
    this.removeAttribute('open');
    // Place focus on the button
    if (focus) button.focus();
  }*/


  /** Starts monitoring changes to the selected theme. */
  startMonitoringChanges() {
    for (const choice of [...this.shadow.querySelectorAll('.selector-choices > input')]) {
      choice.addEventListener('change', this.changeHangler);
    }
  }


  /** Stops monitoring changes to the selected theme. */
  stopMonitoringChanges() {
    for (const choice of [...this.shadow.querySelectorAll('.selector-choices > input')]) {
      choice.removeEventListener('change', this.changeHangler);
    }
  }


  /** Calculates which theme 'auto' corresponds to. */
  static get osTheme() {
    let osTheme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches)        osTheme = 'dark';
    else if (window.matchMedia('(prefers-color-scheme: light)').matches)  osTheme = 'light';
    return osTheme;
  }


  /** Returns the default theme (l) */
  static get defaultTheme() {
    return this.getAttribute('default') === 'dark' ? 'dark' : 'light';
  }


  /** Resolves which theme will be applied (in case of auto). */
  static resolve(theme) {
    if (['light', 'dark'].includes(theme)) return theme;
    return ThemeSelector.osTheme || ThemeSelector.defaultTheme;
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

    for (const selector of [...document.querySelectorAll('theme-selector')]) {
      const alreadyHasTheme = selector.shadow.querySelector(`#theme-${name}`);
      if (alreadyHasTheme) return;
      
      const selectorChoices = selector.shadow.querySelector('.selector-choices');
      selectorChoices.innerHTML += `
        <input type="radio" name="theme" id="theme-${name}" value="${name}" data-scheme="${scheme}">
        <label for="theme-${name}">
          <span class="theme-name" data-string="theme-${name}"></span>
          <span class="theme-cookie-star">*</span>
        </label>
      `;

      translationObserver.translate(selector, strings);

      selector.stopMonitoringChanges();
      selector.startMonitoringChanges();
    }
  }


  connectedCallback() {
    // Add HTML and CSS to the element
    /*if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    const html = template.content.cloneNode(true);
    if (!this.innerHTML) {
      // Give unique name/id to elements in case there are mutiple theme-selectors
      for (const choice of [...html.querySelectorAll('input')]) {
        choice.name = `theme`;
        choice.id = `theme-${choice.value}`;
        const label = html.querySelector(`label[for="theme-${choice.value}"]`);
        label.setAttribute('for', choice.id);
      }
      this.appendChild(html);
    }*/

    translationObserver.serve(this, { method: 'attribute' });

    // Check the current selected theme, if any
    const root = document.documentElement;
    const currentTheme = root.dataset.theme || 'auto';
    const input = this.shadow.querySelector(`input[value="${currentTheme}"]`);
    input.checked = true;
    this.setAttribute('scheme', input.getAttribute('data-scheme') ?? 'light');

    // Make theme-selector button clickable
    const button = this.shadow.querySelector('button');
    //button.addEventListener('click', this.openHandler);

    // Update icon when auto theme is selected and OS-level preference changes
    this.schemeHandler();

    // Monitor the choice of theme
    this.startMonitoringChanges();

    // Monitor OS-level user preferences changes
    for (const scheme of ['light', 'dark']) {
      window.matchMedia(`(prefers-color-scheme: ${scheme})`).addEventListener('change', this.schemeHandler);
    }

    // Disable focusability inside the theme-selector
    disableFocusInside(this, { exceptions: [this.shadow.querySelector('button')] });

    // Remove the button's aria-label if the label is displayed
    this.attributeChangedCallback('label', null, this.getAttribute('label'));
  }


  disconnectedCallback() {
    const button = this.shadow.querySelector('button');
    //button.removeEventListener('click', this.openHandler);

    this.stopMonitoringChanges();

    for (const scheme of ['light', 'dark']) {
      window.matchMedia(`(prefers-color-scheme: ${scheme})`).removeEventListener('change', this.schemeHandler);
    }

    translationObserver.unserve(this);
  }


  static get observedAttributes() { return ['lang', 'label']; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'lang': {
        const lang = newValue;
        const defaultLang = 'en';
        translationObserver.translate(this, strings, lang, defaultLang);
      } break;

      case 'label': {
        const button = this.shadow.querySelector('button');
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
    }
  }
}

if (!customElements.get('theme-selector')) customElements.define('theme-selector', ThemeSelector);