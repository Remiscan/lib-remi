<?php
$theme = isset($_COOKIE['theme']) ? ($_COOKIE['theme'] == 'light' ? 'light' : ($_COOKIE['theme'] == 'dark' ? 'dark' : 'auto')) : 'auto';
?>

<!doctype html>
<html lang="en" data-theme="<?=$theme?>">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;input-slider&gt;</title>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "input-slider": "/_common/components/input-slider/input-slider.js"
      }
    }
    </script>
    
    <link rel="modulepreload" href="/_common/components/input-slider/input-slider.js">
    
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <script type="module">
      import 'input-slider';
    </script>

    <style>
      /*<?php themeSheetStart(); ?>*/
      html[data-theme="light"] {
        color-scheme: light;
        --bg-color: #eee;
      }

      html[data-theme="dark"] {
        color-scheme: dark;
        --bg-color: #111;
      }
      /*<?php themeSheetEnd(closeComment: true); ?>*/

      html, body {
        height: 100%;
      }

      body {
        background: var(--bg-color);
        display: grid;
        position: relative;
        gap: .5rem;
        place-items: center;
        font-family: system-ui;
        margin: 0;
      }

      body > * {
        grid-row: 1;
      }
    </style>

    <script type="module">
      const sliders = document.querySelectorAll('input-slider');
      for (const slider of sliders) {
        for (const type of ['input', 'change']) {
          slider.addEventListener(type, event => {
            console.log(slider, event.type, event.detail.value);
          })
        }
      }
    </script>
  </head>

  <body>
    <input-slider orientation="horizontal"></input-slider>
    <input-slider orientation="vertical"></input-slider>
  </body>

</html>