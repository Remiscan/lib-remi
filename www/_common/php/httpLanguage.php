<?php
// Retourne le langage demandé par le navigateur
function httpLanguage()
{
  $loc = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
  if ($loc != null)
  {
    preg_match_all('/([a-z]{1,8})(?:-[a-z]{1,8})?\s*(?:;\s*q\s*=\s*(1|0\.[0-9]+))?/i', $loc, $matches);

    if (!count($matches)) return '';

    $langues = array_combine($matches[1], $matches[2]);
    foreach($langues as $langue => $pref) {
      if ($pref === '') $langues[$langue] = 1;
    }

    arsort($langues, SORT_NUMERIC);

    foreach($langues as $langue => $pref) {
      if (strpos($langue, 'fr') === 0)  return 'fr';
      elseif (strpos($langue, 'en') === 0) return 'en';
    }

    return '';
  }
  else
    return '';
}