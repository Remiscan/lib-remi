<?php
$component = $_GET['component'] ?? '';
try {
  $data = file_get_contents(__DIR__."/$component/data.json");
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
    <title><?=$data["title"]?></title>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": <?=json_encode($data['imports'])?>
    }
    </script>

    <?php
    foreach ($data["imports"] as $name => $path) {
      if (str_ends_with($path, '.js')) {
        echo '<link rel="modulepreload" href="'.$path.'">'.PHP_EOL;
      }
    }
    ?>
    
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <script type="module">
      <?php
      foreach ($data["imports"] as $name => $path) {
        echo "import '$name';".PHP_EOL;
      }
      ?>
    </script>

    <style>
      html, body {
        color-scheme: light dark;
        height: 100%;
      }

      :root {
        --example-border-color: silver;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --example-border-color: #3f3f3f;
        }
      }

      body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        gap: 38px;
        font-family: system-ui, sans-serif;
        margin: 16px;
      }

      .intro {
        margin: 0;
        padding: 0;
        max-width: 70ch;
      }

      .list-of-examples {
        display: flex;
        flex-direction: column;
        gap: 2em;
      }

      .example {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: .5em;
        border: 1px dashed var(--example-border-color);
        padding: 5px;
      }
    </style>

    <?php if (is_file(__DIR__."/$component/index.css")) { ?>
      <link rel="stylesheet" href="./index.css">
    <?php } ?>
  </head>

  <body>
    <p class="intro"><?=$data["intro"]?></p>

    <ul class="list-of-examples">
      <?php foreach ($data["examples"] as $example) { ?>
        <li class="example">
          <code><?=htmlentities($example)?></code>
          <?=$example?>
        </li>
      <?php } ?>
    </ul>
  </body>

</html>