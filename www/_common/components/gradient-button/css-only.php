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
  /* Filter applied to text */
  --text-filter: brightness(1);
  /* Transition duration */
  --transition-duration: .1s;
  
  -webkit-appearance: none;
  appearance: none;
  background: none;
  border: calc(1px * var(--border-width)) solid;
  border-image: var(--gradient) var(--border-width);
  color: transparent;
  cursor: pointer;
  position: relative;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 0;
  font: inherit;
}

button>span,
button::before {
  background-image: var(--gradient);
  background-size: calc(100% + 2px * var(--border-width)) calc(100% + 2px * var(--border-width));
  background-position: calc(-1px * var(--border-width)) calc(-1px * var(--border-width));

  grid-row: 1;
  grid-column: 1;
  width: 100%;
  height: 100%;
  padding: var(--padding);
  box-sizing: border-box;
}

button::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity var(--transition-duration) linear;
  color: white;
  user-select: none;
  z-index: 0;
}

button:hover::before,
button:focus::before,
button:active::before {
  opacity: 1;
}

button>span {
  -webkit-background-clip: text;
  background-clip: text;
  position: relative;
  transition: color .1s linear;
  filter: drop-shadow(var(--text-shadow)) var(--text-filter);
}

button:hover>span,
button:focus>span,
button:active>span {
  color: var(--hover-text-color);
  filter: drop-shadow(var(--hover-text-shadow));
}

button:active::before {
  transition-duration: 0s;
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
</style>

<p>

<button><span>This is CSS-only</span></button>

<p>

<button><span>Hello!</span></button>
<button><span>How are you?</span></button>
<button><span>This is</span></button>
<button><span>gradient-button</span></button>

<p>

<button style="--border-width: 0"><span>no border</span></button>
<button style="--border-width: 1"><span>1px border</span></button>
<button style="--border-width: 3"><span>3px border</span></button>

<p>

<button style="--padding: .25em .5em;"><span>Small padding</span></button>
<button style="--padding: .75em 1.5em;"><span>Big padding</span></button>