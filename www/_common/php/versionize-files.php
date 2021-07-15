<?php
require_once __DIR__ . '/version.php';
require_once __DIR__ . '/resolvePath.php';
require_once __DIR__ . '/ModuleList.php';



/**
 * Captures a body of JavaScript, CSS or HTML, and versionizes links in that body.
 * (See below for examples.)
 */
function versionizeFiles(string $body, string $fromDir = __DIR__): string {
  $extensions = 'css|css\.php|js|js\.php|json|htm|svg|ico|webp|png|jpe?g|gif|mp4'; // same as in .htaccess
  $regexps = [
    '/(?:from|import) +?\'((?:.*?\/)([^\/]+?)\.(js(?:\.php)?))\';/',
    '/(?:new Worker\()\'((?:.*?\/)([^\/]+?)\.(js(?:\.php)?))\'/',
    '/(?:src|href) *?= *?"((?:[^"]*?\/)?([^\/<>]+?)\.('.$extensions.'))"/',
    '/(?:url\()\'((?:.*?\/)([^\/]+?)\.('.$extensions.'))\'/'
  ];
  $allMatches = ['full' => [], 'path' => [], 'filename' => [], 'fileext' => []];

  foreach($regexps as $regex) {
    preg_match_all($regex, $body, $matches);
    for ($i = 0; $i < count($matches[0]); $i++) {
      $allMatches['full'][] = $matches[0][$i];
      $allMatches['path'][] = $matches[1][$i];
      $allMatches['filename'][] = $matches[2][$i];
      $allMatches['fileext'][] = $matches[3][$i];
    }
  }

  $n = count($allMatches['full']);
  for ($i = 0; $i < $n; $i++) {
    $match = array(
      'full' => $allMatches['full'][$i],
      'path' => $allMatches['path'][$i],
      'filename' => $allMatches['filename'][$i],
      'fileext' => $allMatches['fileext'][$i]
    );

    $Path = new FilePath($match['path'], $fromDir);

    // The version of a module has to depend on all other modules it imports, because its file contains their version number.
    // So this is needed for now, but won't be once import maps can be used in all browsers!
    $LinkedModules = new ModuleList($Path);
    $version = $LinkedModules->toHash();

    $body = str_replace(
      $match['path'],
      $Path->resolve(false, 'absolute') . '/' . $match['filename'] . '--' . $version . '.' . $match['fileext'],
      $body
    );
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