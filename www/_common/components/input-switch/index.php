<html>

  <head>
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
      }
    </style>
  </head>

  <body>
    <input-switch state="off" id="test" style="--width: 18rem"></input-switch>
    <input-switch state="on" style="--width: 16.8rem"></input-switch>
    <input-switch state="off" style="--width: 15.6rem"></input-switch>
    <input-switch state="on" style="--width: 14.4rem"></input-switch>
    <input-switch state="off" style="--width: 13.2rem"></input-switch>
    <input-switch state="on" style="--width: 12rem"></input-switch>
    <input-switch state="off" style="--width: 10.8rem"></input-switch>
    <input-switch state="on" style="--width: 9.6rem"></input-switch>
    <input-switch state="off" style="--width: 8.4rem"></input-switch>
    <input-switch state="on" style="--width: 7.2rem"></input-switch>
    <input-switch state="off" style="--width: 6rem"></input-switch>
    <input-switch state="on" style="--width: 4.8rem"></input-switch>
    <input-switch state="off" style="--width: 3.6rem"></input-switch>
    <input-switch state="on" style="--width: 2.4rem"></input-switch>
    <input-switch state="off" style="--width: 1.2rem"></input-switch>

    <script type="module">
      // ▼ ES modules cache-busted grâce à PHP
      /*<?php ob_start();?>*/

      import '/_common/components/input-switch/input-switch.js.php';

      /*<?php $imports = ob_get_clean();
      require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
      echo versionizeFiles($imports, __DIR__); ?>*/



      document.querySelector('input-switch').addEventListener('switch', event => {
        console.log(`Switch turned ${event.detail.state}`);
      });
    </script>
  </body>

</html>