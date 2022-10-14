<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/colori/lib/src/php/graph.php';
use colori\Graph;

/**
 * Builds a module graph : each node is the path of an ES module, and links are the paths of imports used by that module.
 * @param $startId - The identifier of the starting module used in the import map.
 * @param $importMap - The import map as an associative array.
 */
class ModuleGraph extends Graph {
  public function __construct(string $startId, array $importMap) {
    $ModulesList = [$startId];
    $ModulesPathList = [$importMap[$startId]];
    $GraphNodes = [];

    // Recursively find the list of modules that will be imported from the starting module.
    $findModulesFromFile = function (string $id) use (&$importMap, &$ModulesList, &$ModulesPathList, &$GraphNodes, &$findModulesFromFile): void {
      $path = $_SERVER['DOCUMENT_ROOT'].$importMap[$id];
      $contents = file_get_contents($path);
      $regex = '/(?:from|import) +?\'(.*?)\';/';
      preg_match_all($regex, $contents, $matches);
  
      $links = [];
      // For each imported module, find which additional modules they import
      for ($i = 0; $i < count($matches[0]); $i++) {
        $moduleId = $matches[1][$i];
        $modulePath = $_SERVER['DOCUMENT_ROOT'].$importMap[$moduleId];
        $links[] = $modulePath;
        if (in_array($modulePath, $ModulesPathList)) continue; // Ignore modules that were already imported earlier.
        else {
          $ModulesList[] = $moduleId;
          $ModulesPathList[] = $modulePath;
          $findModulesFromFile($moduleId);
        }
      }
  
      $node = [
        'id' => $path,
        'links' => $links
      ];
      $GraphNodes[] = $node;
    };

    $findModulesFromFile($startId);
    parent::__construct($GraphNodes);
  }
}