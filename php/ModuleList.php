<?php
require_once __DIR__ . '/resolvePath.php';

class ModuleList {
  private FilePath $startingPath;
  private array $FilePathList;
  private array $ResolvedPathList;
  private array $HashList;

  function __construct(FilePath $path) {
    $this->startingPath = $path;
    $this->FilePathList = [$path];
    $this->ResolvedPathList = [$path->resolve()];
    $this->HashList = [];
    $this->findModulesFromFile($path);
  }

  private function findModulesFromFile(FilePath $path): void {
    $contents = file_get_contents($path->resolve(true, 'root'));
    $hash = hash('crc32b', $contents);
    $path->setHash($hash);
    $this->HashList[] = $hash;
    $regex = '/(?:from|import) +?\'((?:.*?\/)([^\/]+?)(\.js(?:\.php)?))\';/';
    preg_match_all($regex, $contents, $matches);

    for ($i = 0; $i < count($matches[0]); $i++) {
      $modulePath = new FilePath($matches[1][$i], $path->directory(true));
      $fullPath = $modulePath->resolve();
      if (in_array($fullPath, $this->ResolvedPathList)) continue;
      else {
        $this->FilePathList[] = $modulePath;
        $this->ResolvedPathList[] = $fullPath;
        $this->findModulesFromFile($modulePath);
      }
    }
  }

  public function toArray($resolved = true) {
    if ($resolved) return $this->ResolvedPathList;
    else           return $this->FilePathList;
  }

  public function toHash() {
    if (count($this->HashList) > 1) return hash('crc32b', implode('', $this->HashList));
    else                            return $this->HashList[0];
  }
}