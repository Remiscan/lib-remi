const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button part="button">
    <span class="text" part="text"></span>
  </button>
  <div class="dots-container" part="dots-container">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host {
    display: inline-grid;
    position: relative;
    font-family: system-ui;
    font-weight: 600;

    --button-color: lightgrey;
    color: black;
    --border-radius: 2em;
    --hover-color: rgb(0, 0, 0, .1);
    --active-color: rgb(255, 255, 255, .1);
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --button-color: dimgrey;
      color: white;
      --hover-color: rgb(255, 255, 255, .1);
      --active-color: rgb(0, 0, 0, .1);
    }
  }

  button,
  .dots-container {
    grid-row: 1;
    grid-column: 1;
    display: grid;
    place-items: center;
    border-radius: var(--border-radius);
  }

  button {
    -webkit-appearance: none;
    appearance: none;
    border: none;
    font: inherit;
    color: inherit;
    padding: 0;
    margin: 0;
    outline-offset: 3px;
    background-color: var(--button-color);
    aspect-ratio: 3 / 1;
    min-height: 2.5rem;
    padding: .5em 1em;
    box-sizing: border-box;
    line-height: 1em;
  }

  .dots-container {
    grid-template-columns: 1fr 1fr 1fr;
    overflow: hidden;
    display: none;
  }

  .dot {
    aspect-ratio: 1;
    height: 100%;
    background-color: var(--button-color);
    border-radius: 50%;
    transform: scale(1.42);
  }

  button:hover {
    background-image: linear-gradient(var(--hover-color) 0% 100%);
  }

  button:active {
    background-image: linear-gradient(var(--active-color) 0% 100%);
  }

  .text {
    white-space: nowrap;
  }
`);



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