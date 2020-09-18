const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: inline-grid;
    position: relative;
    font-family: system-ui;
    font-weight: 600;

    /* --- Customizable properties --- */
    /* Background & text gradient */
    --gradient: linear-gradient(to right, royalblue 0% 100%);
    /* Padding around text */
    --padding: .5em 1em;
    /* Color of text on hover */
    --hover-text-color: white;
    /* Overlay over background on click */
    --active-background-overlay: linear-gradient(to right, rgba(0, 0, 0, .1) 0% 100%);
    /* Shadow around text */
    --text-shadow: 0 0 2px black;
    /* Shadow around text on hover */
    --hover-text-shadow: var(--text-shadow);
    /* Filter applied to text */
    --text-filter: none;
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
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: grid;
    place-items: center;
    padding: var(--padding);
  }

  /* Border and text sharing the same gradient */
  .border,
  .visible-text,
  .hover-text {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: var(--gradient);
    grid-row: 1;
    grid-column: 1;
    position: absolute;
  }

  .border {
    mask: var(--mask);
    mask-size: 100% 100%;
    -webkit-mask: var(--mask);
    -webkit-mask-size: 100% 100%;
    z-index: 0;
  }

  .visible-text {
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    display: grid;
    place-items: center;
    z-index: 1;
    filter: var(--text-filter);
  }

  .hover-text {
    color: var(--hover-text-color);
    display: grid;
    place-items: center;
    z-index: 2;
    opacity: 0;
    transition: opacity .15s linear;
  }

  button:hover>.hover-text,
  button:focus>.hover-text {
    opacity: 1;
    text-shadow: var(--hover-text-shadow);
  }

  button:active>.hover-text {
    background-image: var(--active-background-overlay), var(--gradient);
  }

  /* Invisible text for sizing purposes */
  .text {
    color: transparent;
    user-select: none;
    grid-row: 1;
    grid-column: 1;
    position: relative;
    z-index: 0;
    text-shadow: var(--text-shadow);
  }
</style>

<button>
  <div class="border"></div>
  <div class="visible-text"></div>
  <div class="hover-text" aria-hidden="true"></div>
  <div class="text" aria-hidden="true"></div>
</button>
`;

class GradientButton extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['text', 'border-width'];
  }

  update(attributes = GradientButton.observedAttributes) {
    if (!this.ready) return;

    text: {
      if (!attributes.includes('text')) break text;
      this.shadowRoot.querySelector('.visible-text').innerHTML = this.getAttribute('text');
      this.shadowRoot.querySelector('.hover-text').innerHTML = this.getAttribute('text');
      this.shadowRoot.querySelector('.text').innerHTML = this.getAttribute('text');
    }

    const size = this.getBoundingClientRect();
    this.width = Math.round(size.width);
    this.height = Math.round(size.height);
    this.shadowRoot.querySelector('.hover-text').style.setProperty('border-radius', this.height + 'px')
    
    const border = this.shadowRoot.querySelector('.border');
    const borderWidth = Number(this.getAttribute('border-width'));
    const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${this.width} ${this.height}' version='1.1'%3E%3Crect x='${borderWidth / 2}' y='${borderWidth / 2}' width='${this.width - borderWidth}' height='${this.height - borderWidth}' rx='${this.height / 2}' ry='${this.height / 2}' fill='transparent' stroke-width='${borderWidth}' stroke='black'/%3E%3C/svg%3E`;
    border.style.setProperty('--mask', `url("${svg}")`);
  }

  connectedCallback() {
    this.ready = true;
    this.update();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) return;
    this.update([name]);
  }
}
if (!customElements.get('gradient-button')) customElements.define('gradient-button', GradientButton);