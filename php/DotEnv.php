<?php
/**
 * Parses a .env file.
 * @param $path - The path to the .env file.
 */
class DotEnv {
  private array $env;

  public function __construct(string $path) {
    $env = file_get_contents($path);
    preg_match_all('/^(.*?)=([^\s]*)/m', $env, $matches);
    $env = array_combine($matches[1], $matches[2]);
    $this->env = $env;
  }

  /** Gets a value from the .env file. */
  public function get(string $key): string {
    return $this->env[$key];
  }

  /** Gets an array of all values from the .env file. */
  public function getAll(): array {
    return $this->env;
  }
}