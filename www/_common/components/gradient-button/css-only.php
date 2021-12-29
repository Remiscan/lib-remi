<!doctype html>
<html>
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
  --hover-text-color: white;
  /* Overlay over background on click */
  --active-background-overlay: linear-gradient(to right, rgba(0, 0, 0, .1) 0% 100%);
  /* Shadow around text */
  --text-shadow: 0 0 0 transparent;
  /* Shadow around text on hover */
  --hover-text-shadow: 0 0 2px rgba(0, 0, 0, .7);
  
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
  text-shadow: var(--hover-text-shadow);
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
}

button:nth-of-type(4n+1) {
  --gradient: linear-gradient(135deg,
    black 0% calc(1 * 100% / 9),
    #72501E calc(2 * 100% / 9),
    #D12D1F calc(3 * 100% / 9),
    #EF9236 calc(4 * 100% / 9),
    #FCED4F calc(5 * 100% / 9),
    #3A7F30 calc(6 * 100% / 9),
    #1C50F6 calc(7 * 100% / 9),
    #6B1783 calc(8 * 100% / 9) 100%
  );
  --text-filter: brightness(1.5);
}

button:nth-of-type(4n+2) {
  --gradient: linear-gradient(to right,
    #7CCDF6 0%,
    #EAAEBA calc(1 * 100% / 4),
    #FFFFFF calc(2 * 100% / 4),
    #EAAEBA calc(3 * 100% / 4),
    #7CCDF6 100%
  );
  --hover-text-color: black;
  --hover-text-shadow: none;
}

button:nth-of-type(4n+3) {
  --gradient: linear-gradient(to bottom,
    #C42B70 0%,
    #925394 35% 65%,
    #1137A3 100%
  );
  --text-filter: brightness(1.5);
}

button:nth-of-type(4n+4) {
  --gradient: linear-gradient(135deg,
    #C33D1E 0% calc(1 * 100% / 8),
    #DF7C3D calc(2 * 100% / 8),
    #F19E63 calc(3 * 100% / 8),
    #FFFFFF calc(4 * 100% / 8),
    #C269A2 calc(5 * 100% / 8),
    #A85C8E calc(6 * 100% / 8),
    #951F60 calc(7 * 100% / 8) 100%
  );
}

/* For presentation purposes */

html, body {
  height: 100%;
  margin: 0;
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

<button style="--padding: .25em .5em;">Small padding</button>
<button style="--padding: .75em 1.5em;">Big padding</button>

<p>
  
<a href="./" target="_parent">Custom element version (with JS-generated SVG mask, rounded corners & transitions ✨)</a>