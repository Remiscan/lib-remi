<?php
$theme = $_COOKIE['theme'] == 'light' ? 'light' : ($_CCOOKIE['theme'] == 'dark' ? 'dark' : 'auto');
?>

<html data-theme="<?=$theme?>">

  <head>
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
        grid-column: 10;
      }
    </style>
  </head>

  <body>
    <theme-selector></theme-selector>

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