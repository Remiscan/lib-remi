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
    <script defer src="/_common/polyfills/custom-elements.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "sortable-table": "/_common/components/sortable-table/sortable-table.js"
      }
    }
    </script>
    
    <link rel="modulepreload" href="/_common/components/sortable-table/sortable-table.js">
    <link rel="stylesheet" href="/_common/components/basic.min.css">
    
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <script type="module">
      import 'sortable-table';
    </script>

    <style>
      body {
        margin: revert;
      }
    </style>
  </head>

  <body>
    <table is="sortable-table">
      <thead>
        <tr>
          <td>Prénom</td>
          <td data-type="date" data-format='{ "dateStyle": "short", "timeStyle": "short" }'>Date 1</td>
          <td data-type="date" data-format='{ "dateStyle": "short", "timeStyle": "short" }'>Date 2</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Rémi</td>
          <td>1467842667293</td>
          <td>1667942667393</td>
        </tr>
        <tr>
          <td>Flavien</td>
          <td>1667542667593</td>
          <td>1167342667493</td>
        </tr>
        <tr>
          <td>Skander</td>
          <td>1362542667593</td>
          <td>1267442667493</td>
        </tr>
        <tr>
          <td>Alexandre</td>
          <td>1647542667593</td>
          <td>1267342667493</td>
        </tr>
        <tr>
          <td>Giovanni</td>
          <td>1657542667593</td>
          <td>1457342667493</td>
        </tr>
      </tbody>
    </table>
  </body>