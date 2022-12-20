<?php
$theme = isset($_COOKIE['theme']) ? ($_COOKIE['theme'] == 'light' ? 'light' : ($_COOKIE['theme'] == 'dark' ? 'dark' : 'auto')) : 'auto';
?>

<!doctype html>
<html lang="en" data-theme="<?=$theme?>">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;theme-selector&gt;</title>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "theme-selector": "/_common/components/theme-selector/theme-selector.js",
        "trap-focus": "/_common/js/trap-focus.js",
        "translation-observer": "/_common/js/translation-observer.js"
      }
    }
    </script>
    
    <link rel="modulepreload" href="/_common/components/theme-selector/theme-selector.js">
    <link rel="modulepreload" href="/_common/js/trap-focus.js">
    
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <script type="module">
      import { ThemeSelector } from 'theme-selector';

      ThemeSelector.addTheme('blue', { fr: 'Bleue', en: 'Blue' });

      // Detects theme changes
      window.addEventListener('themechange', event => {
        const html = document.documentElement;
        html.dataset.theme = event.detail.theme;
      });
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
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        place-items: center;
        justify-content: center;
        color: var(--sunmoon-color);
        position: relative;
        gap: .5rem;
        font-family: system-ui, sans-serif;
        margin: 0;
      }

      theme-selector {
        --size: 5rem;
        --primary-color: var(--sunmoon-color);
        --secondary-color: var(--sunray-color);
      }

      theme-selector .selector-title {
        font-size: 1.4rem;
        border-bottom: 1px solid;
        padding: 10px;
      }

      theme-selector > .selector {
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

      theme-selector[position="top"] > .selector {
        transform: translateY(.2rem);
      }

      theme-selector[open="true"] > .selector {
        transform: translateY(0);
      }

      theme-selector > .selector > input {
        width: 1.5em;
        margin: 10px;
        margin-right: 0;
      }

      theme-selector > .selector > input + label {
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
    <theme-selector position="bottom"></theme-selector>
    <theme-selector position="top" label></theme-selector>
  </body>

</html>