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
    --cursor-width: 14px;
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
    border: 2px solid currentColor;
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
    --max-translate: calc(var(--inline-size) - var(--cursor-width));
    width: var(--size);
    height: var(--size);
    box-shadow: inset 0 0 0 2px black,
                0 0 0 2px white;
    outline-offset: 5px;
  }

  :host([orientation="horizontal"]) [part="slider-thumb"] {
    width: var(--cursor-width);
    transform: translateX(calc(var(--ratio) * var(--max-translate)));
  }

  :host([orientation="vertical"]) [part="slider-thumb"] {
    height: var(--cursor-width);
    transform: translateY(calc(var(--ratio) * var(--max-translate)));
  }
`);



export class InputSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }


  connectedCallback() {
    for (const [attr, obj] of InputSlider.ariaAttributesMap) {
      this.initAttribute(attr, obj);
    }
  }


  disconnectedCallback() {
    
  }


  initAttribute(attr, obj) {
    if (!this.getAttribute(attr)) {
      const mappedAriaAttribute = obj;
      if (mappedAriaAttribute.default != null) this.setAttribute(attr, mappedAriaAttribute.default);
    }
  }


  get step() { return Number(this.getAttribute('step')) ?? (Number(this.getAttribute('max')) - Number(this.getAttribute('min'))) / 100; }


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
    if (mappedAriaAttribute) {
      if (value == null)  slider.removeAttribute(mappedAriaAttribute.name);
      else                slider.setAttribute(mappedAriaAttribute.name, value);
    }

    switch (attr) {
      case 'value': {
        const valueTextFormat = this.getAttribute('value-text-format');
        if (valueTextFormat) {
          const valueText = eval(valueTextFormat.replace('{v}', value));
          slider.setAttribute('aria-valuetext', valueText);
        }

        const min = this.getAttribute('min'), max = this.getAttribute('max');
        const ratio = 1 - (max - value) / (max - min);
        slider.style.setProperty('--ratio', ratio);
      } break;
    }
  }
}

if (!customElements.get('input-slider')) customElements.define('input-slider', InputSlider);