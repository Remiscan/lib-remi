<?php
/**
 * Takes a relative path and a base directory, and resolves the full path.
 * @param $path - The relative path.
 * @param $fromDir - The base directory.
 */
class FilePath {
  private $startingDirectory;
  private $unresolved;
  private $parts;

  function __construct(string $path, string $fromDir = __DIR__) {
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

    $parts = [
      'root' => $_SERVER['DOCUMENT_ROOT'],
      'directory' => str_replace($_SERVER['DOCUMENT_ROOT'], '', $dir),
      'file' => $pathArray[count($pathArray) - 1]
    ];

    $this->parts = $parts;
  }


  /**
   * Resolves the path of the file.
   * @param $file - Whether to include the file in the path. If not, only return the path of its directory.
   * @param $type - The type of path requested: relative (to the base directory), root-relative (relative to the document root), absolute.
   */
  public function resolve(bool $file = true, string $type = 'absolute'): string {
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

    elseif ($type == 'root-relative') return $path;
    else                              return $rootPath;
  }


  /**
   * Returns the path of the file's directory.
   * @param $root - Whether to include the document root or not.
   */
  public function directory(bool $root = false): string {
    if ($root) return $this->resolve(false, 'absolute');
    else       return $this->resolve(false, 'root-relative');
  }


  /** Returns the file's name. */
  public function file(): string {
    return $this->parts['file'];
  }
}