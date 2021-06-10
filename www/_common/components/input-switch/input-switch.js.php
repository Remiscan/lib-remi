const template = document.createElement('template');
template.innerHTML = `
<style><?php include './style.css.php'; ?></style>
<?php include './element.html'; ?>
`;



class InputSwitch extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
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
    const button = this.shadowRoot.querySelector('button');
    
    // Set initial state
    button.setAttribute('aria-checked', this.getAttribute('state') == 'on');
    this.removeAttribute('state');
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