<!doctype html>
<html lang="en">

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
      "diamonds-worklet": "/_common/components/artsy-block/worklets/diamonds.js",
      "dots-worklet": "/_common/components/artsy-block/worklets/dots.js",
      "bigdots-worklet": "/_common/components/artsy-block/worklets/bigdots.js",
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

    const startType = blocks[0].getAttribute('type');
    document.body.dataset.type = startType;

    // Listen to settings changes

    // Type of effect
    const select = document.getElementById('effect-selection');
    select.value = startType; // take initial value from the element itself
    select.addEventListener('input', () => {
      const previousType = document.body.dataset.type;
      const previousProps = [...document.querySelectorAll(`fieldset[data-type="${previousType}"] input`)]
        .map(input => input.id.replace(`${previousType}-`, ''));

      for (const block of blocks) {
        // Store previous type settings
        let previousPropsString = '';
        for (const prop of previousProps) {
          const previousPropValue = block.style.getPropertyValue(`--${prop}`);
          if (previousPropValue) previousPropsString += `--${prop}:${previousPropValue};`;
          block.style.removeProperty(`--${prop}`);
        }
        block.dataset[previousType] = previousPropsString;

        // Switch to new type
        block.setAttribute('type', select.value);

        // Restore new type settings if they're stored
        const storedStyles = block.dataset[select.value]?.split(';') ?? [];
        for (const storedProp of storedStyles) {
          const [prop, value] = storedProp.split(':');
          if (prop) block.style.setProperty(prop, value ?? '');
        }
      }

      document.body.dataset.type = select.value;
    });

    // Seed update request button
    const seedUpdateButton = document.querySelector('#request-update');
    seedUpdateButton.addEventListener('click', event => {
      for (const block of blocks) {
        block.dispatchEvent(new Event('updaterequest'));
      }
    });

    // All common and specific settings
    const inputs = document.querySelectorAll('.settings input');
    for (const input of inputs) {
      input.addEventListener('input', () => {
        const type = input.closest('fieldset').dataset.type;
        const prop = input.id.replace(`${type}-`, '');
        const value = input.value;
        for (const block of blocks) {
          block.style.setProperty(`--${prop}`, value);
        }
        document.querySelector(`.${input.id}-value`).innerHTML = value;
      });
    }

    // Update body hue with --base-hue
    document.querySelector('input#common-base-hue').addEventListener('input', event => {
      document.body.style.setProperty('--hue', event.currentTarget.value);
    });
  </script>

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

    body:not([data-type="diamonds"]) fieldset[data-type="diamonds"],
    body:not([data-type="dots"]) fieldset[data-type="dots"],
    body:not([data-type="bigdots"]) fieldset[data-type="bigdots"],
    body:not([data-type="starfield"]) fieldset[data-type="starfield"],
    body:not([data-type="labyrinth"]) fieldset[data-type="labyrinth"],
    body:not([data-type="rainfall"]) fieldset[data-type="rainfall"]
    {
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
</head>

<body>
  <artsy-block type="diamonds"></artsy-block>

  <details class="settings" open>
    <summary>Settings <span class="close">❌</span></summary>

    <div class="settings-content">
      <script>
        if (!('paintWorklet' in CSS)) { document.write(`<p>Not supported in your browser yet 😭, sorry!</p>`); }
      </script>

      <p>
        <label for="effect-selection">Type:</label>
        <select id="effect-selection">
          <option value="diamonds">Diamonds</option>
          <option value="dots">Dots</option>
          <option value="bigdots">Big dots</option>
          <option value="starfield">Star field</option>
          <option value="labyrinth">Labyrinth</option>
          <option value="rainfall">Rainfall</option>
        </select>
      </p>

      <p>
        <button type="button" id="request-update">Change seed</button>
      </p>

      <fieldset data-type="common">
        <legend>Common settings</legend>

        <p>
          <label for="common-cell-size">Cell size:</label>
          <input type="range" id="common-cell-size" min="20" max="200" step="1" value="40">
          <span class="common-cell-size-value">40</span>px
        </p>

        <p>
          <label for="common-frequency">Frequency:</label>
          <input type="range" id="common-frequency" min="0" max="100" step="1" value="100">
          <span class="common-frequency-value">100</span>%
        </p>

        <p>
          <label for="common-base-hue">Hue:</label>
          <input type="range" id="common-base-hue" min="0" max="360" step="1" value="260">
          <span class="common-base-hue-value">260</span>°
        </p>

        <p>
          <label for="common-max-hue-spread">Max hue spread:</label>
          <input type="range" id="common-max-hue-spread" min="0" max="180" step="1" value="30">
          <span class="common-max-hue-spread-value">30</span>°
        </p>
      </fieldset>

      <fieldset data-type="diamonds">
        <legend>Diamonds settings</legend>

        <p>
          <label for="diamonds-max-offset">Max offset:</label>
          <input type="range" id="diamonds-max-offset" min="0" max="100" step="1" value="50">
          <span class="diamonds-max-offset-value">50</span>%
        </p>

        <p>
          <label for="diamonds-min-scale">Min scale:</label>
          <input type="range" id="diamonds-min-scale" min="1" max="100" step="1" value="10">
          <span class="diamonds-min-scale-value">10</span>%
        </p>

        <p>
          <label for="diamonds-max-scale">Max scale:</label>
          <input type="range" id="diamonds-max-scale" min="1" max="100" step="1" value="60">
          <span class="diamonds-max-scale-value">60</span>%
        </p>
      </fieldset>

      <fieldset data-type="dots">
        <legend>Dots settings</legend>

        <p>
          <label for="dots-min-scale">Min scale:</label>
          <input type="range" id="dots-min-scale" min="1" max="100" step="1" value="5">
          <span class="dots-min-scale-value">5</span>%
        </p>

        <p>
          <label for="dots-max-scale">Max scale:</label>
          <input type="range" id="dots-max-scale" min="1" max="100" step="1" value="20">
          <span class="dots-max-scale-value">20</span>%
        </p>
      </fieldset>

      <fieldset data-type="bigdots">
        <legend>Big dots settings</legend>

        <p>
          <label for="bigdots-max-saturation-spread">Max saturation spread:</label>
          <input type="range" id="bigdots-max-saturation-spread" min="0" max="100" step="1" value="40">
          <span class="bigdots-max-saturation-spread-value">40</span>
        </p>

        <p>
          <label for="bigdots-max-lightness-spread">Max lightness spread:</label>
          <input type="range" id="bigdots-max-lightness-spread" min="0" max="100" step="1" value="20">
          <span class="bigdots-max-lightness-spread-value">20</span>
        </p>
      </fieldset>

      <fieldset data-type="starfield">
        <legend>Star field settings</legend>

        <p>
          <label for="starfield-max-offset">Max offset:</label>
          <input type="range" id="starfield-max-offset" min="0" max="100" step="1" value="50">
          <span class="starfield-max-offset-value">50</span>%
        </p>

        <p>
          <label for="starfield-min-scale">Min scale:</label>
          <input type="range" id="starfield-min-scale" min="1" max="100" step="1" value="2">
          <span class="starfield-min-scale-value">2</span>%
        </p>

        <p>
          <label for="starfield-max-scale">Max scale:</label>
          <input type="range" id="starfield-max-scale" min="1" max="100" step="1" value="8">
          <span class="starfield-max-scale-value">8</span>%
        </p>
      </fieldset>

      <fieldset data-type="rainfall">
        <legend>Rainfall settings</legend>

        <p>
          <label for="rainfall-fall-duration">Fall duration:</label>
          <input type="range" id="rainfall-fall-duration" min="100" max="5000" step="100" value="1500">
          <span class="rainfall-fall-duration-value">1500</span>ms
        </p>

        <p>
          <label for="rainfall-wave-duration">Wave duration:</label>
          <input type="range" id="rainfall-wave-duration" min="100" max="1000" step="100" value="500">
          <span class="rainfall-wave-duration-value">500</span>ms
        </p>

        <p>
          <label for="rainfall-drop-height-ratio">Raindrop height ratio:</label>
          <input type="range" id="rainfall-drop-height-ratio" min="1" max="20" step="1" value="2">
          <span class="rainfall-drop-height-ratio-value">2</span>
        </p>
      </fieldset>

      <p>
        <a href="/_common/components/artsy-css/">Older &lt;div&gt;s version</a>
      </p>
    </div>
  </details>