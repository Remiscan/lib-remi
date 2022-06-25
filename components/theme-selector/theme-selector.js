/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "theme-selector": "/_common/components/theme-selector/theme-selector.js",
    "trap-focus": "/_common/js/trap-focus.js",
    "theme-selector-styles": "/_common/components/theme-selector/styles.css.php",
    "theme-selector-strings": "/_common/components/theme-selector/strings.json",
    "theme-selector-template": "/_common/components/theme-selector/template.js",
  }
}
</script>
*/

import strings from 'theme-selector-strings' assert { type: 'json' };
import sheet from 'theme-selector-styles' assert { type: 'css' };
import template from 'theme-selector-template';
import { disableFocusInside, releaseFocusFrom, trapFocusIn } from 'trap-focus';



class ThemeSelector extends HTMLElement {
  constructor() {
    super();
    this.openHandler = () => {};
  }


  ////////////////////////
  // Open the options menu
  open() {
    // Correctly check the current theme if it has been changed by another selector
    const root = document.documentElement;
    const currentTheme = root.dataset.theme || 'auto';
    this.querySelector(`input[value="${currentTheme}"]`).checked = true;

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


  /////////////////////////
  // Close the options menu
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


  ///////////////////////////////////////////////
  // Calculates which theme 'auto' corresponds to
  static get osTheme() {
    let osTheme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches)        osTheme = 'dark';
    else if (window.matchMedia('(prefers-color-scheme: light)').matches)  osTheme = 'light';
    return osTheme;
  }
  static get defaultTheme() {
    if (this.getAttribute('default') == 'dark') return 'dark';
    else                                        return 'light';
  }
  static resolve(theme) {
    if (['light', 'dark'].includes(theme)) return theme;
    return ThemeSelector.osTheme || ThemeSelector.defaultTheme;
  }


  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    this.appendChild(template.content.cloneNode(true));
    
    const button = this.querySelector('button');
    const selector = this.querySelector('.selector');

    // Translate element content
    const lang = document.documentElement.lang || 'en';
    for (const e of [...this.querySelectorAll('[data-string]')]) {
      if (e.tagName == 'IMG') e.alt = strings[lang][e.dataset.string];
      else                    e.innerHTML = strings[lang][e.dataset.string];
    }
    for (const e of [...this.querySelectorAll('[data-label]')]) {
      e.setAttribute('aria-label', strings[lang][e.dataset.label]);
    }

    // Make theme-selector button clickable
    button.addEventListener('click', this.openHandler = event => {
      event.stopPropagation();
      if (this.getAttribute('open') == 'true')  this.close();
      else                                      this.open();
    });

    // Check the current selected theme, if any
    const root = document.documentElement;
    const currentTheme = root.dataset.theme || 'auto';
    this.querySelector(`input[value="${currentTheme}"]`).checked = true;

    // Get a unique name for this theme-selector if there are several
    const themeSelectors = document.querySelectorAll('theme-selector');
    let name = 'theme';
    for (const [k, themeSelector] of Object.entries(themeSelectors)) {
      if (themeSelector == this) name = `theme-${k}`;
    }

    // Apply the choice of theme
    for (const choice of [...selector.querySelectorAll('input')]) {
      choice.name = name;
      choice.addEventListener('change', async () => {
        root.dataset.theme = choice.value;
        const themeEvent = new CustomEvent('themechange', { detail: {
          theme: choice.value,
          resolvedTheme: ThemeSelector.resolve(choice.value)
        }});
        window.dispatchEvent(themeEvent);
      });
    }

    // Disable focusability inside the theme-selector
    disableFocusInside(this, { exceptions: [this.querySelector('button')] });
  }


  disconnectedCallback() {
    const button = this.querySelector('button');
    button.removeEventListener('click', this.openHandler);
  }
}

if (!customElements.get('theme-selector')) customElements.define('theme-selector', ThemeSelector);