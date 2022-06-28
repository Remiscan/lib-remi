<!doctype html>
<html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;input-switch&gt;</title>

    <style>
      /*<?php themeSheetStart(); ?>*/
      html[data-theme="light"] {
        color-scheme: light;
        --bg-color: rgb(224, 224, 224);
        --text-color: black;
      }

      html[data-theme="dark"] {
        color-scheme: dark;
        --bg-color: rgb(34, 34, 34);
        --text-color: white;
      }

      :root[data-theme="light"] input-switch {
        --off-bg-color: #828282;
        --on-bg-color: hsl(231, 40%, 50%);
        --handle-color: #ebebeb;
        --handle-hover-color: #ddd;
        --handle-active-color: #fff;
        --off-text-color: var(--handle-color);
        --on-text-color: var(--handle-color);
        --focus-color: black;
      }

      :root[data-theme="dark"] input-switch {
        --off-bg-color: #929292;
        --on-bg-color: hsl(217, 89%, 75%);
        --handle-color: rgb(48, 48, 48);
        --handle-hover-color: #3a3a3a;
        --handle-active-color: #222;
        --off-text-color: var(--handle-color);
        --on-text-color: var(--handle-color);
        --focus-color: white;
      }
      /*<?php themeSheetEnd(closeComment: true); ?>*/

      @media (forced-colors: active) {
        input-switch {
          --off-bg-color: ButtonFace;
          --on-bg-color: Highlight;
          --handle-color: ButtonText;
          --handle-hover-color: Highlight;
          --handle-active-color: Highlight;
          --off-text-color: ButtonText;
          --on-text-color: Canvas;
          --focus-color: Highlight;
        }
      }

      html {
        background: var(--bg-color);
        height: 100%;
        width: 100%;
      }

      body {
        background: var(--bg-color);
        display: flex;
        position: relative;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
        color: var(--text-color);
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

      input-switch[disabled]::part(handle-container) {
        /*--mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2' width='3' height='2'%3E%3Crect x='0' y='0' width='2' height='2' fill='black'/%3E%3Crect x='1' y='1' width='1' height='1' fill='black'/%3E%3C/svg%3E");
        -webkit-mask-image: var(--mask);
        mask-image: var(--mask);
        -webkit-mask-repeat: repeat;
        mask-repeat: repeat;
        -webkit-mask-size: 3px 3px;
        mask-size: 3px 3px;*/
      }

      /*input-switch[disabled]::part(button) {
        border: 2px solid var(--disabled-color);
        background: transparent;
        cursor: not-allowed;
      }

      input-switch[disabled]::part(background) {
        background: transparent;
      }

      input-switch[disabled]::part(background)::before {
        display: none;
      }

      input-switch[disabled]::part(handle) {
        fill: var(--disabled-color);
      }

      input-switch[disabled]::part(focus-dot) {
        display: none;
      }*/
    </style>

    <!-- ▼ Cache-busted files -->
  <!--<?php versionizeStart(); ?>-->
  
    <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { "polyfillEnable": ["css-modules", "json-modules"] }</script>
    <script defer src="../../polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "input-switch": "/_common/components/input-switch/input-switch.js",
        "input-switch-styles": "/_common/components/input-switch/styles.css",
        "input-switch-template": "/_common/components/input-switch/template.js"
      }
    }
    </script>
  
    <link rel="modulepreload" href="/_common/components/input-switch/input-switch.js">
    <link rel="modulepreload" href="/_common/components/input-switch/template.js">
    <!-- CSS modules not supported in modulepreload yet 😢 -->
  
    <!--<?php versionizeEnd(__DIR__); ?>-->
  </head>

  <body>
    <div class="container">
      <span class="info"><a href="#"><strong>Flip a switch!</strong></a><br>Click or drag.</span>

      <input-switch id="switch-0" label="Switch 0" hint="icon" style="--width: 12rem; --stroke-width: 2;"></input-switch>
      <input-switch id="switch-1" label="Switch 1" checked hint="text" style="--width: 12rem;"></input-switch>
      <input-switch id="switch-2" label="Switch 2" style="--width: 12rem;"></input-switch>

      <label for="switch-3">
        Switch 3
        <input-switch id="switch-3" checked hint="icon"></input-switch>
      </label>

      <label for="switch-4" dir="rtl">
        Switch 4
        <input-switch id="switch-4" hint="text yes no"></input-switch>
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