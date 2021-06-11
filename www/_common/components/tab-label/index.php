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

      .tab-group {
        display: flex;
        margin: 0;
        padding: 0;
        border: none;
        gap: .6rem;
      }

      hr {
        width: 100%;
        height: 1.2rem;
        border: 0;
      }
    </style>
  </head>

  <body>
    <fieldset role="tablist" data-group="tabs-group-name">
      <legend data-string="tabs-group-name-label"></legend>

      <tab-label controls="controlled-element-1-id" label="Tab 1 name" active="true"></tab-label>
      <tab-label controls="controlled-element-2-id" label="Tab 2 name"></tab-label>
      <tab-label controls="controlled-element-3-id" label="Tab 3 name"></tab-label>
    </fieldset>

    <div id="controlled-element-1-id" hidden>Content 1</div>
    <div id="controlled-element-2-id" hidden>Content 2</div>
    <div id="controlled-element-3-id" hidden>Content 3</div>

    <hr>

    <div class="tab-group">
      <tab-label group="no-fieldset" controls="controlled-element-4-id" label="Tab 4" active="true"></tab-label>
      <tab-label group="no-fieldset" controls="controlled-element-5-id" label="Tab 5"></tab-label>
      <tab-label group="no-fieldset" controls="controlled-element-6-id" label="Tab 6"></tab-label>
    </div>

    <div id="controlled-element-4-id" hidden>Content 4</div>
    <div id="controlled-element-5-id" hidden>Content 5</div>
    <div id="controlled-element-6-id" hidden>Content 6</div>

    <script type="module">
      import '/_common/components/tab-label/tab-label--<?=$version?>.js.php';
    </script>
  </body>

</html>