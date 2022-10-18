/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "theme-selector": "/_common/components/theme-selector/theme-selector.js",
    "trap-focus": "/_common/js/trap-focus.js",
    "translation-observer": "/_common/js/translation-observer.js",
    "theme-selector-styles": "/_common/components/theme-selector/styles.css",
    "theme-selector-strings": "/_common/components/theme-selector/strings.json",
    "theme-selector-template": "/_common/components/theme-selector/template.js",
  }
}
</script>
*/

import strings from 'theme-selector-strings' assert { type: 'json' };
import sheet from 'theme-selector-styles' assert { type: 'css' };
import template from 'theme-selector-template';
import translationObserver from 'translation-observer';
import { disableFocusInside, releaseFocusFrom, trapFocusIn } from 'trap-focus';



let count = 0;



export class ThemeSelector extends HTMLElement {
  constructor() {
    super();

    this.openHandler = event => {
      //event.stopPropagation();
      if (this.getAttribute('open') == 'true')  this.close();
      else                                      this.open();
    };

    this.changeHangler = async (event) => {
      const choice = event.currentTarget;
      const root = document.documentElement;
      root.dataset.theme = choice.value;

      for (const selector of [...document.querySelectorAll('theme-selector')]) {
        selector.setAttribute('scheme', ThemeSelector.resolve(choice.getAttribute('data-scheme')));
        if (selector !== this) {
          const input = selector.querySelector(`input[value="${choice.value}"]`);
          input.checked = true;
        }
      }
      
      const themeEvent = new CustomEvent('themechange', { detail: {
        theme: choice.value,
        resolvedTheme: ['light', 'dark', 'auto'].includes(choice.value) ? ThemeSelector.resolve(choice.value) : choice.value
      }});
      window.dispatchEvent(themeEvent);
    }

    this.schemeHandler = event => {
      const autoChoice = this.querySelector('input[value="auto"]');
      const autoScheme = ThemeSelector.osTheme ?? 'light';
      autoChoice.setAttribute('data-scheme', autoScheme);
      const root = document.documentElement;
      if (root.dataset.theme === 'auto') this.setAttribute('scheme', autoScheme);
    };

    this.count = count;
    count++;
  }


  /** Opens the options menu. */
  open() {
    // Disable focus outside the menu
    trapFocusIn(this);

    // Listens to inputs to close the menu
    const closeMenu = event => {
      const eventPath = event.composedPath();
      if (event.type == 'keydown' && !['Escape', 'Esc'].includes(event.key)) return;
      if (event.type != 'keydown' && eventPath.includes(this)) return;
      event.stopPropagation();
      const button = this.querySelector('button');
      const focus = (event.type == 'click' && !eventPath.includes(button)) ? false : true;
      this.close(focus);
      window.removeEventListener(event.type, closeMenu);
    };
    window.addEventListener('click', closeMenu);
    window.addEventListener('keydown', closeMenu);
    // Display the menu
    this.setAttribute('open', 'true');
    // Place focus on checked input
    this.querySelector('input[type="radio"]:checked').focus();
  }


  /** Closes the options menu. */
  close(focus = true) {
    // Restore previous focusability
    releaseFocusFrom(this, { exceptions: [this.querySelector('button')] });
    
    const button = this.querySelector('button');
    button.tabIndex = 0;
    // Hide the menu
    this.removeAttribute('open');
    // Place focus on the button
    if (focus) button.focus();
  }


  /** Starts monitoring changes to the selected theme. */
  startMonitoringChanges() {
    for (const choice of [...this.querySelectorAll('.selector > input')]) {
      choice.addEventListener('change', this.changeHangler);
    }
  }


  /** Stops monitoring changes to the selected theme. */
  stopMonitoringChanges() {
    for (const choice of [...this.querySelectorAll('.selector > input')]) {
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
      const lastElement = selector.querySelector('.selector > :last-child');
      lastElement.outerHTML = `
        <input type="radio" name="theme-${selector.count}" id="theme-${selector.count}-${name}" value="${name}" data-scheme="${scheme}">
        <label for="theme-${selector.count}-${name}">
          <span class="theme-name" data-string="theme-${name}"></span>
          <span class="theme-cookie-star">*</span>
        </label>

        ${lastElement.outerHTML}
      `;

      translationObserver.translate(selector, strings);

      selector.stopMonitoringChanges();
      selector.startMonitoringChanges();
    }
  }


  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    const html = template.content.cloneNode(true);
    if (!this.innerHTML) {
      // Give unique name/id to elements in case there are mutiple theme-selectors
      for (const choice of [...html.querySelectorAll('input')]) {
        choice.name = `theme-${this.count}`;
        choice.id = `theme-${this.count}-${choice.value}`;
        const label = html.querySelector(`label[for="theme-${choice.value}"]`);
        label.setAttribute('for', choice.id);
      }
      this.appendChild(html);
    }

    translationObserver.serve(this, { method: 'attribute' });

    // Check the current selected theme, if any
    const root = document.documentElement;
    const currentTheme = root.dataset.theme || 'auto';
    const input = this.querySelector(`input[value="${currentTheme}"]`);
    input.checked = true;
    this.setAttribute('scheme', input.getAttribute('data-scheme') ?? 'light');

    // Make theme-selector button clickable
    const button = this.querySelector('button');
    button.addEventListener('click', this.openHandler);

    // Update icon when auto theme is selected and OS-level preference changes
    this.schemeHandler();

    // Monitor the choice of theme
    this.startMonitoringChanges();

    // Monitor OS-level user preferences changes
    for (const scheme of ['light', 'dark']) {
      window.matchMedia(`(prefers-color-scheme: ${scheme})`).addEventListener('change', this.schemeHandler);
    }

    // Disable focusability inside the theme-selector
    disableFocusInside(this, { exceptions: [this.querySelector('button')] });
  }


  disconnectedCallback() {
    const button = this.querySelector('button');
    button.removeEventListener('click', this.openHandler);

    this.stopMonitoringChanges();

    for (const scheme of ['light', 'dark']) {
      window.matchMedia(`(prefers-color-scheme: ${scheme})`).removeEventListener('change', this.schemeHandler);
    }

    translationObserver.unserve(this);
  }


  static get observedAttributes() { return ['lang']; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'lang') {
      const lang = newValue;
      const defaultLang = 'en';
      translationObserver.translate(this, strings, lang, defaultLang);
    }
  }
}

if (!customElements.get('theme-selector')) customElements.define('theme-selector', ThemeSelector);