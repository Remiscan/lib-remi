const adopt = ('adoptedStyleSheets' in document);
const template = document.createElement('template');
const css = `<?php include './style.css.php'; ?>`;

let sheet;
if (adopt) {
  sheet = new CSSStyleSheet();
} else {
  template.innerHTML += `<style>${css}</style>`;
}
template.innerHTML += `<?php include './element.html'; ?>`;



class InputSwitch extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    if (adopt) this.shadow.adoptedStyleSheets = [sheet];
  }


  toggle() {
    const button = this.shadowRoot.querySelector('button');
    const checked = button.getAttribute('aria-checked') === 'true';
    const newState = !checked ? 'on' : 'off';
    button.setAttribute('aria-checked', !checked);
    
    // Dispatches switch and switchon / switchoff events on the input-switch element.
    this.dispatchEvent(new CustomEvent('switch', { detail: { checked: !checked, state: newState } }));
    this.dispatchEvent(new Event(`switch${newState}`));
  }


  connectedCallback() {
    // Parse CSS on first connection
    if (sheet?.cssRules.length === 0) sheet.replaceSync(css);

    const button = this.shadowRoot.querySelector('button');

    // Set initial state
    button.setAttribute('aria-checked', this.getAttribute('state') == 'on');
    this.removeAttribute('state');

    // Move id to button (so that <label for="id"> would be properly associated to the button)
    const id = this.getAttribute('id');
    this.removeAttribute('id');
    if (id) button.setAttribute('id', id);

    // Make switch clickable
    button.addEventListener('click', event => {
      event.stopPropagation();
      this.toggle();
    });
  }
}

if (!customElements.get('input-switch')) customElements.define('input-switch', InputSwitch);