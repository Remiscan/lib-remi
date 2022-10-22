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
   * @param $relativeTo - The absolute path relative to which the returned path will be expressed. Supports shorthands 'absolute' and 'root'.
   */
  public function resolve(string $relativeTo = '', bool $filename = true): string {
    $parts = $this->parts;

    if ($relativeTo === 'absolute') return $this->resolve('', $filename);
    if ($relativeTo === 'root')     return $this->resolve($parts['root'], $filename);
    
    $path = $parts['directory'] . ($filename ? '/' . $parts['file'] : '');
    $rootPath = $parts['root'] . $path;

    if ($relativeTo !== '' && !str_starts_with($rootPath, $relativeTo)) {
      throw new Exception("Path $rootPath can not be expressed relative to $relativeTo");
    }

    return str_replace($relativeTo, '', $rootPath);
  }


  /**
   * Returns the path of the file's directory.
   * @param $root - Whether to include the document root or not.
   */
  public function directory(bool $root = false): string {
    if ($root) return $this->resolve('absolute', false);
    else       return $this->resolve('root', false);
  }


  /** Returns the file's name. */
  public function filename(): string {
    return $this->parts['file'];
  }
}