<html lang="fr">

<title>TranslationObserver</title>
<meta name="viewport" content="width=device-width">

<!-- ▼ Fichiers cache-busted grâce à PHP -->
<!--<?php versionizeStart(); ?>-->

<script defer src="../polyfills/adoptedStyleSheets.min.js"></script>
<script>window.esmsInitOptions = { polyfillEnable: ['css-modules'] }</script>
<script defer src="../polyfills/es-module-shims.js"></script>

<script type="importmap">
{
  "imports": {
    "color-picker": "/_common/components/color-picker/color-picker.js",
    "range-gradient-worklet": "/_common/components/color-picker/worklet.js.php",
    "input-slider": "/_common/components/input-slider/input-slider.js",
    "colori": "/colori/lib/dist/colori.min.js",
    "translation-observer": "/_common/js/translation-observer/mod.js"
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

    display: flex;
    flex-direction: column;
    align-items: center;
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
    import 'color-picker';
    import translationObserver from 'translation-observer';

    const strings = {
      "fr": {
        "test": "Ceci est un test",
        "change-lang": "Traduire la page en anglais"
      },
      "en": {
        "test": "This is a test",
        "change-lang": "Translate the page into French"
      }
    };
    
    const source = document.documentElement;
    source.addEventListener('translate', event => translationObserver.translate(source, strings, event.detail.lang));
    translationObserver.serve(source);

    const button = document.querySelector('button[data-action="translate"]');
    button.addEventListener('click', event => {
      const currentLang = document.documentElement.getAttribute('lang');
      const newLang = currentLang === 'fr' ? 'en' : 'fr';
      document.documentElement.setAttribute('lang', newLang);
    });
  </script>

  <p data-string="test"></p>

  <p>
    <color-picker position="bottom" format="okhsl" label name="color"
                  style="--size: 2rem; --range-border-width: 5px; --range-border-radius: 5px;">
    </color-picker>
  </p>

  <p>
    <button type="button" data-string="change-lang" data-action="translate"></button>
  </p>

</body>