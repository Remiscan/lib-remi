// ▼ ES modules cache-busted grâce à PHP
/*<?php ob_start();?>*/

import Theme from './theme.js.php';

/*<?php $imports = ob_get_clean();
require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
echo versionizeFiles($imports, __DIR__); ?>*/



const css = `
<?php include './style.css.php'; ?>
`;

const html = `
<?php include './element.html'; ?>
`;



let cssReady = false;
const focusableQuery = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';



class ThemeSelector extends HTMLElement {
  constructor() {
    super();
  }

  // Correctly position the options menu
  fixSelectorPosition() {
    const selector = this.querySelector('.selector');
    const coords = selector.getBoundingClientRect();
    const button = this.querySelector('button');
    const buttonWidth = button.getBoundingClientRect().width;

    let verticalPosition = 'bottom';
    if (window.scrollY + coords.bottom > document.body.offsetHeight)      verticalPosition = 'top';
    let horizontalPosition = 'center';
    let shift = 0; // sera négatif
    if (window.scrollX + coords.left < 0) {
      horizontalPosition = 'right';
      shift = -.5 * (coords.width - buttonWidth) + window.scrollX - coords.left;
    }
    else if (window.scrollX + coords.right > document.body.offsetWidth) {
      horizontalPosition = 'left';
      shift = -.5 * (coords.width - buttonWidth) + window.scrollX + coords.right - document.body.offsetWidth;
    }
    //shift = Math.max(-1 * maxShift, Math.min(shift, 0));

    selector.dataset.vertical = verticalPosition;
    selector.dataset.horizontal = horizontalPosition;
    selector.style.setProperty('--shift', shift);
  }

  // Open the options menu
  open() {
    // Disable focus outside the menu
    const focusableElements = [...document.querySelectorAll(focusableQuery)];
    for (const element of focusableElements) {
      element.dataset.previousTabindex = element.tabIndex;
      element.tabIndex = -1;
    }
    // Enable focus inside the menu
    const focusableMenuElements = [...this.querySelectorAll(focusableQuery)];
    for (const element of focusableMenuElements) {
      element.dataset.previousTabindex = element.tabIndex;
      element.tabIndex = 0;
    }
    // Place focus on checked input
    this.querySelector('input[type="radio"]:checked').focus();
    // Listens to inputs to close the menu
    const closeMenu = event => {
      console.log(event);
      if (event.type == 'keydown' && !['Escape', 'Esc'].includes(event.key)) return;
      if (event.type != 'keydown' && event.path.includes(this)) return;
      event.stopPropagation();
      this.close();
      window.removeEventListener(event.type, closeMenu);
    };
    window.addEventListener('click', closeMenu);
    window.addEventListener('keydown', closeMenu);
    // Display the menu
    this.setAttribute('open', 'true');
  }

  // Close the options menu
  close() {
    // Restore previous focusability
    const focusableElements = [...document.querySelectorAll(focusableQuery)];
    for (const element of focusableElements) {
      element.tabIndex = element.dataset.previousTabindex;
      element.removeAttribute('data-previous-tabindex');
    }
    this.querySelector('button').tabIndex = 0;
    // Hide the menu
    this.removeAttribute('open');
    // Place focus on the button
    this.querySelector('button').focus();
  }

  connectedCallback() {
    // Add theme-selector CSS to the page
    if (!cssReady) {
      const head = document.querySelector('head');
      const style = document.createElement('style');
      style.innerHTML = css;
      style.id = 'theme-selector-style';
      head.appendChild(style);
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

    // Make theme-selector options clickable
    for (const choice of [...selector.querySelectorAll('input')]) {
      choice.addEventListener('change', async () => Theme.set(choice.value));
    }

    // Use a resize observer to correct the position of the options menu
    const observer = new ResizeObserver(this.fixSelectorPosition.bind(this));
    observer.observe(document.body);

    // Make menu elements un-focusable
    const focusableMenuElements = [...this.querySelectorAll(focusableQuery)];
    for (const element of focusableMenuElements) {
      element.tabIndex = -1;
    }
    this.querySelector('button').tabIndex = 0;
    this.querySelector('button').removeAttribute('data-previous-tabindex');
  }
}

customElements.define("theme-selector", ThemeSelector);