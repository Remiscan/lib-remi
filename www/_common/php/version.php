<?php
// Calcule la version du site
// ou d'une liste de fichiers (en chemins relatifs au dossier racine du projet)
function version($dir = __DIR__, $arrayChemins = false)
{
  if ($arrayChemins)
    $listeFichiers = (array) $arrayChemins;
  else
    $listeFichiers = array_diff(scandir($dir), array('..', '.'));
  $versionFichiers = 0;
  foreach($listeFichiers as $fichier)
  {
    if (file_exists($dir . '/' . $fichier))
    {
      if ($arrayChemins)
        $date_fichier = filemtime($dir . '/' . $fichier);
      else
        $date_fichier = filemtime($dir . '/' . $fichier);

      if ($date_fichier > $versionFichiers)
        $versionFichiers = $date_fichier;
    }
  }
  $versionFichiers = date('Y.m.d_H.i.s', $versionFichiers);
  return $versionFichiers;
}