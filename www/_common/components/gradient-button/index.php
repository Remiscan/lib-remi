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
      "gradient-button-styles": "./styles.css",
      "gradient-button-template": "./template.js"
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
    --hover-text-color: black;
  }

  gradient-button:nth-of-type(4n+1) {
    --gradient: linear-gradient(135deg,
    #ff5d4b calc(1 * 100% / 7),
    #ff8d00 calc(2 * 100% / 7),
    #ffee00 calc(3 * 100% / 7),
    #51b859 calc(4 * 100% / 7),
    #5997ff calc(5 * 100% / 7),
    #d36ee7 calc(6 * 100% / 7) 100%
    );
  }

  gradient-button:nth-of-type(4n+2) {
    --gradient: linear-gradient(to right,
    #7CCDF6 0%,
    #EAAEBA calc(1 * 100% / 4),
    #FFFFFF calc(2 * 100% / 4),
    #EAAEBA calc(3 * 100% / 4),
    #7CCDF6 100%
    );
  }

  gradient-button:nth-of-type(4n+3) {
    --gradient: linear-gradient(to bottom,
    #f95f9c 0%,
    #c583c7 35% 65%,
    #6999ff 100%
    );
  }

  gradient-button:nth-of-type(4n+4) {
    --gradient: linear-gradient(135deg,
    #f86e4f 0% calc(1 * 100% / 8),
    #e48142 calc(2 * 100% / 8),
    #F19E63 calc(3 * 100% / 8),
    #FFFFFF calc(4 * 100% / 8),
    #d67bb5 calc(5 * 100% / 8),
    #d080b3 calc(6 * 100% / 8),
    #e86ea9 calc(7 * 100% / 8) 100%
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
<gradient-button border-width=".2em" text="0.2em border"></gradient-button>
<gradient-button border-width=".5rem" text="0.5rem border"></gradient-button>

<p>

<gradient-button style="--padding: .25em .5em;" text="Smaller padding"></gradient-button>
<gradient-button style="--padding: .75em 1.5em;" text="Bigger padding"></gradient-button>

<p>
  
<a href="./css-only.php" target="_parent">CSS only version (without rounded corners 😢)</a>