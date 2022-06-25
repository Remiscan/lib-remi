<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>&lt;loader-button&gt;</title>
  
  <!-- ▼ Fichiers cache-busted grâce à PHP -->
  <!--<?php ob_start();?>-->

  <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
  <script type="esms-options">{ "polyfillEnable": ["css-modules", "json-modules"] }</script>
  <script defer src="../../polyfills/es-module-shims.js"></script>

  <script type="importmap">
  {
    "imports": {
      "loader-button": "/_common/components/loader-button/loader-button.js",
      "loader-button-styles": "/_common/components/loader-button/styles.css",
      "loader-button-template": "/_common/components/loader-button/template.js"
    }
  }
  </script>

  <!--<?php $imports = ob_get_clean();
  require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
  echo versionizeFiles($imports, __DIR__); ?>-->

  <script type="module">
    import 'loader-button';
  </script>
</head>

<style>
  * { -webkit-tap-highlight-color: transparent; }
  html, body {
    height: 100%;
    margin: 0;
    color-scheme: light dark;
  }
  body {
    background-color: hsl(250, 40%, 30%);
    background-image: linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25% 75%, rgba(0, 0, 0, .1) 75%), 
                      linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25% 75%, rgba(0, 0, 0, .1) 75%);
    background-size: 64px 64px;
    background-position: 0 0, 32px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  p {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  a {
    color: white;
    opacity: .7;
    position: absolute;
    bottom: 1em;
  }

  loader-button {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif;
    font-weight: 600;
    margin: .5em;
  }

  loader-button:nth-of-type(3n+2) {
    --button-color: #375dd4;
    --hover-color: rgb(255, 255, 255, .1);
    --active-color: rgb(0, 0, 0, .1);
    color: white;
  }

  loader-button:nth-of-type(3n+3) {
    --button-color: #8c3db6;
    --hover-color: rgb(255, 255, 255, .1);
    --active-color: rgb(0, 0, 0, .1);
    color: white;
  }
</style>

<p>

<loader-button text="Test" success-text="Success ✅" failure-text="Failure ❌"></loader-button>
<loader-button text="Start loading" success-text="Success ✅" failure-text="Failure ❌"></loader-button>
<loader-button text="Start loading stuff" success-text="Success ✅" failure-text="Failure ❌"></loader-button>