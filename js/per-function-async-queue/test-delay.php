<title>Per function async queue - delay</title>
<meta name="viewport" content="width=device-width">

<!-- ▼ Fichiers cache-busted grâce à PHP -->
<!--<?php versionizeStart(); ?>-->

<script defer src="../polyfills/adoptedStyleSheets.min.js"></script>
<script>window.esmsInitOptions = { polyfillEnable: ['css-modules'] }</script>
<script defer src="../polyfills/es-module-shims.js"></script>

<script type="importmap">
{
  "imports": {
    "per-function-async-queue": "/_common/js/per-function-async-queue/mod.js"
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

    async function _ho(i) {
      return Promise.resolve(i);
    }

	const ho = queueable(_ho, 1000);

	console.log('There should be a delay of 1s between each log, except the first one.')
	const max = 5;
    for (let i = 0; i <= max; i++) {
      ho(i).then(() => console.log(i));
	  if (i === max) {
		setTimeout(() => ho(i + 1).then(() => console.log(i + 1)), 500);
	  }
    }
  </script>

</body>