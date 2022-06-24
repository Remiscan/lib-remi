<?php
// Chargement automatique de classes PHP, chaque classe est dans son fichier class_nom.php
// et sera appelée automatiquement quand on utilisera la classe pour la première fois.
function autochargeClasses($className)
{ 
  if (file_exists('class_'.$className.'.php'))
  { 
    require_once 'class_'.$className.'.php'; 
    return true; 
  }
  elseif (file_exists('modules/class_'.$className.'.php'))
  { 
    require_once 'modules/class_'.$className.'.php'; 
    return true; 
  }
  return false; 
}
// Indique que la fonction précédente est la fonction d'autoload
spl_autoload_register('autochargeClasses');