<!doctype html>
<html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>&lt;gradient-button&gt; (CSS-only)</title>

<style>
button {
  /* --- Customizable properties --- */
  /* Background & text gradient */
  --gradient: linear-gradient(to right, royalblue 0% 100%);
  /* Border width */
  --border-width: 2;
  /* Padding around text */
  --padding: .5em 1em;
  /* Color of text on hover */
  --hover-text-color: black;
  /* Overlay over background on click */
  --active-background-overlay: linear-gradient(to right, rgba(0, 0, 0, .1) 0% 100%);
  
  -webkit-appearance: none;
  appearance: none;
  background: none;
  border: calc(1px * var(--border-width)) solid;
  border-image: var(--gradient) var(--border-width);
  color: transparent;
  position: relative;
  display: grid;
  place-items: center;
  margin: 0;
  padding: var(--padding);
  font: inherit;

  background-image: var(--gradient);
  background-size: calc(100% + 2px * var(--border-width)) calc(100% + 2px * var(--border-width));
  background-position: calc(-1px * var(--border-width)) calc(-1px * var(--border-width));
  -webkit-background-clip: text;
  background-clip: text;
}

button:hover,
button:focus,
button:active {
  color: var(--hover-text-color);
  -webkit-background-clip: unset;
  background-clip: unset;
}

button:active {
  background-image: var(--active-background-overlay), var(--gradient);
}

/* Button examples */

button {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif;
  font-weight: 600;
  margin: .5em;
  --hover-text-color: black;
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
  color-scheme: light dark;
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

a {
  color: white;
  opacity: .7;
  position: absolute;
  bottom: 1em;
}
</style>

<p>

<button>Hello!</button>
<button>How are you?</button>
<button>This is</button>
<button>gradient-button</button>

<p>

<button style="--border-width: 0">No border</button>
<button style="--border-width: 1">1px border</button>
<button style="--border-width: 3">3px border</button>

<p>

<button style="--padding: .25em .5em;">Smaller padding</button>
<button style="--padding: .75em 1.5em;">Bigger padding</button>

<p>
  
<a href="./">Custom element version (with JS-generated SVG mask, rounded corners & transitions ✨)</a>