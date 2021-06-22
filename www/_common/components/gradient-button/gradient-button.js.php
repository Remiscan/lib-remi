const template = document.createElement('template');
template.innerHTML = `
<style><?php include 'style.css'; ?></style>
<?php include 'element.html'; ?>
`;

class GradientButton extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['type', 'text', 'border-width'];
  }

  update(attributes = GradientButton.observedAttributes) {
    if (!this.ready) return;

    text: {
      if (!attributes.includes('text')) break text;
      for (const span of Array.from(this.shadowRoot.querySelectorAll('.text'))) {
        span.innerHTML = this.getAttribute('text');
      }
      /* Placing the text in two elements allows a smoother transition on hover,
      because both text elements have different filters & shadows applied that
      don't transition as smoothly as the current opacity transition. This subtle
      but perceptible difference can be observed in the CSS-only version. */
    }

    type: {
      const button = this.shadowRoot.querySelector('button');
      button.type = this.getAttribute('type') || 'button';
    }

    const size = this.getBoundingClientRect();
    this.width = Math.round(size.width);
    this.height = Math.round(size.height);
    this.shadowRoot.querySelector('.hover-text').style.setProperty('border-radius', this.height + 'px')
    
    const border = this.shadowRoot.querySelector('.border');
    const borderWidth = Number(this.getAttribute('border-width') ?? 2);
    const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${this.width} ${this.height}' version='1.1'%3E%3Crect x='${borderWidth / 2}' y='${borderWidth / 2}' width='${this.width - borderWidth}' height='${this.height - borderWidth}' rx='${this.height / 2}' ry='${this.height / 2}' fill='transparent' stroke-width='${borderWidth}' stroke='black'/%3E%3C/svg%3E`;
    border.style.setProperty('--mask', `url("${svg}")`);
  }

  connectedCallback() {
    this.ready = true;
    this.update();

    // Detect initial text from <gradient-button> content instead of text attribute
    window.addEventListener('DOMContentLoaded', () => {
      if (!this.innerHTML) return;
      this.setAttribute('text', this.innerHTML);
      this.innerHTML = '';
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) return;
    this.update([name]);
  }
}
if (!customElements.get('gradient-button')) customElements.define('gradient-button', GradientButton);