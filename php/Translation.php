<?php

class Translation {
  private readonly array $Texts;
  private string $language;
  private string $defaultLanguage = 'en';

  /**
   * Builds the page's translations from a source.
   * @param $source - The source containing the texts, either stringified JSON or a URL to a JSON file.
   */
  function __construct(string $source) {
    // If the source is stringified JSON
    if (substr($source, 0, 1) == '{') {
      $strings = $source;
    }
    
    // If the source is a link to a JSON file
    else {
      if (!file_exists($source)) throw new Exception("$source can not be used as a translation source");
      $strings = file_get_contents($source);
    }

    $strings = json_decode($strings, true);
    $this->Texts = $strings;

    // Sets the page's language from the user's Accept-Language header (if one of those is supported).
    $this->setLanguage();
  }


  /** Gets a list of supported languages. */
  function supportedLanguages(): array {
    return array_keys($this->Texts);
  }


  /**
   * Sets the language used by the page.
   * @param $lang - The language the user wants to use.
   */
  function setLanguage(?string $lang = null): string {
    $selectedLang = null;
    $candidates = $lang ? [$lang] : $this->acceptedLanguages(true);
    $supported = $this->supportedLanguages();

    foreach ($candidates as $l) {
      if (in_array($l, $supported)) $selectedLang = $l;
      break;
    }

    return $this->language = $selectedLang ?? $this->defaultLanguage;
  }


  /**
   * Gets the currently set language.
   */
  function getLanguage(): string {
    return $this->language;
  }

  /**
   * Gets the translated text associated to the requested id.
   * @param $id - The identifier of the requested text.
   */
  function get(string $id): string {
    return $this->Texts[$this->language][$id] ?? $this->Texts[$this->defaultLanguage][$id] ?? 'undefined string';
  }


  /**
   * Gets a list of languages accepted by the browser.
   * @param $truncate - Whether to truncate language identifiers to their base language tag.
   */
  static function acceptedLanguages(bool $truncate = false): array {
    $header = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? null;
    if ($header == null) return [];

    // Detect all accepted languages and their weight
    if ($truncate) {
      $regex = '/([a-z]{2,3})(?:-[a-z-]*)?\s*?(?:;\s*?q\s*?=\s*?(1|0\.[0-9]+?))?/i';
    } else {
      $regex = '/([a-z]{2,3}(?:-[a-z-]*)?)\s*?(?:;\s*?q\s*?=\s*?(1|0\.[0-9]+?))?/i';
    }
    preg_match_all($regex, $header, $matches);
    if (!count($matches)) return [];
    $languages = array_combine($matches[1], $matches[2]);

    // Replace absent weights by 1
    foreach($languages as $lang => $weight) {
      if ($weight === '') $languages[$lang] = 1;
    }

    // Sort accepted languages by weight
    arsort($languages, SORT_NUMERIC);

    return array_keys($languages);
  }
}