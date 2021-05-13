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



class ThemeSelector extends HTMLElement {
  constructor() {
    super();
  }

  // Correctly position the options menu
  fixSelectorPosition() {
    const selector = this.querySelector('.selector');
    const coords = selector.getBoundingClientRect();

    let verticalPosition = 'bottom';
    if (window.scrollY + coords.bottom > document.body.offsetHeight)      verticalPosition = 'top';
    let horizontalPosition = 'center';
    if (window.scrollX + coords.left < 0)                                 horizontalPosition = 'right';
    else if (window.scrollX + coords.right > document.body.offsetWidth)   horizontalPosition = 'left';

    selector.dataset.vertical = verticalPosition;
    selector.dataset.horizontal = horizontalPosition;

    console.log(coords, containerCoords);
    console.log(verticalPosition, horizontalPosition);
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
    button.addEventListener('click', () => selector.classList.toggle('on'));

    // Make theme-selector options clickable
    for (const choice of [...selector.querySelectorAll('input')]) {
      choice.addEventListener('change', async () => Theme.set(choice.value));
    }

    // Use a resize observer to correct the position of the options menu
    const observer = new ResizeObserver(this.fixSelectorPosition.bind(this));
    observer.observe(document.body);
  }
}

customElements.define("theme-selector", ThemeSelector);