<html>

  <head>
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
        flex-direction: column;
        gap: .6rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
        color: var(--text-color);
        padding: 1rem;
      }
    </style>
  </head>

  <body>
    <fieldset role="tablist">
      <legend data-string="tabs-group-name-label"></legend>

      <tab-label group="tabs-group-name" controls="controlled-element-1-id" id="tab-1-id" active="true">Tab 1 name</tab-label>
      <tab-label group="tabs-group-name" controls="controlled-element-2-id" id="tab-2-id">Tab 2 name</tab-label>
      <tab-label group="tabs-group-name" controls="controlled-element-3-id" id="tab-3-id">Tab 3 name</tab-label>
    </fieldset>

    <div id="controlled-element-1-id">Content 1</div>
    <div id="controlled-element-2-id" hidden>Content 2</div>
    <div id="controlled-element-3-id" hidden>Content 3</div>

    <script type="module">
      // ▼ ES modules cache-busted grâce à PHP
      /*<?php ob_start();?>*/

      import '/_common/components/tab-label/tab-label.js.php';

      /*<?php $imports = ob_get_clean();
      require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
      echo versionizeFiles($imports, __DIR__); ?>*/
    </script>
  </body>

</html>