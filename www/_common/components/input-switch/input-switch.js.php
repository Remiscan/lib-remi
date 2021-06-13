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

    // Gets the object containing the clientX and clientY coordinates of an event
    const getTouch = event => {
      switch (event.type) {
        case 'touchstart': case 'touchmove': return event.touches[0];
        case 'mousedown': case 'mousemove': return event;
      }
    };

    // If <label for="id"> exists, use it to label the button
    // and make it clickable.
    if (this.getAttribute('label') === null) {
      const id = this.getAttribute('id');
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        this.button.setAttribute('aria-label', label.innerText);

        // Clicking on the label toggles the switch
        const labelDown = event => {
          const moveEvent = event.type == 'touchstart' ? 'touchmove' : 'mousemove';
          const endEvent = event.type == 'touchstart' ? 'touchend' : 'mouseup';

          if (event.composedPath().includes(this.button)) return;
          this.moving = false;
          this.button.style.removeProperty('--duration');
          this.button.style.removeProperty('--easing');

          // Swiping on the label (or selecting its text) shouldn't toggle the switch
          let cancel = false;
          const iniX = getTouch(event).clientX;

          const labelMove = event => {
            if (!cancel & Math.abs(iniX - getTouch(event).clientX) > 5) cancel = true;
          }

          const labelStop = event => {
            if (event.target != label) cancel = true;
          };
          
          const labelUp = event => {
            event.preventDefault();
            if (event.composedPath().includes(this.button) || this.moving || cancel) return;
            this.toggle();

            window.removeEventListener('touchstart', labelStop);
            window.removeEventListener(moveEvent, labelMove, { passive: true });
            label.removeEventListener(endEvent, labelUp);
          };

          window.addEventListener('touchstart', labelStop);
          window.addEventListener(moveEvent, labelMove, { passive: true });
          label.addEventListener(endEvent, labelUp);
        };

        label.addEventListener('mousedown', labelDown, { passive: true });
        label.addEventListener('touchstart', labelDown, { passive: true });
      }
    }

    // Make switch touchmoveable
    const startHandle = event => {
      event.preventDefault();
      this.press = true; // whether style variables will not need to be reset
      this.dont = false; // whether the click should be prevented
      let time = Date.now();

      const moveEvent = event.type == 'touchstart' ? 'touchmove' : 'mousemove';
      const endEvent = event.type == 'touchstart' ? 'touchend' : 'mouseup';
      
      this.moving = false;
      let durationChanged = false;
      this.button.style.removeProperty('--duration');
      this.button.style.removeProperty('--easing');

      const coords = this.getBoundingClientRect();
      const width = 0.5 * coords.width * (1 - .2 * .5);
      
      // Gets the coordinates of an event relative to the button
      const getCoords = touch => { return { x: getTouch(touch).clientX - coords.x, y: getTouch(touch).clientY - coords.y } };
      const initialTouch = getCoords(event);

      // Ratio of (distance moved) / (button width)
      const updateDistance = touch => Math.max(-1, Math.min((touch.x - initialTouch.x) / width, 1));
      const updateRatio = touch => Math.max(0, Math.min(initialRatio - updateDistance(touch), 1));
      const initialRatio = Number(this.button.getAttribute('aria-checked') != 'true');

      let lastTouch = initialTouch;
      let lastDistance = 0;
      let maxDistance = 0;
      let frameReady = true;

      const moveHandle = event => {
        event.preventDefault();
        if (!frameReady) return;
        frameReady = false;

        // Disable transition, the handle should follow the finger/cursor immediately
        if (!durationChanged) {
          durationChanged = true;
          this.button.style.setProperty('--duration', 0);
        }

        lastTouch = getCoords(event);
        const ratio = updateRatio(lastTouch);
        const distance = updateDistance(lastTouch);

        // Restart timer when direction changes, to save only the inertia of the last move
        if (Math.sign(distance) != Math.sign(lastDistance)) time = Date.now();

        lastDistance = distance;
        maxDistance = Math.max(Math.abs(distance), maxDistance);

        // Safety margin to differentiate a click and a drag
        if (!this.moving && Math.abs(distance) > 0.1) this.moving = true;
        this.button.style.setProperty('--trans-ratio', ratio);

        requestAnimationFrame(() => { frameReady = true });
      };

      const endHandle = event => {
        event.preventDefault();
        const distance = updateDistance(lastTouch);

        // If it's a drag and it moved to the other side of the switch
        const correctDirection = (Math.sign(distance) === -1 && initialRatio === 0) || (Math.sign(distance) === 1 && initialRatio === 1);
        this.button.style.removeProperty('--trans-ratio');
        
        if (Math.abs(distance) > 0.5 && correctDirection) {
          // Calculate the remaining animation time based on the current speed
          const remainingDuration = Math.round(100 * .001 * (Date.now() - time) * (1 - Math.abs(distance)) / Math.abs(distance)) / 100;
          this.button.style.setProperty('--duration', `${Math.min(1, remainingDuration)}s`);
          this.button.style.setProperty('--easing', 'var(--easing-decelerate)');
        } else {
          this.button.style.removeProperty('--duration');
          // If it's not a click (over safety margin)
          if (maxDistance > 0.1) this.dont = true;
        }

        window.removeEventListener(moveEvent, moveHandle);
        window.removeEventListener(endEvent, endHandle);
      };

      window.addEventListener(moveEvent, moveHandle);
      window.addEventListener(endEvent, endHandle);
    };

    this.button.addEventListener('mousedown', startHandle);
    this.button.addEventListener('touchstart', startHandle);

    // Toggle on click (manual or keyboard)
    const clickHandle = event => {
      // If a mouseup / touchend event says so, don't do anything
      if (this.dont) this.dont = false;
      else {
        // If no mousedown / touchstart event happened before click, reset style variables
        if (!this.press) {
          this.button.style.removeProperty('--duration');
          this.button.style.removeProperty('--easing');
        }
        this.press = false;
        this.toggle();
      }
    }
    this.button.addEventListener('click', clickHandle);
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