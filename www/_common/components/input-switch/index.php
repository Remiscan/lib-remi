<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      /*<?php ob_start();?>*/
      html[data-theme="light"] {
        color-scheme: light;
        --bg-color: rgb(224, 224, 224);
      }

      html[data-theme="dark"] {
        color-scheme: dark;
        --bg-color: rgb(34, 34, 34);
      }
      /*<?php $body = ob_get_clean();
      require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
      echo buildThemesStylesheet($body); ?>*/

      body {
        background: var(--bg-color);
        display: grid;
        color: var(--sunmoon-color);
        position: relative;
        padding: 3rem;
        gap: 1rem;
        font-family: system-ui;
      }
    </style>
  </head>

  <body>
    <input-switch state="off" hint="icon" id="test" style="--width: 18rem"></input-switch>
    <input-switch state="on" hint="text" style="--width: 16.8rem"></input-switch>
    <input-switch state="off" style="--width: 15.6rem"></input-switch>
    <input-switch state="on" hint="icon" style="--width: 14.4rem"></input-switch>
    <input-switch state="off" hint="text" style="--width: 13.2rem"></input-switch>
    <input-switch state="on" style="--width: 12rem"></input-switch>
    <input-switch state="off" hint="icon" style="--width: 10.8rem"></input-switch>
    <input-switch state="on" hint="text" style="--width: 9.6rem"></input-switch>
    <input-switch state="off" style="--width: 8.4rem"></input-switch>
    <input-switch state="on" hint="icon" style="--width: 7.2rem"></input-switch>
    <input-switch state="off" hint="text" style="--width: 6rem"></input-switch>
    <input-switch state="on" style="--width: 4.8rem"></input-switch>
    <input-switch state="off" hint="icon" style="--width: 3.6rem"></input-switch>
    <input-switch state="on" hint="text" style="--width: 2.4rem"></input-switch>
    <input-switch state="off" style="--width: 1.2rem"></input-switch>

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