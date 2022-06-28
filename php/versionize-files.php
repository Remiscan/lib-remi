<?php
require_once __DIR__ . '/resolvePath.php';
require_once __DIR__ . '/version.php';



/**
 * Captures a body of JavaScript, CSS or HTML, and versionizes links in that body.
 * (See below for examples.)
 */
function versionizeFiles(string $body, string $fromDir = __DIR__): string {
  $extensions = 'css|css\.php|js|js\.php|json|htm|svg|ico|webp|png|jpe?g|gif|mp4'; // same as in .htaccess
  $regexps = [
    '/(?:from|import) +?\'((?:.*?\/)([^\/]+?)\.(js(?:\.php)?))\';/',        // import statements
    '/(?:new Worker\()\'((?:.*?\/)([^\/]+?)\.(js(?:\.php)?))\'/',           // Worker creation
    '/(?:src|href) *?= *?"((?:[^"]*?\/)?([^\/<>]+?)\.('.$extensions.'))"/', // src or href HTML attributes
    '/(?:url\()\'((?:.*?\/)([^\/]+?)\.('.$extensions.'))\'/',               // CSS URLs
    '/"[\w\/\.-]+?": +"((?:.*?\/)([^\/]+?)\.('.$extensions.'))"/'           // import maps
  ];

  foreach($regexps as $regex) {
    preg_match_all($regex, $body, $matches);
    for ($i = 0; $i < count($matches[0]); $i++) {
      $expr = $matches[0][$i];
      $path = $matches[1][$i];
      $filename = $matches[2][$i];
      $fileext = $matches[3][$i];

      $RealPath = new FilePath($path, $fromDir);
      $version = version($_SERVER['DOCUMENT_ROOT'], $RealPath->resolve(true, 'absolute'));
      $versionizedPath = $RealPath->resolve(false, 'absolute') . '/' . $filename . '--' . $version . '.' . $fileext;
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



/* Prepended in global.php */

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