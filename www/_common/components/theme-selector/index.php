<style>
  html {
    --bg-color: skyblue;
    --sunmoon-color: black;
    --sunray-color: grey;
  }

  @media (prefers-color-scheme: light) {
    html {
      --bg-color: skyblue;
      --sunmoon-color: black;
      --sunray-color: grey;
    }
  }

  @media (prefers-color-scheme: dark) {
    html {
      --bg-color: darkblue;
      --sunmoon-color: white;
      --sunray-color: lightgrey;
    }
  }

  html[data-theme="light"] {
    --bg-color: skyblue;
    --sunmoon-color: black;
    --sunray-color: grey;
  }

  html[data-theme="dark"] {
    --bg-color: darkblue;
    --sunmoon-color: white;
    --sunray-color: lightgrey;
  }

  body {
    background: var(--bg-color);
    display: grid;
    grid-template-rows: repeat(10, 5rem);
    grid-template-columns: repeat(10, 5rem);
    color: var(--sunmoon-color);
  }

  theme-selector {
    grid-row: 3;
    grid-column: 5;
  }
</style>

<body>
  <theme-selector></theme-selector>
</body>

<script type="module">
  // ▼ ES modules cache-busted grâce à PHP
  /*<?php ob_start();?>*/

  import '/_common/components/theme-selector/theme-selector.js.php';

  /*<?php $imports = ob_get_clean();
  require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/php/versionize-files.php';
  echo versionizeFiles($imports, __DIR__); ?>*/


  ////////////////////////////////
  // Gère les changements de thème
  window.addEventListener('themechange', event => {
    console.log('Theme change requested:', event.detail.theme, '/', event.detail.resolvedTheme);
    const html = document.documentElement;
    html.dataset.theme = event.detail.theme;
  });
</script>