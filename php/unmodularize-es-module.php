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
  $graph = (new ModuleGraph($importMap))->subGraphFrom($importMap[$moduleId]);
  $orderedModules = array_reverse(
    $graph->topologicalOrder()
  );

  $defaultExports = array();
  $defaultCount = 0;
  
  // Include all module files in the right order and remove imports/exports.
  foreach ($orderedModules as $module) {
    $path = $module->id;

    ob_start();
    include_once $_SERVER['DOCUMENT_ROOT'].$path;
    $content = ob_get_clean();

    echo preg_replace_callback_array([
      // Replace 'import/export { name as alias } from ...;' by 'var alias = name;'
      '/(export|import) *?\{(.*?)\} *?(?:from ?\'(.*?)\' *?)?;/' => function ($matches) use (&$path, &$importMap, &$defaultExports, &$defaultCount) {
        $action = $matches[1]; // 'import' or 'export'
        $body = $matches[2]; // 'name1 as alias1, name2 as alias2, ...'
        $from = $matches[3] ?? null; // identifier of the imported module

        $parts = explode(',', $body);
        $aliases = [];
        $result = '';

        foreach ($parts as $part) {
          $subparts = explode(' as ', $part);
          $name = trim($subparts[0]);
          $alias = trim($subparts[1] ?? '');
          if ($action === 'export' && $alias === 'default') {
            $alias = "def$defaultCount";
            $defaultCount++;
            $defaultExports[$path] = $alias;
          } elseif ($action === 'import' && $name === 'default') {
            $name = $defaultExports[$importMap[trim($from)]];
          }
          if ($name && $alias) $result .= "var $alias = $name;";
        }

        return $result;
      },

      // Replace 'import name from ...;' by 'var name = def${i};'
      '/(import) *?([^{}]*?) *?(?:from ?\'(.*?)\' *?)?;/' => function ($matches) use (&$path, &$importMap, &$defaultExports, &$defaultCount) {
        $name = $matches[2]; // 'name'
        $from = $matches[3] ?? null; // identifier of the imported module

        $result = '';

        $alias = $defaultExports[$importMap[trim($from)]];
        if ($name && $alias) $result .= "var $name = $alias;";

        return $result;
      },

      // Replace 'import/export name;' and 'export default name;' by ''
      '/(?:export|import)(.+?);/' => function ($matches) { return ''; },
      
      // Replace 'export expr' and 'export default expr' by 'expr';
      '/export (?:default)?/' => function ($matches) { return ''; },
    ], $content);
  }
}
