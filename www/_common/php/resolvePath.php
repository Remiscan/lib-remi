<?php
class FilePath {
  private $startingDirectory;
  private $unresolved;
  private $parts;

  function __construct($path, $fromDir = __DIR__) {
    $this->unresolved = $path;
    $this->startingDirectory = $fromDir;

    $pathArray = explode('/', $path);

    $depth = 0;
    $dir = ($pathArray[0] == '') ? $_SERVER['DOCUMENT_ROOT'] : $fromDir;
    $i0 = ($pathArray[0] == '') ? 1 : 0;

    for ($i = $i0; $i < count($pathArray); $i++) {
      $part = $pathArray[$i];

      if ($part == '..') $depth++;
      elseif ($part == '.') {}
      else {
        $dir = ($depth > 0) ? dirname($dir, $depth) : $dir;
        $dir = $dir . '/' . $part;
        $depth = 0;
      }
    }

    $dir = ($depth > 0) ? dirname($dir, $depth) : dirname($dir);
    //$this->resolved = str_replace($_SERVER['DOCUMENT_ROOT'], '', $dir);

    $parts = [
      'root' => $_SERVER['DOCUMENT_ROOT'],
      'directory' => str_replace($_SERVER['DOCUMENT_ROOT'], '', $dir),
      'file' => $pathArray[count($pathArray) - 1]
    ];

    $this->parts = $parts;
  }

  public function resolve($file = true, $type = 'absolute') {
    $parts = $this->parts;
    $path = $parts['directory'] . ($file ? '/' . $parts['file'] : '');
    $rootPath = $parts['root'] . $path;

    if ($type == 'relative') {
      $match = preg_match(
        '/^' . preg_quote($this->startingDirectory, '/') . '/',
        $rootPath
      );
      if ($match === 1)      return str_replace($this->startingDirectory, '.', $rootPath);
      else                   return $path;
    }   

    if ($type == 'absolute') return $path;
    else                     return $rootPath;
  }

  public function directory($root = false) {
    if ($root) return $this->resolve(false, 'root');
    else       return $this->resolve(false, 'absolute');
  }

  public function file() {
    return $this->parts['file'];
  }
}