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
    $modulesList = [$startId];
    $modulesPathList = [$importMap[$startId]];
    $graphNodes = [];

    // Recursively find the list of modules that will be imported from the starting module.
    $findModulesFromFile = function (string $id) use (&$importMap, &$modulesList, &$modulesPathList, &$graphNodes, &$findModulesFromFile): void {
      $path = $importMap[$id];
      $contents = file_get_contents($_SERVER['DOCUMENT_ROOT'].$path);
      $regex = '/(?:from|import) +?\'(.*?)\';/';
      preg_match_all($regex, $contents, $matches);
  
      $links = [];
      // For each imported module, find which additional modules they import
      for ($i = 0; $i < count($matches[0]); $i++) {
        $moduleId = $matches[1][$i];
        $modulePath = $importMap[$moduleId];
        $links[] = $modulePath;
        if (in_array($modulePath, $modulesPathList)) continue; // Ignore modules that were already imported earlier.
        else {
          $modulesList[] = $moduleId;
          $modulesPathList[] = $modulePath;
          $findModulesFromFile($moduleId);
        }
      }
  
      $node = [
        'id' => $path,
        'links' => $links
      ];
      $graphNodes[] = $node;
    };

    $findModulesFromFile($startId);
    parent::__construct($graphNodes);
  }
}