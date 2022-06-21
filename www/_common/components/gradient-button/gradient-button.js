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



class GradientButton extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
  }

  static get observedAttributes() {
    return ['type', 'text', 'border-width'];
  }

  update(attributes = GradientButton.observedAttributes) {
    text: {
      if (!attributes.includes('text')) break text;
      // Placing the text in two elements allows a smoother transition on hover.
      for (const span of [...this.shadowRoot.querySelectorAll('.text')]) {
        span.innerHTML = this.getAttribute('text');
      }
    }

    const button = this.shadowRoot.querySelector('button');
    button.type = this.getAttribute('type') || 'button';

    // Calculate the border-width
    const defaultBorderWidth = 2;
    const numberExp = '(?:\\-|\\+)?(?:[0-9]+(?:\\.[0-9]+)?|\\.[0-9]+)(?:(?:e|E)(?:\\-|\\+)?[0-9]+)?';
    const RegExps = {
      px: `^${numberExp}(?:px)?$`,
      other: `^${numberExp}(?:[A-Za-z]+)$`,
    };
    const userBorderWidth = this.getAttribute('border-width') || String(defaultBorderWidth);
    let borderWidth;
    if (userBorderWidth.match(new RegExp(RegExps.px))) {
      borderWidth = parseFloat(userBorderWidth);
    } else {
      const lengthChecker = this.shadowRoot.querySelector('.length-checker');
      lengthChecker.style.setProperty('--length', userBorderWidth);
      borderWidth = parseFloat(getComputedStyle(lengthChecker).width);
    }
    borderWidth = !isNaN(borderWidth) ? borderWidth : defaultBorderWidth;
    this.shadowRoot.querySelector('button').style.setProperty('--border-width', `${borderWidth}px`);

    // Button size (⚠ after border-width)
    const size = this.shadowRoot.querySelector('button').getBoundingClientRect();
    this.width = size.width;
    this.height = size.height;

    // Apply border-radius
    button.style.setProperty('--border-radius', `${this.height / 2}px`);
    
    // Apply border mask
    // ⚠ x, y, width, height, rx, ry are shifted by borderWidth because the stroke is drawn half-in, half-out
    const border = this.shadowRoot.querySelector('.border');
    const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${this.width} ${this.height}' version='1.1'%3E%3Crect x='${borderWidth / 2}' y='${borderWidth / 2}' width='${this.width - borderWidth}' height='${this.height - borderWidth}' rx='${(this.height - borderWidth) / 2}' ry='${(this.height - borderWidth) / 2}' fill='transparent' stroke-width='${borderWidth}' stroke='black'/%3E%3C/svg%3E`;
    border.style.setProperty('--mask', `url("${svg}")`);
  }

  connectedCallback() {
    
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) return;
    this.update([name]);
  }
}

if (!customElements.get('gradient-button')) customElements.define('gradient-button', GradientButton);