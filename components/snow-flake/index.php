<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>&lt;snow-flake&gt;</title>
  
  <!-- ▼ Cache-busted files -->
  <!--<?php versionizeStart(); ?>-->

  <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
  <script>window.esmsInitOptions = { "polyfillEnable": ["css-modules", "json-modules"] }</script>
  <script defer src="../../polyfills/es-module-shims.js"></script>

  <script type="importmap">
  {
    "imports": {
      "snowflake-worklet": "/_common/components/snow-flake/worklet.js"
    }
  }
  </script>

  <!--<?php versionizeEnd(__DIR__); ?>-->

  <script type="module">
    CSS.paintWorklet.addModule(import.meta.resolve('snowflake-worklet'));

    const flake = document.querySelector('.snow-flake');

    const updateSeed = () => flake.style.setProperty('--base-seed', `"${Date.now()}"`);
    updateSeed();

    flake.addEventListener('click', updateSeed);
  </script>

<style>
    html {
      width: 100%;
      height: 100%;
      color-scheme: light dark;
    }

    body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      place-items: center;
      overflow: hidden;
      color: black;
    }

    .snow-flake {
      width: 80vmin;
      aspect-ratio: 1;
      background: paint(snowflake);

      --flake-color: #000;
    }

    @media (prefers-color-scheme: dark) {
      .snow-flake {
        --flake-color: #fff;
      }
    }
  </style>
</head>

<body>
  <div class="snow-flake"></div>