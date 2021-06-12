<html>

  <head>
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
        --cell-size: 14rem;
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

      strong {
        font-size: 2em;
      }

      label {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .6rem;
      }
    </style>
  </head>

  <body>
    <div>
      <span class="info"><strong>Flip a switch!</strong><br>Click or drag.</span>

      <input-switch id="switch-0" label="Switch 0" hint="icon" style="--width: 12rem; --stroke-width: 2;"></input-switch>
      <input-switch id="switch-1" label="Switch 1" state="on" hint="text" style="--width: 12rem;"></input-switch>
      <input-switch id="switch-2" label="Switch 2" style="--width: 12rem;"></input-switch>

      <label for="switch-3">
        Switch 3
        <input-switch id="switch-3" state="on" hint="icon"></input-switch>
      </label>

      <label for="switch-4">
        Switch 4
        <input-switch id="switch-4" hint="text"></input-switch>
      </label>

      <label for="switch-5">
        Switch 5
        <input-switch id="switch-5" state="on"></input-switch>
      </label>

      <span class="action">...</span>
    </div>

    <script type="module">
      <?php require_once dirname(__DIR__, 2) . '/php/version.php';
      $version = version(__DIR__, ['input-switch.js.php', 'style.css.php']); ?>

      import '/_common/components/input-switch/input-switch--<?=$version?>.js.php';


      for (const input of [...document.querySelectorAll('input-switch')]) {
        input.addEventListener('switch', event => {
          document.querySelector('.action').classList.add('on');
          document.querySelector('.action').innerHTML = `${event.target.shadowRoot.querySelector('button').getAttribute('aria-label')} turned ${event.detail.state}`;
        });
      }
    </script>
  </body>

</html>