input-switch {
  aspect-ratio: 1 / 2;
  --width: 3.25rem;
  --height: calc(.5 * var(--width));
  width: var(--width);
  height: var(--height);

  display: inline-block;
  position: relative;

  --easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --duration: .2s;
}

/*<?php ob_start();?>*/
:root[data-theme="light"] input-switch {
  --off-bg-color: hsla(231, 0%, 50%, .7);
  --on-bg-color: hsl(231, 40%, 50%);
  --handle-color: white;
  --off-text-color: var(--handle-color);
  --on-text-color: var(--handle-color);
}

:root[data-theme="dark"] input-switch {
  --off-bg-color: hsla(217, 0%, 75%, .5);
  --on-bg-color: hsl(217, 89%, 75%);
  --handle-color: rgb(48, 48, 48);
  --off-text-color: var(--handle-color);
  --on-text-color: var(--handle-color);
}
/*<?php $body = ob_get_clean();
require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
echo buildThemesStylesheet($body); ?>*/

input-switch>[role="switch"] {
  border: none;
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  appearance: none;
  font: inherit;
  color: inherit;

  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 100%;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: var(--height);
  background-color: var(--off-bg-color);
  overflow: hidden;
}

input-switch>[role="switch"]::before {
	content: '';
	display: block;
	grid-row: 1 / -1;
  grid-column: 1 / -1;
  width: 100%;
  height: 100%;
	background-color: var(--on-bg-color);
	opacity: 0;
  transition: opacity var(--duration) var(--easing-decelerate);
  z-index: 1;
}

input-switch>[role="switch"]>span,
input-switch>[role="switch"]>svg {
  z-index: 2;
  font-size: 0;
  opacity: 1;
  transition: transform var(--duration) var(--easing-decelerate), opacity var(--duration) var(--easing-decelerate);
}

input-switch>[role="switch"]>[data-state="on"] {
  grid-row: 1;
  grid-column: 1;
  color: var(--on-text-color);
  stroke: var(--on-text-color);
  --dir: -1;
}

input-switch>[role="switch"]>[data-state="off"] {
  grid-row: 1;
  grid-column: 2;
  color: var(--off-text-color);
  stroke: var(--off-text-color);
  --dir: 1;
}

input-switch>[role="switch"]::after {
  content: '';
  display: block;
	grid-row: 1;
  grid-column: 1;
  width: 100%;
  height: 100%;
  transform: scale(.8);
  background-color: var(--handle-color);
	border-radius: var(--height);
  transition: transform var(--duration) var(--easing-decelerate);
  z-index: 3;
}

input-switch>[role="switch"][aria-checked="true"]::before {
  opacity: 1;
}

input-switch>[role="switch"][aria-checked="true"]::after {
  transform: translateX(100%) scale(.8);
}

[role="switch"][aria-checked="false"] [data-state="on"],
[role="switch"][aria-checked="true"] [data-state="off"] {
  opacity: 0;
  pointer-events: none;
  transform: translateX(calc(var(--dir) * 100%));
  transition: transform 0s var(--easing-decelerate) var(--duration), opacity var(--duration) var(--easing-decelerate);
}

@media (prefers-reduced-motion: reduce) {
  input-switch {
    --duration: 0;
  }
}