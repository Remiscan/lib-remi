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
      ['diamonds', 'diamond-cells-worklet'],
      ['dots', 'dot-cells-worklet'],
      ['big-dots', 'big-dot-cells-worklet'],
      ['starfield', 'starfield-worklet'],
      ['labyrinth', 'labyrinth-worklet']
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

    //this.registerWorklet(this.getAttribute('type'));
    this.addEventListener('updaterequest', this.updateBaseSeed);
  }

  disconnectedCallback() {
    this.removeEventListener('updaterequest', this.updateBaseSeed);
  }

  static get observedAttributes() {
    return ['type'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'type': {
        this.registerWorklet(newValue);
      } break;
    }
  }
}

if (!customElements.get('artsy-block')) customElements.define('artsy-block', ArtsyBlock);