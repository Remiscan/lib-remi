const css = `
<?php include './style.css.php'; ?>
`;

const html = `
<?php include './element.html'; ?>
`;



let cssReady = false;
let lastResizeTime = 0;
const focusableQuery = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
const stylesheetVersion = /*<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php'; echo '*'.'/\''.version(__DIR__, 'style.css.php').'\';/'.'*'; ?>*/



class ThemeSelector extends HTMLElement {
  constructor() {
    super();
  }


  //////////////////////////////////////
  // Correctly position the options menu
  async fixSelectorPosition() {
    // Wait until resizing is over
    const attempt = Date.now();
    lastResizeTime = attempt;
    await new Promise(resolve => setTimeout(resolve, 100));
    if (attempt != lastResizeTime) return;

    const selector = this.querySelector('.selector');
    const coords = selector.getBoundingClientRect();
    const button = this.querySelector('button');
    const buttonCoords = button.getBoundingClientRect();

    // Cancel previous correction
    selector.removeAttribute('data-vertical');
    selector.removeAttribute('data-horizontal');
    selector.style.setProperty('--shift', 0);
    await new Promise(resolve => requestAnimationFrame(resolve));

    // Calculate new correction
    let verticalPosition = 'bottom';
    if (window.scrollY + coords.bottom > document.body.offsetHeight)
      verticalPosition = 'top';
    let horizontalPosition = 'center';
    let shift = 0; // sera négatif
    if (window.scrollX + coords.left < 0) {
      horizontalPosition = 'right';
      shift = -.5 * (coords.width - buttonCoords.width) + window.scrollX - coords.left;
    }
    else if (window.scrollX + coords.right > document.body.offsetWidth) {
      horizontalPosition = 'left';
      shift = -.5 * (coords.width - buttonCoords.width) + window.scrollX + coords.right - document.body.offsetWidth;
    }

    // Apply new correction
    selector.dataset.vertical = verticalPosition;
    selector.dataset.horizontal = horizontalPosition;
    selector.style.setProperty('--shift', shift);
  }


  ////////////////////////
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


  /////////////////////////
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

    // Apply the choice of theme
    for (const choice of [...selector.querySelectorAll('input')]) {
      choice.addEventListener('change', async () => {
        window.dispatchEvent(
          new CustomEvent('themechange', {
            detail: { 
              theme: choice.value
            }
          })
        );
      });
    }

    // Position the options menu correctly
    this.fixSelectorPosition();
    window.addEventListener('resize', this.fixSelectorPosition);
    window.addEventListener('orientationchange', this.fixSelectorPosition);

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