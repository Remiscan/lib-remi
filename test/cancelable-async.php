<title>cancelableAsync</title>
<meta name="viewport" content="width=device-width">

<!-- ▼ Fichiers cache-busted grâce à PHP -->
<!--<?php versionizeStart(); ?>-->

<script defer src="../polyfills/adoptedStyleSheets.min.js"></script>
<script>window.esmsInitOptions = { polyfillEnable: ['css-modules'] }</script>
<script defer src="../polyfills/es-module-shims.js"></script>

<script type="importmap">
{
  "imports": {
    "cancelable-async": "/_common/js/cancelable-async.js"
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
    import { cancelableAsync, CanceledAsyncWarning } from 'cancelable-async';

    function* test(i) {
      yield new Promise(resolve => setTimeout(resolve, 1000));
      return i;
    }

    test = cancelableAsync(test);

    for (let j = 0; j <= 5; j++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      test(j).then(val => console.log(val))
             .catch(error => {
                if (error instanceof CanceledAsyncWarning) {
                  console.log(error);
                } else {
                  throw error;
                }
             });
    }
  </script>

</body>