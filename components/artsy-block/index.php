<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>&lt;artsy-block&gt;</title>
  
  <!-- ▼ Cache-busted files -->
  <!--<?php versionizeStart(); ?>-->

  <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
  <script>window.esmsInitOptions = { "polyfillEnable": ["css-modules", "json-modules"] }</script>
  <script defer src="../../polyfills/es-module-shims.js"></script>

  <script type="importmap">
  {
    "imports": {
      "artsy-block": "/_common/components/artsy-block/artsy-block.js",
      "artsy-block-styles": "/_common/components/artsy-block/styles.css",
      "diamond-cells-worklet": "/_common/components/artsy-block/worklets/diamond-cells.js",
      "prng": "/_common/js/prng.js"
    }
  }
  </script>
  
  <link rel="modulepreload" href="/_common/components/artsy-block/artsy-block.js">
  <!-- CSS modules not supported in modulepreload yet 😢 -->

  <!--<?php versionizeEnd(__DIR__); ?>-->

  <script type="module">
    import 'artsy-block';

    const blocks = document.querySelectorAll('artsy-block');

    // Listen to options changes

    // Type of effect
    const select = document.getElementById('effect-selection');
    select.value = blocks[0].getAttribute('type'); // take initial value from the element itself
    select.addEventListener('input', () => {
      for (const block of blocks) {
        block.setAttribute('type', select.value);
      }
    });

    // Size of cells
    const cellSizeInput = document.querySelector('input#cell-size');
    cellSizeInput.addEventListener('change', () => {
      const value = cellSizeInput.value;
      for (const block of blocks) {
        block.style.setProperty('--cell-size', value);
      }
    });
    cellSizeInput.addEventListener('input', () => {
      const value = cellSizeInput.value;
      document.querySelector('.cell-size-value').innerHTML = `${value}px`;
    });

    // Frequency of cells
    const frequencyInput = document.querySelector('input#frequency');
    frequencyInput.addEventListener('change', () => {
      const value = frequencyInput.value;
      for (const block of blocks) {
        block.style.setProperty('--frequency', value);
      }
    });
    frequencyInput.addEventListener('input', () => {
      const value = frequencyInput.value;
      document.querySelector('.frequency-value').innerHTML = `${value}%`;
    });

    // Base hue of cells
    const hueInput = document.querySelector('input#hue');
    hueInput.addEventListener('change', () => {
      const value = hueInput.value;
      for (const block of blocks) {
        block.style.setProperty('--base-hue', value);
      }
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
      for (const block of blocks) {
        block.style.setProperty('--max-hue-spread', value);
      }
    });
    hueSpreadInput.addEventListener('input', () => {
      const value = hueSpreadInput.value;
      document.querySelector('.hue-spread-value').innerHTML = `${value}°`;
    });

    // Seed update request button
    const seedUpdateButton = document.querySelector('#request-update');
    seedUpdateButton.addEventListener('click', event => {
      for (const block of blocks) {
        block.dispatchEvent(new Event('updaterequest'));
      }
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

  artsy-block {
    grid-row: 1 / -1;
    grid-column: 1 / -1;
    resize: both;
    overflow: hidden;
  }

  .options {
    grid-row: 1;
    grid-column: 1;
    place-self: start;
    z-index: 2;
    background-color: rgb(0, 0, 0, .6);
    border-radius: 0 0 20px 0;
    box-sizing: border-box;
    position: fixed;
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

<artsy-block type="diamonds"></artsy-block>

<details class="options" open>
  <summary>Options</summary>

  <div class="options-content">
    <p>
      <label for="effect-selection">Type:</label>
      <select id="effect-selection">
        <option value="diamonds">Diamonds</option>
        <option value="dots">Dots</option>
        <option value="starfield">Star field</option>
        <option value="squares">Squares</option>
        <option value="labyrinth">Labyrinth</option>
        <option value="borders">Borders</option>
      </select>
    </p>

    <p>
      <label for="cell-size">Cell size:</label>
      <input type="range" id="cell-size" min="20" max="200" step="1" value="40">
      <span class="cell-size-value">40px</span>
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
      <button type="button" id="request-update">Change seed</button>
    </p>
  </div>
</details>