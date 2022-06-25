<?php
require_once __DIR__ . '/resolvePath.php';



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
      $path = $matches[1][$i];
      $filename = $matches[2][$i];
      $fileext = $matches[3][$i];

      $Path = new FilePath($path, $fromDir);
      $version = hash_file('crc32b', $_SERVER['DOCUMENT_ROOT'] . $Path->resolve(true, 'absolute'));
      $versionizedPath = $Path->resolve(false, 'absolute') . '/' . $filename . '--' . $version . '.' . $fileext;

      $body = str_replace(
        $path,
        $versionizedPath,
        $body
      );
    }
  }

  return $body;
}



// Example 1: versionize links in a JavaScript (.js.php) file:
//
//    /*< ?php ob_start();? >*/
//
//    import { ... } from '../_common/abc.js';
//    import { ... } from './abc.js.php';
//    import { ... } from '/abc.js.php';
//    import { ... } from 'abc.js.php';
//    import './abc.js.php';
//    new Worker('worker-link.js');
//
//    /*< ?php $body = ob_get_clean();
//    require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
//    echo versionizeFiles($body, __DIR__); ? >*/
//
//        returns:
//
//    import { ... } from '/_common/abc--72c6b344.js';
//    ...
//    import './abc--72c6b344.js.php';
//    new Worker('worker-link--72c6b344.js');


// Example 2: versionize links in a HTML (.php) file:
//
//    <!--< ?php ob_start();? >-->
//
//    <link rel="stylesheet" href="/app/page.css">
//    <script type="module" src="/app/scripts.js.php"></script>
//
//    <!--< ?php $body = ob_get_clean();
//    require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
//    echo versionizeFiles($body, __DIR__); ? >-->


// Example 3: versionize links in a CSS (.css.php) file:
//
//    <!--< ?php ob_start();? >-->
//
//    :root {
//      background-image: url('./image.webp');
//    }
//
//    <!--< ?php $body = ob_get_clean();
//    require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
//    echo versionizeFiles($body, __DIR__); ? >-->