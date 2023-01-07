<title>Per function async queue</title>
<meta name="viewport" content="width=device-width">

<!-- ▼ Fichiers cache-busted grâce à PHP -->
<!--<?php versionizeStart(); ?>-->

<script defer src="../polyfills/adoptedStyleSheets.min.js"></script>
<script>window.esmsInitOptions = { polyfillEnable: ['css-modules'] }</script>
<script defer src="../polyfills/es-module-shims.js"></script>

<script type="importmap">
{
  "imports": {
    "per-function-async-queue": "/_common/js/per-function-async-queue.js"
  }
}
</script>

<!--<?php versionizeEnd(__DIR__); ?>-->

<style>
  body {
    margin: 0;
    padding: 10px;
    background-color: #DDD;
    color: #222;
    margin: 20px;

    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color: #222;
      color: #DDD;
    }
  }
</style>

<body>

  <script type="module">
    import { queueable } from 'per-function-async-queue';

    async function yip(...v) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('yip', ...v);
    }

    async function yop(...v) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('yop', ...v);
    }

    yip = queueable(yip);
    yop = queueable(yop);

    for (let i = 0; i < 3; i++) {
      yip(i, 2 * i);
      yop(i, 3 * i);
    }

    setTimeout(() => yip('This should appear after everything else'), 100);
  </script>

</body>