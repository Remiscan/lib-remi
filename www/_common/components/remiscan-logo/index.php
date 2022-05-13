<?php require_once dirname(__DIR__, 2) . '/php/version.php'; ?>
<!doctype html>
<html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;remiscan-logo&gt;</title>

    <!-- ▼ Fichiers cache-busted grâce à PHP -->
    <!--<?php ob_start();?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    <script type="importmap">
    {
      "imports": {
        "remiscan-logo": "/_common/components/remiscan-logo/remiscan-logo.js",
        "remiscan-logo-styles": "/_common/components/remiscan-logo/styles.css.php",
        "remiscan-logo-template": "/_common/components/remiscan-logo/template.js"
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
        --bg-color: rgb(224, 224, 224);
        --text-color: black;
      }

      html[data-theme="dark"] {
        color-scheme: dark;
        --bg-color: rgb(34, 34, 34);
        --text-color: white;
      }
      /*<?php $body = ob_get_clean();
      require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
      echo buildThemesStylesheet($body); ?>*/

      html {
        background: var(--bg-color);
        height: 100%;
        width: 100%;
      }

      body {
        background: var(--bg-color);
        position: relative;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
        color: var(--text-color);
        padding: 1rem;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
      }

      remiscan-logo {
        --width: 8rem;
      }

      .rainbow-text,
      strong {
        font-weight: 600;
        color: var(--text-color);
      }

      .rainbow-bg {
        --main-gradient-bands: 6;
        --main-gradient: repeating-linear-gradient(to right,
          hsl(0, 100%, 90%) 0,
          hsl(39, 100%, 90%) calc(1 * 100% / var(--main-gradient-bands)),
          hsl(60, 100%, 90%) calc(2 * 100% / var(--main-gradient-bands)),
          hsl(120, 100%, 90%) calc(3 * 100% / var(--main-gradient-bands)),
          hsl(240, 100%, 90%) calc(4 * 100% / var(--main-gradient-bands)),
          hsl(300, 100%, 90%) calc(5 * 100% / var(--main-gradient-bands)),
          hsl(0, 100%, 90%) calc(6 * 100% / var(--main-gradient-bands))
        );
        background-image: var(--main-gradient);
        background-size: calc(var(--main-gradient-bands) * 50%) 100%;
        background-position: 0 0;
        background-repeat: repeat;
        animation: rainbow-text-animation 40s linear infinite;
      }

      @supports (background-clip: text) or (-webkit-background-clip: text) {
        .rainbow-text,
        strong {
          background-image: var(--main-gradient);
          background-size: calc(var(--main-gradient-bands) * 50%) 100%;
          background-position: 0 0;
          background-repeat: repeat;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: rainbow-text-animation 40s linear infinite;
        }
      }

      @keyframes rainbow-text-animation {
        0% { background-position: 0 0; }
        100% { background-position: calc(100% * var(--main-gradient-bands)) 0; }
      }

      .rainbow-bg {
        display: block;
        width: 8rem;
        height: 4rem;
        mask: var(--mask);
        mask-size: 100% 100%;
        -webkit-mask-image: var(--mask);
        -webkit-mask-size: 100% 100%;
        --mask: url('/_common/components/remiscan-logo/logo--<?=version(__DIR__, 'logo.svg')?>.svg');
      }

      .remiscan-logo-template {
        display: inline-block;
        position: relative;
        background: var(--background, transparent);
      }

      .remiscan-logo-template > div {
        display: none;
      }

      @supports (mask: url('')) or (-webkit-mask-image: url('')) {
        .remiscan-logo-template > div {
          display: block;
        }

        .remiscan-logo-template > span {
          font-size: 0;
          position: absolute;
        }
      }
    </style>
  </head>

  <body>
    <remiscan-logo background="indigo" text-color="aquamarine" style="--width: 4rem;"></remiscan-logo>
    <remiscan-logo background="indigo" text-color="aquamarine"></remiscan-logo>
    <remiscan-logo background="linear-gradient(to right, red, blue)" text-gradient="linear-gradient(to right, pink, green, pink)"></remiscan-logo>
    <remiscan-logo></remiscan-logo>

    <p> Not the custom component:</p>

    <div class="rainbow-bg"></div>
    <a href="https://remiscan.fr" class="rainbow-bg" style="width: 32rem; height: 16rem;"></a>
    <a href="https://remiscan.fr" class="remiscan-logo-template">
      <span>remiscan</span>
      <div class="rainbow-bg" aria-hidden="true"></div>
    </a>

    <script type="module">
      import 'remiscan-logo';
    </script>
  </body>

</html>