/* Use with this import map:
<script type="importmap">
{
  "imports": {
    "color-picker": "/_common/components/color-picker/color-picker.js",
    "range-gradient-worklet": "/_common/components/color-picker/worklet.js.php",
    "input-slider": "/_common/components/input-slider/input-slider.js",
    "colori": "/colori/lib/dist/colori.min.js",
    "translation-observer": "/_common/js/translation-observer.js"
  }
}
</script>
*/

import Couleur from 'colori';
import 'input-slider';
import translationObserver from 'translation-observer';



const paintWorkletSupport = 'paintWorklet' in CSS;
if (paintWorkletSupport) {
  CSS.paintWorklet.addModule(import.meta.resolve(`range-gradient-worklet`));
}



const template = document.createElement('template');
template.innerHTML = /*html*/`
  <input type="color" part="backup-input">

  <button type="button" data-label="pick-color" part="button">
    <span part="color-preview"></span>

    <svg viewBox="0 0 24 24" part="button-icon">
      <path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.23-1.21c-.39-.39-1.02-.38-1.41 0-.39.39-.39 1.02 0 1.41l.72.72-8.77 8.77c-.1.1-.15.22-.15.36v4.04c0 .28.22.5.5.5h4.04c.13 0 .26-.05.35-.15l8.77-8.77.72.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.22-1.22 3.12-3.12c.41-.4.41-1.03.02-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/>
    </svg>

    <span part="button-label" data-string="pick-color"></span>
  </button>

  <dialog part="selector">
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
        <option value="oklrab">OKLrAB</option>
        <option value="oklrch">OKLrCH</option>
        <option value="okhsl">OKHSL</option>
        <option value="okhsv">OKHSV</option>
      </select>
    </div>

    <label for="range-red" data-format="rgb" part="property-container" data-property="r" data-value-operation="Math.round(255 * {v})">
      <span data-string="prop-r-nom" part="property-name"></span>
      <span part="property-range">[0 ; 255]</span>
      <input type="number" part="input-number" min="0" max="255" step="1" part="input-number">
      <input-slider orientation="vertical" part="input-range" id="range-red" min="0" max="255" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-green" data-format="rgb" part="property-container" data-property="g" data-value-operation="Math.round(255 * {v})">
      <span data-string="prop-g-nom" part="property-name"></span>
      <span part="property-range">[0 ; 255]</span>
      <input type="number" part="input-number" min="0" max="255" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-green" min="0" max="255" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-blue" data-format="rgb" part="property-container" data-property="b" data-value-operation="Math.round(255 * {v})">
      <span data-string="prop-b-nom" part="property-name"></span>
      <span part="property-range">[0 ; 255]</span>
      <input type="number" part="input-number" min="0" max="255" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-blue" min="0" max="255" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-hue" data-format="hsl hwb" part="property-container"  data-property="h"data-value-operation="Math.round({v})">
      <span data-string="prop-h-nom" part="property-name"></span>
      <span part="property-range">[0 ; 359]</span>
      <input type="number" part="input-number" min="0" max="359" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-hue" min="0" max="359" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-saturation" data-format="hsl" part="property-container" data-property="s" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-s-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-saturation" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-luminosity" data-format="hsl" part="property-container" data-property="l" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-l-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-luminosity" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-whiteness" data-format="hwb" part="property-container" data-property="w" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-w-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-whiteness" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-blackness" data-format="hwb" part="property-container" data-property="bk" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-bk-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-blackness" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-cie-lightness" data-format="lab lch" part="property-container" data-property="ciel" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-ciel-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-cie-lightness" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-cie-a-axis" data-format="lab" part="property-container" data-property="ciea" data-value-operation="Math.round({v})">
      <span data-string="prop-ciea-nom" part="property-name"></span>
      <span part="property-range">[-80 ; 94]</span>
      <input type="number" part="input-number" min="-80" max="94" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-cie-a-axis" min="-80" max="94" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-cie-b-axis" data-format="lab" part="property-container" data-property="cieb" data-value-operation="Math.round({v})">
      <span data-string="prop-cieb-nom" part="property-name"></span>
      <span part="property-range">[-112 ; 94]</span>
      <input type="number" part="input-number" min="-112" max="94" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-cie-b-axis" min="-112" max="94" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-cie-chroma" data-format="lch" part="property-container" data-property="ciec" data-value-operation="Math.round({v})">
      <span data-string="prop-ciec-nom" part="property-name"></span>
      <span part="property-range">[0 ; 132]</span>
      <input type="number" part="input-number" min="0" max="132" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-cie-chroma" min="0" max="132" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-cie-hue" data-format="lch" part="property-container" data-property="cieh" data-value-operation="Math.round({v})">
      <span data-string="prop-cieh-nom" part="property-name"></span>
      <span part="property-range">[0 ; 359]</span>
      <input type="number" part="input-number" min="0" max="359" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-cie-hue" min="0" max="359" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-ok-lightness" data-format="oklab oklch" part="property-container" data-property="okl" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-okl-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-ok-lightness" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-ok-lightness-r" data-format="oklrab oklrch okhsl" part="property-container" data-property="oklr" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-oklr-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-ok-lightness-r" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-ok-value" data-format="okhsv" part="property-container" data-property="okv" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-okv-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-ok-value" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-ok-a-axis" data-format="oklab oklrab" part="property-container" data-property="oka" data-value-operation="Math.round(10**3 * {v}) / 10**3">
      <span data-string="prop-oka-nom" part="property-name"></span>
      <span part="property-range">[-0.24 ; 0.28]</span>
      <input type="number" part="input-number" min="-0.24" max="0.28" step="0.001">
      <input-slider orientation="vertical" part="input-range" id="range-ok-a-axis" min="-0.24" max="0.28" step="0.001" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-ok-b-axis" data-format="oklab oklrab" part="property-container" data-property="okb" data-value-operation="Math.round(10**3 * {v}) / 10**3">
      <span data-string="prop-okb-nom" part="property-name"></span>
      <span part="property-range">[-0.32 ; 0.20]</span>
      <input type="number" part="input-number" min="-0.32" max="0.20" step="0.001">
      <input-slider orientation="vertical" part="input-range" id="range-ok-b-axis" min="-0.32" max="0.20" step="0.001" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-ok-chroma" data-format="oklch oklrch" part="property-container" data-property="okc" data-value-operation="Math.round(10**3 * {v}) / 10**3">
      <span data-string="prop-okc-nom" part="property-name"></span>
      <span part="property-range">[0 ; 0.32]</span>
      <input type="number" part="input-number" min="0" max="0.32" step="0.001">
      <input-slider orientation="vertical" part="input-range" id="range-ok-chroma" min="0" max="0.32" step="0.001" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-ok-saturation-l" data-format="okhsl" part="property-container" data-property="oksl" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-oksl-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-ok-saturation-l" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-ok-saturation-v" data-format="okhsv" part="property-container" data-property="oksv" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-oksv-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-ok-saturation-v" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-ok-hue" data-format="oklch oklrch okhsl okhsv" part="property-container" data-property="okh" data-value-operation="Math.round({v})">
      <span data-string="prop-okh-nom" part="property-name"></span>
      <span part="property-range">[0 ; 359]</span>
      <input type="number" part="input-number" min="0" max="359" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-ok-hue" min="0" max="359" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>

    <label for="range-opacity" data-format="rgb hsl hwb lab lch oklab oklch oklrab oklrch okhsl okhsv" data-property="a" part="property-container" data-value-operation="Math.round(100 * {v})">
      <span data-string="prop-a-nom" part="property-name"></span>
      <span part="property-range">[0 ; 100]</span>
      <input type="number" part="input-number" min="0" max="100" step="1">
      <input-slider orientation="vertical" part="input-range" id="range-opacity" min="0" max="100" step="1" exportparts="slider-track,slider-thumb"></input-slider>
    </label>
  </dialog>
`;



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  :host {
    display: grid;
    place-items: center;
    position: relative;
    --size: 3rem;
    --tap-safe-size: 44px;
    --range-height: 12rem;
    --gradient-steps: 25;
    --cursor-width: 14;
    --range-border-width: 2px;
    --range-border-radius: 0px;
    --checkered-light-background-color: #fff;
    --checkered-light-cell-color: rgba(0, 0, 0, .1);
    /*--checkered-dark-background-color: #000;
    --checkered-dark-cell-color: rgba(255, 255, 255, .1);*/
    --checkered-dark-background-color: var(--checkered-light-background-color);
    --checkered-dark-cell-color: var(--checkered-light-cell-color);
    --border-color: black;
    --border-color-opposite: white;
    --checkered-background-color: var(--checkered-light-background-color);
    --checkered-cell-color: var(--checkered-light-cell-color);
    --checkered-transparence: linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, .1) 75%),
                              linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, .1) 75%),
                              linear-gradient(to right, var(--checkered-background-color) 0% 100%);
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --border-color: white;
      --border-color-opposite: black;
      --checkered-background-color: var(--checkered-dark-background-color);
      --checkered-cell-color: var(--checkered-dark-cell-color);
    }
  }

  [part="backup-input"] {
    display: none;
  }

  @supports not (background: paint(checkered)) {
    [part="backup-input"] {
      display: revert;
    }

    [part="button"],
    [part="selector"] {
      display: none;
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

  /* Hit zone bigger than the actual button */
  button::before {
    content: '';
    display: block;
    width: 100%;
    min-width: var(--tap-safe-size);
    height: 100%;
    min-height: var(--tap-safe-size);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
                paint(checkered);
    width: 100%;
    height: 100%;
  }

  button > [part="button-icon"] {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    --icon-color: var(--light-theme-icon-color);
    fill: var(--icon-color, currentColor);
    --sun-resize: .5s;
    --moon-hole-apparition: .5s;
    --moon-hole-disparition: .3s;
  }

  @media (prefers-color-scheme: dark) {
    button > [part="button-icon"] {
      --icon-color: var(--dark-theme-icon-color);
    }
  }



  /**********/
  /* POP-UP */
  /**********/

  [part="selector"] {
    grid-template-columns: repeat(4, 1fr);
    gap: .3rem;
    background: #ddd;
    color: black;
    padding: 5px;
    border: 1px solid currentColor;
    box-sizing: border-box;
    max-width: 100vw;
    max-height: 100vh;
    overscroll-behavior: contain;
  }

  @media (prefers-color-scheme: dark) {
    [part="selector"] {
      background: #222;
      color: white;
    }
  }

  [part="selector"][open] {
    display: grid;
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
    --range-width: var(--tap-safe-size);
    --range-full-width: calc(var(--range-width) + 2 * var(--range-border-width));
    --range-full-height: calc(var(--range-height) + 2 * var(--range-border-width));
    grid-template-columns: calc(2 * var(--range-width));
    grid-template-rows: auto auto var(--range-full-height);
    justify-items: center;
    gap: 10px;
    position: relative;
    --gradient-steps: 25;
  }

  /* Gradient steps per format */
  label[data-property="r"],
  label[data-property="g"],
  label[data-property="b"],
  label[data-property="a"] {
    --gradient-steps: 1;
  }
  label[data-property="h"],
  label[data-property="s"],
  label[data-property="l"],
  label[data-property="w"],
  label[data-property="bk"] {
    --gradient-steps: 25;
  }
  label[data-property="ciel"],
  label[data-property="ciea"],
  label[data-property="cieb"],
  label[data-property="ciec"],
  label[data-property="cieh"],
  label[data-property="okl"],
  label[data-property="oka"],
  label[data-property="okb"],
  label[data-property="okc"],
  label[data-property="okh"],
  label[data-property="oklr"],
  label[data-property="okv"],
  label[data-property="oksl"],
  label[data-property="oksv"] {
    --gradient-steps: 50;
  }

  /* Properties displayed per format */
  :host(:not([format])) label[data-format~="rgb"],
  :host([format="rgb"]) label[data-format~="rgb"],
  :host([format="hsl"]) label[data-format~="hsl"],
  :host([format="hwb"]) label[data-format~="hwb"],
  :host([format="lab"]) label[data-format~="lab"],
  :host([format="lch"]) label[data-format~="lch"],
  :host([format="oklab"]) label[data-format~="oklab"],
  :host([format="oklch"]) label[data-format~="oklch"],
  :host([format="oklrab"]) label[data-format~="oklrab"],
  :host([format="oklrch"]) label[data-format~="oklrch"],
  :host([format="okhsl"]) label[data-format~="okhsl"],
  :host([format="okhsv"]) label[data-format~="okhsv"] {
    display: grid;
  }
  
  input-slider {
    --block-size: var(--range-width);
    --inline-size: var(--range-height);
    --border: var(--range-border-width, 0px) var(--range-border-style, solid) var(--range-border-color, var(--border-color-opposite));
    border: var(--border, none);
    border-radius: var(--range-border-radius);
    --couleurs: white 0%, black 100%;
    background: paint(range-gradient),
                paint(checkered);
    background-repeat: no-repeat, no-repeat;
    position: relative;
  }

  input-slider::part(slider-track) {
    display: none;
  }
  
  input-slider::part(slider-thumb) {
    height: calc(var(--cursor-width) * 1px);
    background: transparent;
    border: none;
    border-radius: var(--range-border-radius);
    box-shadow: inset 0 0 0 2px var(--border-color-opposite),
                0 0 0 2px var(--border-color);
  }
  
  input-slider[data-property]:hover + input[type="number"][data-property],
  input-slider[data-property]:focus + input[type="number"][data-property],
  input-slider[data-property]:active + input[type="number"][data-property] {
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
    "prop-oklr-nom": "Luminosité",
    "prop-oka-nom": "Axe A",
    "prop-okb-nom": "Axe B",
    "prop-okc-nom": "Chroma",
    "prop-okh-nom": "Teinte",
    "prop-oksl-nom": "Saturation",
    "prop-oklr-nom": "Luminosité",
    "prop-oksv-nom": "Saturation",
    "prop-okv-nom": "Valeur",
    "prop-a-nom": "Opacité",
  },
  
  "en": {
    "pick-color": "Choose a color",
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
    "prop-oklr-nom": "Lightness",
    "prop-oka-nom": "A axis",
    "prop-okb-nom": "B axis",
    "prop-okc-nom": "Chroma",
    "prop-okh-nom": "Hue",
    "prop-oksl-nom": "Saturation",
    "prop-oklr-nom": "Lightness",
    "prop-oksv-nom": "Saturation",
    "prop-okv-nom": "Value",
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

    this.backupHandler = event => {
      switch (event.type) {
        case 'input':
        case 'change': {
          //event.stopPropagation();
          this.dispatchEvent(new CustomEvent(event.type, {
            bubbles: true,
            detail: { color: event.currentTarget.value }
          }));
        } break;

        default:
          return;
      }
    }

    this.lastinputcolor = null;
    this.lastchangecolor = null;
  }


  /** Opens the options menu. */
  open() {
    const selector = this.shadowRoot.querySelector('[part="selector"]');
    selector.showModal();

    const closeMenu = event => {
      const rect = selector.getBoundingClientRect();
      const x = event.clientX, y = event.clientY;
      // If click inside dialog rect, don't close the dialog
      if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) return;
      if (event.screenX === 0 && event.screenY === 0) return; // prevent closing on clicking <select> option in iframe
      this.close();
      selector.removeEventListener('click', closeMenu);
    };
    selector.addEventListener('click', closeMenu);
  }


  /**
   * Closes the options menu.
   * @param {boolean} focus - Whether to focus on the toggle button after closing.
   */
  close() {
    const selector = this.shadowRoot.querySelector('[part="selector"]');
    selector.close();
  }


  /**
   * Gets the current input value of a certain color property.
   * @param {string} prop - The name of the color property.
   * @returns {string} The current input value.
   */
  #getCurrentRangeValue(prop) {
    return this.shadowRoot.querySelector(`label[data-property="${prop}"] > input-slider`).value;
  }


  /**
   * Returns the expression of the color based on current input values.
   * @returns {string} A color expression.
   */
  #getCurrentColorExpression() {
    const format = this.shadowRoot.querySelector('select').value;
    const rangeValue = prop => {
      const value = this.#getCurrentRangeValue(prop);
      switch (prop) {
        case 'r': case 'g': case 'b':
          return `${Number(value) / 255}`;
        case 'a': case 's': case 'l': case 'w': case 'bk': case 'ciel': case 'okl': case 'oksl': case 'oklr': case 'oksv': case 'okv':
          return `${Number(value) / 100}`;
        default:
          return `${value}`;
      }
    }
    
    const values = [...Couleur.propertiesOf(format), 'a'].map(p => rangeValue(p));
    const cssFormats = ['rgb', 'hsl', 'hwb', 'lab', 'lch', 'oklab', 'oklch'];
    const appliedFormat = cssFormats.includes(format) ? format : `color-${format}`;
    return Couleur.makeString(appliedFormat, values, { precision: 2 });
  }


  /**
   * Update the gradients of the input-sliders.
   */
  #updateGradients() {
    const format = this.shadowRoot.querySelector('select').value;

    const allLabels = [...this.shadowRoot.querySelectorAll(`label[data-format]`)];
    const formatLabels = format ? [...this.shadowRoot.querySelectorAll(`label[data-format~="${format}"]`)] : [];
    const formatIsSupported = CSS.supports(`color: ${black.toString(`color-${format}`)}`);

    for (const label of allLabels) {
      const rangeInput = label.querySelector('input-slider');
      const appliedFormat = formatLabels.includes(label) ? format : label.dataset.format.split(' ')[0];

      // Make the paint worklet recalculate the gradients
      for (const prop of [...Couleur.propertiesOf(appliedFormat), 'a']) {
        label.style.setProperty(`--${prop}`, this.#getCurrentRangeValue(prop));
      }

      rangeInput.style.setProperty('--as-format', appliedFormat);
      rangeInput.style.setProperty('--format-is-supported', String(formatIsSupported));
    }
  }


  /**
   * Updates the color of the color-picker button when its selected color is updated.
   * @param {string} colorExpr - The expression of the selected color.
   */
  #updateButtonColor(colorExpr) {
    const color = new Couleur(colorExpr);
    const button = this.shadowRoot.querySelector('button');

    // Update color of the button, with clamped version in case the format isn't supported yet by the browser
    button.style.setProperty('--color', colorExpr);
    button.style.setProperty('--clamped-color', color.toGamut('srgb').hex);

    // Update color of the icon, enforcing good contrast with the button color
    button.style.setProperty('--light-theme-icon-color', Couleur.blend(
      getComputedStyle(this).getPropertyValue('--checkered-light-background-color').trim(),
      color
    ).bestColorScheme('background') === 'dark' ? 'white' : 'black');
    button.style.setProperty('--dark-theme-icon-color', Couleur.blend(
      getComputedStyle(this).getPropertyValue('--checkered-dark-background-color').trim(),
      color
    ).bestColorScheme('background') === 'dark' ? 'white' : 'black');
  }


  /**
   * Updates the values of inputs of the non-selected formats when the selected color is updated.
   * @param {string} colorExpr - The expression of the selected color.
   * @param {string} format - The user-selected format, whose values won't be updated because they were chosen by the user.
   */
  #updateOtherInputs(colorExpr, format = this.shadowRoot.querySelector('select').value) {
    const color = new Couleur(colorExpr);
    for (const label of [...this.shadowRoot.querySelectorAll('label[data-property]')]) {
      const rangeInput = label.querySelector(`input-slider`);
      const numericInput = label.querySelector(`input[type="number"]`);

      const prop = label.dataset.property;
      const formats = label.dataset.format.split(' ');
      const appliedFormat = (format && Couleur.propertiesOf(format).includes(prop)) ? format : formats[0];
      const clampedColor = color.toGamut(appliedFormat);
      const propIndex = [...Couleur.propertiesOf(appliedFormat), 'a'].findIndex(p => p === prop);
      const value = [...clampedColor.valuesTo(appliedFormat), clampedColor.a][propIndex];
      const displayedValue = eval(label.dataset.valueOperation.replace('{v}', value));

      // Don't update values of the currently chosen format
      if (!(formats.includes(format))) {
        rangeInput.value = displayedValue;
        numericInput.value = displayedValue;
      }
    }
  }


  /**
   * Updates the selected color when an input-slider's value is modified.
   * @param {Event} event - The event that triggered the color update.
   * @param {string} colorExpr - The expression of the selected color.
   * @param {HTMLInputElement} rangeInput - The input-slider element that triggered the event.
   */
  #updateColor(event, colorExpr, rangeInput) {
    if (this[`last${event.type}color`] === colorExpr) return;
    this[`last${event.type}color`] = colorExpr;
    
    this.dispatchEvent(new CustomEvent(event.type, {
      bubbles: true,
      detail: { color: colorExpr }
    }));

    this.setAttribute('color', colorExpr);

    // Update button color
    this.#updateButtonColor(colorExpr);

    // Update values of inputs that weren't manually changed by the user
    if (event.type === 'change') {
      this.#updateOtherInputs(colorExpr);
    }

    // Update gradients
    this.#updateGradients();

    if (rangeInput) {
      const numericInput = rangeInput.parentElement.querySelector(`input[type="number"]`);

      // Only update the value of numericInput if the value of rangeInput changed
      if (numericInput.value !== rangeInput.value) {
        if (![rangeInput, numericInput].includes(document.activeElement)) {
          rangeInput.focus();
        }
        numericInput.value = rangeInput.value;
      }
    }
  }


  /**
   * Programmatically update the selected color.
   * @param {string} colorExpr - The expression of the selected color.
   */
  selectColor(colorExpr) {
    this.#updateOtherInputs(colorExpr, null);
    this.#updateColor(new Event('change'), colorExpr);
  }


  /** Starts monitoring changes to the selected color. */
  #startMonitoringChanges() {
    const select = this.shadowRoot.querySelector('select');
    let selectChangeHandler;
    select.addEventListener('change', selectChangeHandler = event => {
      const format = select.value;
      this.setAttribute('format', format);
      this.#updateGradients();
    });
    this.inputHandlers.push({ input: select, type: 'change', handler: selectChangeHandler });

    for (const label of [...this.shadowRoot.querySelectorAll('label[data-property]')]) {
      const rangeInput = label.querySelector(`input-slider`);
      const numericInput = label.querySelector(`input[type="number"]`);

      rangeInput.style.setProperty('--property', label.dataset.property);
      rangeInput.style.setProperty('--min', rangeInput.getAttribute('min'));
      rangeInput.style.setProperty('--max', rangeInput.getAttribute('max'));

      const rangeHandler = event => this.#updateColor(event, this.#getCurrentColorExpression(), rangeInput);
      const numericHandler = event => {
        // Update range input on numeric input change
        rangeInput.value = numericInput.value;
        rangeInput.dispatchEvent(new Event(event.type));
      };

      for (const type of ['change', 'input']) {
        rangeInput.addEventListener(type, rangeHandler);
        this.inputHandlers.push({ input: rangeInput, type, handler: rangeHandler });

        numericInput.addEventListener(type, numericHandler);
        this.inputHandlers.push({ input: numericInput, type, handler: numericHandler });
      }
    }
  }


  /** Stops monitoring changes to the selected color. */
  #stopMonitoringChanges() {
    for (const [input, { type, handler }] of this.inputHandlers) {
      input.removeEventListener(type, handler);
    }
  }


  connectedCallback() {
    translationObserver.serve(this, { method: 'attribute' });

    const startColor = this.getAttribute('color') ?? 'red';

    if (!paintWorkletSupport) {
      const backupInput = this.shadowRoot.querySelector('input[type="color"]');
      backupInput.value = new Couleur(startColor).hex;
      backupInput.addEventListener('input', this.backupHandler);
      backupInput.addEventListener('change', this.backupHandler);
      return;
    }

    // If the format attribute is present, switch to that format
    const format = this.getAttribute('format') ?? 'rgb';
    const select = this.shadowRoot.querySelector('select');
    select.value = format;

    // Use the color attribute as the starting color
    this.selectColor(startColor);

    // Remove the button's aria-label if the label is displayed
    this.attributeChangedCallback('label', null, this.getAttribute('label'));

    // Make color-picker button clickable
    const button = this.shadowRoot.querySelector('button');
    button.addEventListener('click', this.openHandler);

    // Monitor the choice of color
    this.#startMonitoringChanges();
  }


  disconnectedCallback() {
    translationObserver.unserve(this);

    if (!paintWorkletSupport) {
      const backupInput = this.shadowRoot.querySelector('input[type="color"]');
      backupInput.removeEventListener('input', this.backupHandler);
      backupInput.removeEventListener('change', this.backupHandler);
      return;
    }

    const button = this.shadowRoot.querySelector('button');
    button.removeEventListener('click', this.openHandler);

    this.#stopMonitoringChanges();
  }


  static get observedAttributes() { return ['lang', 'label']; }
  

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (attr) {
      case 'lang': {
        const lang = newValue;
        const defaultLang = 'en';
        translationObserver.translate(this, strings, lang, defaultLang);
      } break;

      case 'label': {
        if (!paintWorkletSupport) {
          const backupInput = this.shadowRoot.querySelector('input[type="color"]');
          backupInput.setAttribute('data-label', 'pick-color');
          translationObserver.translate(this, strings, this.getAttribute('lang'));
          return;
        }

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
    }
  }
}

if (!customElements.get('color-picker')) customElements.define('color-picker', ColorPicker);