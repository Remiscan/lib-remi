<?php $sizes = [12, 8, 4]; ?>
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
        font-family: system-ui;
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
    </style>
  </head>

  <body>
    <div>
      <?php for ($i = 0; $i < count($sizes); $i++) { $rem = $sizes[$i]; ?>
      <input-switch state="<?=($i % 2 == 0) ? 'off' : 'on'?>" hint="icon" style="--width: <?=$rem?>rem;"></input-switch>
      <input-switch state="<?=($i % 2 == 1) ? 'off' : 'on'?>" hint="text" style="--width: <?=$rem?>rem;"></input-switch>
      <input-switch state="<?=($i % 2 == 0) ? 'off' : 'on'?>" style="--width: <?=$rem?>rem;"></input-switch>
      <?php } ?>
    </div>

    <script type="module">
      <?php require_once dirname(__DIR__, 2) . '/php/version.php';
      $version = version(__DIR__, ['input-switch.js.php', 'style.css.php']); ?>

      import '/_common/components/input-switch/input-switch--<?=$version?>.js.php';



      document.querySelector('input-switch').addEventListener('switch', event => {
        console.log(`Switch turned ${event.detail.state}`);
      });
    </script>
  </body>

</html>