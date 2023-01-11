<?php
$theme = isset($_COOKIE['theme']) ? ($_COOKIE['theme'] == 'light' ? 'light' : ($_COOKIE['theme'] == 'dark' ? 'dark' : 'auto')) : 'auto';
?>

<!doctype html>
<html lang="en" data-theme="<?=$theme?>">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;material components&gt;</title>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "colori": "/colori/lib/dist/colori.min.js",
        "palette": "/colori/palette/palette.js"
      }
    }
    </script>

    <script type="module">
      <?php
      $materialComponents = array_diff(scandir(__DIR__), ['.', '..', 'index.php']);
      foreach ($materialComponents as $filename) {
        if (is_dir($filename)) continue;
        ?>
        import './<?=$filename?>';
      <?php }
      ?>
    </script>
    
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <script type="module">
      import Palette from 'palette';

      const materialLikeGenerator = function(hue) {
        return {
          lightnesses: [1, .99, .95, .9, .8, .7, .6, .5, .4, .3, .2, .1, 0],
          colors: [
            { label: 'primary', chroma: .1305, hue: hue },
            { label: 'secondary', chroma: .0357, hue: hue },
            { label: 'tertiary', chroma: .0605, hue: hue + 60},
            { label: 'success', chroma: .1783, hue: 143 },
            { label: 'error', chroma: .1783, hue: 28 },
            { label: 'neutral', chroma: .0058, hue: hue },
            { label: 'neutral-variant', chroma: .0178, hue: hue }
          ]
        };
      };

      class MaterialLikePalette extends Palette {
        constructor(hue) {
          super(hue, materialLikeGenerator);
        }
      }

      const palette = new MaterialLikePalette(280);
      document.querySelector('style#palette').innerHTML = `:root { ${palette.toCSS()} }`;

      const hueInput = document.querySelector('input[name="hue-choice"]');
      hueInput.addEventListener('input', event => {
        const palette = new MaterialLikePalette(Number(hueInput.value));
        document.querySelector('style#palette').innerHTML = `:root { ${palette.toCSS()} }`;
      });
    </script>

    <style id="palette"></style>
    <link rel="stylesheet" href="./ext/material_icons.css">
    <link rel="stylesheet" href="./ext/themes.css">

    <style>
      html, body {
        color-scheme: light dark;
        height: 100%;
        font-family: 'Roboto';
        accent-color: rgb(var(--primary));
      }

      body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 500px;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        justify-content: center;
        position: relative;
        gap: .5rem;
        margin: auto;
      }

      :not(:defined) {
        display: none;
      }
    </style>
  </head>

  <body>
    <input name="hue-choice" type="range" min="0" max="359" step="1" value="255">

    <!-- Buttons -->

    <material-button class="elevated">
      <span slot="icon">refresh</span>
      <span slot="label">Test</span>
    </material-button>

    <material-button class="filled">
      <span slot="icon">refresh</span>
      <span slot="label">Test</span>
    </material-button>

    <material-button class="filled-tonal">
      <span slot="icon">refresh</span>
      <span slot="label">Test</span>
    </material-button>

    <material-button class="outlined">
      <span slot="icon">refresh</span>
      <span slot="label">Test</span>
    </material-button>

    <material-button class="text">
      <span slot="icon">refresh</span>
      <span slot="label">Test</span>
    </material-button>

    <!-- Floating action buttons -->

    <material-fab class="extended">
      <span slot="icon">refresh</span>
      <span slot="label">Test</span>
    </material-fab>

    <material-fab class="secondary small">
      <span slot="icon">refresh</span>
      <span slot="label">Test</span>
    </material-fab>

    <material-fab class="tertiary large">
      <span slot="icon">refresh</span>
      <span slot="label">Test</span>
    </material-fab>

    <!-- Icon buttons -->

    <material-icon-button class="filled">
      <span slot="icon">refresh</span>
    </material-icon-button>

    <material-icon-button class="filled-tonal">
      <span slot="icon">refresh</span>
    </material-icon-button>

    <material-icon-button class="outlined">
      <span slot="icon">refresh</span>
    </material-icon-button>

    <material-icon-button>
      <span slot="icon">refresh</span>
    </material-icon-button>
  </body>

</html>