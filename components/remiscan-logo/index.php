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
        "remiscan-logo-svg": "/_common/components/remiscan-logo/logo.svg"
      }
    }
    </script>
  
    <link rel="modulepreload" href="/_common/components/remiscan-logo/remiscan-logo.js">
  
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <style>
      html {
        height: 100%;
        width: 100%;
        color-scheme: light dark;
      }

      body {
        position: relative;
        font-family: system-ui, sans-serif;
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
      <remiscan-logo background="#321b32" text-color="#b3e6b3" style="--width: 4rem;"></remiscan-logo>
      <remiscan-logo background="#321b32" text-color="#b3e6b3"></remiscan-logo>
      <remiscan-logo background="linear-gradient(to right, #321b32, darkblue)" text-gradient="linear-gradient(to right, #b3e6b3, moccasin)"></remiscan-logo>
      <remiscan-logo style="--width: 16rem;" animate></remiscan-logo>
    </p>

    <script type="module">
      import 'remiscan-logo';
    </script>
  </body>

</html>