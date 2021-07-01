let cssReady = false;
const css = `<?php include './style.css.php'; ?>`;
const html = `<?php include './element.html'; ?>`;



const focusableQuery = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';



class ThemeSelector extends HTMLElement {
  constructor() {
    super();
  }


  ////////////////////////
  // Open the options menu
  open() {
    // Correctly check the current theme if it has been changed by another selector
    const root = document.documentElement;
    const currentTheme = root.dataset.theme || 'auto';
    this.querySelector(`input[value="${currentTheme}"]`).checked = true;

    // Disable focus outside the menu
    const focusableElements = [...document.querySelectorAll(focusableQuery)];
    for (const element of focusableElements) {
      if (this.contains(element)) {
        if (element.tagName != 'BUTTON') element.tabIndex = 0;
        continue;
      }
      element.dataset.previousTabindex = element.tabIndex;
      element.tabIndex = -1;
      //element.classList.add('unusable');
    }

    // Listens to inputs to close the menu
    const closeMenu = event => {
      if (event.type == 'keydown' && !['Escape', 'Esc'].includes(event.key)) return;
      if (event.type != 'keydown' && event.path.includes(this)) return;
      event.stopPropagation();
      const button = this.querySelector('button');
      const focus = (event.type == 'click' && !event.path.includes(button)) ? false : true;
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
    const focusableElements = [...document.querySelectorAll(focusableQuery)];
    for (const element of focusableElements) {
      if (this.contains(element)) {
        if (element.tagName != 'BUTTON') element.tabIndex = -1;
        continue;
      }
      element.tabIndex = element.dataset.previousTabindex;
      element.removeAttribute('data-previous-tabindex');
      //element.classList.remove('unusable');
    }
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
    // Add theme-selector CSS to the page
    if (!cssReady) {
      const head = document.querySelector('head');
      const firstStylesheet = document.querySelector('link[rel="stylesheet"], style');
      const style = document.createElement('style');
      style.innerHTML = css;
      style.id = 'theme-selector-style';
      if (!!firstStylesheet)  head.insertBefore(style, firstStylesheet);
      else                    head.appendChild(style);
      cssReady = true;
    }
    this.innerHTML = html;

    const button = this.querySelector('button');
    const selector = this.querySelector('.selector');

    // Make theme-selector button clickable
    button.addEventListener('click', event => {
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
  }
}

if (!customElements.get('theme-selector')) customElements.define('theme-selector', ThemeSelector);