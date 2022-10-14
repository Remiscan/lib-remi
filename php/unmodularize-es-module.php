<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/_common/php/ModuleGraph.php';

/**
 * Builds a module graph starting from a first ES module, then include all of these modules
 * in the same file in proper import order, and remove all mentions of import and export.
 * This effectively transforms multiple ES module files into a single, non-module JS file.
 * @param $moduleId - The identifier of the first module used in the import map.
 * @param $importMapPath - The path of the import map file.
 */
function unmodularize(string $moduleId, string $importMapPath) {
  // Build the module graph
  $importMap = json_decode(file_get_contents($importMapPath), associative: true)['imports'];
  $graph = new ModuleGraph($moduleId, $importMap);
  $orderedModules = array_reverse(
    $graph->topologicalOrder()
  );
  
  // Include all module files in the right order and remove imports/exports.
  foreach ($orderedModules as $module) {
    $path = $module->id;

    ob_start();
    include_once $path;
    $content = ob_get_clean();

    echo preg_replace_callback_array([
      // Replace 'import/export { name as alias };' by 'var alias = name;'
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

      // Replace 'import/export name;' by ''
      '/(?:export|import)(.+?);/' => function ($matches) { return ''; },
      
      // Replace 'export expr' by 'expr';
      '/export ?/' => function ($matches) { return ''; },
    ], $content);
  }
}
