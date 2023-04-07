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
      return ['yip', ...v];
    }

    async function yop(...v) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return ['yop', ...v];
    }

    async function err(...v) {
      await new Promise((resolve, reject) => setTimeout(() => reject(v), 1000));
      return [...v];
    }

    yip = queueable(yip);
    yop = queueable(yop);
    err = queueable(err);

    for (let i = 0; i < 2; i++) {
      yip(i, 2 * i).then(v => console.log(...v));
      yop(i, 3 * i).then(v => console.log(...v));
    }

    const messages = await yip('💚 There should be a blue heart right after this');
    console.log(...messages);
    console.log('💙 There should be a green heart right before this');

    for (let i = 2; i < 4; i++) {
      err(i).then(v => console.log(...v));
    }

    for (let i = 4; i < 6; i++) {
      yip(i, 2 * i).then(v => console.log(...v));
      yop(i, 3 * i).then(v => console.log(...v));
    }

    setTimeout(async () => console.log(...await yip('This should be the last message')), 100);
  </script>

</body>