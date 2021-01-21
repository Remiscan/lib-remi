<?php
require_once 'httpLanguage.php';

// Chargement initial des strings dans une application traduisible (via traduction.js)
class Textes {
  public $strings;
  public $lang;

  function __construct($app) {
    $this->lang = httpLanguage();
    $path = dirname(__DIR__, 2) . '/' . $app . '/strings.json';
    if (!file_exists($path)) throw new Exception('Fichier strings.json introuvable');
    $json = file_get_contents($path);
    $json = json_decode($json, true);
    $this->strings = $json;
  }

  public function getString($id) {
    return $this->strings[$this->lang][$id] ?? $this->strings['fr'][$id] ?? 'undefined string';
  }
}