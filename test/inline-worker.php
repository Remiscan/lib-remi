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

<script type="module">
  import InlineWorker from 'inline-worker';


  async function test(n) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return n * 2;
  }

  const inlineWorker = new InlineWorker(test);

  const doubleButton = document.querySelector('#doubleButton');
  doubleButton.addEventListener('click', async event => {
    const number = document.querySelector('#number').value;
    const result = await inlineWorker.run(number);
    console.log(result);
  });


  async function testError(e) {
    throw new Error(e);
  }

  const errorWorker = new InlineWorker(testError);

  const errorButton = document.querySelector('#errorButton');
  errorButton.addEventListener('click', async event => {
    const result = await errorWorker.run('test error');
    console.log(result);
  });
</script>

<style>
  body {
    margin: 0;
    padding: 10px;
    background-color: #DDD;
    color: #222;
    margin: 20px;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color: #222;
      color: #DDD;
    }
  }
</style>

<body>

  <p>
    <label for="number">const x = </label>
    <input type="number" id="number" value="17">
    <span>;</span>
    <button type="button" id="doubleButton">Execute x => x * 2 in an InlineWorker (with 1s delay)</button>
  </p>

  <p>
    <button type="button" id="errorButton">Throw 'test error' in an InlineWorker</button>
  </p>
</body>