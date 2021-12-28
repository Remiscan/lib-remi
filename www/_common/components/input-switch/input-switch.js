import sheet from './styles.css' assert { type: 'css' };
import template from './template.js';



// Gets the object containing the clientX and clientY coordinates of an event
const getTouch = event => {
  switch (event.type) {
    case 'touchstart': case 'touchmove': return event.touches[0];
    case 'mousedown': case 'mousemove': return event;
  }
};



export default class InputSwitch extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
    
    this.button = this.shadowRoot.querySelector('button');
    this.moving = false;
    this.handlers = {
      labelDown: () => {},
      start: () => {}
    };
  }


  toggle() {
    if (this.disabled) return;
    this.button.setAttribute('aria-checked', !this.checked);
    this.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
  }


  // Clicking on the label toggles the switch
  onLabelDown(event) {
    const moveEvent = event.type == 'touchstart' ? 'touchmove' : 'mousemove';
    const endEvent = event.type == 'touchstart' ? 'touchend' : 'mouseup';
    const label = event.currentTarget;

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
      if (event.type === 'touchend') {
        event.preventDefault(); // Prevents mouseup event which would fire labelUp again
      }
      if (!(event.composedPath().includes(this.button) || this.moving || cancel)) {
        this.button.focus();
        this.toggle(); // Toggle instead of click, to work after a small move that canceled the previous click
      }

      window.removeEventListener('touchstart', labelStop, { passive: true });
      window.removeEventListener(moveEvent, labelMove, { passive: true });
      label.removeEventListener(endEvent, labelUp, { passive: false });
    };

    window.addEventListener('touchstart', labelStop, { passive: true });
    window.addEventListener(moveEvent, labelMove, { passive: true });
    label.addEventListener(endEvent, labelUp, { passive: false });
  }


  // Make switch touchmoveable
  onStart(event) {
    this.defaultPrevented = false; // whether event.preventDefault has been called during this click
    if (event.type === 'touchstart') {
      event.preventDefault(); // Prevents lag before first touchmove event
      this.defaultPrevented = true;
    }
    
    this.lastClickWasManual = true; // Whether the last click was manual (true) or through the element.click() method.
                                    // If false, style variables will be reset.
    this.cancelNextClick = false; // whether the click should be prevented
    let time = Date.now();

    const moveEvent = event.type == 'touchstart' ? 'touchmove' : 'mousemove';
    const endEvent = event.type == 'touchstart' ? 'touchend' : 'mouseup';
    
    this.moving = false; // whether the user is dragging the handle
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
      if (event.type === 'touchmove') {
        event.preventDefault(); // Prevents scrolling (and subsequent mouse events)
        this.defaultPrevented = true;
      }
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
      const distance = updateDistance(lastTouch);
      this.button.style.removeProperty('--trans-ratio');
      let simulateClick = this.defaultPrevented;

      // If it's a drag and it moved to the other side of the switch
      const correctDirection = (Math.sign(distance) === -1 && initialRatio === 0) || (Math.sign(distance) === 1 && initialRatio === 1);
      if (Math.abs(distance) > 0.5 && correctDirection) {
        // Calculate the remaining animation time based on the current speed
        const remainingDuration = Math.round(100 * .001 * (Date.now() - time) * (1 - Math.abs(distance)) / Math.abs(distance)) / 100;
        this.button.style.setProperty('--duration', `${Math.min(1, remainingDuration)}s`);
        this.button.style.setProperty('--easing', 'var(--easing-decelerate)');
        // If dragged outside of the button, no click event will be dispatched on it
        if (!event.composedPath().includes(this.button)) simulateClick = true;
      } else {
        this.button.style.removeProperty('--duration');
        // If it's not a click (over safety margin)
        if (maxDistance > 0.1) this.cancelNextClick = true;
      }

      if (simulateClick) {
        this.button.click();
        this.button.focus();
      }

      window.removeEventListener(moveEvent, moveHandle, { passive: false });
      window.removeEventListener(endEvent, endHandle, { passive: true });
    };

    window.addEventListener(moveEvent, moveHandle, { passive: false });
    window.addEventListener(endEvent, endHandle, { passive: true });
  }


  get checked() {
    return this.button.getAttribute('aria-checked') === 'true';
  }

  set checked(value) {
    const checked = this.button.getAttribute('aria-checked') === 'true';
    if (checked === value) return;
    this.toggle();
  }

  get disabled() {
    return this.button.getAttribute('disabled') !== null;
  }

  set disabled(value) {
    if (value === true) {
      this.button.setAttribute('disabled', 'true');
    } else {
      this.button.removeAttribute('disabled');
    }
  }


  update(attr, newValue) {
    switch (attr) {
      case 'label':
        if (newValue) this.button.setAttribute('aria-label', newValue);
        break;
      case 'labelledby':
        if (newValue) this.button.setAttribute('aria-labelledby', newValue);
        break;
      case 'disabled':
        if (newValue !== null) this.disabled = true;
        else                   this.disabled = false;
        break;
      case 'hint': {
        const hints = (newValue || '').split(' ');
        const type = hints[0];
        switch (type) {
          case 'text': {
            const textOn = hints[1] || 'On';
            const textOff = hints[2] || 'Off';
            this.shadowRoot.querySelector('[data-state="on"]').innerHTML = `<span>${textOn}</span>`;
            this.shadowRoot.querySelector('[data-state="off"]').innerHTML = `<span>${textOff}</span>`;
          } break;
          case 'icon': {
            const iconOn = `<svg viewBox="0 0 24 24" class="default-icon"><path d="M 6 12 L 10 16 L 18 8" fill="transparent"/></svg>`;
            const iconOff = `<svg viewBox="0 0 24 24" class="default-icon"><path d="M 6 12 L 18 12" fill="transparent"/></svg>`;
            this.shadowRoot.querySelector('[data-state="on"]').innerHTML = iconOn;
            this.shadowRoot.querySelector('[data-state="off"]').innerHTML = iconOff;
          } break;
          default:
            this.shadowRoot.querySelector('[data-state="on"]').innerHTML = '';
            this.shadowRoot.querySelector('[data-state="off"]').innerHTML = '';
        }
      }
    }
  }


  connectedCallback() {
    // Set initial state
    this.button.setAttribute('aria-checked', this.getAttribute('checked') !== null);
    this.removeAttribute('checked');

    // If <label for="id"> exists, use it to label the button
    // and make it clickable.
    if (this.getAttribute('label') === null) {
      const id = this.getAttribute('id');
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        this.button.setAttribute('aria-label', label.innerText);

        // Clicking on the label toggles the switch
        this.handlers.labelDown = this.onLabelDown.bind(this);
        label.addEventListener('mousedown', this.handlers.labelDown, { passive: true });
        label.addEventListener('touchstart', this.handlers.labelDown, { passive: true });
      }
    }

    // Make switch touchmoveable
    this.handlers.start = this.onStart.bind(this);
    this.button.addEventListener('mousedown', this.handlers.start, { passive: true });
    this.button.addEventListener('touchstart', this.handlers.start, { passive: false });

    // Toggle on click (manual or keyboard)
    const clickHandle = event => {
      // If a mouseup / touchend event says so, don't do anything
      if (this.cancelNextClick) this.cancelNextClick = false;
      else {
        // If no mousedown / touchstart event happened before click, reset style variables
        if (!this.lastClickWasManual) {
          this.button.style.removeProperty('--duration');
          this.button.style.removeProperty('--easing');
        }
        this.lastClickWasManual = false;
        this.toggle();
      }
    }
    this.button.addEventListener('click', clickHandle);
  }


  disconnectedCallback() {
    const id = this.getAttribute('id');
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) {
      label.removeEventListener('mousedown', this.handlers.labelDown, { passive: true });
      label.removeEventListener('touchstart', this.handlers.labelDown, { passive: true });
    }
    this.button.removeEventListener('mousedown', this.handlers.start, { passive: true });
    this.button.removeEventListener('touchstart', this.handlers.start, { passive: false });
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.update(name, newValue);
  }


  static get observedAttributes() {
    return ['label', 'labelledby', 'disabled', 'hint'];
  }
}

if (!customElements.get('input-switch')) customElements.define('input-switch', InputSwitch);