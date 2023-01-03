<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/_common/php/Graph.php';

/**
 * Builds a module graph : each node is the path of an ES module, and links are the paths of imports used by that module.
 * @param $importMap - The import map as an associative array.
 */
class ModuleGraph extends Graph {
  public function __construct(array $importMap) {
    $graphNodes = [];

    // Make a Graph node for a module
    $makeNode = function (string $id) use (&$importMap) {
      $path = $importMap[$id];
      $contents = file_get_contents($_SERVER['DOCUMENT_ROOT'].$path);
      $regex = '/(?:from|import) +?\'(.*?)\';/';
      preg_match_all($regex, $contents, $matches);

      $links = [];
      // For each imported module, find which additional modules they import
      for ($i = 0; $i < count($matches[0]); $i++) {
        $moduleId = $matches[1][$i];
        $modulePath = $importMap[$moduleId] ?? false;
        if (!$modulePath) continue;
        $links[] = $modulePath;
      }
  
      return [
        'id' => $path,
        'links' => $links
      ];
    };

    foreach ($importMap as $id => $path) {
      $node = $makeNode($id);
      $graphNodes[] = $node;
    }

    parent::__construct($graphNodes);
  }
}