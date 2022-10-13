<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/_common/php/ModuleGraph.php';

function unmodularize(string $moduleId, string $importMapPath) {
  $importMap = json_decode(file_get_contents($importMapPath), associative: true)['imports'];
  $graph = ModuleGraph::create($moduleId, $importMap);
  $orderedModules = array_reverse(
    $graph->topologicalOrder()
  );
  
  foreach ($orderedModules as $module) {
    $path = $module->id;
    ob_start();
    include_once $path;
    $content = ob_get_clean();
    echo preg_replace_callback_array([
      '/(?:export|import) *?\{(.*?)\} *?(?:from(.*?))?;/' => function ($matches) {
        $body = $matches[1];
        $parts = explode(',', $body);
        $aliases = [];
        $result = '';
        $defaultCount = 0;

        foreach ($parts as $part) {
          $subparts = explode(' as ', $part);
          $name = trim($subparts[0]);
          if ($name === 'default') $name = 'def';
          $alias = trim($subparts[1] ?? '');
          if ($alias === 'default') $alias = 'def';
          if ($alias) $result .= "var $alias = $name;";
        }

        return $result;
      },
      '/export(.+?);/' => function ($matches) { return ''; },
      '/export ?/' => function ($matches) { return ''; },
      '/import(.+?);/' => function ($matches) { return ''; },
    ], $content);
  }
}
