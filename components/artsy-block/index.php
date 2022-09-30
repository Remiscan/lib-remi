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

    // Listen to settings changes

    // Type of effect
    const select = document.getElementById('effect-selection');
    select.value = blocks[0].getAttribute('type'); // take initial value from the element itself
    select.addEventListener('input', () => {
      for (const block of blocks) {
        block.setAttribute('type', select.value);
      }
      document.body.dataset.type = select.value;
    });

    // All common and specific settings
    const inputs = document.querySelectorAll('.settings input');
    for (const input of inputs) {
      input.addEventListener('input', () => {
        const value = input.value;
        for (const block of blocks) {
          block.style.setProperty(`--${input.id}`, value);
        }
        document.querySelector(`.${input.id}-value`).innerHTML = value;
      });
    }

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

  .settings {
    grid-row: 1;
    grid-column: 1;
    place-self: start;
    z-index: 2;
    background-color: rgb(255, 255, 255, .9);
    border-radius: 0 0 20px 0;
    box-sizing: border-box;
    position: fixed;
    max-height: 100%;
    overflow: auto;
  }

  .settings > summary {
    padding: 10px;
  }

  .close {
    position: absolute;
    right: 10px;
    cursor: default;
    filter: grayscale(100%) brightness(0%);
  }

  .settings:not([open]) .close {
    display: none;
  }

  .settings-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-top: 1px solid currentColor;
  }

  .settings-content > p {
    margin: 0;
  }

  body:not([data-type="rainfall"]) fieldset[data-type="rainfall"] {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color: hsl(var(--hue), 30%, 8%);
      accent-color: hsl(var(--hue), 100%, 80%);
      color: white;
    }

    .settings {
      background-color: rgb(255, 255, 255, .7);
      background-color: rgb(0, 0, 0, .6);
    }

    .close {
      filter: grayscale(100%) brightness(1000%);
    }
  }
</style>

<artsy-block type="diamonds"></artsy-block>

<details class="settings" open>
  <summary>Settings <span class="close">❌</span></summary>

  <div class="settings-content">
    <script>
      if (!('paintWorklet' in CSS)) { document.write(`<p>Not supported in your browser yet 😭, sorry!</p>`); }
    </script>

    <fieldset data-type="common">
      <legend>Common settings</legend>

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
        <span class="cell-size-value">40</span>px
      </p>

      <p>
        <label for="frequency">Frequency:</label>
        <input type="range" id="frequency" min="0" max="100" step="1" value="100">
        <span class="frequency-value">100</span>%
      </p>

      <p>
        <label for="base-hue">Hue:</label>
        <input type="range" id="base-hue" min="0" max="360" step="1" value="260">
        <span class="base-hue-value">260</span>°
      </p>

      <p>
        <label for="max-hue-spread">Max hue spread:</label>
        <input type="range" id="max-hue-spread" min="0" max="180" step="1" value="30">
        <span class="max-hue-spread-value">30</span>°
      </p>

      <p>
        <button type="button" id="request-update">Change seed</button>
      </p>
    </fieldset>

    <fieldset data-type="rainfall">
      <legend>Rainfall settings</legend>

      <p>
        <label for="fall-duration">Fall duration:</label>
        <input type="range" id="fall-duration" min="100" max="5000" step="100" value="1500">
        <span class="fall-duration-value">1500</span>ms
      </p>

      <p>
        <label for="wave-duration">Wave duration:</label>
        <input type="range" id="wave-duration" min="100" max="1000" step="100" value="500">
        <span class="wave-duration-value">500</span>ms
      </p>

      <p>
        <label for="drop-height-ratio">Raindrop height ratio:</label>
        <input type="range" id="drop-height-ratio" min="1" max="20" step="1" value="2">
        <span class="drop-height-ratio-value">2</span>
      </p>
    </fieldset>

    <p>
      <a href="/_common/components/artsy-css/">Older &lt;div&gt;s version</a>
    </p>
  </div>
</details>