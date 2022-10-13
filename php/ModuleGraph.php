<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/colori/lib/src/php/graph.php';

class ModuleGraph {
  public static function create(string $startId, array $importMap): colori\Graph {
    $ModulesList = [$startId];
    $ModulesPathList = [$importMap[$startId]];
    $GraphNodes = [];

    $findModulesFromFile = function (string $id) use (&$importMap, &$ModulesList, &$ModulesPathList, &$GraphNodes, &$findModulesFromFile): void {
      $path = $_SERVER['DOCUMENT_ROOT'].$importMap[$id];
      $contents = file_get_contents($path);
      $regex = '/(?:from|import) +?\'(.*?)\';/';
      preg_match_all($regex, $contents, $matches);
  
      $links = [];
      for ($i = 0; $i < count($matches[0]); $i++) {
        $moduleId = $matches[1][$i];
        $modulePath = $_SERVER['DOCUMENT_ROOT'].$importMap[$moduleId];
        $links[] = $modulePath;
        if (in_array($modulePath, $ModulesPathList)) continue;
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
    return new colori\Graph($GraphNodes);
  }
}