<?php require_once dirname(__DIR__, 2) . '/php/version.php'; ?>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
        display: flex;
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
        --background-color: orange;
        --text-color: blue;
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
        --mask: url('/_common/components/remiscan-logo/logo--<?=version(__DIR__, 'logo.svg')?>.svg#remiscan-logo-mask');
      }
    </style>
  </head>

  <body>
    <remiscan-logo background-color="orange" text-color="aquamarine"></remiscan-logo>
    <div class="rainbow-bg"></div>

    <script type="module">
      import '/_common/components/remiscan-logo/remiscan-logo--<?=version(__DIR__, 'remiscan-logo.js.php')?>.js.php';
    </script>
  </body>

</html>