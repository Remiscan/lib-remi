<?php
$theme = isset($_COOKIE['theme']) ? ($_COOKIE['theme'] == 'light' ? 'light' : ($_COOKIE['theme'] == 'dark' ? 'dark' : 'auto')) : 'auto';
?>

<!doctype html>
<html lang="en" data-theme="<?=$theme?>">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;color-swatch&gt;</title>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "color-swatch": "/_common/components/color-swatch/color-swatch.js",
        "colori": "/colori/lib/dist/colori.min.js",
        "translation-observer": "/_common/js/translation-observer.js"
      }
    }
    </script>
    
    <link rel="modulepreload" href="/_common/components/color-swatch/color-swatch.js">
    
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <script type="module">
      import 'color-swatch';
    </script>

    <style>
      html, body {
        color-scheme: light dark;
        height: 100%;
      }

      body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        gap: 38px;
        font-family: system-ui, sans-serif;
        margin: 16px;
      }

      .intro {
        margin: 0;
        padding: 0;
        max-width: 70ch;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 2em;
      }

      .one-swatch {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1em;
        border: 1px solid currentColor;
        padding: 4px;
      }

      color-swatch {
        border: 1px solid currentColor;
        padding: 2px;
      }
    </style>
  </head>

  <body>
    <p class="intro">The color-swatch component uses my own library <a href="/colori/">Colori</a>. It takes a color expression and a format as HTML arguments. It displays a preview of the color, its expression in the requested format, and a button to copy that expression.</p>

    <div class="container">
      <div class="one-swatch">
        <code><?=htmlentities('<color-swatch format="hex" color="skyblue"></color-swatch>')?></code>
        <color-swatch format="hex" color="skyblue"></color-swatch>
      </div>

      <div class="one-swatch">
        <code><?=htmlentities('<color-swatch format="rgb" color="skyblue"></color-swatch>')?></code>
        <color-swatch format="rgb" color="skyblue"></color-swatch>
      </div>

      <div class="one-swatch">
        <code><?=htmlentities('<color-swatch format="oklch" color="skyblue"></color-swatch>')?></code>
        <color-swatch format="oklch" color="skyblue"></color-swatch>
      </div>
    </div>
  </body>

</html>