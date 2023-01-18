/***** CURRENT PROBLEM WITH POINTER EVENTS & CLICKS: *****

On pointerdown, setPointerCapture is used to make sure every following event is fired on the button, even if the pointer moved.
However:
- In Firefox, after a pointerup event, a click event is fired on the button ONLY IF the pointer is still over the button.
- In Chrome, after a pointerup event, a click event is fired on the button no matter where the pointer is.

Chrome's behaviour is the one I want here.

(see https://github.com/w3c/pointerevents/issues/356)

*************************************************/



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button type="button" part="button" role="switch" aria-checked="false">
    <span part="border" aria-hidden="true"></span>
    <span part="track" aria-hidden="true"></span>
    <span part="thumb" aria-hidden="true">
      <svg class="icon-off" part="icon" viewBox="2.4 2.4 19.2 19.2">
        <path d="M 6 6 L 18 18" fill="transparent"/>
        <path d="M 18 6 L 6 18" fill="transparent"/>
      </svg>
      <svg class="icon-on" part="icon" viewBox="2.4 2.4 19.2 19.2">
        <path d="M 6 12 L 10 16 L 18 8" fill="transparent"/>
      </svg>
    </span>
  </button>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host {
    aspect-ratio: 1 / 2;
    --height: 2em;
    --border-width: .125em;
    width: calc(2 * var(--height));
    height: calc(var(--height) + 2 * var(--border-width));

    display: inline-block;
    position: relative;

    --easing-standard: cubic-bezier(.2, 0, 0, 1);
    --easing-decelerate: cubic-bezier(0, 0, 0, 1);
    --easing: var(--easing-standard);
    --duration: .2s;
    --off-thumb-scale: .6;

    --off-track-color: #f1f1f1; /* white.blend(--on-track-color, .1) to OKLrCH, then chroma 0 */
    --on-track-color: #4d5cb3;
    --off-thumb-color: #7f7f7f; /* --on-track-color to OKLrCH, then chroma 0 and lightness +10% */
    --on-thumb-color: #e1efff; /* --on-track-color to OKLrCH, then lightness 95% */
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --off-track-color: #222222; /* #121212.blend(--on-track-color, .1) to OKLCH, then chroma 0 */
      --on-track-color: #87b2f8;
      --off-thumb-color: #929292; /* --on-track-color to OKLCH, then chroma 0 and lightness -10% */
      --on-thumb-color: #000329; /* --on-track-color to OKLrCH, then lightness 5% */
    }
  }

  @media (forced-colors: active) {
    :host {
      -ms-high-contrast-adjust: none;
      forced-color-adjust: none;
      --off-track-color: Canvas;
      --on-track-color: Highlight;
      --off-thumb-color: ButtonText;
      --on-thumb-color: Canvas;
    }
  }

  [role="switch"] {
    border: none;
    background: none;
    margin: 0;
    padding: 0;
    -webkit-appearance: none;
    appearance: none;
    font: inherit;
    color: inherit;
    outline-offset: 3px;

    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    border-radius: calc(.5 * (var(--height) + 2 * var(--border-width)));
    transition:
      transform var(--duration) var(--easing),
      opacity var(--duration) var(--easing);

    touch-action: none;
    --ratio: 0;
    --dir: 1;
    --transform-ratio: calc(var(--dir) * var(--ratio));
    --ratio-margin: .33;
    --delayed-ratio: clamp(0, (var(--ratio) - var(--ratio-margin)) / (1 - 2 * var(--ratio-margin)), 1);
  }

  [role="switch"]:dir(rtl) {
    --dir: -1;
  }

  [role="switch"] > *,
  [part="thumb"] > * {
    grid-row: 1;
    grid-column: 1;
  }

  [part="border"] {
    display: grid;
    width: 100%;
    height: 100%;
    border: var(--border-width, 0px) solid var(--off-thumb-color);
    border-radius: calc(.5 * (var(--height) + 2 * var(--border-width)));
    background-color: var(--off-track-color);
    box-sizing: border-box;
    position: relative;
    z-index: 1;
  }

  [part="track"] {
    display: grid;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: calc(.5 * (var(--height) + 2 * var(--border-width)));
    background-color: var(--on-track-color);
    box-sizing: border-box;
    opacity: var(--delayed-ratio);
    transform: scale(var(--scale, 1));
    transition: inherit;
    position: relative;
    z-index: 2;
  }

  [part="thumb"] {
    display: grid;
    width: calc(var(--height) - 2 * var(--border-width));
    height: calc(var(--height) - 2 * var(--border-width));
    padding: calc(2 * var(--border-width));
    margin: calc(2 * var(--border-width));
    box-sizing: border-box;
    background-color: var(--off-thumb-color);
    justify-self: start;
    border-radius: calc(.5 * var(--height));
    --scale: calc(var(--off-thumb-scale) + var(--delayed-ratio) * (1 - var(--off-thumb-scale)));
    --min-translation: 0px;
    --max-translation: calc(var(--height) - 2 * var(--border-width));
    --translation: calc(var(--dir) * max(var(--min-translation), var(--ratio) * var(--max-translation)));
    transform:
      translateX(var(--translation))
      scale(var(--scale))
      rotate(0.05deg) /* fix for jerky half-pixel transitions in Firefox */
      ;
    transition: inherit;
    will-change: transform;
    position: relative;
    z-index: 3;
  }

  [part="thumb"]::before {
    content: '';
    display: flex;
    width: calc(100% + 3 * var(--border-width));
    height: calc(100% + 3 * var(--border-width));
    transform: translate(calc(-1.5 * var(--dir) * var(--border-width)), calc(-1.5 * var(--border-width)));
    border-radius: 50%;
    position: absolute;
    z-index: 1;
    background-color: var(--interaction-ring-color);
    transition: inherit;
    opacity: 0;
  }

  button:hover [part="thumb"]::before {
    opacity: .08;
  }

  button:active [part="thumb"]::before {
    opacity: .12;
  }

  [part="thumb"]::after {
    content: '';
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    z-index: 2;
    background-color: var(--on-thumb-color);
    opacity: var(--delayed-ratio);
    transition: inherit;
    will-change: opacity;
  }

  .icon-off {
    opacity: calc(1 - var(--delayed-ratio));
    transition: inherit;
    will-change: opacity;
    stroke: var(--off-track-color);
    stroke-width: 2.5; /* (1 / --off-thumb-scale) * .icon-on--stroke-width */
    position: relative;
    z-index: 3;
  }

  .icon-on {
    opacity: var(--delayed-ratio);
    transition: inherit;
    will-change: opacity;
    stroke: var(--on-track-color);
    stroke-width: 2;
    position: relative;
    z-index: 3;
  }

  :host(:not([icon-on])) .icon-on {
    display: none;
  }

  :host(:not([icon-off])) .icon-off {
    display: none;
  }

  :host([icon-off]) {
    --off-thumb-scale: .8;
  }

  [role="switch"][aria-checked="false"] {
    --ratio: 0;
    --interaction-ring-color: var(--off-thumb-color);
  }
  [role="switch"][aria-checked="true"] {
    --ratio: 1;
    --interaction-ring-color: var(--on-thumb-color);
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
  static formAssociated = true;
  #internals;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [sheet];
    if ('ElementInternals' in window && 'setFormValue' in window.ElementInternals.prototype) {
      this.#internals = this.attachInternals();
    }
    
    this.button = this.shadowRoot.querySelector('button');
    this.moving = false;
    this.handlers = {
      labelClick: () => {},
      start: () => {}
    };
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


  get checked() {
    return this.button.getAttribute('aria-checked') === 'true';
  }


  set checked(value) {
    if (this.disabled) return;
    const bool = Boolean(value);
    const shouldDispatchEvent = bool !== this.checked;
    this.button.setAttribute('aria-checked', String(bool));
    this.#internals?.setFormValue(String(bool));
    if (shouldDispatchEvent) {
      this.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
    }
  }


  toggle() {
    this.checked = !this.checked;
  }


  // Clicking on the label toggles the switch
  onLabelClick(event) {
    event.preventDefault();
    if (event.composedPath().includes(this.button)) {
    } else {
      this.button.style.removeProperty('--duration');
      this.button.style.removeProperty('--easing');
      this.cancelNextClick = false;
      this.button.click();
    }
  }


  // Make switch touchmoveable
  onStart(event) {
    this.button.setPointerCapture(event.pointerId);
    
    this.cancelNextClick = false; // whether the click should be prevented
    let time = Date.now();
    
    this.moving = false; // whether the user is dragging the handle
    let durationChanged = false;
    this.button.style.removeProperty('--duration');
    this.button.style.removeProperty('--easing');

    const coords = this.getBoundingClientRect();
    const slidableWidth = 0.8 * coords.height;
    const textDir = this.rtl ? -1 : 1;
    this.button.style.setProperty('--dir', textDir); // for broswers that don't support the :dir() pseudo-class
    
    // Gets the coordinates of an event relative to the button
    const getCoords = touch => { return { x: touch.clientX - coords.x, y: touch.clientY - coords.y } };
    const initialTouch = getCoords(event);

    // Ratio of (distance moved) / (button width)
    const initialRatio = Number(this.checked);
    const updateDistance = touch => textDir * Math.max(-1, Math.min((touch.x - initialTouch.x) / slidableWidth, 1));
    const updateRatio = touch => Math.max(0, Math.min(initialRatio + updateDistance(touch), 1));

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
      const correctDirection = (Math.sign(distance) === -1 && initialRatio === 1) || (Math.sign(distance) === 1 && initialRatio === 0);
      if (Math.abs(distance) > 0.5 && correctDirection) {
        // Calculate the remaining animation time based on the current speed
        const remainingDuration = Math.round(100 * .001 * (Date.now() - time) * (1 - Math.abs(distance)) / Math.abs(distance)) / 100;
        this.button.style.setProperty('--duration', `${Math.min(1, remainingDuration)}s`);
        this.button.style.setProperty('--easing', 'var(--easing-decelerate)');
        this.checked = !initialRatio;
      } else {
        this.button.style.removeProperty('--duration');
        // If it's not a click (over safety margin)
        if (maxDistance > clickSafetyMargin) this.cancelNextClick = true;
      }

      if (this.moving) {
        this.cancelNextClick = true;
      }

      this.button.removeEventListener('pointermove', moveHandle, { passive: true });
      this.button.removeEventListener('pointerup', endHandle);
    };

    this.button.addEventListener('pointermove', moveHandle, { passive: true });
    this.button.addEventListener('pointerup', endHandle);
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
    }
  }


  connectedCallback() {
    this.button.style.setProperty('--duration', 0);

    // Set initial state
    const initialState = this.getAttribute('checked') !== null;
    this.button.setAttribute('aria-checked', String(initialState));
    this.#internals?.setFormValue(String(initialState));
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
      if (this.cancelNextClick && event.detail !== 0) {
        this.cancelNextClick = false;
      } else {
        this.button.style.removeProperty('--duration');
        this.button.style.removeProperty('--easing');
        this.toggle();
      }

      //if (!event.pointerId) this.button.focus();
    }
    this.button.addEventListener('click', clickHandle);

    /*for (const type of ['pointercancel', 'gotpointercapture', 'lostpointercapture', 'pointerdown', 'pointerup', 'click']) {
      this.button.addEventListener(type, event => console.log(event.type, event, event.currentTarget, Date.now()));
    }*/

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
    return ['label', 'labelledby', 'disabled'];
  }
}

if (!customElements.get('input-switch')) customElements.define('input-switch', InputSwitch);