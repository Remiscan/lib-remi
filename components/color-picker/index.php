<?php
$theme = isset($_COOKIE['theme']) ? ($_COOKIE['theme'] == 'light' ? 'light' : ($_COOKIE['theme'] == 'dark' ? 'dark' : 'auto')) : 'auto';
?>

<!doctype html>
<html lang="en" data-theme="<?=$theme?>">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;color-picker&gt;</title>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "color-picker": "/_common/components/color-picker/color-picker.js",
        "range-gradient-worklet": "/_common/components/color-picker/worklet.js.php",
        "input-slider": "/_common/components/input-slider/input-slider.js",
        "colori": "/colori/lib/dist/colori.min.js",
        "translation-observer": "/_common/js/translation-observer.js"
      }
    }
    </script>
    
    <link rel="modulepreload" href="/_common/components/color-picker/color-picker.js">
    <link rel="modulepreload" href="/_common/components/input-slider/input-slider.js">
    
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <script type="module">
      import 'color-picker';

      let i = 0;
      for (const colorPicker of [...document.querySelectorAll('color-picker')]) {
        for (const type of ['input', 'change']) {
          colorPicker.addEventListener(type, event => {
            if (!event.detail?.color) return;
            console.log(`${i}: ${type} color ${event.detail.color}`);
          });
        }
        i++;
      }
    </script>

    <style>
      /*<?php themeSheetStart(); ?>*/
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
      /*<?php themeSheetEnd(closeComment: true); ?>*/

      html[data-theme="blue"] {
        color-scheme: light;
        --bg-color: skyblue;
        --sunmoon-color: darkblue;
        --sunray-color: royalblue;
      }

      html, body {
        height: 100%;
      }

      body {
        background: var(--bg-color);
        display: grid;
        color: var(--sunmoon-color);
        position: relative;
        gap: .5rem;
        place-items: center;
        font-family: system-ui;
        margin: 0;
      }

      body > * {
        grid-row: 1;
      }

      color-picker:nth-of-type(1) {
        --size: 3rem;
      }

      color-picker:nth-of-type(2) {
        --size: 2rem;
        --range-border-width: 5px;
        --range-border-radius: 5px;
      }

      color-picker::part(selector) {
        border-radius: 10px;
      }
    </style>
  </head>

  <body>
    <color-picker position="bottom" format="hsl" color="blue"></color-picker>
    <color-picker position="bottom" format="okhsl" label></color-picker>
  </body>

</html>