<?php /* Prepended in global.php */

/**
 * Builds a stylesheet supporting light and dark themes through both @media (prefers-color-scheme)
 * and [data-theme="light"/"dark"]
 */
function buildThemesStylesheet(string $body, string $default = 'light', bool $closeComment = false): array {
  $regexp = '/(?:html|:root)\[(?:data-)?theme="?light"?\](?<selector> .*)*\{(?<light>(?:.|\n|\r)*?)\}(?:\n|\r| )*(?:html|:root)\[(?:data-)?theme="?dark"?\]( .*)*\{(?<dark>(?:.|\n|\r)*?)\}/';
  preg_match_all($regexp, $body, $matches);

  $blocks = [];

  for ($i = 0; $i < count($matches[0]); $i++) {
    $selector = str_replace(' ', '', $matches['selector'][$i]) == '' ? ':root' : $matches['selector'][$i];

    $css = "";
    if ($closeComment) $css .= "*/";
    $css .= "\n" . $selector . " {" . $matches[$default][$i] . "}\n\n";
    if ($default == 'dark') {
      $css .= "@media (prefers-color-scheme: light) {\n" . $selector . " {" . $matches['light'][$i] . "}\n}\n\n";
    } else {
      $css .= "@media (prefers-color-scheme: dark) {\n" . $selector . " {" . $matches['dark'][$i] . "}\n}\n\n";
    }
    $css .= ":root[data-theme=\"light\"] " . $matches['selector'][$i] . " {" . $matches['light'][$i] . "}\n\n";
    $css .= ":root[data-theme=\"dark\"] " . $matches['selector'][$i] . " {" . $matches['dark'][$i] . "}\n";
    if ($closeComment) $css .= "/*";
  
    $blocks[] = $css;
  }

  return $blocks;
}



function themeSheetStart() {
  ob_start();
}

function themeSheetEnd($default = 'light', $closeComment = true) {
  $body = ob_get_clean();
  $blocks = buildThemesStylesheet($body, $default, $closeComment);
  foreach ($blocks as $block) {
    echo $block;
  }
}



/* HOW TO USE: In CSS */
/* (themeSheetStart and themeSheetEnd prepended in global.php)

//    /*< ?php themeSheetStart(); ? >*/
//
//    html[data-theme="light"] {
//      --variables-light: etc; 
//    }
//
//    html[data-theme="dark"] {
//      --variables-dark: etc;
//    }
//
//    /*< ?php themeSheetEnd(closeComment: true); ? >*/

/* PRINTS (if default = light) */

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