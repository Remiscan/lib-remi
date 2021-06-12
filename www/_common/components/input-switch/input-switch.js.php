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
    this.button = this.shadowRoot.querySelector('button');
    this.moving = false;
  }


  toggle() {
    const checked = this.button.getAttribute('aria-checked') === 'true';
    const newState = !checked ? 'on' : 'off';
    this.button.setAttribute('aria-checked', !checked);
    
    // Dispatches switch and switchon / switchoff events on the input-switch element.
    this.dispatchEvent(new CustomEvent('switch', { detail: { checked: !checked, state: newState } }));
    this.dispatchEvent(new Event(`switch${newState}`));
  }


  connectedCallback() {
    // Parse CSS on first connection
    if (sheet?.cssRules.length === 0) sheet.replaceSync(css);

    // Set initial state
    this.button.setAttribute('aria-checked', this.getAttribute('state') == 'on');
    this.removeAttribute('state');

    // If <label for="id"> exists, use it to label the button
    if (this.getAttribute('label') === null) {
      const id = this.getAttribute('id');
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        this.button.setAttribute('aria-label', label.innerText);

        // Clicking on the label toggles the switch
        const labelDown = event => {
          if (event.composedPath().includes(this.button)) return;
          this.moving = false;
        };
        const labelUp = event => {
          event.preventDefault();
          if (event.composedPath().includes(this.button) || this.moving) return;
          this.toggle();
        };
        label.addEventListener('mousedown', labelDown);
        label.addEventListener('touchstart', labelDown);
        label.addEventListener('mouseup', labelUp);
        label.addEventListener('touchend', labelUp);
      }
    }

    // Make switch clickable and touchmoveable
    const startHandle = event => {
      const moveEvent = event.type == 'touchstart' ? 'touchmove' : 'mousemove';
      const endEvent = event.type == 'touchstart' ? 'touchend' : 'mouseup';
      // Gets the object containing the clientX and clientY coordinates of the event
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
      // Gets the coordinates of the event relative to the button
      const getCoords = touch => { return { x: getTouch(touch).clientX - coords.x, y: getTouch(touch).clientY - coords.y } };
      const initialTouch = getCoords(event);

      // Ratio of (distance moved) / (button width)
      const updateDistance = touch => Math.max(-1, Math.min((touch.x - initialTouch.x) / width, 1));
      const updateRatio = touch => Math.max(0, Math.min(initialRatio - updateDistance(touch), 1));
      const initialRatio = Number(this.button.getAttribute('aria-checked') != 'true');
      let lastTouch = initialTouch;
      let maxDistance = 0;

      const moveHandle = event => {
        // Disable transition, the handle should follow the finger/cursor immediately
        if (!durationChanged) {
          durationChanged = true;
          this.button.style.setProperty('--duration', 0);
        }

        lastTouch = getCoords(event);
        const ratio = updateRatio(lastTouch);
        const distance = updateDistance(lastTouch);
        maxDistance = Math.max(Math.abs(distance), maxDistance);
        // Safety margin to differentiate a click and a drag
        if (!this.moving && Math.abs(distance) > 0.1) this.moving = true;
        this.button.style.setProperty('--trans-ratio', ratio);
      };

      const endHandle = event => {
        event.preventDefault();

        // Re-enable transition
        durationChanged = false;
        this.button.style.removeProperty('--duration');
        this.button.style.removeProperty('--trans-ratio');

        const distance = updateDistance(lastTouch);
        // If it's a drag and it moved to the other side of the switch
        const correctDirection = (Math.sign(distance) === -1 && initialRatio === 0) || (Math.sign(distance) === 1 && initialRatio === 1);
        if (Math.abs(distance) > 0.5 && correctDirection) this.toggle();
        // If it's a click (under safety margin)
        else if (maxDistance <= 0.1) this.toggle();

        window.removeEventListener(moveEvent, moveHandle);
        window.removeEventListener(endEvent, endHandle);

      }

      window.addEventListener(moveEvent, moveHandle);
      window.addEventListener(endEvent, endHandle);
    };

    this.button.addEventListener('mousedown', startHandle);
    this.button.addEventListener('touchstart', startHandle);
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'label') {
      this.button.setAttribute('aria-label', newValue);
    }
  }


  static get observedAttributes() {
    return ['label'];
  }
}

if (!customElements.get('input-switch')) customElements.define('input-switch', InputSwitch);