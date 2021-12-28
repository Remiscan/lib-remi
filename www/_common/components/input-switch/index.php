<html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      /*<?php ob_start();?>*/
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
      /*<?php $body = ob_get_clean();
      require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
      echo buildThemesStylesheet($body); ?>*/

      /*<?php ob_start();?>*/
      :root[data-theme="light"] input-switch {
        --off-bg-color: hsl(231, 0%, 50%);
        --on-bg-color: hsl(231, 40%, 50%);
        --handle-color: #ebebeb;
        --handle-hover-color: #ddd;
        --handle-active-color: #fff;
        --off-text-color: var(--handle-color);
        --on-text-color: var(--handle-color);
        --focus-color: black;
      }

      :root[data-theme="dark"] input-switch {
        --off-bg-color: hsl(217, 0%, 55%);
        --on-bg-color: hsl(217, 89%, 75%);
        --handle-color: rgb(48, 48, 48);
        --handle-hover-color: #3a3a3a;
        --handle-active-color: #222;
        --off-text-color: var(--handle-color);
        --on-text-color: var(--handle-color);
        --focus-color: white;
      }
      /*<?php $body = ob_get_clean();
      require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
      echo buildThemesStylesheet($body); ?>*/

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

      div {
        margin: auto;
        display: grid;
        place-items: center;
        --cell-size: 13rem;
        grid-template-columns: repeat(auto-fit, var(--cell-size));
        gap: 1rem;
        max-width: min(95%, 3 * (var(--cell-size) + 1rem));
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

      input-switch[disabled] {
        opacity: .5;
      }
    </style>

    <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
    <script type="esms-options">{ "polyfillEnable": ["css-modules", "json-modules"] }</script>
    <script defer src="../../polyfills/es-module-shims.js"></script>
  </head>

  <body>
    <div>
      <span class="info"><a href="#"><strong>Flip a switch!</strong></a><br>Click or drag.</span>

      <input-switch id="switch-0" label="Switch 0" hint="icon" style="--width: 12rem; --stroke-width: 2;"></input-switch>
      <input-switch id="switch-1" label="Switch 1" checked="true" hint="text" style="--width: 12rem;"></input-switch>
      <input-switch id="switch-2" label="Switch 2" style="--width: 12rem;"></input-switch>

      <label for="switch-3">
        Switch 3
        <input-switch id="switch-3" checked="true" hint="icon"></input-switch>
      </label>

      <label for="switch-4">
        Switch 4
        <input-switch id="switch-4" hint="text yes no"></input-switch>
      </label>

      <label for="switch-5">
        Switch 5
        <input-switch id="switch-5" checked="true" disabled></input-switch>
      </label>

      <span class="action">...</span>
    </div>

    <script type="module">
      <?php require_once dirname(__DIR__, 2) . '/php/version.php';
      $version = version(__DIR__, ['input-switch.js', 'styles.css.php']); ?>

      import '/_common/components/input-switch/input-switch--<?=$version?>.js';


      for (const input of [...document.querySelectorAll('input-switch')]) {
        input.addEventListener('change', event => {
          document.querySelector('.action').classList.add('on');
          document.querySelector('.action').innerHTML = `${event.currentTarget.shadowRoot.querySelector('button').getAttribute('aria-label')} turned ${event.currentTarget.checked ? 'on' : 'off'}`;
        });
      }
    </script>
  </body>

</html>