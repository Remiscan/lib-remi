/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "loader-button": "/_common/components/loader-button/loader-button.js",
    "loader-button-styles": "/_common/components/loader-button/styles.css",
    "loader-button-template": "/_common/components/loader-button/template.js"
  }
}
</script>
*/

import sheet from 'loader-button-styles' assert { type: 'css' };
import template from 'loader-button-template';



/*const observer = new ResizeObserver(entries => {
  for (const entry of entries) {
    if (entry.borderBoxSize) {
      const element = entry.target.getRootNode().host;
      element.style.setProperty('--height', `${entry.contentBoxSize[0].blockSize}px`);
    }
  }
});*/



class LoaderButton extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
    //this.observedOnce = false;
  }

  update(attr, newValue) {
    switch (attr) {
      case 'type': {
        const button = this.shadowRoot.querySelector('button');
        button.type = newValue || 'button';
      } break;

      case 'text': {
        // Placing the text in two elements allows a smoother transition on hover.
        for (const span of [...this.shadowRoot.querySelectorAll('.text')]) {
          span.innerHTML = newValue;
        }
      } break;
    }
  }

  connectedCallback() {
    // Type should be set as "button" if no type is given
    if (!this.getAttribute('type')) this.update('type', 'button');

    // Re-calculate size when content changes
    //observer.observe(this.shadowRoot.querySelector('button'));
  }

  disconnectedCallback() {
    //observer.unobserve(this.shadowRoot.querySelector('button'));
  }

  static get observedAttributes() {
    return ['type', 'text'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.update(attr, newValue);
  }
}

if (!customElements.get('loader-button')) customElements.define('loader-button', LoaderButton);