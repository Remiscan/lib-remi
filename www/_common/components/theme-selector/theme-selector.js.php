// ▼ ES modules cache-busted grâce à PHP
/*<?php ob_start();?>*/

import Theme from './theme.js.php';

/*<?php $imports = ob_get_clean();
require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
echo versionizeFiles($imports, __DIR__); ?>*/



const css = `
<?php include './style.css'; ?>
`;

const html = `
<?php include './element.html'; ?>
`;



let cssReady = false;



class ThemeSelector extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
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
    const svg = this.querySelector('svg');

    button.addEventListener('click', () => selector.classList.toggle('on'));

    for (const choice of [...selector.querySelectorAll('input')]) {
      choice.addEventListener('change', async () => {
        // Animates the icon
        const chosenTheme = choice.value;
        if (Theme.resolve(chosenTheme) == 'dark') svg.classList.remove('dark');
        else                                      svg.classList.add('dark');

        // Sets the theme
        Theme.set(chosenTheme);
      });
    }
  }
}

customElements.define("theme-selector", ThemeSelector);