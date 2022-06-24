<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My web components</title>

    <style>
      html {
        color-scheme: dark light;
        height: 100%;
      }

      body {
        height: 100%;
        margin: 0;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: 1fr;
      }

      nav {
        font-size: 1.2rem;
        padding: .5rem;
        box-sizing: border-box;
      }

      h1 {
        display: inline-block;
        margin: .5rem;
        position: sticky;
        left: .5rem;
      }

      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      @media (orientation: portrait) {
        body {
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr;
        }

        nav {
          width: 100%;
          overflow-x: auto;
        }

        ul {
          width: max-content;
          padding: 0;
          margin: .5rem 0;
        }

        ul > li {
          display: inline-block;
          margin: 0 .5em;
        }
      }
    </style>
  </head>

  <body>
    <nav>
      <h1>Components</h1>
      <ul>
        <li><a href="./gradient-button/" target="iframe">gradient-button</a>
        <li><a href="./input-switch/" target="iframe">input-switch</a>
        <li><a href="./loader-button/" target="iframe">loader-button</a>
        <li><a href="./remiscan-logo/" target="iframe">remiscan-logo</a>
        <li><a href="./tab-label/" target="iframe">tab-label</a>
        <li><a href="./theme-selector/" target="iframe">theme-selector</a>
      </ul>
    </nav>

    <iframe name="iframe" src="preview.html"></iframe>
  </body>
</html>