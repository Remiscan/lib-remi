const css = `
<?php include './style.css.php'; ?>
`;

const html = `
<?php include './element.html'; ?>
`;



let cssReady = false;



class InputSwitch extends HTMLElement {
  constructor() {
    super();
  }


  toggle() {
    const state = this.getAttribute('state');
    const newState = state == 'on' ? 'off' : 'on';
    this.setAttribute('state', newState);
    this.dispatchEvent(new CustomEvent('switch', { detail: { state: newState } }));
    this.dispatchEvent(new Event(`switch${newState}`));
  }


  connectedCallback() {
    // Add theme-selector CSS to the page
    if (!cssReady) {
      const head = document.querySelector('head');
      const firstStylesheet = document.querySelector('link[rel="stylesheet"], style');
      const style = document.createElement('style');
      style.innerHTML = css;
      style.id = 'input-switch-style';
      if (!!firstStylesheet)  head.insertBefore(style, firstStylesheet);
      else                    head.appendChild(style);
      cssReady = true;
    }
    this.innerHTML = html;

    const button = this.querySelector('button');
    
    // Set initial state
    button.setAttribute('aria-checked', this.getAttribute('state') == 'on');
    const id = this.getAttribute('id');
    this.removeAttribute('id');
    if (id) button.setAttribute('id', id);

    // Make switch clickable
    button.addEventListener('click', event => {
      event.stopPropagation();
      this.toggle();
    });

    this.ready = true;
  }


  static get observedAttributes() {
    return ['state'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) return;
    if (name == 'state') {
      if (!this.ready) return;
      const button = this.querySelector('button');
      button.setAttribute('aria-checked', newValue == 'on');
      return;
    }
  }
}

if (!customElements.get('input-switch')) customElements.define('input-switch', InputSwitch);