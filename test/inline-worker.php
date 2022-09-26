<title>inline worker</title>
<meta name="viewport" content="width=device-width">

<!-- ▼ Fichiers cache-busted grâce à PHP -->
<!--<?php versionizeStart(); ?>-->

<script defer src="../polyfills/adoptedStyleSheets.min.js"></script>
<script>window.esmsInitOptions = { polyfillEnable: ['css-modules'] }</script>
<script defer src="../polyfills/es-module-shims.js"></script>

<script type="importmap">
{
  "imports": {
    "inline-worker": "/_common/js/inline-worker.js"
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

  <button type="button">Contacter le worker</button>

  <script type="module">
    import InlineWorker from 'inline-worker';

    async function test(n) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return n * 2;
    }

    const inlineWorker = new InlineWorker(test);

    const button = document.querySelector('button');
    button.addEventListener('click', async event => {
      const result = await inlineWorker.run(17);
      console.log(result);
    });
  </script>

</body>