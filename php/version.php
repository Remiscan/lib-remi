<?php
/** Computes the version of a list of files, relative to the given directory. */
function version($dir = __DIR__, $arrayChemins = false, $method = 'hash')
{
  if ($arrayChemins) $listeFichiers = (array) $arrayChemins;
  else               $listeFichiers = array_diff(scandir($dir), array('..', '.'));

  // Initialize version
  $versionFichiers = match($method) {
    'date', 'pretty-date' => 0,
    'hash' => []
  };

  // Compute version
  foreach($listeFichiers as $fichier) {
    $path = $dir . '/' . $fichier;
    if (file_exists($path) && is_file($path)) {
      switch ($method) {
        case 'pretty-date':
        case 'date':
          $date_fichier = filemtime($path);
          if ($date_fichier > $versionFichiers) $versionFichiers = $date_fichier;
          break;
        case 'hash':
          $hash = hash_file('crc32b', $path);
          $versionFichiers[] = $hash;
      }
    }
  }

  // Parse version
  $versionFichiers = match($method) {
    'pretty-date' => date('Y.m.d_H.i.s', $versionFichiers),
    'hash' => count($versionFichiers) > 1 ? hash('crc32b', implode($versionFichiers)) : ($versionFichiers[0] ?? 'doesnotexist'),
    default => $versionFichiers
  };

  return $versionFichiers;
}