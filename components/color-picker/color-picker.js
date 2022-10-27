/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "color-picker": "/_common/components/color-picker/color-picker.js",
    "colori": "/colori/lib/dist/colori.js",
    "trap-focus": "/_common/js/trap-focus.js",
    "translation-observer": "/_common/js/translation-observer.js"
  }
}
</script>
*/

import translationObserver from 'translation-observer';
import { disableFocusInside, releaseFocusFrom, trapFocusIn } from 'trap-focus';



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button type="button" data-label="change-theme">
    <svg viewBox="0 0 120 120">
    </svg>

    <span data-string="change-theme-short"></span>
  </button>

  <div class="selector">
    <label for="color-formats" data-string="color-format"></label>
    <select name="color-formats" id="color-formats">
      <option value="rgb">RGB</option>
      <option value="hsl">HSL</option>
      <option value="hwb">HWB</option>
      <option value="lab">LAB</option>
      <option value="lch">LCH</option>
      <option value="oklab">OKLAB</option>
      <option value="oklch">OKLCH</option>
    </select>

    <label for="range-red" data-format="rgb">
      <span data-string="prop-r-nom" data-string="prop-r-nom"></span>
      <span>[0 ; 255]</span>
      <input type="range" id="range-red" data-property="r" min="0" max="255" step="1" value="<?=round(255 * $startColor->r)?>">
      <input type="number" data-property="r" min="0" max="255" step="1" value="<?=round(255 * $startColor->r)?>">
    </label>

    <label for="range-green" data-format="rgb">
      <span data-string="prop-g-nom" data-string="prop-g-nom"></span>
      <span>[0 ; 255]</span>
      <input type="range" id="range-green" data-property="g" min="0" max="255" step="1" value="<?=round(255 * $startColor->g)?>">
      <input type="number" data-property="g" min="0" max="255" step="1" value="<?=round(255 * $startColor->g)?>">
    </label>

    <label for="range-blue" data-format="rgb">
      <span data-string="prop-b-nom" data-string="prop-b-nom"></span>
      <span>[0 ; 255]</span>
      <input type="range" id="range-blue" data-property="b" min="0" max="255" step="1" value="<?=round(255 * $startColor->b)?>">
      <input type="number" data-property="b" min="0" max="255" step="1" value="<?=round(255 * $startColor->b)?>">
    </label>

    <label for="range-hue" data-format="hsl hwb">
      <span data-string="prop-h-nom" data-string="prop-h-nom"></span>
      <span>[0 ; 360]</span>
      <input type="range" id="range-hue" data-property="h" min="0" max="360" step="1" value="<?=round($startColor->h())?>">
      <input type="number" data-property="h" min="0" max="360" step="1" value="<?=round($startColor->h())?>">
    </label>

    <label for="range-saturation" data-format="hsl">
      <span data-string="prop-s-nom" data-string="prop-s-nom"></span>
      <span>[0 ; 100]</span>
      <input type="range" id="range-saturation" data-property="s" min="0" max="100" step="1" value="<?=round(100 * $startColor->s())?>">
      <input type="number" data-property="s" min="0" max="100" step="1" value="<?=round(100 * $startColor->s())?>">
    </label>

    <label for="range-luminosity" data-format="hsl">
      <span data-string="prop-l-nom" data-string="prop-l-nom"></span>
      <span>[0 ; 100]</span>
      <input type="range" id="range-luminosity" data-property="l" min="0" max="100" step="1" value="<?=round(100 * $startColor->l())?>">
      <input type="number" data-property="l" min="0" max="100" step="1" value="<?=round(100 * $startColor->l())?>">
    </label>

    <label for="range-whiteness" data-format="hwb">
      <span data-string="prop-w-nom" data-string="prop-w-nom"></span>
      <span>[0 ; 100]</span>
      <input type="range" id="range-whiteness" data-property="w" min="0" max="100" step="1" value="<?=round(100 * $startColor->w())?>">
      <input type="number" data-property="w" min="0" max="100" step="1" value="<?=round(100 * $startColor->w())?>">
    </label>

    <label for="range-blackness" data-format="hwb">
      <span data-string="prop-bk-nom" data-string="prop-bk-nom"></span>
      <span>[0 ; 100]</span>
      <input type="range" id="range-blackness" data-property="bk" min="0" max="100" step="1" value="<?=round(100 * $startColor->bk())?>">
      <input type="number" data-property="bk" min="0" max="100" step="1" value="<?=round(100 * $startColor->bk())?>">
    </label>

    <label for="range-cie-lightness" data-format="lab lch">
      <span data-string="prop-ciel-nom" data-string="prop-ciel-nom"></span>
      <span>[0 ; 100]</span>
      <input type="range" id="range-cie-lightness" data-property="ciel" min="0" max="100" step="1" value="<?=round(100 * $startColor->ciel())?>">
      <input type="number" data-property="ciel" min="0" max="100" step="1" value="<?=round(100 * $startColor->ciel())?>">
    </label>

    <label for="range-cie-a-axis" data-format="lab">
      <span data-string="prop-ciea-nom" data-string="prop-ciea-nom"></span>
      <span>[-80 ; 94]</span>
      <input type="range" id="range-cie-a-axis" data-property="ciea" min="-80" max="94" step="1" value="<?=round($startColor->ciea())?>">
      <input type="number" data-property="ciea" min="-80" max="94" step="1" value="<?=round($startColor->ciea())?>">
    </label>

    <label for="range-cie-b-axis" data-format="lab">
      <span data-string="prop-cieb-nom" data-string="prop-cieb-nom"></span>
      <span>[-112 ; 94]</span>
      <input type="range" id="range-cie-b-axis" data-property="cieb" min="-112" max="94" step="1" value="<?=round($startColor->cieb())?>">
      <input type="number" data-property="cieb" min="-112" max="94" step="1" value="<?=round($startColor->cieb())?>">
    </label>

    <label for="range-cie-chroma" data-format="lch">
      <span data-string="prop-ciec-nom" data-string="prop-ciec-nom"></span>
      <span>[0 ; 132]</span>
      <input type="range" id="range-cie-chroma" data-property="ciec" min="0" max="132" step="1" value="<?=round($startColor->ciec())?>">
      <input type="number" data-property="ciec" min="0" max="132" step="1" value="<?=round($startColor->ciec())?>">
    </label>

    <label for="range-cie-hue" data-format="lch">
      <span data-string="prop-cieh-nom" data-string="prop-cieh-nom"></span>
      <span>[0 ; 360]</span>
      <input type="range" id="range-cie-hue" data-property="cieh" min="0" max="360" step="1" value="<?=round($startColor->cieh())?>">
      <input type="number" data-property="cieh" min="0" max="360" step="1" value="<?=round($startColor->cieh())?>">
    </label>

    <label for="range-ok-lightness" data-format="oklab oklch">
      <span data-string="prop-okl-nom" data-string="prop-okl-nom"></span>
      <span>[0 ; 100]</span>
      <input type="range" id="range-ok-lightness" data-property="okl" min="0" max="100" step="1" value="<?=round(100 * $startColor->okl())?>">
      <input type="number" data-property="okl" min="0" max="100" step="1" value="<?=round(100 * $startColor->okl())?>">
    </label>

    <label for="range-ok-a-axis" data-format="oklab">
      <span data-string="prop-oka-nom" data-string="prop-oka-nom"></span>
      <span>[-0.24 ; 0.28]</span>
      <input type="range" id="range-ok-a-axis" data-property="oka" min="-0.24" max="0.28" step="0.001" value="<?=round(10**3 * $startColor->oka()) / 10**3?>">
      <input type="number" data-property="oka" min="-0.24" max="0.28" step="0.001" value="<?=round(10**3 * $startColor->oka()) / 10**3?>">
    </label>

    <label for="range-ok-b-axis" data-format="oklab">
      <span data-string="prop-okb-nom" data-string="prop-okb-nom"></span>
      <span>[-0.32 ; 0.20]</span>
      <input type="range" id="range-ok-b-axis" data-property="okb" min="-0.32" max="0.20" step="0.001" value="<?=round(10**3 * $startColor->okb()) / 10**3?>">
      <input type="number" data-property="okb" min="-0.32" max="0.20" step="0.001" value="<?=round(10**3 * $startColor->okb()) / 10**3?>">
    </label>

    <label for="range-ok-chroma" data-format="oklch">
      <span data-string="prop-okc-nom" data-string="prop-okc-nom"></span>
      <span>[0 ; 0.32]</span>
      <input type="range" id="range-ok-chroma" data-property="okc" min="0" max="0.32" step="0.001" value="<?=round(10**3 * $startColor->okc()) / 10**3?>">
      <input type="number" data-property="okc" min="0" max="0.32" step="0.001" value="<?=round(10**3 * $startColor->okc()) / 10**3?>">
    </label>

    <label for="range-ok-hue" data-format="oklch">
      <span data-string="prop-okh-nom" data-string="prop-okh-nom"></span>
      <span>[0 ; 360]</span>
      <input type="range" id="range-ok-hue" data-property="okh" min="0" max="360" step="1" value="<?=round($startColor->okh())?>">
      <input type="number" data-property="okh" min="0" max="360" step="1" value="<?=round($startColor->okh())?>">
    </label>

    <label for="range-opacity" data-format="rgb hsl hwb lab lch oklab oklch">
      <span data-string="prop-a-nom" data-string="prop-a-nom"></span>
      <span>[0 ; 100]</span>
      <input type="range" id="range-opacity" data-property="a" min="0" max="100" step="1" value="<?=round(100 * $startColor->a)?>">
      <input type="number" data-property="a" min="0" max="100" step="1" value="<?=round(100 * $startColor->a)?>">
    </label>
  </div>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  button {
    border: none;
    background-color: transparent;
    padding: 0;
    margin: 0;
    font: inherit;
    line-height: inherit;
    text-transform: none;
    cursor: pointer;
    color-scheme: light dark;

    display: grid;
    grid-template-columns: var(--size) auto;
    align-items: center;
    gap: 1ch;
    color: currentColor;
  }

  :host(:not([label])) > button {
    grid-template-columns: var(--size) 0;
    gap: 0;
  }

  :host {
    display: grid;
    place-items: center;
    position: relative;
    --size: 3rem;
    --tap-safe-size: 44px;
    --echiquier-transparence: linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, .1) 75%),
                              linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, .1) 75%),
                              linear-gradient(to right, #ddd 0% 100%);
  }

  :host(:not([label])) > button > span {
    display: none;
  }

  svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    fill: var(--primary-color, var(--default-color));
    --sun-resize: .5s;
    --moon-hole-apparition: .5s;
    --moon-hole-disparition: .3s;
  }

  .unusable {
    pointer-events: none !important;
  }



  /**********/
  /* POP-UP */
  /**********/

  .selector {
    display: grid;
    grid-template-columns: auto 1fr auto;
    position: absolute;
    top: 100%;
    grid-row: 1;
    grid-column: 1;
    opacity: 0;
    pointer-events: none;
  }

  :host([open]) > .selector {
    opacity: 1;
    pointer-events: auto;
  }

  .selector-title {
    grid-column: 1 / -1;
  }

  .selector > input {
    grid-column: 1;
  }

  .selector > label {
    grid-column: 2;
  }

  .selector > label > span {
    grid-column: 2;
  }

  :host([position="bottom"]) > .selector {
    top: 100%;
  }
  :host([position="top"]) > .selector {
    top: unset;
    bottom: 100%;
  }
  :host([position="left"]) > .selector {
    top: unset;
    right: 100%;
  }
  :host([position="right"]) > .selector {
    top: unset;
    left: 100%;
  }



  /**********/
  /* INPUTS */
  /**********/

  label[data-format] {
    display: none;
    grid-template-columns: auto auto 1fr;
    grid-template-rows: auto auto;
    gap: .3rem;
    position: relative;
    --cursor-width: 14px;
  }
  
  :host(:not([data-format])) label[data-format~="rgb"],
  :host([data-format="rgb"]) label[data-format~="rgb"],
  :host([data-format="hsl"]) label[data-format~="hsl"],
  :host([data-format="hwb"]) label[data-format~="hwb"],
  :host([data-format="lab"]) label[data-format~="lab"],
  :host([data-format="lch"]) label[data-format~="lch"],
  :host([data-format="oklab"]) label[data-format~="oklab"],
  :host([data-format="oklch"]) label[data-format~="oklch"] {
    display: grid;
  }
  
  label[data-format] > input[type="range"] {
    grid-row: 2;
    grid-column: 1 / -1;
  }
  
  input[type="range"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: block;
    height: var(--tap-safe-size);
    border: none;
    --couleurs: white 0%, black 100%;
    background: linear-gradient(to right, var(--couleurs)),
                var(--echiquier-transparence);
    background-size: 100% 100%, 16px 16px, 16px 16px;
    background-position: 0 0, 0 0, 8px 8px;
    background-repeat: no-repeat, repeat, repeat;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: var(--cursor-width);
    height: var(--tap-safe-size);
    background: transparent;
    border: none;
    border-radius: .6rem;
    box-shadow: inset 0 0 0 2px var(--input-active-bg-color),
                0 0 0 2px var(--text-color);
  }
  
  input[type="range"]::-moz-range-thumb {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: var(--cursor-width);
    height: var(--tap-safe-size);
    background: transparent;
    border: none;
    border-radius: .6rem;
    box-shadow: inset 0 0 0 2px var(--input-active-bg-color),
                0 0 0 2px var(--text-color);
  }
  
  input[type="range"]::-moz-range-track {
    background: none;
  }
  
  input[type=number][data-property]::-webkit-inner-spin-button, 
  input[type=number][data-property]::-webkit-outer-spin-button {  
    opacity: 1;
  }
  
  input[type="number"][data-property] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    --width: 6ch;
    width: var(--width);
    height: 1.8rem;
    --padding-side: .3rem;
    padding: .15rem var(--padding-side);
    font-size: 1rem;
    color: var(--text-color);
    border: none;
    border-radius: .6rem;
    background: var(--body-color);
    --border-width: 1px;
    border: var(--border-width) solid var(--section-color);
    text-align: center;
  
    position: absolute;
    --compensation: calc(var(--cursor-width) + 2 * var(--preview-border-width) + 2 * var(--border-width));
    bottom: calc(var(--tap-safe-size) + 10px);
    left: clamp(
      0px,
      var(--pos, 0) * (100% - var(--compensation)) - 0.5 * var(--width) + var(--padding-side),
      100% - 24px - var(--width) + 2 * var(--padding-side)
    ); 
    margin: 0 -6ch 0 0;
  
    opacity: 0;
    pointer-events: none;
  }
  
  input[type="range"][data-property]:hover + input[type="number"][data-property],
  input[type="range"][data-property]:focus + input[type="number"][data-property],
  input[type="range"][data-property]:active + input[type="number"][data-property],
  input[type="number"][data-property]:hover,
  input[type="number"][data-property]:focus,
  input[type="number"][data-property]:active {
    opacity: 1;
    pointer-events: auto;
  }
`);



const strings = {
  "fr": {
    "pick-color": "Choisir une couleur",
    "selector-title": "Sélecteur de couleur",
    "color-format": "Format",
    "prop-r-nom": "Rouge",
    "prop-g-nom": "Vert",
    "prop-b-nom": "Bleu",
    "prop-h-nom": "Teinte",
    "prop-s-nom": "Saturation",
    "prop-l-nom": "Luminosité",
    "prop-w-nom": "Blancheur",
    "prop-bk-nom": "Noirceur",
    "prop-ciel-nom": "Luminosité",
    "prop-ciea-nom": "Axe A",
    "prop-cieb-nom": "Axe B",
    "prop-ciec-nom": "Chroma",
    "prop-cieh-nom": "Teinte",
    "prop-okl-nom": "Luminosité",
    "prop-oka-nom": "Axe A",
    "prop-okb-nom": "Axe B",
    "prop-okc-nom": "Chroma",
    "prop-okh-nom": "Teinte",
    "prop-a-nom": "Opacité",
  },
  
  "en": {
    "pick-color": "Pick a color",
    "selector-title": "Color picker",
    "color-format": "Format",
    "prop-r-nom": "Red",
    "prop-g-nom": "Green",
    "prop-b-nom": "Blue",
    "prop-h-nom": "Hue",
    "prop-s-nom": "Saturation",
    "prop-l-nom": "Luminosity",
    "prop-w-nom": "Whiteness",
    "prop-bk-nom": "Blackness",
    "prop-ciel-nom": "Lightness",
    "prop-ciea-nom": "A axis",
    "prop-cieb-nom": "B axis",
    "prop-ciec-nom": "Chroma",
    "prop-cieh-nom": "Hue",
    "prop-okl-nom": "Lightness",
    "prop-oka-nom": "A axis",
    "prop-okb-nom": "B axis",
    "prop-okc-nom": "Chroma",
    "prop-okh-nom": "Hue",
    "prop-a-nom": "Opacity",
  }
};



export class ColorPicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [sheet];

    this.inputHandlers = new Map(); // Map<InputElement, Handler>

    this.openHandler = event => {
      if (this.getAttribute('open'))  this.close();
      else                            this.open();
    };

    this.changeHangler = async (event) => {
      const choice = event.currentTarget;
      
      const themeEvent = new CustomEvent('themechange', { detail: {
        color: choice.value
      }});
      window.dispatchEvent(themeEvent);
    }
  }


  /** Opens the options menu. */
  open() {
    // Disable focus outside the menu
    trapFocusIn(this);

    // Listens to inputs to close the menu
    const closeMenu = event => {
      const eventPath = event.composedPath();
      if (event.type == 'keydown' && !['Escape', 'Esc'].includes(event.key)) return;
      if (event.type != 'keydown' && eventPath.includes(this)) return;
      event.stopPropagation();
      const button = this.shadowRoot.querySelector('button');
      const focus = (event.type == 'click' && !eventPath.includes(button)) ? false : true;
      this.close(focus);
      window.removeEventListener(event.type, closeMenu);
    };
    window.addEventListener('click', closeMenu);
    window.addEventListener('keydown', closeMenu);
    // Display the menu
    this.setAttribute('open', '');
    // Place focus on checked input
    this.shadowRoot.querySelector('input[type="radio"]:checked')?.focus();
  }


  /** Closes the options menu. */
  close(focus = true) {
    // Restore previous focusability
    releaseFocusFrom(this, { exceptions: [this.shadowRoot.querySelector('button')] });
    
    const button = this.shadowRoot.querySelector('button');
    button.tabIndex = 0;
    // Hide the menu
    this.removeAttribute('open');
    // Place focus on the button
    if (focus) button.focus();
  }


  /** Starts monitoring changes to the selected color. */
  startMonitoringChanges() {
    const select = this.shadowRoot.querySelector('select');
    select.addEventListener('change', event => {
      this.setAttribute('format', select.value);
    });

    const rangeValue = prop => this.shadowRoot.querySelector(`input[type="range"][data-property="${prop}"]`).value;
    for (const input of [...this.shadowRoot.querySelectorAll('input[type="range"][data-property]')]) {
      // Create corresponding numeric input
      const numericInput = this.shadowRoot.querySelector(`input[type="number"][data-property="${input.dataset.property}"]`);
      numericInput.style.setProperty('--pos', (input.value - input.min) / (input.max - input.min));

      // Update gradients on range change
      let rangeChangeHandler;
      input.addEventListener('change', rangeChangeHandler = event => {
        const format = this.getAttribute('format');
        let color;
        const a = rangeValue('a') / 100;
        switch (format) {
          case 'rgb': color = `rgb(${rangeValue('r')}, ${rangeValue('g')}, ${rangeValue('b')}, ${a})`; break;
          case 'hsl': color = `hsl(${rangeValue('h')}, ${rangeValue('s')}%, ${rangeValue('l')}%, ${a})`; break;
          case 'hwb': color = `hwb(${rangeValue('h')} ${rangeValue('w')}% ${rangeValue('bk')}% / ${a})`; break;
          case 'lab': color = `lab(${rangeValue('ciel')}% ${rangeValue('ciea')} ${rangeValue('cieb')} / ${a})`; break;
          case 'lch': color = `lch(${rangeValue('ciel')}% ${rangeValue('ciec')} ${rangeValue('cieh')} / ${a})`; break;
          case 'oklab': color = `oklab(${rangeValue('okl')}% ${rangeValue('oka')} ${rangeValue('okb')} / ${a})`; break;
          case 'oklch': color = `oklch(${rangeValue('okl')}% ${rangeValue('okc')} ${rangeValue('okh')} / ${a})`; break;
        }
        this.setAttribute('last-changed-property', input.dataset.property);
        this.setAttribute('color', color);
      });
      this.inputHandlers.set(input, { type: 'change', handler: rangeChangeHandler });

      // Move numeric input on range drag
      let rangeInputHandler;
      input.addEventListener('input', rangeInputHandler = event => {
        if (numericInput.value == input.value) return;
        if (![input, numericInput].includes(document.activeElement)) input.focus();
        numericInput.value = input.value;
        numericInput.style.setProperty('--pos', (input.value - input.min) / (input.max - input.min));
      });
      this.inputHandlers.set(input, { type: 'input', handler: rangeInputHandler });

      // Move numeric input and update range input value on range change
      let numberChangeHandler;
      numericInput.addEventListener('change', numberChangeHandler = event => {
        input.value = numericInput.value;
        numericInput.style.setProperty('--pos', (input.value - input.min) / (input.max - input.min));
        input.dispatchEvent(new Event('change'));
      });
      this.inputHandlers.set(numericInput, { type: 'change', handler: numberChangeHandler });
    }
  }


  /** Stops monitoring changes to the selected color. */
  stopMonitoringChanges() {
    for (const [input, { type, handler }] of this.inputHandlers) {
      input.removeEventListener(type, handler);
    }
  }


  connectedCallback() {
    translationObserver.serve(this, { method: 'attribute' });

    // Make color-picker button clickable
    const button = this.shadowRoot.querySelector('button');
    button.addEventListener('click', this.openHandler);

    // Monitor the choice of color
    this.startMonitoringChanges();

    // Disable focusability inside the color-picker
    disableFocusInside(this, { exceptions: [this.shadowRoot.querySelector('button')] });

    // Remove the button's aria-label if the label is displayed
    this.attributeChangedCallback('label', null, this.getAttribute('label'));
  }


  disconnectedCallback() {
    const button = this.shadowRoot.querySelector('button');
    button.removeEventListener('click', this.openHandler);

    this.stopMonitoringChanges();

    translationObserver.unserve(this);
  }


  static get observedAttributes() { return ['lang', 'label', 'color']; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'lang': {
        const lang = newValue;
        const defaultLang = 'en';
        translationObserver.translate(this, strings, lang, defaultLang);
      } break;

      case 'label': {
        const button = this.shadowRoot.querySelector('button');
        if (!button) return;
        // If label shown, don't use aria-label
        if (newValue !== null) {
          button.removeAttribute('data-label');
          button.removeAttribute('aria-label');
        } else {
          button.setAttribute('data-label', 'pick-color');
          translationObserver.translate(this, strings, this.getAttribute('lang'));
        }
      } break;

      case 'color': {
        // Update gradients and button color here
        this.updateGradients(newValue, this.getAttribute('last-changed-property'));
        
      } break;
    }
  }
}

if (!customElements.get('color-picker')) customElements.define('color-picker', ColorPicker);