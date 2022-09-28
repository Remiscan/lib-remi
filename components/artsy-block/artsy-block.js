/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "artsy-block": "/_common/components/artsy-block/artsy-block.js",
    "artsy-block-styles": "/_common/components/artsy-block/styles.css"
  }
}
</script>
*/

import sheet from 'artsy-block-styles' assert { type: 'css' };



class ArtsyBlock extends HTMLElement {
  constructor() {
    super();
    this.updateBaseSeed();
  }

  updateBaseSeed() {
    this.baseSeed = Date.now();
    this.style.setProperty('--base-seed', `'${this.baseSeed}'`);
  }

  static get workletImportNames() {
    return new Map([
      ['diamonds', 'diamond-cells-worklet']
    ]);
  }

  registerWorklet(type) {
    const importName = ArtsyBlock.workletImportNames.get(type);

    if (importName) {
      try {
        CSS.paintWorklet.addModule(import.meta.resolve(importName));
      } catch (e) {}
    }
  }

  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    this.registerWorklet(this.getAttribute('type'));
    this.addEventListener('updaterequest', this.updateBaseSeed);
  }

  disconnectedCallback() {
    this.removeEventListener('updaterequest', this.updateBaseSeed);
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'type': {
        this.registerWorklet(newValue);
      } break;
    }
  }

  editCell(cell) {
    const borderStyles = ['dotted', 'dashed', 'solid', 'double'];

    switch (this.type) {

      case 'dots': {
        cell.style.setProperty('--scale', Math.round(100 * (.2 + .8 * Math.random())) / 100);
      } break;

      case 'starfield': {
        cell.style.setProperty('--scale', Math.round(100 * (.25 + .75 * Math.random())) / 100);
        cell.style.setProperty('--decalage-x', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--decalage-y', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
      } break;

      case 'squares': {
        cell.style.setProperty('--scale', Math.round(100 * (2 - 1.5 * Math.random())) / 100);
        cell.style.setProperty('--opacity', Math.round(100 * (1 - .5 * Math.random())) / 100);
        cell.style.setProperty('--rotation', Math.round(360 * Math.random()));
        cell.style.setProperty('--decalage-x', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--decalage-y', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--height', Math.round(100 * (0.5 + 0.5 * Math.random())) / 100);
        cell.style.setProperty('--epaisseur', Math.round(2 + 1 * Math.random()));
      } break;

      case 'labyrinth':
      case 'borders': {
        cell.style.setProperty('--scale', Math.round(100 * (.6 + 2 * .4 * Math.random())) / 100);
        cell.style.setProperty('--opacity', Math.round(100 * (1 - 1 * Math.random())) / 100);
        cell.style.setProperty('--rotation', Math.round(4 * Math.random()));

        if (this.getAttribute('previous-type') && this.type !== this.getAttribute('previous-type')) {
          cell.style.setProperty('--border-style', borderStyles[Math.round((borderStyles.length - 1) * Math.random())]);
        }

        cell.style.setProperty('--decalage-x', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
        cell.style.setProperty('--decalage-y', Math.round(-20 + 2 * 20 * Math.random()) + 'px');
      } break;
      
    }

  }
}

if (!customElements.get('artsy-block')) customElements.define('artsy-block', ArtsyBlock);