/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "artsy-block": "/_common/components/artsy-block/artsy-block.js",
    "artsy-block-styles": "/_common/components/artsy-block/styles.css",
    "${type}-worklet": "/_common/components/artsy-block/worklets/${type}.js"
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

  registerWorklet(type) {
    try {
      CSS.paintWorklet.addModule(import.meta.resolve(`${type}-worklet`));
    } catch (e) {
      console.error(e);
    }
  }

  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

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