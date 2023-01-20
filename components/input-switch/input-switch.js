/***** CURRENT PROBLEM WITH POINTER EVENTS & CLICKS: *****

On pointerdown, setPointerCapture is used to make sure every following event is fired on the button, even if the pointer moved.
However:
- In Firefox, after a pointerup event, a click event is fired on the button ONLY IF the pointer is still over the button.
- In Chrome, after a pointerup event, a click event is fired on the button no matter where the pointer is.

Chrome's behaviour is the one I want here.
White it's not implemented the same way in all browsers, I have to update the checked state of the switch manually instead of
relying on the click after pointerup. In a hypothetical future where every browser works like Chrome now, I could remove the
"cancelNextClick" check, remove the manual updating of the switch's "checked" property in the pointerup handler, and let the
click handler deal with updating the switch's state in every case.

(see https://github.com/w3c/pointerevents/issues/356)

**********************************************************/



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button type="button" part="button" role="switch" aria-checked="false">
    <span part="border" aria-hidden="true"></span>
    <span part="track" aria-hidden="true"></span>
    <span part="thumb" aria-hidden="true">
      <svg part="bg bg-off" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14"/>
        <svg part="icon icon-unchecked" viewBox="-2.4 -2.4 28.8 28.8">
          <path d="M 6 6 L 18 18" fill="transparent"/>
          <path d="M 18 6 L 6 18" fill="transparent"/>
        </svg>
      </svg>
      <svg part="bg bg-on" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14"/>
        <svg part="icon icon-checked" viewBox="-2.4 -2.4 28.8 28.8">
          <path d="M 6 12 L 10 16 L 18 8" fill="transparent"/>
        </svg>
      </svg>
    </span>
  </button>
`;



const cssPropertiesApiSupported = 'registerProperty' in CSS;
const cssTranslatePropertySupported = CSS.supports('translate: 0');



if (cssPropertiesApiSupported) {
  CSS.registerProperty({
    name: '--ratio',
    syntax: '<number>',
    inherits: true,
    initialValue: 0,
  });

  CSS.registerProperty({
    name: '--integer-ratio',
    syntax: '<integer>',
    inherits: false,
    initialValue: 0,
  });
}



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host {
    aspect-ratio: 1 / 2;
    --height: 2em;
    --border-width: .125em;
    --width: calc(1.625 * var(--height));
    width: calc(var(--width) + 2 * var(--border-width));
    height: calc(var(--height) + 2 * var(--border-width));

    display: inline-block;
    position: relative;

    --easing-standard: cubic-bezier(.2, 0, 0, 1);
    --easing-decelerate: cubic-bezier(0, 0, 0, 1);
    --easing: var(--easing-standard);
    --duration: .3s;
    --off-thumb-scale: .6;
    --interaction-ring-width: max(4px, var(--border-width));
    --interaction-ring-color: currentColor;

    --off-track-color: #EFEFEF; /* track color from chrome's default input[type="range"] */
    --on-track-color: #0075FF; /* filled color from chrome's default input[type="checkbox"] */
    --off-thumb-color: #808080; /* border-color from chrome's default input[type="checkbox"] */
    --on-thumb-color: white;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --off-track-color: #3B3B3B; /* track color from chrome's default input[type="range"] */
      --on-track-color: #99C8FF; /* filled color from chrome's default input[type="checkbox"] */
      --off-thumb-color: #bfbfbf; /* border-color from chrome's default input[type="checkbox"], then improveContrast with --off-track-color to 60 */
      --on-thumb-color: #000e2c; /* --on-track-color to OKLrCH, then lightness from --off-track-color * .5 */
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
    outline-offset: 2px;

    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    border-radius: calc(.5 * (var(--height) + 2 * var(--border-width)));
    --delayed-duration: calc(var(--duration) * (1 - 2 * var(--ratio-margin)));
    --delayed-delay: calc(var(--duration) * var(--ratio-margin));
    transition: --ratio var(--duration) var(--easing);
    overflow: hidden;
    padding: 1px; /* to prevent cutting part of the border with overflow hidden */
    box-sizing: content-box; /* so the previous padding doesn't affect visible button size */

    touch-action: none;
    --ratio: 0;
    --dir: 1;
    --ratio-margin: .1;
    --delayed-ratio: clamp(0, (var(--ratio) - var(--ratio-margin)) / (1 - 2 * var(--ratio-margin)), 1);
    --interpolated-delayed-ratio: clamp(
      0,
      2.4975 * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio)
      - 6.24376 * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio)
      + 3.20513 * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio)
      + 1.43606 * var(--delayed-ratio) * var(--delayed-ratio)
      + 0.105062 * var(--delayed-ratio),
      1
    ); /* https://www.wolframalpha.com/input?i=interpolating+polynomial++{{-0.2,+0},{-0.1,+0},{0,+0},{1,+1},{1.1,+1},{1.2,+1}} */
  }

  [role="switch"][aria-checked="false"] {
    --ratio: 0;
  }
  [role="switch"][aria-checked="true"] {
    --ratio: 1;
  }

  [role="switch"]:dir(rtl) {
    --dir: -1;
  }

  [role="switch"] > *,
  [part~="thumb"] > * {
    grid-row: 1;
    grid-column: 1;
  }

  [role="switch"]::before {
    content: '';
    display: flex;
    width: calc(100% + var(--interaction-coeff, 0) * var(--interaction-ring-width));
    height: calc(100% + var(--interaction-coeff, 0) * var(--interaction-ring-width));
    border-radius: calc(3 * var(--height));
    position: absolute;
    z-index: 1;
    background-color: var(--interaction-ring-color);
    opacity: 0;
    --interaction-duration: .2s;
    transition:
      width var(--interaction-duration) var(--easing-standard),
      height var(--interaction-duration) var(--easing-standard),
      opacity var(--interaction-duration) var(--easing-standard)
      ;
    contain: size;
  }

  [role="switch"]:is(:hover, :active, .active, .dragged)::before {
    --interaction-duration: .1s;
  }

  [role="switch"]:hover::before {
    --interaction-coeff: 2;
    opacity: .08;
  }

  [role="switch"]:active::before {
    opacity: .12;
  }

  /* .active only on pointer events, whereas :active also on keyboard event */
  [role="switch"].active::before {
    --interaction-coeff: 2.5;
  }

  [role="switch"].dragged::before {
    opacity: .16;
    --interaction-coeff: 2.5;
  }

  [role="switch"]:disabled::before {
    display: none;
  }

  [part~="border"] {
    display: grid;
    width: 100%;
    height: 100%;
    border: var(--border-width, 0px) solid var(--off-thumb-color);
    border-radius: calc(.5 * (var(--height) + 2 * var(--border-width)));
    background-color: var(--off-track-color);
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    --integer-ratio: calc(var(--ratio) - .5); /* rounded to 1 when ratio = 1, else 0 */
    opacity: calc(1 - var(--integer-ratio)); /* having opacity 0 when checked hides the underlying border and makes the track border more rounded */
  }

  [part~="track"] {
    display: grid;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: calc(.5 * (var(--height) + 2 * var(--border-width)));
    background-color: var(--on-track-color);
    box-sizing: border-box;
    opacity: var(--interpolated-delayed-ratio);
    scale: var(--scale, 1);
    position: relative;
    z-index: 2;
  }

  [part~="thumb"] {
    display: grid;
    height: 100%;
    aspect-ratio: 1 / 1;
    box-sizing: border-box;
    justify-self: start;
    --scale: calc(var(--off-thumb-scale) + var(--interpolated-delayed-ratio) * (1 - var(--off-thumb-scale)));
    --max-translation: calc(var(--width) - var(--height)); /* because the thumb's width is --height - border */
    --translation: calc(var(--dir) *var(--ratio) * var(--max-translation));
    translate: var(--translation);
    scale: var(--scale);
    /*rotate: .05deg;*/ /* fix for jerky half-pixel transitions in Firefox */ /* disable: makes it too blurry */
    position: relative;
    z-index: 3;
  }

  [part~="bg-off"] {
    stroke: none;
    fill: var(--off-thumb-color);
  }

  [part~="bg-on"] {
    stroke: none;
    fill: var(--on-thumb-color);
    opacity: var(--interpolated-delayed-ratio);
  }

  [part~="icon-unchecked"] {
    opacity: calc(1 - var(--interpolated-delayed-ratio));
    stroke: var(--off-track-color);
    stroke-width: 2.5; /* (1 / --off-thumb-scale) * .icon-checked--stroke-width */
    position: relative;
    z-index: 3;
  }

  [part~="icon-checked"] {
    opacity: var(--interpolated-delayed-ratio);
    stroke: var(--on-track-color);
    stroke-width: 2;
    position: relative;
    z-index: 3;
  }

  :host(:not([icons~="checked"], [icons~="both"])) [part~="icon-checked"] {
    display: none;
  }

  :host(:not([icons~="unchecked"], [icons~="both"])) [part~="icon-unchecked"] {
    display: none;
  }

  :host(:is([icons~="unchecked"], [icons~="both"])) {
    --off-thumb-scale: .8;
  }

  /* Fallback animation when CSS Properties API not supported */

  [role="switch"].fallback {
    --fallback-transition:
      transform var(--duration) var(--easing),
      opacity var(--duration) var(--easing);
    transition: var(--fallback-transition);
  }

  [role="switch"].fallback [part~="border"] {
    opacity: 1;
  }

  [role="switch"].fallback [part~="track"] {
    scale: unset;
    transform: scale(var(--scale, 1));
  }

  [role="switch"].fallback [part~="thumb"] {
    scale: unset;
    translate: unset;
    transform:
      scale(var(--scale))
      translate(var(--translation));
  }

  [role="switch"].fallback :is(
    [part~="track"],
    [part~="thumb"],
    [part~="bg-on"]
  ) {
    transition: var(--fallback-transition);
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
    if (!cssPropertiesApiSupported || !cssTranslatePropertySupported) {
      this.button.classList.add('fallback');
    }

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
    if (event.button !== 0) return; // Only act on left mouse click, touch or pen contact
    if (this.disabled) return;
    
    this.button.setPointerCapture(event.pointerId);
    
    this.cancelNextClick = false; // whether the click should be prevented
    let time = Date.now();
    
    this.moving = false; // whether the user is dragging the handle
    let durationChanged = false;
    this.button.style.removeProperty('--duration');
    this.button.style.removeProperty('--easing');

    const coords = this.getBoundingClientRect();
    const slidableWidth = coords.width - coords.height; /* see css --max-translation */
    const textDir = this.rtl ? -1 : 1;
    this.button.style.setProperty('--dir', String(textDir)); // for broswers that don't support the :dir() pseudo-class
    this.button.classList.add('active');
    
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
        this.button.style.setProperty('--duration', '0');
      }

      lastTouch = getCoords(event);
      const ratio = updateRatio(lastTouch);
      const distance = updateDistance(lastTouch);

      // Restart timer when direction changes, to save only the inertia of the last move
      if (Math.sign(distance) !== Math.sign(lastDistance)) time = Date.now();

      lastDistance = distance;
      maxDistance = Math.max(Math.abs(distance), maxDistance);

      // Safety margin to differentiate a click and a drag
      if (!this.moving && Math.abs(distance) > clickSafetyMargin) {
        this.moving = true;
        this.button.classList.add('dragged');
      }
      this.button.style.setProperty('--ratio', ratio);

      requestAnimationFrame(() => { frameReady = true });
    };

    const endHandle = event => {
      const distance = updateDistance(lastTouch);
      this.button.style.removeProperty('--ratio');

      this.cancelNextClick = true;

      this.button.classList.remove('active', 'dragged');

      this.button.removeEventListener('pointermove', moveHandle, { passive: true });
      this.button.removeEventListener('pointerup', endHandle);
      this.button.removeEventListener('pointercancel', endHandle);

      if (event.type === 'pointercancel') return;

      // If it's a drag and it moved to the other side of the switch
      const correctDirection = (Math.sign(distance) === -1 && initialRatio === 1) || (Math.sign(distance) === 1 && initialRatio === 0);

      // If moved by more than half width, treat as a successful drag and change the switch's state
      if (Math.abs(distance) > 0.5 && correctDirection) {
        // Calculate the remaining animation time based on the current speed
        const remainingDuration = Math.round(100 * .001 * (Date.now() - time) * (1 - Math.abs(distance)) / Math.abs(distance)) / 100;
        this.button.style.setProperty('--duration', `${Math.min(1, remainingDuration)}s`);
        this.button.style.setProperty('--easing', 'var(--easing-decelerate)');

        // Change the switch's state
        this.checked = !initialRatio;
      }

      // If moved by less than safety margin, treat as a click and change the switch's state
      else if (Math.abs(distance) <= clickSafetyMargin) {
        this.button.style.removeProperty('--duration');
        this.checked = !initialRatio;
      }
      
      // Else, don't change the switch's state
      else {
        this.button.style.removeProperty('--duration');
      }
    };

    this.button.addEventListener('pointermove', moveHandle, { passive: true });
    this.button.addEventListener('pointerup', endHandle);
    this.button.addEventListener('pointercancel', endHandle);
  }

  get disabled() {
    return this.button.getAttribute('disabled') !== null;
  }

  set disabled(value) {
    if (value == null || value === false) {
      this.removeAttribute('disabled');
    } else {
      this.setAttribute('disabled', 'true');
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
        if (newValue == null) {
          this.button.removeAttribute('disabled');
        } else {
          this.button.setAttribute('disabled', 'true');
        }
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