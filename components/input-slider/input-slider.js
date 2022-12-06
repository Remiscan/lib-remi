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
    --tap-safe-size: 44px;
    --block-size: var(--tap-safe-size);
    --inline-size: calc(5 * var(--block-size));
    --track-width: 4px;
    --thumb-width: 12px;
    --thumb-color: black;
    --thumb-border-color: white;
    --thumb-hover-border-color: dodgerblue;
    --track-color: grey;
    --track-filled-color: dodgerblue;
    touch-action: none;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --thumb-color: white;
      --thumb-border-color: black;
      --track-color: lightgrey;
    }
  }

  :host(:hover),
  [role="slider"]:focus {
    --thumb-border-color: var(--thumb-hover-border-color);
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
  }

  :host([orientation="horizontal"]) [part="slider-track"] {
    height: var(--track-width);
    --background-direction: to right;
  }

  :host([orientation="vertical"]) [part="slider-track"] {
    width: var(--track-width);
    --background-direction: to top;
  }

  :host([orientation="horizontal"][reversed]) [part="slider-track"] {
    --background-direction: to left;
  }

  :host([orientation="vertical"][reversed]) [part="slider-track"] {
    --background-direction: to bottom;
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
    --applied-ratio: var(--ratio);
    box-sizing: border-box;
    will-change: transform;
  }

  :host([reversed]) [part="slider-thumb"] {
    --applied-ratio: calc(1 - var(--ratio));
  }

  :host([orientation="horizontal"]) [part="slider-thumb"] {
    width: var(--thumb-width);
    transform: translateX(calc(var(--applied-ratio) * var(--max-translate)));
  }

  :host([orientation="vertical"]) [part="slider-thumb"] {
    height: var(--thumb-width);
    transform: translateY(calc((1 - var(--applied-ratio)) * var(--max-translate)));
  }
`);



export class InputSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [sheet];

    // Gets the ratio of the nrequested position of the slider thumb
    const getPositionRatio = (event, rect, thumbRect, orientation, reversed) => {
      let start, end, current;
      if (orientation === 'horizontal') {
        const thumbWidth = thumbRect.width;
        start = rect.x + thumbWidth / 2;
        end = rect.x + rect.width - thumbWidth / 2;
        current = event.clientX;
      } else if (orientation === 'vertical') {
        const thumbWidth = thumbRect.height;
        start = rect.y + thumbWidth / 2;
        end = rect.y + rect.height - thumbWidth / 2;
        current = event.clientY;
      }
      let ratio = (current - start) / (end - start);
      if (orientation === 'vertical') ratio = 1 - ratio; // because vertical sliders start from the bottom by default
      if (reversed) ratio = 1 - ratio; // double reversal if vertical and reversed, to start from the top

      return Math.max(0, Math.min(ratio, 1));
    };

    // Handles pointer events
    this.pointerDownHandler = downEvent => {
      this.setPointerCapture(downEvent.pointerId); // so that pointermove and pointerup events fire on ${this} even if the pointer stepped out of it

      const rect = this.getBoundingClientRect();
      const thumbRect = this.shadowRoot.querySelector('[role="slider"]').getBoundingClientRect();
      const reversed = this.getAttribute('reversed') != null;
      const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';

      const ratio = getPositionRatio(downEvent, rect, thumbRect, orientation, reversed);

      const min = this.min, max = this.max;
      const value = this.closestValidValue(min + ratio * (max - min));
      this.setAttribute('value', value);

      let moving = false;
      const pointerMoveHandler = moveEvent => {
        moveEvent.preventDefault(); // Prevents drag interference
        if (moving) return;
        moving = true;

        const ratio = getPositionRatio(moveEvent, rect, thumbRect, orientation, reversed);
        const value = this.closestValidValue(min + ratio * (max - min));
        this.setAttribute('value', value);

        requestAnimationFrame(() => { moving = false });
      };

      const pointerUpHandler = upEvent => {

        const ratio = getPositionRatio(upEvent, rect, thumbRect, orientation, reversed);
        const value = this.closestValidValue(min + ratio * (max - min));
        this.setAttribute('value', value);
        this.dispatchUpdateEvent('change');

        this.releasePointerCapture(upEvent.pointerId);
        this.removeEventListener('pointermove', pointerMoveHandler);
        this.removeEventListener('pointerup', pointerUpHandler);
      };

      this.addEventListener('pointermove', pointerMoveHandler);
      this.addEventListener('pointerup', pointerUpHandler);
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

        if (supportedKey) {
          this.setAttribute('value', newValue);
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
    for (const [attr, obj] of InputSlider.ariaAttributesMap) {
      this.initAttribute(attr, obj);
    }

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


  dispatchUpdateEvent(type = 'input', value = this.value, valueText = this.valueText) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      detail: { value, valueText }
    }));
  }


  closestValidValue(value) {
    const min = this.min, max = this.max, step = this.step;
    const closerValidStep = Math.round((value - min) / step);
    const decimals = (`${step}`.split('.')[1] ?? '').length;
    const validValue = Math.max(min, Math.min(min + closerValidStep * step, max));
    return Number(validValue.toFixed(decimals));
  }


  get min() {
    const defaultMin = InputSlider.ariaAttributesMap.get('min').default;
    const currentMin = this.getAttribute('min');

    if (currentMin == null || isNaN(Number(currentMin))) return Number(defaultMin);
    else return Number(currentMin);
  }

  set min(value) {
    this.setAttribute('min', value);
  }

  get max() {
    const defaultMax = InputSlider.ariaAttributesMap.get('max').default;
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

  get value() {
    const value = Number(this.getAttribute('value'));
    return this.closestValidValue(value);
  }

  set value(val) {
    this.setAttribute('value', val);
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


  static get ariaAttributesMap() {
    return new Map([
      ['min', { name: 'aria-valuemin', default: 0 }],
      ['max', { name: 'aria-valuemax', default: 1 }],
      ['value', { name: 'aria-valuenow', default: 0 }],
      ['orientation', { name: 'aria-orientation', default: 'horizontal' }],
      ['label', { name: 'aria-label', default: null }],
      ['labelledby', { name: 'aria-labelledby', default: null }],
    ]);
  }


  static get observedAttributes() { return [...InputSlider.ariaAttributesMap.keys()]; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;

    const slider = this.shadowRoot.querySelector('[role="slider"]');
    const mappedAriaAttribute = InputSlider.ariaAttributesMap.get(attr);

    // Don't use aria-label when aria-labelledby is set
    if (attr === 'label' && this.getAttribute('labelledby')) return slider.removeAttribute('aria-label');

    // Set the corresponding aria-attribute on the slider
    const value = newValue ?? mappedAriaAttribute.default;
    if (mappedAriaAttribute.name) {
      if (value == null)  slider.removeAttribute(mappedAriaAttribute.name);
      else                slider.setAttribute(mappedAriaAttribute.name, value);
    }

    switch (attr) {
      case 'value': {
        const currentValue = this.closestValidValue(Number(value));
        if (String(currentValue) !== newValue) return this.setAttribute('value', currentValue);

        const valueText = this.valueText;
        slider.setAttribute('aria-valuetext', valueText);

        this.dispatchUpdateEvent('input', Number(currentValue), valueText);
      }

      case 'min':
      case 'max': {
        const min = Number(this.getAttribute('min')), max = Number(this.getAttribute('max')), value = Number(this.getAttribute('value'));
        const currentValue = Math.max(min, Math.min(value, max));
        const ratio = 1 - (max - currentValue) / (max - min);
        const track = this.shadowRoot.querySelector('[part="slider-track"]');
        slider.style.setProperty('--ratio', ratio);
        track.style.setProperty('--ratio', ratio);
      }
    }
  }
}

if (!customElements.get('input-slider')) customElements.define('input-slider', InputSlider);