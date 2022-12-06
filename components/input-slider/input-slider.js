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
    --thumb-width: 8px;
    --thumb-color: black;
    --thumb-opposite-color: white;
    --thumb-hover-color: dodgerblue;
    --rail-color: grey;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --thumb-color: white;
      --thumb-opposite-color: black;
      --rail-color: lightgrey;
    }
  }

  :host(:hover) {
    --thumb-opposite-color: var(--thumb-hover-color);
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
    border: 2px solid var(--rail-color);
    border-radius: 2px;
  }

  :host([orientation="horizontal"]) [part="slider-rail"] {
    height: 0;
  }

  :host([orientation="vertical"]) [part="slider-rail"] {
    width: 0;
  }

  [part="slider-thumb"] {
    place-self: start;
    --size: min(var(--block-size), var(--inline-size));
    --max-translate: calc(var(--inline-size) - var(--thumb-width));
    width: var(--size);
    height: var(--size);
    background-color: var(--thumb-color);
    box-shadow: 0 0 0 2px var(--thumb-opposite-color);
    border-radius: var(--thumb-width);
    outline-offset: 5px;
  }

  :host([orientation="horizontal"]) [part="slider-thumb"] {
    width: var(--thumb-width);
    transform: translateX(calc(var(--ratio) * var(--max-translate)));
  }

  :host([orientation="vertical"]) [part="slider-thumb"] {
    height: var(--thumb-width);
    transform: translateY(calc((1 - var(--ratio)) * var(--max-translate)));
  }
`);



export class InputSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [sheet];

    this.inputting = false;
  }


  connectedCallback() {
    for (const [attr, obj] of InputSlider.ariaAttributesMap) {
      this.initAttribute(attr, obj);
    }

    if (!this.getAttribute('step')) this.setAttribute('step', this.step);
  }


  disconnectedCallback() {
    
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
    const min = Number(this.getAttribute('min')), max = Number(this.getAttribute('max')), step = Number(this.step);
    const closerValidStep = Math.round((value - min) / step);
    return Math.max(min, Math.min(min + closerValidStep * step, max));
  }


  get step() {
    const defaultStep = (Number(this.getAttribute('max')) - Number(this.getAttribute('min'))) / 100;
    const currentStep = this.getAttribute('step');

    if (currentStep == null || isNaN(Number(currentStep))) return defaultStep;
    else return currentStep;
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

        this.dispatchUpdateEvent('input', currentValue, valueText);
      }

      case 'min':
      case 'max': {
        const min = Number(this.getAttribute('min')), max = Number(this.getAttribute('max')), value = Number(this.getAttribute('value'));
        const currentValue = Math.max(min, Math.min(value, max));
        const ratio = 1 - (max - currentValue) / (max - min);
        slider.style.setProperty('--ratio', ratio);
      }
    }
  }
}

if (!customElements.get('input-slider')) customElements.define('input-slider', InputSlider);