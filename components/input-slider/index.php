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
      html, body {
        color-scheme: light dark;
        height: 100%;
      }

      body {
        background: var(--bg-color);
        display: grid;
        grid-template-columns: repeat(2, auto);
        position: relative;
        gap: .5rem;
        place-items: center;
        font-family: system-ui, sans-serif;
        margin: 0;
        padding: 10px;
        box-sizing: border-box;
      }

      .intro {
        grid-column: 1 / -1;
        max-width: 60ch;
      }
    </style>

    <script type="module">
      const sliders = document.querySelectorAll('input-slider');
      for (const slider of sliders) {
        for (const type of ['input', 'change']) {
          slider.addEventListener(type, event => {
            console.log(slider, event.type, event.detail);
          })
        }
      }
    </script>
  </head>

  <body>
    <p class="intro">I'm making a slider based on the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/slider/">ARIA slider pattern</a> because <code>&lt;input type="range"&gt;</code>'s support for customizing the appearance of vertical sliders wasn't good enough for me.</p>

    <form>
      <input-slider orientation="horizontal" value-text-format="ratio {v}" step="0.1" value="0.3" name="slider"></input-slider>
    </form>
    <input-slider orientation="vertical" min="5" max="200" step="1" value="102"></input-slider>

    <!-- for rtl languages
    <input-slider dir="rtl" orientation="horizontal" value-text-format="ratio {v}" value="0.3"></input-slider>
    <input-slider dir="rtl" orientation="vertical" min="-100" max="5" step="5" value="-52"></input-slider>
    -->

    <input-slider reversed orientation="horizontal" value-text-format="ratio {v}" value="0.3"></input-slider>
    <input-slider reversed orientation="vertical" min="-100" max="5" step="5" value="-52"></input-slider>

    <!-- for rtl languages
    <input-slider reversed dir="rtl" orientation="horizontal" value-text-format="ratio {v}" value="0.3"></input-slider>
    <input-slider reversed dir="rtl" orientation="vertical" min="-100" max="5" step="5" value="-52"></input-slider>
    -->
  </body>

</html>