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
        "colori": "/colori/lib/dist/colori.js",
        "trap-focus": "/_common/js/trap-focus.js",
        "translation-observer": "/_common/js/translation-observer.js"
      }
    }
    </script>
    
    <link rel="modulepreload" href="/_common/components/color-picker/color-picker.js">
    <link rel="modulepreload" href="/_common/js/trap-focus.js">
    
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <script type="module">
      import 'color-picker';
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

      color-picker {
        --size: 2rem;
        transform: translateY(calc(-0.5 * (44px * 3 + 10px * 2 + 1.4rem)));
        --primary-color: var(--sunmoon-color);
        --secondary-color: var(--sunray-color);
      }

      color-picker .selector-title {
        font-size: 1.4rem;
        border-bottom: 1px solid;
        padding: 10px;
      }

      color-picker > .selector {
        font-size: 1.2rem;
        border: 1px solid currentColor;
        border-radius: 10px;
        width: max-content;
        transform: translateY(-.2rem);
        transition: opacity .2s ease,
                    transform .2s ease;
        margin-top: 10px;
        overflow: hidden;
      }

      color-picker[open="true"] > .selector {
        transform: translateY(0);
      }

      color-picker > .selector > input {
        width: 1.5em;
        margin: 10px;
        margin-right: 0;
      }

      color-picker > .selector > input + label {
        box-sizing: border-box;
        height: 44px;
        padding: 10px;
        display: grid;
        align-content: center;
        justify-content: start;
      }
    </style>
  </head>

  <body>
    <color-picker position="bottom"></color-picker>
    <color-picker position="bottom" label></color-picker>
  </body>

</html>