<!doctype html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;sortable-table&gt;</title>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "sortable-table": "/_common/components/sortable-table/sortable-table.js"
      }
    }
    </script>
    
    <link rel="modulepreload" href="/_common/components/sortable-table/sortable-table.js">
    
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <script type="module">
      import 'sortable-table';
    </script>

    <style>
      table[id="sortable-table"]:not(:defined) {
        display: none;
      }
    </style>
  </head>

  <body>
    <table is="sortable-table">
      <thead>
        <tr>
          <td data-type="date">Perte de connexion</td>
          <td data-type="date">Reconnexion</td>
          <td data-type="date">Durée de la déconnexion</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1667742667593</td>
          <td>1667842667293</td>
          <td>1667942667393</td>
        </tr>
        <tr>
          <td>1667942667893</td>
          <td>1667542667593</td>
          <td>1667342667493</td>
        </tr>
      </tbody>
    </table>
  </body>