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
        "sortable-table": "/_common/components/sortable-table/sortable-table.js",
        "translation-observer": "/_common/js/translation-observer.js",
        "custom-elements-polyfill": "/_common/polyfills/custom-elements.js"
      }
    }
    </script>
    
    <link rel="modulepreload" href="/_common/components/sortable-table/sortable-table.js">
    <link rel="modulepreload" href="/_common/js/translation-observer.js">
    <link rel="modulepreload" href="/_common/polyfills/custom-elements.js">
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
          <td>Name</td>
          <td data-type="number">Letters in name</td>
          <td data-type="date" data-format='{ "dateStyle": "medium" }'>Birthday</td>
          <!--<td data-type="date" data-format='{ "dateStyle": "short", "timeStyle": "medium" }'>Random time</td>-->
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Rémi</td>
          <td>4</td>
          <td>752025600000</td>
          <!--<td>1667942667393</td>-->
        </tr>
        <tr>
          <td>Guillaume</td>
          <td>9</td>
          <td>373766400000</td>
          <!--<td>1167342667493</td>-->
        </tr>
        <tr>
          <td>Christophe</td>
          <td>10</td>
          <td>236131200000</td>
          <!--<td>1267442667493</td>-->
        </tr>
        <tr>
          <td>Marino</td>
          <td>6</td>
          <td>155084400000</td>
          <!--<td>1267342667493</td>-->
        </tr>
      </tbody>
    </table>
  </body>