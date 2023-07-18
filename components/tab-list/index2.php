<!doctype html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;tab-list&gt;</title>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->
  
    <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script> <!-- to support constructed style sheets -->
    <script>window.esmsInitOptions = { "polyfillEnable": ["css-modules", "json-modules"] }</script>
    <script defer src="../../polyfills/es-module-shims.js"></script> <!-- to support import maps -->
    
    <script type="importmap">
    {
      "imports": {
        "tab-list": "/_common/components/tab-list/tab-list.js",
        "custom-elements-polyfill": "/_common/polyfills/custom-elements.js"
      }
    }
    </script>
  
    <link rel="modulepreload" href="/_common/components/tab-list/tab-list.js">
    <link rel="modulepreload" href="/_common/polyfills/custom-elements.js">
  
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <script type="module">
      import 'tab-list';

      window.addEventListener('tabchange', event => {
        console.log(event.detail);
      });
    </script>

    <style>
      html {
        height: 100%;
        width: 100%;
        color-scheme: light dark;
      }

      body {
        font-family: system-ui, sans-serif;
        padding: 16px;
      }

      hr {
        width: 100%;
        height: 20px;
        border: 0;
      }

      p {
        margin: 0;
      }

      /* Prevent flash on unstyled content */
      [is="tab-list"]:not([role="tablist"]) {
        display: none;
      }
    </style>
  </head>

  <body>
    <div is="tab-list">
      <button role="tab" aria-controls="controlled-element-11-id">Tab 1.1</button>
      <button role="tab" aria-controls="controlled-element-12-id">Tab 1.2</button>
      <button role="tab" aria-controls="controlled-element-13-id">Tab 1.3</button>
    </div>

    <div id="controlled-element-11-id" hidden>
      <p>Testing horizontal tab list. First tab selected by default.
    </div>
    <div id="controlled-element-12-id" hidden>Content 1.2</div>
    <div id="controlled-element-13-id" hidden>Content 1.3</div>
    
    <hr>

    <div is="tab-list" aria-orientation="vertical" style="filter: hue-rotate(-120deg)">
      <button role="tab" aria-controls="controlled-element-21-id">Tab 2.1</button>
      <button role="tab" aria-controls="controlled-element-22-id" aria-selected="true">Tab 2.2</button>
      <button role="tab" aria-controls="controlled-element-23-id">Tab 2.3</button>
    </div>

    <div id="controlled-element-21-id" hidden>Content 2.1</div>
    <div id="controlled-element-22-id" hidden>
      <p>Testing vertical tab list. Second tab selected by default.
    </div>
    <div id="controlled-element-23-id" hidden>Content 2.3</div>

    <hr>

    <div is="tab-list" style="filter: hue-rotate(120deg)">
      <button role="tab" aria-controls="controlled-element-31-id">Tab 3.1</button>
      <button role="tab" aria-controls="controlled-element-32-id">Tab 3.2</button>
      <button role="tab" aria-controls="controlled-element-33-id" aria-selected="true">Tab 3.3</button>
    </div>

    <div id="controlled-element-31-id" hidden>Content 3.1</div>
    <div id="controlled-element-32-id" hidden>Content 3.2</div>
    <div id="controlled-element-33-id" hidden>
      <p>Testing horizontal tab list again. Third tab selected by default.
    </div>
  </body>

</html>