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
    <span part="track-unchecked" aria-hidden="true"></span>
    <span part="track-checked" aria-hidden="true"></span>
    <span part="thumb" aria-hidden="true">
      <svg part="visible-thumb" viewBox="0 0 36 36">
        <g part="thumb-unchecked">
          <circle part="bg bg-unchecked" cx="18" cy="18" r="14"/>
          <svg part="icon icon-unchecked" viewBox="-2.4 -2.4 28.8 28.8">
            <path d="M 6 6 L 18 18" fill="transparent"/>
            <path d="M 18 6 L 6 18" fill="transparent"/>
          </svg>
        </g>
        <g part="thumb-checked">
          <circle part="bg bg-checked" cx="18" cy="18" r="14"/>
          <svg part="icon icon-checked" viewBox="-2.4 -2.4 28.8 28.8">
            <path d="M 6 12 L 10 16 L 18 8" fill="transparent"/>
          </svg>
        </g>
      </svg>
      <svg part="interaction-hint" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="18"/>
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
    --aspect-ratio: 1.625;
    --width: calc(var(--aspect-ratio) * var(--height));
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
    --interaction-ring-duration: .2s;

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

  @media (prefers-reduced-motion: reduce) {
    :host {
      --duration: 0;
    }
  }

  /*
   * Elaborate animation:
   * |- ✅ --ratio transition on [role="switch"]
   * | |- implicit opacity transition on [part~="track-checked"]
   * | |- implicit translate transition on [part~="thumb"]
   * | |- implicit scale transition on [part="visible-thumb"]
   * | |- implicit opacity transition on [part~="thumb-checked"]
   * |- opacity transition on [part~="interaction-hint"]
   * 
   * Fallback animation:
   * |- ❌ --ratio transition impossible
   * |- opacity transition on [part~="track-checked"]
   * |- transform (translate) transition on [part~="thumb"]
   * |- transform (scale) transition on [part~="visible-thumb"]
   * |- opacity transition on [part~="thumb-checked"]
   * |- opacity transition on [part~="interaction-hint"]
   */

  /* Button */
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
    transition: --ratio var(--duration) var(--easing);
    padding: 1px; /* to prevent cutting part of the border with overflow hidden */
    box-sizing: content-box; /* so the previous padding doesn't affect visible button size */
    overflow: hidden; /* stops focus outline from deforming around overflowing content */
    touch-action: none; /* prevents 300ms delay on pointerdown on mobile */

    --ratio: 0;
    --dir: 1;
    --ratio-margin: .1;
    --delayed-ratio: clamp(0, (var(--ratio) - var(--ratio-margin)) / (1 - 2 * var(--ratio-margin)), 1); /* so the scaling and opacity transitions start a bit after and end a bit before the translation */
    --interpolated-delayed-ratio: clamp(
      0,
      2.4975 * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio)
      - 6.24376 * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio)
      + 3.20513 * var(--delayed-ratio) * var(--delayed-ratio) * var(--delayed-ratio)
      + 1.43606 * var(--delayed-ratio) * var(--delayed-ratio)
      + 0.105062 * var(--delayed-ratio),
      1
    ); /* https://www.wolframalpha.com/input?i=interpolating+polynomial++{{-0.2,+0},{-0.1,+0},{0,+0},{1,+1},{1.1,+1},{1.2,+1}} so thescaling and opacity transitions are smoothed instead of linear during the translation */
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

  [part~="track-unchecked"] {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: var(--border-width, 0px) solid var(--off-thumb-color);
    border-radius: calc(.5 * (var(--height) + 2 * var(--border-width)));
    background-color: var(--off-track-color);
    --integer-ratio: calc(var(--ratio) - .5); /* rounded to 1 when ratio = 1, else 0 */
    opacity: calc(1 - var(--integer-ratio)); /* having opacity 0 when checked hides the underlying border and makes the track-checked border more rounded */
  }

  [part~="track-checked"] {
    width: 100%;
    height: 100%;
    border-radius: calc(.5 * (var(--height) + 2 * var(--border-width)));
    background-color: var(--on-track-color);
    opacity: var(--interpolated-delayed-ratio);
  }

  [part~="thumb"] {
    display: grid;
    height: 100%;
    aspect-ratio: 1 / 1;
    justify-self: start;
    --max-translation: calc(var(--width) - var(--height)); /* because the thumb's width is --height - border */
    --translation: calc(var(--dir) *var(--ratio) * var(--max-translation));
    translate: var(--translation);
    position: relative;
  }

  [part~="visible-thumb"] {
    --scale: calc(var(--off-thumb-scale) + var(--interpolated-delayed-ratio) * (1 - var(--off-thumb-scale)));
    scale: var(--scale);
  }

  [part~="interaction-hint"] {
    --ring-height: calc(var(--height) + 2 * var(--border-width));
    height: var(--ring-height);
    position: absolute;
    fill: var(--interaction-ring-color);
    opacity: 0;
    transition: opacity var(--interaction-ring-duration) var(--easing-standard) var(--interaction-ring-delay, 0s);
  }

  @media (hover) {
    [role="switch"]:hover [part~="interaction-hint"] {
      opacity: .08;
    }
  }

  [role="switch"]:active [part~="interaction-hint"] {
    --interaction-ring-delay: .2s;
    opacity: .12;
  }

  [role="switch"].dragged [part~="interaction-hint"] {
    --interaction-ring-delay: 0s;
    --interaction-ring-duration: 0s;
    opacity: .16;
  }

  [role="switch"]:disabled [part~="interaction-hint"] {
    display: none;
  }

  [part~="bg-unchecked"] {
    stroke: none;
    fill: var(--off-thumb-color);
  }

  [part~="bg-checked"] {
    stroke: none;
    fill: var(--on-thumb-color);
  }

  [part~="thumb-checked"] {
    opacity: var(--interpolated-delayed-ratio);
  }

  [part~="icon-unchecked"] {
    stroke: var(--off-track-color);
    stroke-width: 2.5; /* (1 / --off-thumb-scale) * .icon-checked's --stroke-width */
    position: relative;
  }

  [part~="icon-checked"] {
    stroke: var(--on-track-color);
    stroke-width: 2;
    position: relative;
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

  [role="switch"].fallback :is(
    [part~="track-checked"],
    [part~="thumb"],
    [part~="visible-thumb"],
    [part~="thumb-checked"]
  ) {
    transition: var(--fallback-transition);
  }

  [role="switch"].fallback [part~="track-unchecked"] {
    opacity: 1;
  }

  [role="switch"].fallback [part~="thumb"] {
    translate: unset;
    transform: translate(var(--translation));
  }

  [role="switch"].fallback [part="visible-thumb"] {
    scale: unset;
    transform: scale(var(--scale));
  }
`);



export default class InputSwitch extends HTMLElement {
  static intentionalDragFloor = 3; // How many pixels the pointer must move to consider it an intentional drag
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

    const clickSafetyMargin = InputSwitch.intentionalDragFloor / slidableWidth; // % of slidable width

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