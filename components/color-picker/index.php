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

      color-picker::part(selector) {
        border-radius: 10px;
      }

      .intro {
        margin: 0;
        padding: 0;
      }

      @supports (background: paint(a)) {
        .fallback {
          display: none;
        }
      }
    </style>
  </head>

  <body>
    <p class="intro">This color-picker uses my own library <a href="/colori/">Colori</a> and paint worklets.</p>
    <p class="fallback">Your browser does not support paint worklets yet, so the color-picker is using your browser's native color input element as a fallback.</p>
    <color-picker position="bottom" format="hsl" color="blue" style="--size: 3rem"></color-picker>
    <form>
      <color-picker position="bottom" format="okhsl" label name="color"
                    style="--size: 2rem; --range-border-width: 5px; --range-border-radius: 5px;">
      </color-picker>
    </form>
  </body>

</html>