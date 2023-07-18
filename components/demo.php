<?php
$component = $_GET['component'] ?? '';
try {
  $data = file_get_contents(__DIR__."/$component/demo.json");
  $data = json_decode($data, true);
} catch (\Throwable $error) {
  $indexPath = __DIR__."/$component/index.php";
  if (file_exists($indexPath)) {
    include $indexPath;
  } else {
    echo "No such component";
  }
  exit;
}
?>

<!doctype html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?=htmlentities($data["title"])?></title>

    <style>
      html, body {
        color-scheme: light dark;
        height: 100%;
      }

      :root {
        color: black;
        --body-background-color: #FFFFFF;
        --example-border-color: #ECECEC;
        --code-background-color: #ECECEC;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          color: white;
          --body-background-color: #121212;
          --example-border-color: #242424;
          --code-background-color: #242424;
        }
      }

      body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        gap: 2rem;
        font-family: system-ui, sans-serif;
        margin: 0;
        padding: 16px;
        box-sizing: border-box;
        background-color: var(--body-background-color);
      }

      h1, h2, h3, pre {
        margin: 0;
        text-wrap: wrap;
      }

      p {
        margin: 0;
        padding: 0;
        max-width: 70ch;
      }

      .list-of-examples {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: flex;
        gap: 2rem;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
        max-width: 140ch;
      }

      .example {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border: 1px solid var(--example-border-color);
        padding: 6px;
      }

      .example > h3 {
        font-size: 1.05em;
      }

      .example h3:not(:first-child) {
        margin-top: 4px;
      }

      .example > code {
        background: var(--code-background-color);
        padding: 8px 0;
        box-shadow:
          -7px 0 var(--code-background-color),
          7px 0 var(--code-background-color);
      }

      .visually-hidden {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0,0,0,0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
    </style>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": <?=json_encode($data['imports'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)?>
    }
    </script>

    <?php if (is_file(__DIR__."/$component/demo.css")) { ?>
      <link rel="stylesheet" href="/_common/components/<?=$component?>/demo.css">
    <?php } ?>

    <?php if (is_file(__DIR__."/$component/demo.js")) { ?>
      <script type="module" src="/_common/components/<?=$component?>/demo.js"></script>
    <?php } ?>
    
    <!--<?php versionizeEnd(__DIR__); ?>-->
  </head>

  <body>
    <h1><?=htmlentities($data["title"])?></h1>

    <h2 class="visually-hidden">What is it?</h2>

    <p class="intro"><?=$data["intro"]?></p>

    <h2 class="visually-hidden">Examples of use</h2>

    <ul class="list-of-examples">
      <?php foreach ($data["examples"] as $example) { ?>
        <li class="example">
          <h3>HTML</h3>
          <code><pre><?=htmlentities($example)?></pre></code>
          <h3>Output</h3>
          <?=$example?>
        </li>
      <?php } ?>
    </ul>
  </body>

</html>