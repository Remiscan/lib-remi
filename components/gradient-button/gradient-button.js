/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "gradient-button": "/_common/components/gradient-button/gradient-button.js",
    "gradient-button-styles": "/_common/components/gradient-button/styles.css",
    "gradient-button-template": "/_common/components/gradient-button/template.js"
  }
}
</script>
*/

import sheet from 'gradient-button-styles' assert { type: 'css' };
import template from 'gradient-button-template';



const observer = new ResizeObserver(entries => {
  for (const entry of entries) {
    if (entry.borderBoxSize) {
      const element = entry.target.getRootNode().host;
      if (element.observedOnce) {
        element.update('size');
      }
      element.observedOnce = true;
    }
  }
});



class GradientButton extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
    this.observedOnce = false;
  }

  get borderWidth() {
    const defaultBorderWidth = 2;
    const borderWidthChecker = this.shadowRoot.querySelector('.border-width-checker');
    let borderWidth = parseFloat(getComputedStyle(borderWidthChecker).width);
    return !isNaN(borderWidth) ? borderWidth : defaultBorderWidth;
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
      } // don't break, update size after text!

      // 'size' isn't an attribute, but we'll call it manually
      case 'size': {
        // Get button size
        const button = this.shadowRoot.querySelector('button');
        const size = button.getBoundingClientRect();
        this.width = size.width;
        this.height = size.height;

        // Apply border-radius
        button.style.setProperty('--border-radius', `${this.height / 2}px`);

        // Apply border mask
        // ⚠ x, y, width, height, rx, ry are shifted by borderWidth because the stroke is drawn half-in, half-out
        const border = this.shadowRoot.querySelector('.border');
        const borderWidth = this.borderWidth;
        const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${this.width} ${this.height}' version='1.1'%3E%3Crect x='${borderWidth / 2}' y='${borderWidth / 2}' width='${this.width - borderWidth}' height='${this.height - borderWidth}' rx='${(this.height - borderWidth) / 2}' ry='${(this.height - borderWidth) / 2}' fill='transparent' stroke-width='${borderWidth}' stroke='black'/%3E%3C/svg%3E`;
        border.style.setProperty('--mask', `url("${svg}")`);
      } break;
    }
  }

  connectedCallback() {
    // Type should be set as "button" if no type is given
    if (!this.getAttribute('type')) this.update('type', 'button');

    // Re-calculate size when border-width changes
    observer.observe(this.shadowRoot.querySelector('.border-width-checker'));
  }

  disconnectedCallback() {
    observer.unobserve(this.shadowRoot.querySelector('.border-width-checker'));
  }

  static get observedAttributes() {
    return ['type', 'text'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.update(attr, newValue);
  }
}

if (!customElements.get('gradient-button')) customElements.define('gradient-button', GradientButton);