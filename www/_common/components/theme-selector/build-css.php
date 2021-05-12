<?php
////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Construit le fichier .css contenant les variables de thème en utilisant la fonction comme ceci
// au début du fichier style-themes.css.php :
//
//    /*< ?php ob_start();? >*/
//
//    html[data-theme="light"] {
//      --variables-light: etc; 
//    }
//
//    html[data-theme="dark"] {
//      --variables-dark: etc;
//    }
//
//    /*< ?php $body = ob_get_clean();
//    require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
//    echo buildThemesStylesheet($body); ? >*/
//
// et renvoie les mêmes variables organisées comme ceci :
//
//    html {
//      --variables-default: etc;
//    }
//
//    @media (prefers-color-scheme: light) {
//      html {
//        --variables-light: etc;
//      }
//    }
//
//    @media (prefers-color-scheme: dark) {
//      html {
//        --variables-dark: etc;
//      }
//    }
//
//    html[data-theme="light"] {
//      --variables-light: etc; 
//    }
//
//    html[data-theme="dark"] {
//      --variables-dark: etc;
//    }
//
////////////////////////////////////////////////////////////////////////////////////////////////////

function buildThemesStylesheet($body, $default = 'light')
{
  $regexp = '/(?:html|:root)\[data-theme="?light"?\] *\{(?<light>(?:.|\n|\r)*)\}(?:\n|\r| )*(?:html|:root)\[data-theme="?dark"?\] *\{(?<dark>(?:.|\n|\r)*)\}/';
  preg_match_all($regexp, $body, $matches);

  $css = "*/
:root {" . $matches[$default][0] . "}

@media (prefers-color-scheme: light) {
  :root {" . $matches['light'][0] . "}
}

@media (prefers-color-scheme: dark) {
  :root {" . $matches['dark'][0] . "}
}

:root[data-theme=\"light\"] {" . $matches['light'][0] . "}

:root[data-theme=\"dark\"] {" . $matches['dark'][0] . "}
/*";

  return $css;
}