<!doctype html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;remiscan-logo&gt;</title>

    <!-- ▼ Cache-busted files -->
  <!--<?php versionizeStart(); ?>-->
  
    <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { "polyfillEnable": ["css-modules", "json-modules"] }</script>
    <script defer src="../../polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "remiscan-logo": "/_common/components/remiscan-logo/remiscan-logo.js",
        "remiscan-logo-styles": "/_common/components/remiscan-logo/styles.css.php",
        "remiscan-logo-template": "/_common/components/remiscan-logo/template.js"
      }
    }
    </script>
  
    <link rel="modulepreload" href="/_common/components/remiscan-logo/remiscan-logo.js">
    <link rel="modulepreload" href="/_common/components/remiscan-logo/template.js">
    <!-- CSS modules not supported in modulepreload yet 😢 -->
  
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <style>
      /*<?php themeSheetStart(); ?>*/
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
      /*<?php themeSheetEnd(closeComment: true); ?>*/

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
        display: grid;
        place-items: center;
      }

      p {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        justify-content: center;
        align-items: center;
      }

      remiscan-logo {
        --width: 8rem;
      }
    </style>
  </head>

  <body>
    <p>
      <remiscan-logo background="indigo" text-color="aquamarine" style="--width: 4rem;"></remiscan-logo>
      <remiscan-logo background="indigo" text-color="aquamarine"></remiscan-logo>
      <remiscan-logo background="linear-gradient(to right, indigo, darkblue)" text-gradient="linear-gradient(to right, palegreen, moccasin)"></remiscan-logo>
      <remiscan-logo style="--width: 16rem;" animate></remiscan-logo>
    </p>

    <script type="module">
      import 'remiscan-logo';
    </script>
  </body>

</html>