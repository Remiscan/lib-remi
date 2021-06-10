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
  --off-bg-color: hsl(0, 0%, 61%);
  --on-bg-color: hsl(231, 40%, 50%);
  --handle-color: white;
  --off-text-color: var(--handle-color);
  --on-text-color: var(--handle-color);
}

:root[data-theme="dark"] input-switch {
  --off-bg-color: hsl(0, 0%, 44%);
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
  grid-template-columns: 100%;
  grid-template-rows: 100%;
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

.input-switch-hints {
  grid-row: 1 / -1;
  grid-column: 1 / -1;
  width: 150%;
  height: 100%;
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100%;
  place-items: center;
  transition: transform var(--duration) var(--easing-decelerate);
  z-index: 3;
}

.input-switch-hints>span,
.input-switch-hints>svg {
  display: none;
  z-index: 2;
}

.input-switch-hints>span {
  font-size: calc(var(--width) / 4);
  margin-right: calc(var(--dir) * 20%);
  position: relative;
}

.input-switch-hints>[data-state="on"] {
  grid-row: 1;
  grid-column: 1;
  color: var(--on-text-color);
  stroke: var(--on-text-color);
  --dir: -1;
}

.input-switch-hints>[data-state="off"] {
  grid-row: 1;
  grid-column: 3;
  color: var(--off-text-color);
  stroke: var(--off-text-color);
  --dir: 1;
}

input-switch[hint="text"] .input-switch-hints>span,
input-switch[hint="icon"] .input-switch-hints>svg {
  display: block;
}

.input-switch-hints::after {
  content: '';
  display: block;
	grid-row: 1;
  grid-column: 2;
  width: 100%;
  height: 100%;
  transform: scale(.8);
  background-color: var(--handle-color);
	border-radius: var(--height);
  z-index: 3;
}

input-switch>[role="switch"][aria-checked="true"]::before {
  opacity: 1;
}

input-switch>[role="switch"][aria-checked="false"]>.input-switch-hints {
  transform: translateX(calc(-100% / 3));
}
input-switch>[role="switch"][aria-checked="true"]>.input-switch-hints {
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  input-switch {
    --duration: 0;
  }
}