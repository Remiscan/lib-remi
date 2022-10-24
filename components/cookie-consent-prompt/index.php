<?php
$testCookie = isset($_COOKIE['test']) ? $_COOKIE['test'] : '';
?>

<!doctype html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>&lt;cookie-consent-prompt&gt;</title>

    <!-- ▼ Cache-busted files -->
    <!--<?php versionizeStart(); ?>-->

    <!-- Import map -->
    <script defer src="/_common/polyfills/adoptedStyleSheets.min.js"></script>
    <script>window.esmsInitOptions = { polyfillEnable: ['css-modules', 'json-modules'] }</script>
    <script defer src="/_common/polyfills/es-module-shims.js"></script>
    
    <script type="importmap">
    {
      "imports": {
        "cookie-consent-prompt": "/_common/components/cookie-consent-prompt/cookie-consent-prompt.js",
        "cookie-factory": "/_common/js/cookie-factory.js",
        "translation-observer": "/_common/js/translation-observer.js"
      }
    }
    </script>
    
    <link rel="modulepreload" href="/_common/components/cookie-consent-prompt/cookie-consent-prompt.js">
    <link rel="modulepreload" href="/_common/js/cookie-factory.js">
    <link rel="modulepreload" href="/_common/js/translation-observer.js">
    
    <!--<?php versionizeEnd(__DIR__); ?>-->

    <style>
      html {
        color-scheme: light dark;
      }

      html, body {
        height: 100%;
      }

      body {
        background: var(--bg-color);
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr 10rem;
        color: var(--sunmoon-color);
        position: relative;
        gap: .5rem;
        place-items: center;
        font-family: system-ui;
        margin: 0;
      }

      .cookie-consent-container {
        align-self: end;
        grid-row: -2;
        display: grid;
        place-items: center;
      }

      .yes-set > .no,
      .no-set > .yes {
        display: none;
      }

      p {
        display: flex;
        flex-direction: column;
        max-width: min(95%, 60ch);
        line-height: 1.4em;
      }

      button {
        font-size: 1.1em;
        padding: 5px;
      }

      cookie-consent-prompt {
        border: 1px solid currentColor;
        border-radius: 10px;
        margin: 10px;
        padding: 10px;
        row-gap: 5px;
      }

      cookie-consent-prompt > .cookie-consent-prompt-info {
        opacity: .8;
      }
    </style>
  </head>

  <body>
    <p class="intro">
      I'm tired of being asked to consent to all cookies as soon as I visit any website. My goal here was to create a system working more like Android app permissions: no cookie is set by default, and you only get prompted to consent to a specific cookie when you do something that needs a cookie.
    </p>

    <p>
      <span class="cookie-info <?=$testCookie != '' ? 'yes' : 'no' ?>-set">
        <span class="yes">The test cookie is set. It will expire after 5 minutes.</span>
        <span class="no">The test cookie is not set.</span>
      </span>

      <button type="button" class="open-prompt">Set test cookie</button>
    </p>

    <div class="cookie-consent-container"></div>

    <script type="module">
      import CookieFactory from 'cookie-factory';
      import 'cookie-consent-prompt';

      const Cookie = new CookieFactory('_common/components');

      // Detects button click
      const button = document.querySelector('.open-prompt');
      button.addEventListener('click', () => {
        const cookie = new Cookie('test', 'test value', { maxAge: 5*60 });
        cookie.prompt(true);
      });

      // Detects cookie consent
      window.addEventListener('cookieconsent', event => {
        if (event.detail.name !== 'test') return;
        const isSet = event.detail.consent;
        const infoContainer = document.querySelector('.cookie-info');
        if (isSet) infoContainer.classList.replace('no-set', 'yes-set');
        else       infoContainer.classList.replace('yes-set', 'no-set');
      });
    </script>
  </body>

</html>