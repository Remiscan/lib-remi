/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "input-slider": "/_common/components/input-slider/input-slider.js"
  }
}
</script>
*/



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <div part="slider-track" role="none" aria-hidden="true"></div>
  <div part="slider-thumb" role="slider" tabindex="0"></div>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host {
    display: grid;
    place-items: center;
    position: relative;
    border: none; /* borders of the HOST perturb the cursor/thumb positioning */
                  /* the slider thumb will move over borders of the TRACK */
                  /* so if track visuals must be precisely aligned, use no border on track, only outlines */
    --tap-safe-size: 44px;
    --block-size: var(--tap-safe-size);
    --inline-size: calc(5 * var(--block-size));
    --track-width: 8px;
    --track-color: #EFEFEF;
    --track-filled-color: #0075FF;
    --track-border-color: #B2B2B2;
    --track-hover-color: #005CC8;
    --track-active-color: #3793FF;
    --thumb-width: 12px;
    --thumb-color: var(--track-filled-color);
    --thumb-border-color: white;
    --rtl: 1; /* -1 if rtl */
    --reversed: 1; /* -1 if reversed */
    --vertical: 1; /* -1 if vertical */
    --ratio-coeff: calc(var(--rtl) * var(--reversed) * var(--vertical));
    touch-action: none;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --track-color: #3B3B3B;
      --track-filled-color: #99C8FF;
      --track-border-color: #858585;
      --track-hover-color: #D1E6FF;
      --track-active-color: #61A9FF;
      --thumb-border-color: black;
    }
  }

  :host([dir="rtl"]),
  :host(:dir(rtl)) {
    --rtl: -1;
  }

  :host([reversed]) {
    --reversed: -1;
  }

  :host([orientation="vertical"]) {
    --vertical: -1;
    --rtl: 1; /* rtl doesn't matter in vertical orientation */
  }

  :host(:hover),
  [role="slider"]:focus {
    --thumb-color: var(--track-hover-color);
  }

  :host(:active),
  [role="slider"]:active {
    --track-filled-color: var(--track-active-color);
    --thumb-color: var(--track-active-color);
  }

  :host([orientation="horizontal"]) {
    height: var(--block-size);
    width: var(--inline-size);
  }

  :host([orientation="vertical"]) {
    width: var(--block-size);
    height: var(--inline-size);
  }

  [part="slider-track"],
  [part="slider-thumb"] {
    grid-row: 1;
    grid-column: 1;
  }

  [part="slider-track"] {
    width: 100%;
    height: 100%;
    background-color: var(--track-color);
    --background-colors: var(--track-filled-color) 0 calc(var(--ratio) * 100%), var(--track-color) calc(var(--ratio) * 100%) 100%;
    background: linear-gradient(var(--background-direction), var(--background-colors));
    border-radius: var(--track-width);
    border: 1px solid var(--track-border-color);
    box-sizing: border-box;
  }

  :host([orientation="horizontal"]) [part="slider-track"] {
    height: var(--track-width);
    --background-direction: calc(var(--ratio-coeff) * 90deg);
  }

  :host([orientation="vertical"]) [part="slider-track"] {
    width: var(--track-width);
    --background-direction: calc(90deg + var(--ratio-coeff) * 90deg);
  }

  [part="slider-thumb"] {
    place-self: start;
    --size: min(var(--block-size), var(--inline-size));
    --max-translate: calc(var(--inline-size) - var(--thumb-width));
    width: var(--size);
    height: var(--size);
    background-color: var(--thumb-color);
    border: 2px solid var(--thumb-border-color);
    border-radius: var(--thumb-width);
    outline-offset: 3px;
    box-sizing: border-box;
    will-change: transform;
    --normal-ratio: calc(var(--ratio-coeff) * var(--ratio)); /* positive if --ratio-coeff = 1, negative if --ratio-coeff = -1 */
    --reversed-ratio: calc(-1 * var(--ratio-coeff) - var(--ratio)); /* positive if --ratio-coeff = -1, negative if --ratio-coeff = 1 */
    --applied-ratio: max(var(--normal-ratio), var(--reversed-ratio)); /* --normal-ratio if --ratio-coeff = 1, --reversed-ratio if --ratio-coeff = -1 */
  }

  :host([dir="rtl"]:not([orientation="vertical"])) [part="slider-thumb"],
  :host(:dir(rtl):not([orientation="vertical"])) [part="slider-thumb"] {
    place-self: end;
  }

  :host([orientation="horizontal"]) [part="slider-thumb"] {
    width: var(--thumb-width);
    transform: translateX(calc(var(--applied-ratio) * var(--max-translate)));
  }

  :host([orientation="vertical"]) [part="slider-thumb"] {
    height: var(--thumb-width);
    transform: translateY(calc(var(--applied-ratio) * var(--max-translate)));
  }
`);



const ariaAttributesMap = new Map([
  ['min', { name: 'aria-valuemin', default: 0 }],
  ['max', { name: 'aria-valuemax', default: 1 }],
  ['value', { name: 'aria-valuenow', default: 0 }],
  ['orientation', { name: 'aria-orientation', default: 'horizontal' }],
  ['label', { name: 'aria-label', default: null }],
  ['labelledby', { name: 'aria-labelledby', default: null }],
]);



export class InputSlider extends HTMLElement {
  static formAssociated = true;
  #internals;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [sheet];
    if ('ElementInternals' in window && 'setFormValue' in window.ElementInternals.prototype) {
      this.#internals = this.attachInternals();
    }

    // Gets the ratio of the nrequested position of the slider thumb
    const getPositionRatio = (event, rect, thumbRect, direction) => {
      let start, end, current;

      switch (direction) {
        case 'left-to-right':
        case 'right-to-left': {
          const thumbWidth = thumbRect.width;
          start = rect.x + thumbWidth / 2;
          end = rect.x + rect.width - thumbWidth / 2;
          current = event.clientX;
        } break;

        case 'bottom-to-top':
        case 'top-to-bottom': {
          const thumbWidth = thumbRect.height;
          start = rect.y + thumbWidth / 2;
          end = rect.y + rect.height - thumbWidth / 2;
          current = event.clientY;
        } break;
      }

      let ratio = (current - start) / (end - start);
      if (direction === 'right-to-left' || direction === 'bottom-to-top') ratio = 1 - ratio;

      return Math.max(0, Math.min(ratio, 1));
    };

    // Handles pointer events
    this.pointerDownHandler = downEvent => {
      if (downEvent.button !== 0) return; // Only act on left mouse click, touch or pen contact

      downEvent.preventDefault(); // Prevents drag interference
      this.setPointerCapture(downEvent.pointerId); // so that pointermove and pointerup events fire on ${this} even if the pointer stepped out of it

      const thumb = this.shadowRoot.querySelector('[role="slider"]');

      const rect = this.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();

      const rtl = this.getAttribute('dir') === 'rtl' || getComputedStyle(this).getPropertyValue('direction') === 'rtl';
      const reversed = this.getAttribute('reversed') != null;
      const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';

      let direction = reversed ? 'right-to-left' : 'left-to-right';
      if (orientation === 'horizontal' && rtl) {
        direction = reversed ? 'left-to-right' : 'right-to-left';
      } else if (orientation === 'vertical') {
        direction = reversed ? 'top-to-bottom' : 'bottom-to-top';
      }

      const ratio = getPositionRatio(downEvent, rect, thumbRect, direction);

      const min = this.min, max = this.max;
      const value = this.closestValidValue(min + ratio * (max - min));

      this.setValue(value);
      this.dispatchUpdateEvent('input', 'pointerdown');

      let moving = false;
      const pointerMoveHandler = moveEvent => {
        moveEvent.preventDefault(); // Prevents drag interference
        if (moving) return;
        moving = true;

        const ratio = getPositionRatio(moveEvent, rect, thumbRect, direction);
        const value = this.closestValidValue(min + ratio * (max - min));
        this.setValue(value);
        this.dispatchUpdateEvent('input', 'pointermove');

        requestAnimationFrame(() => { moving = false });
      };

      const pointerUpHandler = upEvent => {
        thumb.focus();

        const ratio = getPositionRatio(upEvent, rect, thumbRect, direction);
        const value = this.closestValidValue(min + ratio * (max - min));
        this.setValue(value);
        this.dispatchUpdateEvent('input', 'pointerup');
        this.dispatchUpdateEvent('change', 'pointerup');

        this.releasePointerCapture(upEvent.pointerId);
        this.removeEventListener('pointermove', pointerMoveHandler);
        this.removeEventListener('pointerup', pointerUpHandler);
        this.removeEventListener('pointercancel', pointerUpHandler);
      };

      this.addEventListener('pointermove', pointerMoveHandler);
      this.addEventListener('pointerup', pointerUpHandler);
      this.addEventListener('pointercancel', pointerUpHandler);
    };

    // Handles focus events
    this.focusHandler = focusEvent => {
      const thumb = this.shadowRoot.querySelector('[role="slider"]');
      const reversed = this.getAttribute('reversed') != null;
      const vertical = this.getAttribute('orientation') === 'vertical';

      const keydownHandler = keydownEvent => {
        let newValue = this.value;
        let supportedKey = true;

        switch (keydownEvent.code) {
          case 'ArrowRight': {
            const step = (reversed && !vertical ? -1 : 1) * this.step;
            newValue += step;
          }  break;

          case 'ArrowLeft': {
            const step = (reversed && !vertical ? -1 : 1) * -this.step;
            newValue += step;
          } break;

          case 'ArrowUp': {
            const step = (reversed && vertical ? -1 : 1) * this.step;
            newValue += step;
          } break;

          case 'ArrowDown': {
            const step = (reversed && vertical ? -1 : 1) * -this.step;
            newValue += step;
          } break;

          case 'PageUp': {
            const step = (reversed && vertical ? -1 : 1) * 10 * this.step;
            newValue += step;
          } break;

          case 'PageDown': {
            const step = (reversed && vertical ? -1 : 1) * 10 * -this.step;
            newValue += step;
          } break;

          case 'Home': {
            newValue = this.min;
          } break;

          case 'End': {
            newValue = this.max;
          } break;

          default: {
            supportedKey = false;
          }
        }

        console.log(this.value, newValue, this.closestValidValue(newValue));

        if (supportedKey) {
          this.setValue(newValue);
          this.dispatchUpdateEvent('input', 'keydown');
          this.dispatchUpdateEvent('change', 'keydown');
          keydownEvent.preventDefault();
        }
      };

      const blurHandler = blurEvent => {
        thumb.removeEventListener('keydown', keydownHandler);
        thumb.removeEventListener('blur', blurHandler);
      };

      thumb.addEventListener('keydown', keydownHandler);
      thumb.addEventListener('blur', blurHandler);
    };
  }


  connectedCallback() {
    for (const [attr, obj] of ariaAttributesMap) {
      this.initAttribute(attr, obj);
    }

    const initialValue = this.getAttribute('value') ?? ariaAttributesMap.get('value').default;
    this.setValue(initialValue);

    if (!this.getAttribute('step')) this.setAttribute('step', this.step);

    this.addEventListener('pointerdown', this.pointerDownHandler);

    const thumb = this.shadowRoot.querySelector('[role="slider"]');
    thumb.addEventListener('focus', this.focusHandler);
  }


  disconnectedCallback() {
    this.removeEventListener('pointerdown', this.pointerDownHandler);

    const thumb = this.shadowRoot.querySelector('[role="slider"]');
    thumb.removeEventListener('focus', this.focusHandler);
  }


  initAttribute(attr, obj) {
    if (!this.getAttribute(attr)) {
      const mappedAriaAttribute = obj;
      if (mappedAriaAttribute.default != null) this.setAttribute(attr, mappedAriaAttribute.default);
    }
  }


  dispatchUpdateEvent(type, cause, value = this.value, valueText = this.valueText) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      detail: { value, valueText, cause }
    }));
  }


  closestValidValue(value) {
    const min = this.min, max = this.max, step = this.step;
    const closerValidStep = Math.round((value - min) / step);
    const decimals = (`${step}`.split('.')[1] ?? '').length;
    const validValue = Math.max(min, Math.min(min + closerValidStep * step, max));
    return Number(validValue.toFixed(decimals));
  }


  setValue(value) {
    const newValue = this.closestValidValue(Number(value));
    this.internalValue = newValue;
    this.#internals?.setFormValue(newValue);

    const slider = this.shadowRoot.querySelector('[role="slider"]');
    slider.setAttribute('aria-valuetext', this.valueText);

    this.applyValue();
  }


  applyValue() {
    const min = this.min, max = this.max, value = this.value;
    const currentValue = Math.max(min, Math.min(value, max));
    const ratio = 1 - (max - currentValue) / (max - min);
    const slider = this.shadowRoot.querySelector('[role="slider"]');
    const track = this.shadowRoot.querySelector('[part="slider-track"]');
    slider.style.setProperty('--ratio', ratio);
    track.style.setProperty('--ratio', ratio);
  }


  get min() {
    const defaultMin = ariaAttributesMap.get('min').default;
    const currentMin = this.getAttribute('min');

    if (currentMin == null || isNaN(Number(currentMin))) return Number(defaultMin);
    else return Number(currentMin);
  }

  set min(value) {
    this.setAttribute('min', value);
  }

  get max() {
    const defaultMax = ariaAttributesMap.get('max').default;
    const currentMax = this.getAttribute('max');

    if (currentMax == null || isNaN(Number(currentMax))) return Number(defaultMax);
    else return Number(currentMax);
  }

  set max(value) {
    this.setAttribute('max', value);
  }

  get step() {
    const defaultStep = (this.max - this.min) / 100;
    const currentStep = this.getAttribute('step');

    if (currentStep == null || isNaN(Number(currentStep))) return Number(defaultStep);
    else return Number(currentStep);
  }

  set step(value) {
    this.setAttribute('step', value);
  }

  internalValue = 0;

  get value() {
    return this.internalValue;
  }

  set value(val) {
    this.setValue(val);
  }

  get valueText() {
    const decimals = (`${this.step}`.split('.')[1] ?? '').length;
    const value = String(this.value.toFixed(decimals));
    const valueTextFormat = this.getAttribute('value-text-format');
    return valueTextFormat != null ? valueTextFormat.replace('{v}', value) : value;
  }

  get orientation() {
    return this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
  }

  set orientation(val) {
    this.setAttribute('orientation', val === 'vertical' ? 'vertical' : 'horizontal');
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


  static get observedAttributes() { return [...ariaAttributesMap.keys()]; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;

    const slider = this.shadowRoot.querySelector('[role="slider"]');
    const mappedAriaAttribute = ariaAttributesMap.get(attr);

    // Don't use aria-label when aria-labelledby is set
    if (attr === 'label' && this.getAttribute('labelledby')) return slider.removeAttribute('aria-label');

    // Set the corresponding aria-attribute on the slider
    const value = newValue ?? mappedAriaAttribute.default;
    if (mappedAriaAttribute.name) {
      if (value == null)  slider.removeAttribute(mappedAriaAttribute.name);
      else                slider.setAttribute(mappedAriaAttribute.name, value);
    }

    switch (attr) {
      case 'min':
      case 'max': {
        this.applyValue();
      }
    }
  }
}

if (!customElements.get('input-slider')) customElements.define('input-slider', InputSlider);