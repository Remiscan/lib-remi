<?php
$theme = $_COOKIE['theme'] == 'light' ? 'light' : ($_CCOOKIE['theme'] == 'dark' ? 'dark' : 'auto');
?>

<!doctype html>
<html data-theme="<?=$theme?>">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      /*<?php ob_start();?>*/
      html[data-theme="light"] {
        --bg-color: skyblue;
        --sunmoon-color: black;
        --sunray-color: hsl(40, 100%, 10%);
      }

      html[data-theme="dark"] {
        --bg-color: darkblue;
        --sunmoon-color: white;
        --sunray-color: lemonchiffon;
      }
      /*<?php $body = ob_get_clean();
      require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
      echo buildThemesStylesheet($body); ?>*/

      body {
        background: var(--bg-color);
        display: grid;
        grid-template-rows: repeat(15, 5rem);
        grid-template-columns: repeat(30, 5rem);
        color: var(--sunmoon-color);
        position: relative;
      }

      theme-selector {
        grid-row: 10;
        grid-column: 3;
      }

      /*theme-selector .selector {
        margin: .6rem;
        border-radius: .6rem;
        background-color: mediumslateblue;
        display: grid;
        grid-template-columns: 0 1fr;
        grid-template-rows: repeat(3, 2rem);
      }

      input[type="radio"] {
        height: 0;
        width: 0;
        opacity: 0;
        margin: 0;
        pointer-events: none;
        position: absolute;
      }

      input[type="radio"] + label {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto;
      }

      input[type="radio"] + label::before {
        content: '';
        display: block;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        border: 2px solid var(--sunray-color);
        place-self: center;
        grid-row: 1;
        grid-column: 1;
        margin: 0 .6rem;
      }

      input[type="radio"]:checked + label::after {
        content: '';
        display: block;
        width: .6rem;
        height: .4rem;
        border: 2px solid var(--sunmoon-color);
        border-top: none;
        border-right: none;
        transform: translateY(-25%) rotate(-45deg);
        place-self: center;
        grid-row: 1;
        grid-column: 1;
      }

      input[type="radio"] + label>span {
        margin: auto .6rem auto 0;
      }*/
    </style>
  </head>

  <body>
    <a href="#">Test link</a>
    <button>Test button</button>
    <theme-selector position="right"></theme-selector>

    <script type="module">
      // ▼ ES modules cache-busted grâce à PHP
      /*<?php ob_start();?>*/

      import '/_common/components/theme-selector/theme-selector.js.php';

      /*<?php $imports = ob_get_clean();
      require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
      echo versionizeFiles($imports, __DIR__); ?>*/


      ////////////////////////////////
      // Gère les changements de thème
      window.addEventListener('themechange', event => {
        //console.log('Theme change requested:', event.detail.theme, '/', event.detail.resolvedTheme);
        const html = document.documentElement;
        html.dataset.theme = event.detail.theme;
      });
    </script>
  </body>

</html>