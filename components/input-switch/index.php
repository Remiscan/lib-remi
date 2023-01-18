<!doctype html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;input-switch&gt; (v2)</title>

    <style>
      html {
        color-scheme: light dark;
        height: 100%;
        width: 100%;
      }

      body {
        display: flex;
        position: relative;
        font-family: system-ui, sans-serif;
        padding: 1rem;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
      }

      .container {
        margin: auto;
        display: grid;
        place-items: center;
        --cell-size: 13rem;
        grid-template-columns: repeat(auto-fit, var(--cell-size));
        gap: 1rem;
        width: min(95%, 3 * (var(--cell-size) + 1rem));
        justify-content: center;
      }

      .info, .action {
        grid-column: 1 / -1;
        padding: .5rem 1rem;
        border-radius: 2rem;
        background-color: var(--bg-color);
        z-index: 2;
        text-align: center;
      }

      .action {
        position: sticky;
        bottom: .6rem;
        opacity: 0;
      }
      .action.on {
        opacity: 1;
      }

      a {
        color: currentColor;
      }

      strong {
        font-size: 1.6em;
      }

      label {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .6rem;
      }

      input-switch[disabled]::part(button) {
        cursor: not-allowed;
      }

      input-switch[disabled] {
        opacity: .5;
      }
    </style>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->
  
    <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { "polyfillEnable": ["css-modules", "json-modules"] }</script>
    <script defer src="../../polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "input-switch": "/_common/components/input-switch/input-switch.js"
      }
    }
    </script>
  
    <link rel="modulepreload" href="/_common/components/input-switch/input-switch.js">
  
    <!--<?php versionizeEnd(__DIR__); ?>-->
  </head>

  <body>
    <div class="container">
      <span class="info">
        <a href="#"><strong>Flip a switch!</strong></a>
        <br>Click or drag. (<a class="other-version" href="v1.php">See v1</a>)
      </span>

      <input-switch id="switch-0" label="Switch 0" icon-off icon-on style="font-size: 3rem"></input-switch>
      <input-switch id="switch-1" label="Switch 1" checked icon-on style="font-size: 3rem"></input-switch>
      <input-switch id="switch-2" label="Switch 2" style="font-size: 3rem"></input-switch>

      <form>
        <label for="switch-3">
          Switch 3
          <input-switch id="switch-3" checked icon-off icon-on name="switch"></input-switch>
        </label>
      </form>

      <label for="switch-4" dir="rtl">
        Switch 4
        <input-switch id="switch-4" icon-on></input-switch>
      </label>

      <label for="switch-5">
        Switch 5
        <input-switch id="switch-5" checked disabled></input-switch>
      </label>

      <span class="action">...</span>
    </div>

    <script type="module">
      import 'input-switch';

      for (const input of [...document.querySelectorAll('input-switch')]) {
        input.addEventListener('change', event => {
          document.querySelector('.action').classList.add('on');
          document.querySelector('.action').innerHTML = `${event.currentTarget.shadowRoot.querySelector('button').getAttribute('aria-label')} turned ${event.currentTarget.checked ? 'on' : 'off'}`;
        });
      }
    </script>
  </body>

</html>