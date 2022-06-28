<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>&lt;artsy-css&gt;</title>
  
  <!-- ▼ Cache-busted files -->
  <!--<?php versionizeStart(); ?>-->

  <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
  <script>window.esmsInitOptions = { "polyfillEnable": ["css-modules", "json-modules"] }</script>
  <script defer src="../../polyfills/es-module-shims.js"></script>

  <script type="importmap">
  {
    "imports": {
      "artsy-css": "/_common/components/artsy-css/artsy-css.js",
      "artsy-css-styles": "/_common/components/artsy-css/styles.css"
    }
  }
  </script>
  
  <link rel="modulepreload" href="/_common/components/artsy-css/artsy-css.js">
  <!-- CSS modules not supported in modulepreload yet 😢 -->

  <!--<?php versionizeEnd(__DIR__); ?>-->

  <script type="module">
    import 'artsy-css';

    const container = document.querySelector('artsy-css');

    // Listen to options changes

    // Type of effect
    const select = document.getElementById('effect-selection');
    select.value = container.getAttribute('type'); // take initial value from the element itself
    select.addEventListener('input', () => {
      container.setAttribute('previous-type', container.getAttribute('type'));
      container.setAttribute('type', select.value);
    });

    // Frequency of cells
    const frequencyInput = document.querySelector('input#frequency');
    frequencyInput.addEventListener('change', () => {
      const value = frequencyInput.value;
      container.setAttribute('frequency', value);
    });
    frequencyInput.addEventListener('input', () => {
      const value = frequencyInput.value;
      document.querySelector('.frequency-value').innerHTML = `${value}%`;
    });

    // Base hue of cells
    const hueInput = document.querySelector('input#hue');
    hueInput.addEventListener('change', () => {
      const value = hueInput.value;
      container.style.setProperty('--base-hue', value);
      document.body.style.setProperty('--hue', value);
    });
    hueInput.addEventListener('input', () => {
      const value = hueInput.value;
      document.querySelector('.hue-value').innerHTML = `${value}°`;
    })

    // Max hue spread of cells
    const hueSpreadInput = document.querySelector('input#hue-spread');
    hueSpreadInput.addEventListener('change', () => {
      const value = hueSpreadInput.value;
      container.style.setProperty('--max-hue-spread', value);
    });
    hueSpreadInput.addEventListener('input', () => {
      const value = hueSpreadInput.value;
      document.querySelector('.hue-spread-value').innerHTML = `${value}°`;
    });

    // Order of cell updates
    const inputOrdre = document.querySelector('input#order');
    inputOrdre.addEventListener('change', () => {
      if (inputOrdre.checked) container.setAttribute('order', 'from-click');
      else container.removeAttribute('order');
    });

    // Apply filter over the element
    const inputFiltre = document.querySelector('input#filter');
    inputFiltre.addEventListener('change', () => {
      if (inputFiltre.checked) container.setAttribute('filter', '');
      else container.removeAttribute('filter');
    });
  </script>
</head>

<style>
  html {
    width: 100vw;
    width: 100lvw;
    height: 100vh;
    height: 100lvh;
    color-scheme: dark light;
  }

  body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    place-items: center;
    --hue: 260;
    background-color: hsl(var(--hue), 30%, 8%);
    overflow: hidden;
    color: white;
    accent-color: hsl(var(--hue), 100%, 80%);
  }

  artsy-css {
    grid-row: 1 / -1;
    grid-column: 1 / -1;
  }

  .options {
    grid-row: 1;
    grid-column: 1;
    place-self: start;
    z-index: 2;
    background-color: rgb(0, 0, 0, .6);
    border-radius: 0 0 20px 0;
    box-sizing: border-box;
  }

  .options > summary {
    padding: 10px;
  }

  .options-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-top: 1px solid currentColor;
  }

  .options-content > p {
    margin: 0;
  }
</style>

<artsy-css type="diamond" order="from-click"></artsy-css>

<details class="options" open>
  <summary>Options</summary>

  <div class="options-content">
    <p>Click anywhere to randomize the cells.</p>

    <p>
      <label for="effect-selection">Type:</label>
      <select id="effect-selection">
        <option value="diamond">Diamonds</option>
        <option value="square">Squares</option>
        <option value="labyrinth">Labyrinth</option>
        <option value="border">Borders</option>
      </select>
    </p>

    <p>
      <label for="frequency">Frequency:</label>
      <input type="range" id="frequency" min="0" max="100" step="1" value="100">
      <span class="frequency-value">100%</span>
    </p>

    <p>
      <label for="hue">Hue:</label>
      <input type="range" id="hue" min="0" max="360" step="1" value="260">
      <span class="hue-value">260°</span>
    </p>

    <p>
      <label for="hue-spread">Max hue spread:</label>
      <input type="range" id="hue-spread" min="0" max="180" step="1" value="30">
      <span class="hue-spread-value">30°</span>
    </p>

    <p>
      <input type="checkbox" id="order" checked>
      <label for="order">Cell updates spread from click</label>
    </p>

    <p>
      <input type="checkbox" id="filter">
      <label for="filter">Weird filter</label>
    </p>
  </div>
</details>