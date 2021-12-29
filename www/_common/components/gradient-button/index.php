<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>&lt;gradient-button&gt;</title>

  <script defer src="../../polyfills/adoptedStyleSheets.min.js"></script>
  <script type="esms-options">{ "polyfillEnable": ["css-modules", "json-modules"] }</script>
  <script defer src="../../polyfills/es-module-shims.js"></script>
  
  <!-- ▼ Fichiers cache-busted grâce à PHP -->
  <!--<?php ob_start();?>-->
  <script type="importmap">
  {
    "imports": {
      "styles": "./styles.css",
      "template": "./template.js"
    }
  }
  </script>
  <script type="module">
    import './gradient-button.js';
  </script>
  <!--<?php $imports = ob_get_clean();
  require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
  echo versionizeFiles($imports, __DIR__); ?>-->
</head>

<style>
  * { -webkit-tap-highlight-color: transparent; }
  html, body {
    height: 100%;
    margin: 0;
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
    flex-direction: row;
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

  gradient-button {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif;
    font-weight: 600;
    margin: .5em;
  }

  gradient-button:nth-of-type(4n+1) {
    --gradient: linear-gradient(135deg,
    black 0% calc(1 * 100% / 9),
    #72501E calc(2 * 100% / 9),
    #D12D1F calc(3 * 100% / 9),
    #EF9236 calc(4 * 100% / 9),
    #FCED4F calc(5 * 100% / 9),
    #3A7F30 calc(6 * 100% / 9),
    #1C50F6 calc(7 * 100% / 9),
    #6B1783 calc(8 * 100% / 9) 100%
    );
    --text-filter: brightness(1.5);
  }

  gradient-button:nth-of-type(4n+2) {
    --gradient: linear-gradient(to right,
    #7CCDF6 0%,
    #EAAEBA calc(1 * 100% / 4),
    #FFFFFF calc(2 * 100% / 4),
    #EAAEBA calc(3 * 100% / 4),
    #7CCDF6 100%
    );
    --hover-text-color: black;
    --hover-text-shadow: none;
  }

  gradient-button:nth-of-type(4n+3) {
    --gradient: linear-gradient(to bottom,
    #C42B70 0%,
    #925394 35% 65%,
    #1137A3 100%
    );
    --text-filter: brightness(1.5);
  }

  gradient-button:nth-of-type(4n+4) {
    --gradient: linear-gradient(135deg,
    #C33D1E 0% calc(1 * 100% / 8),
    #DF7C3D calc(2 * 100% / 8),
    #F19E63 calc(3 * 100% / 8),
    #FFFFFF calc(4 * 100% / 8),
    #C269A2 calc(5 * 100% / 8),
    #A85C8E calc(6 * 100% / 8),
    #951F60 calc(7 * 100% / 8) 100%
    );
  }
</style>

<p>

<gradient-button text="Hello !"></gradient-button>
<gradient-button text="How are you?"></gradient-button>
<gradient-button text="This is"></gradient-button>
<gradient-button text="gradient-button"></gradient-button>

<p>

<gradient-button border-width="0" text="No border"></gradient-button>
<gradient-button border-width="1" text="1px border"></gradient-button>
<gradient-button border-width="3" text="3px border"></gradient-button>

<p>

<gradient-button style="--padding: .25em .5em;" text="Small padding"></gradient-button>
<gradient-button style="--padding: .75em 1.5em;" text="Big padding"></gradient-button>

<p>
  
<a href="./css-only.php" target="_parent">CSS only version (without rounded corners 😢)</a>