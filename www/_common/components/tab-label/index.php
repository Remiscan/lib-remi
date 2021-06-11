<?php require_once dirname(__DIR__, 2) . '/php/version.php';
$version = version(__DIR__, ['tab-label.js.php', 'style.css.php']); ?>
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

      <?php include __DIR__ . '/style.css.php'; ?>
    </style>
  </head>

  <body>
    <fieldset role="tablist" data-group="tabs-group-name">
      <legend data-string="tabs-group-name-label"></legend>

      <tab-label controls="controlled-element-1-id" active="true">Tab 1 name</tab-label>
      <tab-label controls="controlled-element-2-id">Tab 2 name</tab-label>
      <tab-label controls="controlled-element-3-id">Tab 3 name</tab-label>
    </fieldset>

    <div id="controlled-element-1-id">Content 1</div>
    <div id="controlled-element-2-id" hidden>Content 2</div>
    <div id="controlled-element-3-id" hidden>Content 3</div>

    <script type="module">
      import '/_common/components/tab-label/tab-label--<?=$version?>.js.php';
    </script>
  </body>

</html>