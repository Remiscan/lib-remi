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
    this.moving = false;
    button.addEventListener('click', event => {
      if (this.moving) return;
      event.stopPropagation();
      this.toggle();
    });

    // Make switch touchmoveable
    const startHandle = event => {
      const moveEvent = event.type == 'touchstart' ? 'touchmove' : 'mousemove';
      const endEvent = event.type == 'touchstart' ? 'touchend' : 'mouseup';
      const getTouch = event => {
        switch (event.type) {
          case 'touchstart': case 'touchmove': return event.touches[0];
          case 'mousedown': case 'mousemove': return event;
        }
      };
      
      this.moving = false;
      let durationChanged = false;

      const coords = this.getBoundingClientRect();
      const width = 0.5 * coords.width * (1 - .2 * .5);
      const getCoords = touch => { return { x: getTouch(touch).clientX - coords.x, y: getTouch(touch).clientY - coords.y } };
      const initialTouch = getCoords(event);

      const updateRatio = touch => {
        switch (initialRatio) {
          case 1: return Math.max(0, Math.min(1 - (touch.x - initialTouch.x) / width, 1));
          case 0: return Math.max(0, Math.min((initialTouch.x - touch.x) / width, 1));
        }
      };
      const initialRatio = Number(button.getAttribute('aria-checked') != 'true');
      let lastTouch = initialTouch;

      const moveHandle = event => {
        if (!durationChanged) {
          durationChanged = true;
          button.style.setProperty('--duration', 0);
        }

        lastTouch = getCoords(event);
        const ratio = updateRatio(lastTouch);
        if (!this.moving && Math.abs(initialRatio - ratio) > 0.1) this.moving = true;
        button.style.setProperty('--trans-ratio', ratio);
      };

      const endHandle = event => {
        durationChanged = false;
        button.style.removeProperty('--duration');
        button.style.removeProperty('--trans-ratio');
        const ratio = updateRatio(lastTouch);
        if (Math.abs(initialRatio - ratio) > 0.5) this.toggle();

        window.removeEventListener(moveEvent, moveHandle);
        window.removeEventListener(endEvent, endHandle);
      }

      window.addEventListener(moveEvent, moveHandle);
      window.addEventListener(endEvent, endHandle);
    };

    button.addEventListener('mousedown', startHandle);
    button.addEventListener('touchstart', startHandle);
  }
}

if (!customElements.get('input-switch')) customElements.define('input-switch', InputSwitch);