<!doctype html>
<html lang="en">

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>&lt;gradient-button&gt; (CSS-only)</title>

  <style>
  /* Native button functionality */
  button {
    grid-row: 1;
    grid-column: 1;
    -webkit-appearance: none;
    appearance: none;
    font: inherit;
    color: inherit;
    padding: .5em 1em;
    margin: 0;
    display: grid;
    place-items: center;
    outline-offset: 3px;
    white-space: nowrap;

    background-image: var(--gradient);
    background-size: calc(100% + 2 * var(--border-width)) calc(100% + 2 * var(--border-width));
    background-position: calc(-1 * var(--border-width)) calc(-1 * var(--border-width));
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;

    position: relative;
    border: solid var(--border-width) transparent;
    border-radius: 2em;

    /* --- Customizable properties --- */
    /* Background & text gradient */
    --gradient: linear-gradient(royalblue 0% 100%);
    /* Width of the gradient border */
    --border-width: 2px;
    /* Interaction state layer */
    --state-layer-rgb: 0, 0, 0;
  }

  /* Border gradient */
  button::before {
    background-size: calc(100% + 2 * var(--border-width)) calc(100% + 2 * var(--border-width));
    background-position: calc(-1 * var(--border-width)) calc(-1 * var(--border-width));
    background-image: var(--gradient);
    background-clip: border-box;

    --full: linear-gradient(black 0% 100%);
    -webkit-mask: var(--full) padding-box, var(--full);
    -webkit-mask-composite: xor;
    mask: var(--full) padding-box exclude, var(--full);
  }

  /* State layer */
  button::after {
    background-image: linear-gradient(to right, rgb(var(--state-layer-rgb), var(--state-layer-opacity, 0)) 0% 100%);
  }

  button::before,
  button::after {
    content: '';
    position: absolute;
    inset: calc(-1 * var(--border-width));
    border: inherit;
    border-radius: inherit;
    min-width: 100%;
    min-height: 100%;
  }

  /* On interaction */
  button:hover, button:focus-visible, button:active {
    background-clip: initial;
    -webkit-text-fill-color: inherit;
  }

  button:hover {
    --state-layer-opacity: .0;
  }

  button:active {
    --state-layer-opacity: .1;
  }

  /* Button examples */

  button {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif;
    font-weight: 600;
    margin: .5em;
    color: black;
  }

  button:nth-of-type(4n+1) {
    --gradient: linear-gradient(135deg,
      #ff5d4b calc(1 * 100% / 7),
      #ff8d00 calc(2 * 100% / 7),
      #ffee00 calc(3 * 100% / 7),
      #51b859 calc(4 * 100% / 7),
      #5997ff calc(5 * 100% / 7),
      #d36ee7 calc(6 * 100% / 7) 100%
    );
  }

  button:nth-of-type(4n+2) {
    --gradient: linear-gradient(to right,
      #7CCDF6 0%,
      #EAAEBA calc(1 * 100% / 4),
      #FFFFFF calc(2 * 100% / 4),
      #EAAEBA calc(3 * 100% / 4),
      #7CCDF6 100%
    );
  }

  button:nth-of-type(4n+3) {
    --gradient: linear-gradient(to bottom,
      #f95f9c 0%,
      #c583c7 35% 65%,
      #6999ff 100%
    );
  }

  button:nth-of-type(4n+4) {
    --gradient: linear-gradient(135deg,
      #f86e4f 0% calc(1 * 100% / 8),
      #e48142 calc(2 * 100% / 8),
      #F19E63 calc(3 * 100% / 8),
      #FFFFFF calc(4 * 100% / 8),
      #d67bb5 calc(5 * 100% / 8),
      #d080b3 calc(6 * 100% / 8),
      #e86ea9 calc(7 * 100% / 8) 100%
    );
  }

  /* For presentation purposes */

  html, body {
    height: 100%;
    margin: 0;
    color-scheme: dark;
  }

  body {
    background-color: hsl(250, 40%, 30%);
    background-image: linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25% 75%, rgba(0, 0, 0, .1) 75%), 
      linear-gradient(45deg, rgba(0, 0, 0, .1) 25%, transparent 25% 75%, rgba(0, 0, 0, .1) 75%);
    background-size: 64px 64px;
    background-position: 0 0, 32px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  p {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  p:last-of-type {
    opacity: .7;
    position: absolute;
    bottom: 1em;
  }

  a {
    color: white;
  }
  </style>
</head>

<body>
  <p>

  <button>Hello!</button>
  <button>How are you?</button>
  <button>This is</button>
  <button>gradient-button</button>

  <p>

  <button style="--border-width: 0">No border</button>
  <button style="--border-width: 1px">1px border</button>
  <button style="--border-width: .3em">.3em border</button>

  <p>

  <button style="padding: .25em .5em;">Smaller padding</button>
  <button style="padding: .75em 1.5em;">Bigger padding</button>

  <p>
    
  <a href="./">Custom element version (with JS-generated SVG mask for cleaner borders & transitions ✨)</a>