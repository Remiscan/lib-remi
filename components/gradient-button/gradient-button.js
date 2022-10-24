const template = document.createElement('template');
template.innerHTML = /*html*/`
<button part="button">
  <span class="border" part="border" aria-hidden="true"></span>
  <span class="gradient-text" part="gradient-text" aria-hidden="true">
    <span class="text" part="text"></span>
  </span>
  <span class="hover-bg" part="hover-bg" aria-hidden="true"></span>
  <span class="hover-text text" part="hover-text text"></span>
  <span class="border-width-checker" aria-hidden="true"></span>
</button>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host {
    display: inline-grid;
    position: relative;
    font-family: system-ui;
    font-weight: 600;

    /* --- Customizable properties --- */
    /* Background & text gradient */
    --gradient: linear-gradient(to right, royalblue 0% 100%);
    /* Width of the gradient border */
    --border-width: 2px;
    /* Padding around text */
    --padding: .5em 1em;
    /* Color of text on hover */
    --hover-text-color: black;
    /* Overlay over background on click */
    --active-background-overlay: linear-gradient(to right, rgba(0, 0, 0, .1) 0% 100%);
    /* Transition duration */
    --transition-duration: .1s;
  }

  :host(:not([text])) {
    opacity: 0;
  }

  /* Native button functionality */
  button {
    grid-row: 1;
    grid-column: 1;
    -webkit-appearance: none;
    appearance: none;
    background: none;
    border: none;
    font: inherit;
    padding: 0;
    margin: 0;
    display: grid;
    place-items: center;
    border-radius: var(--border-radius);
    outline-offset: 3px;
  }

  /* Border and text sharing the same gradient */
  .border,
  .gradient-text,
  .hover-bg {
    display: block;
    width: 100%;
    height: 100%;
    background-image: var(--gradient);
    grid-row: 1;
    grid-column: 1;
  }

  .border {
    mask: var(--mask);
    mask-size: 100% 100%;
    -webkit-mask: var(--mask);
    -webkit-mask-size: 100% 100%;
    z-index: 0;
  }

  .gradient-text {
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    display: grid;
    place-items: center;
    z-index: 1;
    user-select: none;
  }

  .hover-bg {
    transition: opacity var(--transition-duration) linear;
    border-radius: var(--border-radius);
    z-index: 2;
  }

  button:not(:hover):not(:focus):not(:active) > .hover-bg {
    opacity: 0;
  }

  button:active > .hover-bg {
    background-image: var(--active-background-overlay), var(--gradient);
  }

  .hover-text {
    display: block;
    width: 100%;
    height: 100%;
    grid-row: 1;
    grid-column: 1;
    box-sizing: border-box;

    color: var(--hover-text-color);
    display: grid;
    place-items: center;
    z-index: 3;
    transition: color var(--transition-duration) linear;
  }

  button:not(:hover):not(:focus):not(:active) > .hover-text {
    --hover-text-color: transparent;
  }

  button:active > .hover-text {
    transition-duration: 0s;
  }

  .text {
    white-space: nowrap;
  }

  .gradient-text > .text {
    padding: var(--padding);
    margin: var(--border-width);
  }

  .border-width-checker {
    display: block;
    height: 0;
    width: var(--border-width, 0);
    position: absolute;
    pointer-events: none;
  }
`);



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