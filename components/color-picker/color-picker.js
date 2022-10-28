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

import Couleur from 'colori';
import translationObserver from 'translation-observer';
import { disableFocusInside, releaseFocusFrom, trapFocusIn } from 'trap-focus';



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <button type="button" data-label="pick-color" part="button">
    <span part="color-preview"></span>

    <svg viewBox="0 0 24 24" part="button-icon">
      <path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.23-1.21c-.39-.39-1.02-.38-1.41 0-.39.39-.39 1.02 0 1.41l.72.72-8.77 8.77c-.1.1-.15.22-.15.36v4.04c0 .28.22.5.5.5h4.04c.13 0 .26-.05.35-.15l8.77-8.77.72.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.22-1.22 3.12-3.12c.41-.4.41-1.03.02-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/>
    </svg>

    <span part="button-label" data-string="pick-color"></span>
  </button>

  <div part="selector">
    <div part="format-choice">
      <label for="color-formats" data-string="color-format" part="select-label"></label>
      <select name="color-formats" id="color-formats" part="select">
        <option value="rgb">RGB</option>
        <option value="hsl">HSL</option>
        <option value="hwb">HWB</option>
        <option value="lab">LAB</option>
        <option value="lch">LCH</option>
        <option value="oklab">OKLAB</option>
        <option value="oklch">OKLCH</option>
      </select>
    </div>

    <label for="range-red" data-format="rgb" part="property-container" data-property="r" data-value-operation="Math.round(255 * {v})">
      <span data-string="prop-r-nom" part="property-name"></span>
      <span part="property-range">[0 ; 255]</span>
      <input type="number" part="input-number" min="0" max="255" step="1" part="input-number">
      <input type="range" part="input-range" id="range-red" min="0" max="255" step="1">
    </label>

    <label for="range-green" data-format="rgb" part="property-container" data-property="g" data-value-operation="Math.round(255 * {v})">
      <span data-string="prop-g-nom" part="property-name"></span>
      <span part="property-range">[0 ; 255]</span>
      <input type="number" part="input-number" min="0" max="255" step="1">
      <input type="range" part="input-range" id="range-green" min="0" max="255" step="1">
    </label>

    <label for="range-blue" data-format="rgb" part="property-container" data-property="b" data-value-operation="Math.round(255 * {v})">
      <span data-string="prop-b-nom" part="property-name"></span>
      <span part="property-range">[0 ; 255]</span>
      <input type="number" part="input-number" min="0" max="255" step="1">
      <input type="range" part="input-range" id="range-blue" min="0" max="255" step="1">
    </label>

    <label for="range-hue" data-format="hsl hwb" part="property-container"  data-property="h"data-value-operation="Math.round({v})">
      <span data-string="prop-h-nom" part="property-name"></span>
      <span part="property-range">[0 ; 360]</span>
      <input type="number" part="input-number" min="0" max="360" step="1">
      <input type="range" part="input-range" id="range-hue" min="0" max="360" step="1">
    </label>

    <label for="range-saturation" data-format="hsl" part="property-container" data-property="s" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-s-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input type="range" part="input-range" id="range-saturation" min="0" max="100" step="1">
    </label>

    <label for="range-luminosity" data-format="hsl" part="property-container" data-property="l" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-l-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input type="range" part="input-range" id="range-luminosity" min="0" max="100" step="1">
    </label>

    <label for="range-whiteness" data-format="hwb" part="property-container" data-property="w" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-w-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input type="range" part="input-range" id="range-whiteness" min="0" max="100" step="1">
    </label>

    <label for="range-blackness" data-format="hwb" part="property-container" data-property="bk" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-bk-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input type="range" part="input-range" id="range-blackness" min="0" max="100" step="1">
    </label>

    <label for="range-cie-lightness" data-format="lab lch" part="property-container" data-property="ciel" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-ciel-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input type="range" part="input-range" id="range-cie-lightness" min="0" max="100" step="1">
    </label>

    <label for="range-cie-a-axis" data-format="lab" part="property-container" data-property="ciea" data-value-operation="Math.round({v})">
      <span data-string="prop-ciea-nom" part="property-name"></span>
      <span part="property-range">[-80 ; 94]</span>
      <input type="number" part="input-number" min="-80" max="94" step="1">
      <input type="range" part="input-range" id="range-cie-a-axis" min="-80" max="94" step="1">
    </label>

    <label for="range-cie-b-axis" data-format="lab" part="property-container" data-property="cieb" data-value-operation="Math.round({v})">
      <span data-string="prop-cieb-nom" part="property-name"></span>
      <span part="property-range">[-112 ; 94]</span>
      <input type="number" part="input-number" min="-112" max="94" step="1">
      <input type="range" part="input-range" id="range-cie-b-axis" min="-112" max="94" step="1">
    </label>

    <label for="range-cie-chroma" data-format="lch" part="property-container" data-property="ciec" data-value-operation="Math.round({v})">
      <span data-string="prop-ciec-nom" part="property-name"></span>
      <span part="property-range">[0 ; 132]</span>
      <input type="number" part="input-number" min="0" max="132" step="1">
      <input type="range" part="input-range" id="range-cie-chroma" min="0" max="132" step="1">
    </label>

    <label for="range-cie-hue" data-format="lch" part="property-container" data-property="cieh" data-value-operation="Math.round({v})">
      <span data-string="prop-cieh-nom" part="property-name"></span>
      <span part="property-range">[0 ; 360]</span>
      <input type="number" part="input-number" min="0" max="360" step="1">
      <input type="range" part="input-range" id="range-cie-hue" min="0" max="360" step="1">
    </label>

    <label for="range-ok-lightness" data-format="oklab oklch" part="property-container" data-property="okl" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-okl-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input type="range" part="input-range" id="range-ok-lightness" min="0" max="100" step="1">
    </label>

    <label for="range-ok-a-axis" data-format="oklab" part="property-container" data-property="oka" data-value-operation="Math.round(10**3 * {v}) / 10**3">
      <span data-string="prop-oka-nom" part="property-name"></span>
      <span part="property-range">[-0.24 ; 0.28]</span>
      <input type="number" part="input-number" min="-0.24" max="0.28" step="0.001">
      <input type="range" part="input-range" id="range-ok-a-axis" min="-0.24" max="0.28" step="0.001">
    </label>

    <label for="range-ok-b-axis" data-format="oklab" part="property-container" data-property="okb" data-value-operation="Math.round(10**3 * {v}) / 10**3">
      <span data-string="prop-okb-nom" part="property-name"></span>
      <span part="property-range">[-0.32 ; 0.20]</span>
      <input type="number" part="input-number" min="-0.32" max="0.20" step="0.001">
      <input type="range" part="input-range" id="range-ok-b-axis" min="-0.32" max="0.20" step="0.001">
    </label>

    <label for="range-ok-chroma" data-format="oklch" part="property-container" data-property="okc" data-value-operation="Math.round(10**3 * {v}) / 10**3">
      <span data-string="prop-okc-nom" part="property-name"></span>
      <span part="property-range">[0 ; 0.32]</span>
      <input type="number" part="input-number" min="0" max="0.32" step="0.001">
      <input type="range" part="input-range" id="range-ok-chroma" min="0" max="0.32" step="0.001">
    </label>

    <label for="range-ok-hue" data-format="oklch" part="property-container" data-property="okh" data-value-operation="Math.round({v})">
      <span data-string="prop-okh-nom" part="property-name"></span>
      <span part="property-range">[0 ; 360]</span>
      <input type="number" part="input-number" min="0" max="360" step="1">
      <input type="range" part="input-range" id="range-ok-hue" min="0" max="360" step="1">
    </label>

    <label for="range-opacity" data-format="rgb hsl hwb lab lch oklab oklch" data-property="a" part="property-container" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-a-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input type="range" part="input-range" id="range-opacity" min="0" max="100" step="1">
    </label>
  </div>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host {
    display: grid;
    place-items: center;
    position: relative;
    --size: 3rem;
    --tap-safe-size: 44px;
    --slider-height: 12rem;
    --gradient-steps: 25;
    --cursor-width: 14;
    --echiquier-light-background-color: #ddd;
    --echiquier-dark-background-color: #555;
    --echiquier-background-color: var(--echiquier-light-background-color);
    --echiquier-transparence: linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, .1) 75%),
                              linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, .1) 75%),
                              linear-gradient(to right, var(--echiquier-background-color) 0% 100%);
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --echiquier-background-color: var(--echiquier-dark-background-color);
    }
  }

  button {
    color-scheme: light dark;

    display: grid;
    grid-template-columns: var(--size) auto;
    align-items: center;
    gap: 1ch;
    padding: 0.2em;
  }

  :host(:not([label])) > button {
    grid-template-columns: var(--size) 0;
    gap: 0;
  }

  :host(:not([label])) [part="button-label"] {
    display: none;
  }

  button > [part="color-preview"],
  button > [part="button-icon"] {
    grid-row: 1;
    grid-column: 1;
  }

  button > [part="color-preview"] {
    --displayed-color: var(--clamped-color, var(--color, transparent));
    grid-row: 1 / -1;
    background: linear-gradient(to right, var(--displayed-color) 0% 100%),
                var(--echiquier-transparence);
    background-size: 100% 100%, 16px 16px, 16px 16px;
    background-position: 0 0, 0 0, 8px 8px;
    background-repeat: no-repeat, repeat, repeat;
    width: 100%;
    height: 100%;
  }

  button > [part="button-icon"] {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    --text-color: var(--light-theme-text-color);
    fill: var(--text-color, currentColor);
    --sun-resize: .5s;
    --moon-hole-apparition: .5s;
    --moon-hole-disparition: .3s;
  }

  @media (prefers-color-scheme: dark) {
    button > [part="button-icon"] {
      --text-color: var(--dark-theme-text-color);
    }
  }



  /**********/
  /* POP-UP */
  /**********/

  [part="selector"] {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: .3rem;
    position: absolute;
    top: 100%;
    grid-row: 1;
    grid-column: 1;
    opacity: 0;
    pointer-events: none;
    background: #ddd;
    color: black;
    padding: 5px;
    border: 1px solid currentColor;
  }

  @media (prefers-color-scheme: dark) {
    [part="selector"] {
      background: #222;
      color: white;
    }
  }

  :host([open]) > [part="selector"] {
    opacity: 1;
    pointer-events: auto;
  }

  :host([position="bottom"]) > [part="selector"] {
    top: 100%;
  }
  :host([position="top"]) > [part="selector"] {
    top: unset;
    bottom: 100%;
  }
  :host([position="left"]) > [part="selector"] {
    top: unset;
    right: 100%;
  }
  :host([position="right"]) > [part="selector"] {
    top: unset;
    left: 100%;
  }



  /*****************/
  /* FORMAT SELECT */
  /*****************/

  [part="format-choice"] {
    grid-column: 1 / -1;
    width: fit-content;
    margin: auto;
  }

  [part="select-label"],
  [part="property-name"] {
    font-size: 1.1em;
    font-weight: 600;
  }

  [part="property-range"] {
    display: none;
  }



  /**********/
  /* INPUTS */
  /**********/

  label[data-format] {
    display: none;
    --slider-width: var(--tap-safe-size);
    grid-template-columns: calc(2 * var(--slider-width));
    grid-template-rows: auto auto var(--slider-height);
    justify-items: center;
    gap: 10px;
    position: relative;
  }
  
  :host(:not([format])) label[data-format~="rgb"],
  :host([format="rgb"]) label[data-format~="rgb"],
  :host([format="hsl"]) label[data-format~="hsl"],
  :host([format="hwb"]) label[data-format~="hwb"],
  :host([format="lab"]) label[data-format~="lab"],
  :host([format="lch"]) label[data-format~="lch"],
  :host([format="oklab"]) label[data-format~="oklab"],
  :host([format="oklch"]) label[data-format~="oklch"] {
    display: grid;
  }
  
  input[type="range"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: var(--slider-height);
    height: var(--slider-width);
    margin: 0;
    padding: 0;
    rotate: -90deg;
    translate: 0 calc(0.5 * (var(--slider-height) - var(--slider-width)));
    display: block;
    border: none;
    --couleurs: white 0%, black 100%;
    background: paint(range-gradient),
                var(--echiquier-transparence);
    background-size: 100% 100%, 16px 16px, 16px 16px;
    background-position: 0 0, 0 0, 8px 8px;
    background-repeat: no-repeat, repeat, repeat;
    position: relative;
    outline-offset: 3px;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: calc(var(--cursor-width) * 1px);
    height: var(--tap-safe-size);
    background: transparent;
    border: none;
    box-shadow: inset 0 0 0 2px white,
                0 0 0 2px black;
  }
  
  input[type="range"]::-moz-range-thumb {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: calc(var(--cursor-width) * 1px);
    height: var(--tap-safe-size);
    background: transparent;
    border: none;
    box-shadow: inset 0 0 0 2px white,
                0 0 0 2px black;
  }
  
  input[type="range"]::-moz-range-track {
    background: none;
  }
  
  input[type="range"][data-property]:hover + input[type="number"][data-property],
  input[type="range"][data-property]:focus + input[type="number"][data-property],
  input[type="range"][data-property]:active + input[type="number"][data-property] {
    opacity: 1;
    pointer-events: auto;
  }

  input[type="number"] {
    width: 8ch;
  }
`);



const strings = {
  "fr": {
    "pick-color": "Choisir une couleur",
    "selector-title": "Sélecteur de couleur",
    "color-format": "Format :",
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
    "color-format": "Format:",
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



const black = new Couleur('black');



export class ColorPicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [sheet];

    this.inputHandlers = []; // Array<{ input, type, handler }>

    this.openHandler = event => {
      if (this.getAttribute('open') != null)  this.close();
      else                                    this.open();
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


  getCurrentRangeValue(prop) {
    return this.shadowRoot.querySelector(`label[data-property="${prop}"] > input[type="range"]`).value;
  }


  getCurrentColorExpression() {
    let color;
    const format = this.shadowRoot.querySelector('select').value;
    const rangeValue = this.getCurrentRangeValue.bind(this);
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
    return color;
  }


  updateGradients() {
    for (const prop of Couleur.properties) {
      this.style.setProperty(`--${prop}`, this.getCurrentRangeValue(prop));
    }
  }


  linkPropertiesToFormats(format) {
    // Makes sure properties shared by multiple formats update their gradients
    const allLabels = [...this.shadowRoot.querySelectorAll(`label[data-format]`)];
    const formatLabels = [...this.shadowRoot.querySelectorAll(`label[data-format~="${format}"]`)];
    const formatIsSupported = CSS.supports(`color: ${black[format]}`);
    for (const label of allLabels) {
      const range = label.querySelector('input[type="range"]');
      if (formatLabels.includes(label)) {
        range.style.setProperty('--as-format', format);
      } else {
        range.style.setProperty('--as-format', label.dataset.format.split(' ')[0]);
      }
      range.style.setProperty('--format-is-supported', String(formatIsSupported));
    }
  }


  /** Starts monitoring changes to the selected color. */
  startMonitoringChanges() {
    const select = this.shadowRoot.querySelector('select');
    let selectChangeHandler;
    select.addEventListener('change', selectChangeHandler = event => {
      this.setAttribute('format', select.value);
    });
    this.inputHandlers.push({ input: select, type: 'change', handler: selectChangeHandler });

    for (const label of [...this.shadowRoot.querySelectorAll('label[data-property]')]) {
      const rangeInput = label.querySelector(`input[type="range"]`);
      const numericInput = label.querySelector(`input[type="number"]`);

      rangeInput.style.setProperty('--property', label.dataset.property);
      rangeInput.style.setProperty('--min', rangeInput.getAttribute('min'));
      rangeInput.style.setProperty('--max', rangeInput.getAttribute('max'));

      // Update other sliders and numeric input on slider change
      let rangeChangeHandler;
      rangeInput.addEventListener('change', rangeChangeHandler = event => {
        const colorExpr = this.getCurrentColorExpression();

        this.dispatchEvent(new CustomEvent('colorchange', {
          bubbles: true,
          detail: { color: colorExpr }
        }));

        this.setAttribute('color', colorExpr);
      });
      this.inputHandlers.push({ input: rangeInput, type: 'change', handler: rangeChangeHandler });

      // Update numeric input on slider input
      let rangeInputHandler;
      rangeInput.addEventListener('input', rangeInputHandler = event => {
        if (!this.getAttribute('color')) return;

        const colorExpr = this.getCurrentColorExpression();
        const color = new Couleur(colorExpr);

        this.dispatchEvent(new CustomEvent('colorinput', {
          bubbles: true,
          detail: { color: colorExpr }
        }));
        
        const format = this.shadowRoot.querySelector('select').value;
        this.setAttribute('last-changed-format', format);

        this.linkPropertiesToFormats(format);
        this.updateGradients();

        if (numericInput.value !== rangeInput.value) {
          if (![rangeInput, numericInput].includes(document.activeElement)) rangeInput.focus();
          numericInput.value = rangeInput.value;
        }
      });
      this.inputHandlers.push({ input: rangeInput, type: 'input', handler: rangeInputHandler });

      // Update range input on numeric input change
      let numberChangeHandler;
      numericInput.addEventListener('change', numberChangeHandler = event => {
        rangeInput.value = numericInput.value;
        rangeInput.dispatchEvent(new Event('change'));
      });
      this.inputHandlers.push({ input: numericInput, type: 'change', handler: numberChangeHandler });
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

    // Disable focusability inside the color-picker
    disableFocusInside(this, { exceptions: [this.shadowRoot.querySelector('button')] });

    // Remove the button's aria-label if the label is displayed
    this.attributeChangedCallback('label', null, this.getAttribute('label'));

    // If the format attribute is present, switch to that format
    const format = this.getAttribute('format') ?? 'rgb';
    const select = this.shadowRoot.querySelector('select');
    select.value = format;
    this.linkPropertiesToFormats(format);

    // Monitor the choice of color
    this.startMonitoringChanges();

    CSS.paintWorklet.addModule(import.meta.resolve(`range-gradient-worklet`));
    if (!this.getAttribute('color')) this.setAttribute('color', 'red');
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
        const color = new Couleur(newValue);

        // Update button color
        const button = this.shadowRoot.querySelector('button');
        button.style.setProperty('--color', newValue);
        button.style.setProperty('--clamped-color', color.toGamut('srgb').hex);
        button.style.setProperty('--light-theme-text-color', Couleur.blend(
          getComputedStyle(this).getPropertyValue('--echiquier-light-background-color').trim(),
          color
        ).bestColorScheme('background') === 'dark' ? 'white' : 'black');
        button.style.setProperty('--dark-theme-text-color', Couleur.blend(
          getComputedStyle(this).getPropertyValue('--echiquier-dark-background-color').trim(),
          color
        ).bestColorScheme('background') === 'dark' ? 'white' : 'black');

        // Update values of inputs
        const lastChangedFormat = this.getAttribute('last-changed-format');
        for (const label of [...this.shadowRoot.querySelectorAll('label[data-property]')]) {
          const rangeInput = label.querySelector(`input[type="range"]`);
          const numericInput = label.querySelector(`input[type="number"]`);

          const prop = label.dataset.property;
          const formats = label.dataset.format.split(' ');
          const clampedColor = color.toGamut(formats[0]);
          const value = clampedColor[prop];
          const displayedValue = eval(label.dataset.valueOperation.replace('{v}', value));

          if (!(formats.includes(lastChangedFormat))) {
            rangeInput.value = displayedValue;
            numericInput.value = displayedValue;
          }
        }

        // Update gradients
        this.updateGradients();
      } break;
    }
  }
}

if (!customElements.get('color-picker')) customElements.define('color-picker', ColorPicker);