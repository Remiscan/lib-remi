/***** CURRENT PROBLEM WITH POINTER EVENTS: *****

On pointerdown, setPointerCapture is used to make sure every following event is fired on the button, even if the pointer moved.
However:
- In Firefox, after a pointerup event, a click event is fired on the button ONLY IF the pointer is still over the button.
- In Chrome, after a pointerup event, a click event is fired on the button no matter where the pointer is.

Chrome's behaviour is the one I want here.

(see https://github.com/w3c/pointerevents/issues/356)

*************************************************/



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button type="button" role="switch" aria-checked="false" part="button">
    <span class="input-switch-bg" aria-hidden="true" part="background">
      <span class="input-switch-hints" aria-hidden="true" part="hints-container">
        <span data-state="on" part="hint hint-on"></span>
        <svg class="input-switch-handle" viewBox="0 0 24 24" part="handle-container">
          <circle cx="12" cy="12" r="9.6" stroke-width="0" part="handle"/>
          <circle class="focus-dot" cx="12" cy="12" r="2.4" stroke-width="0" part="focus-dot"/>
        </svg>
        <span data-state="off" part="hint hint-off"></span>
      </span>
    </span>
  </button>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host {
    aspect-ratio: 1 / 2;
    --width: 4rem;
    width: var(--width);
    height: calc(.5 * var(--width));

    display: inline-block;
    position: relative;

    --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
    --easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
    --easing: var(--easing-standard);
    --duration: .2s;
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;

    --off-bg-color: #828282; /* --on-bg-color to OKLCH, then chroma 0 and lightness +10% */
    --on-bg-color: hsl(231, 40%, 50%);
    --handle-color: #ebebeb;
    --handle-hover-color: #ddd;
    --handle-active-color: #fff;
    --off-text-color: var(--handle-color);
    --on-text-color: var(--handle-color);
    --focus-color: black;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --off-bg-color: #929292; /* --on-bg-color to OKLCH, then chroma 0 and lightness -10% */
      --on-bg-color: hsl(217, 89%, 75%);
      --handle-color: rgb(48, 48, 48);
      --handle-hover-color: #3a3a3a;
      --handle-active-color: #222;
      --off-text-color: var(--handle-color);
      --on-text-color: var(--handle-color);
      --focus-color: white;
    }
  }

  @media (forced-colors: active) {
    :host {
      -ms-high-contrast-adjust: none;
      forced-color-adjust: none;
      --off-bg-color: ButtonFace;
      --on-bg-color: Highlight;
      --handle-color: ButtonText;
      --handle-hover-color: Highlight;
      --handle-active-color: Highlight;
      --off-text-color: ButtonText;
      --on-text-color: Canvas;
      --focus-color: Highlight;
    }
  }

  [role="switch"] {
    border: none;
    margin: 0;
    padding: 0;
    -webkit-appearance: none;
    appearance: none;
    font: inherit;
    color: inherit;
    outline-offset: 3px;

    width: 100%;
    height: 100%;
    border-radius: calc(.5 * var(--width));

    touch-action: none;
    --ratio: 0;
    --dir: 1;
    --transform-ratio: calc(var(--dir) * var(--ratio));
  }

  [role="switch"]:dir(rtl) {
    --dir: -1;
  }

  .input-switch-bg {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 100%;
    width: 100%;
    height: 100%;
    border-radius: calc(.5 * var(--width));
    background-color: var(--off-bg-color);
    position: relative;
    overflow: hidden;
  }

  .input-switch-bg::before {
    content: '';
    display: block;
    grid-row: 1 / -1;
    grid-column: 1 / -1;
    width: 100%;
    height: 100%;
    background-color: var(--on-bg-color);
    opacity: calc(1 - var(--ratio));
    transition: opacity var(--duration) var(--easing);
    will-change: opacity;
    z-index: 1;
  }

  @media (forced-colors: active) {
    [role="switch"] {
      border: 2px solid var(--handle-color);
      background-color: var(--off-bg-color);
    }

    [role="switch"][aria-checked="true"] {
      border-color: var(--on-bg-color);
      background-color: var(--on-bg-color);
    }

    [role="switch"][aria-checked="true"] .input-switch-bg {
      background-color: var(--on-bg-color);
    }

    [role="switch"][aria-checked="true"] .input-switch-handle {
      fill: var(--on-text-color);
    }

    [role="switch"]:not(:disabled):is(:hover, :active, .active) {
      background-color: var(--off-bg-color);
      border-color: var(--on-bg-color);
      --on-text-color: var(--off-text-color);
    }

    [role="switch"]:not(:disabled):is(:hover, :active, .active) .input-switch-bg {
      background-color: var(--off-bg-color);
    }

    [role="switch"]:not(:disabled):is(:hover, :active, .active) .input-switch-handle {
      fill: var(--off-text-color);
    }

    .input-switch-bg::before {
      display: none;
    }

    .focus-dot {
      display: none;
      fill: var(--off-bg-color);
    }
    [role="switch"][aria-checked="true"] .focus-dot {
      fill: var(--on-bg-color);
    }
    [role="switch"]:not(:disabled):is(:hover, :active, .active) .focus-dot {
      fill: var(--off-bg-color);
    }
    [role="switch"]:focus .focus-dot {
      display: block;
    }
    [role="switch"]:focus:not(:focus-visible) .focus-dot {
      display: none;
    }
  }

  .input-switch-hints {
    grid-row: 1 / -1;
    grid-column: 1 / -1;
    width: 150%;
    height: 100%;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 100%;
    place-items: center;
    transition: transform var(--duration) var(--easing);
    z-index: 2;
    transform: translateX(calc(-100% * var(--transform-ratio) / 3));
    will-change: transform;
  }

  .input-switch-hints>span[data-state] {
    display: grid;
    --side-margin: calc(.1 * var(--width) / 3);
    font-family: var(--font-family);
    font-size: calc(var(--width) / 4);
    font-weight: var(--font-weight, 700);
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  .input-switch-hints>span[data-state]>svg {
    width: 100%;
    height: 100%;
  }

  .input-switch-hints>span[data-state="on"] {
    place-items: start;
  }
  .input-switch-hints>span[data-state="off"] {
    place-items: end;
  }

  .input-switch-hints>span>* {
    --padding-left: 0;
    --padding-right: 0;
    padding: 0 var(--padding-right) 0 var(--padding-left);
  }

  .input-switch-hints>span[data-state="on"]>* {
    --padding-left: calc((1 + var(--dir)) * .5 * var(--side-margin));
    --padding-right: calc((1 - var(--dir)) * .5 * var(--side-margin));
  }
  .input-switch-hints>span[data-state="off"]>* {
    --padding-left: calc((1 - var(--dir)) * .5 * var(--side-margin));
    --padding-right: calc((1 + var(--dir)) * .5 * var(--side-margin));
  }

  .input-switch-hints svg.default-icon {
    stroke-width: var(--stroke-width, 3);
  }

  .input-switch-hints>[data-state="on"] {
    grid-row: 1;
    grid-column: 1;
    color: var(--on-text-color);
    stroke: var(--on-text-color);
  }

  .input-switch-hints>[data-state="off"] {
    grid-row: 1;
    grid-column: 3;
    color: var(--off-text-color);
    stroke: var(--off-text-color);
  }

  .input-switch-handle {
    grid-row: 1;
    grid-column: 2;
    width: 100%;
    height: 100%;
    z-index: 3;
    fill: var(--handle-color);
  }

  [role="switch"]:not(:disabled):hover .input-switch-handle {
    fill: var(--handle-hover-color);
  }
  [role="switch"]:not(:disabled):is(:active, .active) .input-switch-handle {
    fill: var(--handle-active-color);
  }

  [role="switch"][aria-checked="false"] {
    --ratio: 1;
    --current-color: var(--off-bg-color);
  }
  [role="switch"][aria-checked="true"] {
    --ratio: 0;
    --current-color: var(--on-bg-color);
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      --duration: 0;
    }
  }
`);



// How many pixels the finger must move to consider it an intentional drag
const intentionalDragLimit = 3; // pixels



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
  onLabelClick(event) {
    if (event.composedPath().includes(this.button)) {
      event.preventDefault();
    } else {
      this.button.click();
    }
  }


  // Make switch touchmoveable
  onStart(event) {
    this.button.setPointerCapture(event.pointerId);
    
    this.lastClickWasManual = true; // Whether the last click was manual (true) or through the element.click() method.
                                    // If false, style variables will be reset.
    this.cancelNextClick = false; // whether the click should be prevented
    let time = Date.now();
    
    this.moving = false; // whether the user is dragging the handle
    let durationChanged = false;
    this.button.style.removeProperty('--duration');
    this.button.style.removeProperty('--easing');

    const coords = this.getBoundingClientRect();
    const slidableWidth = 0.5 * coords.width * (1 - .2 * .5);
    const textDir = this.rtl ? -1 : 1;
    this.button.style.setProperty('--dir', textDir); // for broswers that don't support the :dir() pseudo-class
    
    // Gets the coordinates of an event relative to the button
    const getCoords = touch => { return { x: touch.clientX - coords.x, y: touch.clientY - coords.y } };
    const initialTouch = getCoords(event);

    // Ratio of (distance moved) / (button width)
    const initialRatio = Number(this.button.getAttribute('aria-checked') != 'true');
    const updateDistance = touch => textDir * Math.max(-1, Math.min((touch.x - initialTouch.x) / slidableWidth, 1));
    const updateRatio = touch => Math.max(0, Math.min(initialRatio - updateDistance(touch), 1));

    let lastTouch = initialTouch;
    let lastDistance = 0;
    let maxDistance = 0;
    let frameReady = true;

    const clickSafetyMargin = intentionalDragLimit / slidableWidth; // % of slidable width

    const moveHandle = event => {
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
      if (Math.sign(distance) !== Math.sign(lastDistance)) time = Date.now();

      lastDistance = distance;
      maxDistance = Math.max(Math.abs(distance), maxDistance);

      // Safety margin to differentiate a click and a drag
      if (!this.moving && Math.abs(distance) > clickSafetyMargin) this.moving = true;
      this.button.style.setProperty('--ratio', ratio);

      requestAnimationFrame(() => { frameReady = true });
    };

    const endHandle = event => {
      const distance = updateDistance(lastTouch);
      this.button.style.removeProperty('--ratio');

      // If it's a drag and it moved to the other side of the switch
      const correctDirection = (Math.sign(distance) === -1 && initialRatio === 0) || (Math.sign(distance) === 1 && initialRatio === 1);
      if (Math.abs(distance) > 0.5 && correctDirection) {
        // Calculate the remaining animation time based on the current speed
        const remainingDuration = Math.round(100 * .001 * (Date.now() - time) * (1 - Math.abs(distance)) / Math.abs(distance)) / 100;
        this.button.style.setProperty('--duration', `${Math.min(1, remainingDuration)}s`);
        this.button.style.setProperty('--easing', 'var(--easing-decelerate)');
      } else {
        this.button.style.removeProperty('--duration');
        // If it's not a click (over safety margin)
        if (maxDistance > clickSafetyMargin) this.cancelNextClick = true;
      }

      //this.button.releasePointerCapture(event.pointerId);
      this.button.removeEventListener('pointermove', moveHandle, { passive: true });
      this.button.removeEventListener('pointerup', endHandle, { passive: true });
    };

    this.button.addEventListener('pointermove', moveHandle, { passive: true });
    this.button.addEventListener('pointerup', endHandle, { passive: true });
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

  get rtl() {
    return getComputedStyle(this.button).getPropertyValue('direction') === 'rtl';
  }


  update(attr, newValue) {
    switch (attr) {
      case 'label':
        this.button.setAttribute('aria-label', newValue || '');
        break;
      case 'labelledby':
        const labelText = document.getElementById(newValue)?.innerText || '';
        this.button.setAttribute('aria-label', labelText);
        break;
      case 'disabled':
        this.disabled = newValue !== null;
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
    this.button.style.setProperty('--duration', 0);

    // Set initial state
    this.button.setAttribute('aria-checked', this.getAttribute('checked') !== null);
    this.removeAttribute('checked');
    this.button.style.setProperty('--dir', this.rtl ? -1 : 1); // for broswers that don't support the :dir() pseudo-class

    // If <label for="id"> exists, use it to label the button
    // and make it clickable.
    const id = this.getAttribute('id');
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) {
      if (this.getAttribute('label') === null) {
        this.button.setAttribute('aria-label', label.innerText); // aria-labelledby doesn't work through shadow DOM
      }

      // Clicking on the label toggles the switch
      this.handlers.labelClick = this.onLabelClick.bind(this);
      label.addEventListener('click', this.handlers.labelClick);
    }

    // Make switch touchmoveable
    this.handlers.start = this.onStart.bind(this);
    this.button.addEventListener('pointerdown', this.handlers.start, { passive: true });

    // Toggle on click (manual or keyboard)
    const clickHandle = event => {     
      // If a pointerup event says so, don't do anything
      if (this.cancelNextClick) this.cancelNextClick = false;
      else {
        // If no pointerdown event happened before click, reset style variables
        if (!this.lastClickWasManual) {
          this.button.style.removeProperty('--duration');
          this.button.style.removeProperty('--easing');
        }
        this.lastClickWasManual = false;
        this.toggle();
      }

      //if (!event.pointerId) this.button.focus();
    }
    this.button.addEventListener('click', clickHandle);

    for (const type of ['pointercancel', 'gotpointercapture', 'lostpointercapture', 'pointerdown', 'pointerup', 'click']) {
      this.button.addEventListener(type, event => console.log(event.type, event.currentTarget, Date.now()));
    }

    this.button.style.removeProperty('--duration');
  }


  disconnectedCallback() {
    const id = this.getAttribute('id');
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) label.removeEventListener('click', this.handlers.labelClick);
    this.button.removeEventListener('pointerdown', this.handlers.start, { passive: true });
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