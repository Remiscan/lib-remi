const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button part="button">
    <slot></slot>
  </button>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host {
    display: contents;

    /* --- Customizable properties --- */
    /* Background & text gradient */
    --gradient: linear-gradient(to right, royalblue 0% 100%);
    /* Interaction state layer color */
    --state-layer-color: black;
  }

  /* Native button functionality */
  button {
    grid-row: 1;
    grid-column: 1;
    -webkit-appearance: none;
    appearance: none;
    font: inherit;
    color: inherit;
    padding: .5em 1em;
    margin: 0;
    display: grid;
    place-items: center;
    border-radius: var(--border-radius);
    outline-offset: 3px;

    background-image: var(--gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    background-origin: border-box;

    position: relative;
    border: 2px solid transparent;
    border-radius: 5em;
  }

  /* Border gradient */
  button::before {
    background-image: var(--gradient);
    background-clip: border-box;
    background-origin: border-box;

    -webkit-mask:
      linear-gradient(transparent 0% 100%) padding-box,
      linear-gradient(black 0% 100%)
      ;
    -webkit-mask-composite: source-in;
    mask:
      linear-gradient(transparent 0% 100%) padding-box,
      linear-gradient(black 0% 100%)
      ;
    mask-composite: intersect;
  }

  /* Interaction state layer */
  button::after {
    background-image: linear-gradient(to right, var(--state-layer-color) 0% 100%);
    opacity: var(--state-layer-opacity, 0);
  }

  button::before,
  button::after {
    content: '';
    position: absolute;
    border: inherit;
    border-radius: inherit;
    width: 100%;
    height: 100%;
  }

  button:hover, button:focus-visible, button:active {
    background-clip: initial;
    -webkit-text-fill-color: inherit;
  }

  button:hover {
    --state-layer-opacity: .0;
  }

  button:active {
    --state-layer-opacity: .1;
  }
`);



class GradientButton extends HTMLElement {
  static formAssociated = true;
  #internals;
  #button;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
    if ('ElementInternals' in window && 'setFormValue' in window.ElementInternals.prototype) {
      this.#internals = this.attachInternals();
    }
  }


  get button() {
    if (!this.#button) {
      const button = this.shadow.querySelector('button');
      if (button instanceof HTMLButtonElement) this.#button = button;
    }
    return this.#button;
  }


  // Useful properties and methods for form-associated elements
  get form() { return this.#internals?.form; }
  get name() { return this.getAttribute('name'); }
  get type() { return this.localName; }
  get validity() {return this.#internals?.validity; }
  get validationMessage() {return this.#internals?.validationMessage; }
  get willValidate() {return this.#internals?.willValidate; }
  checkValidity() { return this.#internals?.checkValidity(); }
  reportValidity() {return this.#internals?.reportValidity(); }


  update(attr, newValue) {
    const button = this.shadowRoot.querySelector('button');
    switch (attr) {
      case 'type':
        if (button) button.type = newValue || 'button';
      break;

      case 'value':
        this.#internals?.setFormValue(newValue);

      default:
        if (button) button.setAttribute(attr, newValue);
    }
  }


  connectedCallback() {
    // Type should be set as "button" if no type is given
    if (!this.getAttribute('type')) this.update('type', 'button');
  }

  static get observedAttributes() {
    return ['autofocus', 'disabled', 'form', 'name', 'type', 'value'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.update(attr, newValue);
  }
}

if (!customElements.get('gradient-button')) customElements.define('gradient-button', GradientButton);