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
  <div part="slider-rail" role="none" aria-hidden="true"></div>
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
    --rail-width: 4px;
    --thumb-width: 8px;
    --thumb-color: black;
    --thumb-border-color: white;
    --thumb-hover-border-color: dodgerblue;
    --rail-color: grey;
    --rail-filled-color: dodgerblue;
    touch-action: none;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --thumb-color: white;
      --thumb-border-color: black;
      --rail-color: lightgrey;
    }
  }

  :host(:hover) {
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

  [part="slider-rail"],
  [part="slider-thumb"] {
    grid-row: 1;
    grid-column: 1;
  }

  [part="slider-rail"] {
    width: 100%;
    height: 100%;
    background-color: var(--rail-color);
    --background-colors: var(--rail-filled-color) 0 calc(var(--ratio) * 100%), var(--rail-color) calc(var(--ratio) * 100%) 100%;
    background: linear-gradient(var(--background-direction), var(--background-colors));
    border-radius: var(--rail-width);
  }

  :host([orientation="horizontal"]) [part="slider-rail"] {
    height: var(--rail-width);
    --background-direction: to right;
  }

  :host([orientation="vertical"]) [part="slider-rail"] {
    width: var(--rail-width);
    --background-direction: to top;
  }

  :host([orientation="horizontal"][reversed]) [part="slider-rail"] {
    --background-direction: to left;
  }

  :host([orientation="vertical"][reversed]) [part="slider-rail"] {
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
    outline-offset: 5px;
    --applied-ratio: var(--ratio);
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

    const getPositionRatio = (event, rect, orientation, reversed) => {
      let start, end, current;
      if (orientation === 'horizontal') {
        start = rect.x;
        end = rect.x + rect.width;
        current = event.clientX;
      } else if (orientation === 'vertical') {
        start = rect.y;
        end = rect.y + rect.height;
        current = event.clientY;
      }
      let ratio = (current - start) / (end - start);
      if (orientation === 'vertical') ratio = 1 - ratio;
      if (reversed) ratio = 1 - ratio;

      return Math.max(0, Math.min(ratio, 1));
    };

    this.pointerDownHandler = downEvent => {
      this.setPointerCapture(downEvent.pointerId);
      downEvent.preventDefault();

      const rect = this.getBoundingClientRect();
      const reversed = this.getAttribute('reversed') != null;
      const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';

      const ratio = getPositionRatio(downEvent, rect, orientation, reversed);

      const min = this.min, max = this.max;
      const value = this.closestValidValue(min + ratio * (max - min));
      this.setAttribute('value', value);

      let moving = false;
      const pointerMoveHandler = moveEvent => {
        if (moving) return;
        moving = true;
        moveEvent.preventDefault();

        const ratio = getPositionRatio(moveEvent, rect, orientation, reversed);
        const value = this.closestValidValue(min + ratio * (max - min));
        this.setAttribute('value', value);

        requestAnimationFrame(() => { moving = false });
      };

      const pointerUpHandler = upEvent => {
        upEvent.preventDefault();

        const ratio = getPositionRatio(upEvent, rect, orientation, reversed);
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
  }


  connectedCallback() {
    for (const [attr, obj] of InputSlider.ariaAttributesMap) {
      this.initAttribute(attr, obj);
    }

    if (!this.getAttribute('step')) this.setAttribute('step', this.step);

    this.addEventListener('pointerdown', this.pointerDownHandler);
  }


  disconnectedCallback() {
    this.removeEventListener('pointerdown', this.pointerDownHandler);
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
    return Math.max(min, Math.min(min + closerValidStep * step, max));
  }


  get min() {
    return Number(this.getAttribute('min'));
  }

  get max() {
    return Number(this.getAttribute('max'));
  }

  get step() {
    const defaultStep = (this.max - this.min) / 100;
    const currentStep = this.getAttribute('step');

    if (currentStep == null || isNaN(Number(currentStep))) return Number(defaultStep);
    else return Number(currentStep);
  }

  get value() {
    const value = Number(this.getAttribute('value'));
    return this.closestValidValue(value);
  }

  get valueText() {
    const value = String(this.value);
    const valueTextFormat = this.getAttribute('value-text-format');
    return valueTextFormat != null ? valueTextFormat.replace('{v}', value) : value;
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
        const decimals = (`${this.step}`.split('.')[1] ?? '').length;
        const currentValue = this.closestValidValue(Number(value)).toFixed(decimals);
        if (Number(currentValue) !== Number(newValue)) return this.setAttribute('value', currentValue);

        const valueText = this.valueText;
        slider.setAttribute('aria-valuetext', valueText);

        this.dispatchUpdateEvent('input', Number(currentValue), valueText);
      }

      case 'min':
      case 'max': {
        const min = Number(this.getAttribute('min')), max = Number(this.getAttribute('max')), value = Number(this.getAttribute('value'));
        const currentValue = Math.max(min, Math.min(value, max));
        const ratio = 1 - (max - currentValue) / (max - min);
        const rail = this.shadowRoot.querySelector('[part="slider-rail"]');
        slider.style.setProperty('--ratio', ratio);
        rail.style.setProperty('--ratio', ratio);
      }
    }
  }
}

if (!customElements.get('input-slider')) customElements.define('input-slider', InputSlider);