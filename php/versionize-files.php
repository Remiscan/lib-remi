<?php /* Prepended in global.php */

require_once __DIR__ . '/FilePath.php';



/**
 * Computes the version of a list of files, relative to the given directory.
 */
function version(array $paths = [], string $method = 'date') {
  $files = [];
  foreach ($paths as $path) {
    if (file_exists($path)) {
      if (is_dir($path))      $files = [...$files, ...array_diff(scandir($path), array('..', '.'))];
      elseif (is_file($path)) $files = [...$files, $path];
    }
  }

  // Initialize version
  $filesVersion = match($method) {
    'date', 'pretty-date' => 0,
    'hash' => []
  };

  // Compute version
  foreach($files as $file) {
    switch ($method) {
      case 'pretty-date':
      case 'date':
        $fileDate = filemtime($file);
        if ($fileDate > $filesVersion) $filesVersion = $fileDate;
        break;
      case 'hash':
        $hash = hash_file('crc32b', $file);
        $filesVersion[] = $hash;
        break;
    }
  }

  // Parse version
  $filesVersion = match($method) {
    'pretty-date' => date('Y.m.d_H.i.s', $filesVersion),
    'hash' => count($filesVersion) > 1 ? hash('crc32b', implode($filesVersion)) : ($filesVersion[0] ?? 'doesnotexist'),
    default => $filesVersion
  };

  return $filesVersion;
}



/**
 * Captures a body of JavaScript, CSS or HTML, and versionizes links in that body.
 * (See below for examples.)
 */
function versionizeFiles(string $body, string $fromDir = __DIR__): string {
  $extensions = getenv('VERSIONIZED_EXTS'); // Defined in .conf
  $regexps = [
    '/(?:from|import) +?\'((?:.*?\/)([^\/]+?)\.(js(?:\.php)?))\';/',        // import statements
    '/(?:new Worker\()\'((?:.*?\/)([^\/]+?)\.(js(?:\.php)?))\'/',           // Worker creation
    '/(?:src|href) *?= *?"((?:[^"]*?\/)?([^\/<>]+?)\.('.$extensions.'))"/', // src or href HTML attributes
    '/(?:url\()\'((?:.*?\/)([^\/]+?)\.('.$extensions.'))\'/',               // CSS URLs
    '/"[\w\/\.-]+?": +"((?:.*?\/)([^\/]+?)\.('.$extensions.'))"/',          // import maps
    //'/(?:Location: +?https:\/\/'.$_SERVER['SERVER_NAME'].')((?:.*?\/)([^\/]+?)\.('.$extensions.'))/' // Location header
  ];

  foreach($regexps as $regex) {
    preg_match_all($regex, $body, $matches);
    for ($i = 0; $i < count($matches[0]); $i++) {
      $expr = $matches[0][$i];
      $path = $matches[1][$i];
      $filename = $matches[2][$i];
      $fileext = $matches[3][$i];

      $RealPath = new FilePath($path, $fromDir);
      $version = version([$RealPath->resolve()]);
      $versionizedPath = $RealPath->directory(false) . '/' . $filename . '--' . $version . '.' . $fileext;
      $versionizedExpr = str_replace($path, $versionizedPath, $expr);

      $body = str_replace(
        $expr,
        $versionizedExpr,
        $body
      );
    }
  }

  return $body;
}



function versionizeStart() {
  ob_start();
}

function versionizeEnd($dir) {
  $imports = ob_get_clean();
  echo versionizeFiles($imports, $dir);
}



/* HOW TO USE: In HTML, CSS or JS files */

//    /*< ?php versionizeStart();? >*/
//
//    <script type="importmap">
//    {
//      "imports": {
//        "name": "./path.js"
//      }
//    }
//    </script>
//
//    <script type="module">
//      import { ... } from '../_common/abc.js';
//      import { ... } from './abc.js.php';
//      import { ... } from '/abc.js.php';
//      import { ... } from 'abc.js.php';
//      import './abc.js.php';
//
//      new Worker('worker-link.js');
//    </script>
//
//    <link rel="stylesheet" href="/app/page.css">
//    <script type="module" src="/app/scripts.js.php"></script>
//
//    <style>
//      :root {
//        background-image: url('./image.webp');
//      }
//    </style>
//
//    /*< ?php versionizeEnd(__DIR__); ? >*/

/* PRINTS */

//    <script type="importmap">
//    {
//      "imports": {
//        "name": "./path--72c6b344.js"
//      }
//    }
//    </script>
//
//    <script type="module">
//      import { ... } from '../_common/abc--72c6b344.js';
//      import { ... } from './abc--72c6b344.js';
//      import { ... } from '/abc--72c6b344.js';
//      import { ... } from 'abc--72c6b344.js';
//      import './abc--72c6b344.js';
//
//      new Worker('worker-link--72c6b344.js');
//    </script>
//
//    <link rel="stylesheet" href="/app/page--72c6b344.css">
//    <script type="module" src="/app/scripts--72c6b344.js.php"></script>
//
//    <style>
//      :root {
//        background-image: url('./image--72c6b344.webp');
//      }
//    </style>