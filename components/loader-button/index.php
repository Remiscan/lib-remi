<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>&lt;loader-button&gt;</title>
  
  <!-- ▼ Cache-busted files -->
  <!--<?php versionizeStart(); ?>-->

  <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
  <script>window.esmsInitOptions = { "polyfillEnable": ["css-modules", "json-modules"] }</script>
  <script defer src="../../polyfills/es-module-shims.js"></script>
  
  <script type="importmap">
  {
    "imports": {
      "loader-button": "/_common/components/loader-button/loader-button.js"
    }
  }
  </script>

  <link rel="modulepreload" href="/_common/components/loader-button/loader-button.js">

  <!--<?php versionizeEnd(__DIR__); ?>-->

  <script type="module">
    import 'loader-button';

    const buttons = document.querySelectorAll('loader-button');
    buttons.forEach(button => {
      button.addEventListener('click', event => {
        button.wakeUp();
      });
    });
  </script>

  <style>
    * { -webkit-tap-highlight-color: transparent; }
    html, body {
      height: 100%;
      margin: 0;
      color-scheme: light dark;
    }
    body {
      background-color: hsl(250, 40%, 30%);
      background-image: linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25% 75%, rgba(0, 0, 0, .1) 75%), 
                        linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25% 75%, rgba(0, 0, 0, .1) 75%);
      background-size: 64px 64px;
      background-position: 0 0, 32px 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: system-ui, sans-serif;
    }
    p {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    a {
      color: white;
      opacity: .7;
      position: absolute;
      bottom: 1em;
    }

    loader-button {
      font-weight: 600;
      margin: .5em;
    }

    loader-button:nth-of-type(3n+2) {
      --button-color: #375dd4;
      --hover-color: rgb(255, 255, 255, .1);
      --active-color: rgb(0, 0, 0, .1);
      color: white;
    }

    loader-button:nth-of-type(3n+3) {
      --button-color: #8c3db6;
      --hover-color: rgb(255, 255, 255, .1);
      --active-color: rgb(0, 0, 0, .1);
      color: white;
    }
  </style>
</head>

<body>
  <p>

  <loader-button>Test</loader-button>
  <loader-button>Test success</loader-button>
  <loader-button>Test loading failure</loader-button>