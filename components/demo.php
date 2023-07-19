<?php
$component = trim($_GET['component'] ?? '', '/');
try {
  $data = file_get_contents(__DIR__."/$component/demo.json");
  $data = json_decode($data, true);
  $data['imports'][$component] = "/_common/components/$component/$component.js";
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
        --code-background-color: #DBDBDB;
        --example-border-color: #DBDBDB;
        --example-background-color: #F7F7F7;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          color: white;
          --code-background-color: #242424;
          --example-border-color: #242424;
          --example-background-color: #080808;
        }
      }

      body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        gap: 1.5rem;
        font-family: system-ui, sans-serif;
        margin: 0;
        padding: 16px;
        box-sizing: border-box;
        height: auto;
        min-height: 100%;
      }

      body:has(:not(:defined)) {
        display: none;
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
        margin: 0 auto;
        padding: 0;
        list-style-type: none;
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(60ch, 1fr));
        max-width: min(100%, 150ch);
        align-items: stretch;
      }

      @media (max-width: 70ch) {
        .list-of-examples {
          width: 100%;
          grid-template-columns: 1fr;
        }
      }

      .example {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 6px;
        border: 2px solid var(--code-background-color);
        padding: 0 6px 6px;
        background-image:
          linear-gradient(45deg, 
            var(--example-background-color) 25%, 
            transparent 25% 75%, 
            var(--example-background-color) 75%
          ), linear-gradient(45deg, 
            var(--example-background-color) 25%, 
            transparent 25% 75%, 
            var(--example-background-color) 75%
          );
        background-size: 32px 32px;
        background-position: 0 0, 16px 16px;
      }

      .example > h3 {
        font-size: .9em;
        align-self: start;
      }

      .example h3:not(:first-child) {
        margin-top: 8px;
      }

      .example > pre {
        width: 100%;
        max-height: 5rem;
        overflow-y: auto;
        scrollbar-width: thin;
        background: var(--code-background-color);
        padding: 8px 0;
        display: flex;
        box-shadow:
          -7px 0 var(--code-background-color),
          7px 0 var(--code-background-color);
      }

      .example > pre > code {
        max-width: 80ch;
        margin: auto;
      }

      .example > .element {
        margin: auto;
        display: flex;
        border: 2px dashed var(--example-border-color);
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

    <script src="/_common/components/prism.js"></script>
    <link rel="stylesheet" media="not (prefers-color-scheme: dark)" href="/_common/components/prism-light.css">
    <link rel="stylesheet" media="(prefers-color-scheme: dark)" href="/_common/components/prism-dark.css">

    <script type="module">
      import '<?=$component?>';
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
    <h1 class="visually-hidden"><?=htmlentities($data["title"])?></h1>

    <h2 class="visually-hidden">What is it?</h2>

    <p class="intro"><?=$data["intro"]?></p>

    <h2 class="visually-hidden">Examples of use</h2>

    <ul class="list-of-examples">
      <?php foreach ($data["examples"] as $example) { ?>
        <li class="example">
          <h3 class="visually-hidden">HTML</h3>
          <pre><code class="language-html"><?=htmlentities($example)?></code></pre>
          <h3 class="visually-hidden">Output</h3>
          <div class="element"><?=$example?></div>
        </li>
      <?php } ?>
    </ul>
  </body>

</html>