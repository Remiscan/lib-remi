<?php
////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Récupère les imports JavaScript en utilisant la fonction comme ceci en début de fichier .js.php :
//
//    /*< ?php ob_start();? >*/
//
//    import { ... } from '../_common/abc.js';
//    import { ... } from './abc.js.php';
//    import { ... } from '/abc.js.php';
//    import { ... } from 'abc.js.php';
//    import './abc.js.php';
//
//    /*< ?php $body = ob_get_clean();
//    require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
//    echo versionizeFiles($body, __DIR__); ? >*/
//
// et renvoie les imports en ayant inséré le numéro de version avant l'extension de fichier :
//
//    import { ... } from '../_common/abc--2020.01.30_16.16.16.js';
//    import { ... } from './abc--2020.03.11_20.31.18.js.php';
//    import './abc--2020.03.11_20.31.18.js.php';
//
////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Récupère aussi les liens de fichiers dans les attributs src ou href comme ceci :
//
//    <!--< ?php ob_start();? >-->
//
//    <link rel="preload" as="fetch" href="/app/strings.json" crossorigin>
//    <link rel="modulepreload" href="/_common/js/traduction.js">
//    <link rel="stylesheet" href="/app/page.css">
//    <script type="module" src="/app/scripts.js.php"></script>
//
//    <!--< ?php $imports = ob_get_clean();
//    require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
//    echo versionizeFiles($imports, __DIR__); ? >-->
//
// et renvoie les liens en ayant inséré le numéro de version avant l'extension de fichier :
//
//    <link rel="preload" as="fetch" href="/app/strings--2020.08.26_23.45.06.json" crossorigin>
//    <link rel="modulepreload" href="/_common/js/traduction--2020.08.27_23.22.24.js">
//    <link rel="stylesheet" href="/app/page--2020.08.25_22.51.29.css">
//    <script type="module" src="/app/scripts--2020.08.28_22.25.39.js.php"></script>
//
////////////////////////////////////////////////////////////////////////////////////////////////////

require_once __DIR__ . '/version.php';
require_once __DIR__ . '/resolvePath.php';

function versionizeFiles($body, $fromDir = __DIR__)
{
  $extensions = ['\.html', '\.css', '\.json', '\.js', '(?:\.js)\.php'];
  $regexps = [
    '/(?:from|import) +\'((?:.*\/)([^\/]+)(\.js(?:\.php)?))\';/',
    '/(?:src|href) *= *"((?:[^"]*\/)?([^\/<>]+)(' . implode('|', $extensions) . '))"/'
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
  for ($i = 0; $i < $n; $i++)
  {
    $match = array(
      'full' => $allMatches['full'][$i],
      'path' => $allMatches['path'][$i],
      'filename' => $allMatches['filename'][$i],
      'fileext' => $allMatches['fileext'][$i]
    );

    $Path = new FilePath($match['path'], $fromDir);

    $version = version($Path->resolve(false, 'root'), $Path->file());

    $body = str_replace(
      $match['path'],
      $Path->resolve(false, 'absolute') . '/' . $match['filename'] . '--' . $version . $match['fileext'],
      $body
    );
  }

  return $body;
}