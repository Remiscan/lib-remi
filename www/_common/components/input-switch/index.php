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
      }

      div {
        margin: auto;
        display: grid;
        place-items: center;
        --cell-size: 14rem;
        grid-template-columns: repeat(auto-fit, var(--cell-size));
        max-width: min(95%, 3 * (var(--cell-size) + 1rem));
        gap: 1rem;
      }

      .info {
        grid-column: 1 / -1;
        padding: .5rem 1rem;
        border-radius: 2rem;
        background-color: var(--bg-color);
        position: sticky;
        z-index: 2;
        top: .5rem;
      }
    </style>
  </head>

  <body>
    <div>
      <span class="info">Click a switch!</span>

      <input-switch id="switch-0" state="off" hint="icon" style="--width: 12rem; --stroke-width: 2;"></input-switch>
      <input-switch id="switch-1" state="on" hint="text" style="--width: 12rem;"></input-switch>
      <input-switch id="switch-2" state="off" style="--width: 12rem;"></input-switch>

      <input-switch id="switch-3" state="on" hint="icon"></input-switch>
      <input-switch id="switch-4" state="off" hint="text"></input-switch>
      <input-switch id="switch-5" state="on"></input-switch>
    </div>

    <script type="module">
      <?php require_once dirname(__DIR__, 2) . '/php/version.php';
      $version = version(__DIR__, ['input-switch.js.php', 'style.css.php']); ?>

      import '/_common/components/input-switch/input-switch--<?=$version?>.js.php';


      for (const input of [...document.querySelectorAll('input-switch')]) {
        input.addEventListener('switch', event => {
          document.querySelector('.info').innerHTML = `${event.target.shadowRoot.querySelector('button').id} turned ${event.detail.state}`;
        });
      }
    </script>
  </body>

</html>