<?php
$theme = isset($_COOKIE['theme']) ? ($_COOKIE['theme'] == 'light' ? 'light' : ($_COOKIE['theme'] == 'dark' ? 'dark' : 'auto')) : 'auto';
?>

<!doctype html>
<html data-theme="<?=$theme?>">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;theme-selector&gt;</title>

    <!-- ▼ Fichiers cache-busted grâce à PHP -->
    <!--<?php ob_start();?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "theme-selector": "/_common/components/theme-selector/theme-selector.js",
        "trap-focus": "/_common/js/trap-focus.js",
        "theme-selector-styles": "/_common/components/theme-selector/styles.css.php",
        "theme-selector-strings": "/_common/components/theme-selector/strings.json",
        "theme-selector-template": "/_common/components/theme-selector/template.js"
      }
    }
    </script>

    <!--<?php $imports = ob_get_clean();
    require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
    echo versionizeFiles($imports, __DIR__); ?>-->

    <style>
      /*<?php ob_start();?>*/
      html[data-theme="light"] {
        color-scheme: light;
        --bg-color: #eee;
        --sunmoon-color: black;
        --sunray-color: hsl(40, 100%, 10%);
      }

      html[data-theme="dark"] {
        color-scheme: dark;
        --bg-color: #111;
        --sunmoon-color: white;
        --sunray-color: lemonchiffon;
      }
      /*<?php $body = ob_get_clean();
      require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
      echo buildThemesStylesheet($body); ?>*/

      html, body {
        height: 100%;
      }

      body {
        background: var(--bg-color);
        display: grid;
        grid-template-rows: auto 1fr;
        color: var(--sunmoon-color);
        position: relative;
        gap: .5rem;
        place-items: start;
      }

      body > * {
        grid-row: 1;
      }

      theme-selector {
        grid-row: 2;
        grid-column: 1 / -1;
        width: 5rem;
        place-self: center;
      }
    </style>
  </head>

  <body>
    <span>Test text.</span>
    <a href="#">Test link</a>
    <button>Test button</button>
    <theme-selector position="right"></theme-selector>

    <script type="module">
      import 'theme-selector';


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