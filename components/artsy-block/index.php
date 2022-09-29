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
      "dot-cells-worklet": "/_common/components/artsy-block/worklets/dot-cells.js",
      "big-dot-cells-worklet": "/_common/components/artsy-block/worklets/big-dot-cells.js",
      "starfield-worklet": "/_common/components/artsy-block/worklets/starfield.js",
      "labyrinth-worklet": "/_common/components/artsy-block/worklets/labyrinth.js",
      "rainfall-worklet": "/_common/components/artsy-block/worklets/rainfall.js"
    }
  }
  </script>
  
  <link rel="modulepreload" href="/_common/components/artsy-block/artsy-block.js">
  <link rel="preload" as="style" href="/_common/components/artsy-block/styles.css">
  <link rel="modulepreload" href="/_common/js/geometry.js">
  <link rel="modulepreload" href="/_common/js/prng.js">
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
    cellSizeInput.addEventListener('input', () => {
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
    frequencyInput.addEventListener('input', () => {
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
    hueInput.addEventListener('input', () => {
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
    hueSpreadInput.addEventListener('input', () => {
      const value = hueSpreadInput.value;
      for (const block of blocks) {
        block.style.setProperty('--max-hue-spread', value);
      }
    });
    hueSpreadInput.addEventListener('input', () => {
      const value = hueSpreadInput.value;
      document.querySelector('.hue-spread-value').innerHTML = `${value}°`;
    });

    // Cell animation
    /*const inputAnimate = document.querySelector('input#animate');
    inputAnimate.addEventListener('change', () => {
      for (const block of blocks) {
        if (inputAnimate.checked) block.setAttribute('animate', '');
        else block.removeAttribute('animate');
      }
    });*/

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
    width: 100%;
    height: 100%;
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
    overflow: hidden;
    color: black;
    background-color: hsl(var(--hue), 30%, 92%);
    accent-color: hsl(var(--hue), 100%, 50%);
  }

  artsy-block:not(:defined) {
    display: none;
  }

  artsy-block {
    grid-row: 1 / -1;
    grid-column: 1 / -1;
    resize: both;
    overflow: hidden;
    box-shadow: 0 0 0 2px currentColor;
  }

  .options {
    grid-row: 1;
    grid-column: 1;
    place-self: start;
    z-index: 2;
    background-color: rgb(255, 255, 255, .8);
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

  @media (prefers-color-scheme: dark) {
    body {
      background-color: hsl(var(--hue), 30%, 8%);
      accent-color: hsl(var(--hue), 100%, 80%);
      color: white;
    }

    .options {
      background-color: rgb(255, 255, 255, .6);
      background-color: rgb(0, 0, 0, .6);
    }
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
        <option value="big-dots">Big dots</option>
        <option value="starfield">Star field</option>
        <option value="labyrinth">Labyrinth</option>
        <option value="rainfall">Rainfall</option>
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

    <!--<p>
      <input type="checkbox" id="animate">
      <label for="animate">Animate cells</label>
    </p>-->

    <p>
      <button type="button" id="request-update">Change seed</button>
    </p>

    <p>
      <a href="/_common/components/artsy-css/">Older &lt;div&gt;s version</a>
    </p>
  </div>
</details>