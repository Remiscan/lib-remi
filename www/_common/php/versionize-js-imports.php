<?php
require_once __DIR__.'/version.php';

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Récupère les imports JavaScript en utilisant la fonction comme ceci en début de fichier .js.php :
//
//    /*< ?php ob_start();? >*/
//    import { ... } from '../_common/abc.js';
//    import { ... } from './abc.js.php';
//    /*< ?php $imports = ob_get_clean();
//    require_once dirname(__DIR__, 1).'/_common/php/versionize-js-imports.php';
//    echo versionizeImports($imports, __DIR__); ? >*/
//
// et renvoie les imports en ayant inséré le numéro de version avant l'extension de fichier :
//
//    import { ... } from '../_common/abc--2020.01.30_16.16.16.js';
//    import { ... } from './abc--2020.03.11_20.31.18.js.php';
//
////////////////////////////////////////////////////////////////////////////////////////////////////

function versionizeImports($imports, $fromDir = __DIR__)
{
  preg_match_all('/from \'((?:(?:\.\.)\/?)+|\.)\/(|.+\/)?([a-zA-Z0-9_-]+)(\.js(?:\.php)?)\';/', $imports, $matches);
  $n = count($matches[0]);

  for ($i = 0; $i < $n; $i++)
  {
    $match = array();

    foreach($matches as $m) {
      $match[] = $m[$i];
    }

    if ($match[1] == '.')
      $dir = $fromDir;
    elseif (preg_match('/\.\./', $match[1])) {
      $depth = count(explode('/', $match[1]));
      $dir = dirname($fromDir, $depth).'/'.$match[2];
    }
    
    $version = version($dir, $match[3].$match[4]);
    
    $imports = str_replace(
      $match[2].$match[3].$match[4],
      $match[2].$match[3].'--'.$version.$match[4],
      $imports
    );
  }

  return $imports;
}